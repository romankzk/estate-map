import { useForm } from "@tanstack/react-form";
import * as z from "zod"
import { addManorRecord } from "@/lib/data-utils";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    date: z.string(),
    sourceSignature: z.string(),
    sourceLink: z.string(),
    owner: z.string(),
    items: z.string(),
});

interface AddRecordFormProps {
    onClose: () => void;
    data: any;
    onUpdate?: (updatedManor: any) => void;
}

export function AddRecordForm({ onClose, data, onUpdate }: AddRecordFormProps) {
    const form = useForm({
        defaultValues: {
            date: '',
            sourceSignature: '',
            sourceLink: '',
            owner: '',
            items: '',
        },
        onSubmit: async ({ value }) => {
            const result = formSchema.safeParse(value);
            if (!result.success) {
                console.error("Validation failed", result.error);
                return;
            }

            try {
                const updatedManor = await addManorRecord(data.id, value);
                if (onUpdate) onUpdate(updatedManor);
                onClose();
                form.reset();
            } catch (error) {
                console.error("Failed to add record", error);
            }
        },
    });

    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
        }}>
            <DialogHeader>
                <DialogTitle>Додати склад - {data.name}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
                <FieldGroup>
                    <form.Field
                        name="date"
                        children={(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor="date-input">Рік</FieldLabel>
                                    <Input
                                        id="date-input"
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder=""
                                    />
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            )
                        }}
                    />
                    <form.Field
                        name="sourceSignature"
                        children={(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor="signature-input">Джерело: сигнатура</FieldLabel>
                                    <Input
                                        id="signature-input"
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder=""
                                    />
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            )
                        }}
                    />
                    <form.Field
                        name="sourceLink"
                        children={(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor="link-input">Джерело: посилання</FieldLabel>
                                    <Input
                                        id="link-input"
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder=""
                                    />
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            )
                        }}
                    />
                    <form.Field
                        name="owner"
                        children={(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor="owner-input">Власник / староста</FieldLabel>
                                    <Input
                                        id="owner-input"
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder=""
                                    />
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            )
                        }}
                    />
                    <form.Field
                        name="items"
                        children={(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor="items-input">Населені пункти</FieldLabel>
                                    <Textarea
                                        id="items-input"
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="" />
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            )
                        }}
                    />
                </FieldGroup>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Скасувати</Button>
                </DialogClose>
                <Button type="submit">Зберегти</Button>
            </DialogFooter>
        </form>
    )
}