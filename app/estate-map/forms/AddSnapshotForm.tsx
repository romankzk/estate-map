import { useForm } from "@tanstack/react-form";
import * as z from "zod"
import { createEstateSnapshot } from "@/lib/data-utils";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const formSchema = z.object({
    date: z.string().min(4).max(30),
    sourceSignature: z.string().min(2).max(50),
    sourceLink: z.httpUrl({
        message: "Введіть URL-адресу у форматі http:// або https://"
    }).optional(),
    owner: z.string().max(250).optional(),
    notes: z.string().optional(),
    items: z.string().min(2)
});

interface AddSnapshotFormProps {
    onClose: () => void;
    data: any;
    onUpdate?: (updatedManor: any) => void;
}

export function AddSnapshotForm({ onClose, data, onUpdate }: AddSnapshotFormProps) {
    const form = useForm({
        defaultValues: {
            date: '',
            sourceSignature: '',
            sourceLink: '',
            owner: '',
            notes: '',
            items: '',
        },
        onSubmit: async ({ value }) => {
            const result = formSchema.safeParse(value);
            if (!result.success) {
                console.error("Validation failed", result.error);
                return;
            }

            try {
                const updatedEstate = await createEstateSnapshot(data.id, value);
                if (onUpdate) onUpdate(updatedEstate);
                toast.success(`Склад маєтку "${data.name}" за ${value.date} р. успішно додано!`, { position: "bottom-center" });
                onClose();
                form.reset();
            } catch (error) {
                console.error("Failed to add snapshot", error);
                toast.error(`Сталася помилка: ${error}`, { position: "bottom-center" });
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
                                        placeholder="напр. 1710"
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
                                        placeholder="напр. ЦДІАК 10-1-242 - арк. 35зв"
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
                                        placeholder="напр. https://www.szukajwarchiwach.gov.pl/en/jednostka/-/jednostka/17711031"
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
                                        placeholder="напр. Адам Потоцький"
                                    />
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            )
                        }}
                    />
                    <form.Field
                        name="notes"
                        children={(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor="notes-input">Примітки</FieldLabel>
                                    <Input
                                        id="notes-input"
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="напр. Раніше у складі Галицького староства"
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
                                        placeholder="напр. Львів (місто), Скнилів, Сокільники" />
                                    <FieldDescription>Розділяйте населені пункти комою, крапкою з комою, рискою (|) або просто пишіть з нового рядка.</FieldDescription>
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
                <Button
                    type="submit"
                    className="cursor-pointer bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors"
                >
                    Зберегти
                </Button>
            </DialogFooter>
        </form>
    )
}