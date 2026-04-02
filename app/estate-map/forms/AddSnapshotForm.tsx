import { useForm } from "@tanstack/react-form";
import * as z from "zod"
import { createEstateSnapshot } from "@/lib/data-utils";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { States } from "../utils/enums";

const formSchema = z.object({
    name: z.string()
        .min(2, "Поле не може бути порожнім")
        .max(50, "Поле повинне містити не більше 50 символів"),
    state: z.string()
        .min(2, "Поле не може бути порожнім")
        .max(50, "Поле повинне містити не більше 50 символів"),
    province: z.string()
        .min(2, "Поле не може бути порожнім")
        .max(50, "Поле повинне містити не більше 50 символів"),
    district: z.string(),
    date: z.string()
        .min(2, "Поле не може бути порожнім")
        .max(30, "Поле повинне містити не більше 30 символів"),
    sourceSignature: z.string()
        .min(2, "Поле не може бути порожнім")
        .max(50, "Поле повинне містити не більше 50 символів"),
    sourcePage: z.string(),
    sourceLink: z.url({
        message: "Поле повинне містити URL-адресу у форматі http:// або https://"
    })
        .or(z.literal("")),
    owner: z.string(),
    notes: z.string(),
    items: z.string()
        .min(2, "Поле не може бути порожнім")
        .max(2500, "Поле повинне містити не більше 2500 символів"),
});

interface AddSnapshotFormProps {
    onClose: () => void;
    data: any;
    onUpdate?: (updatedManor: any) => void;
}

export function AddSnapshotForm({ onClose, data, onUpdate }: AddSnapshotFormProps) {
    const form = useForm({
        defaultValues: {
            name: data.name,
            state: 'poland',
            province: '',
            district: '',
            date: '',
            sourceSignature: '',
            sourcePage: '',
            sourceLink: '',
            owner: '',
            notes: '',
            items: '',
        },
        validators: {
            onSubmit: formSchema
        },
        onSubmit: async ({ value }) => {
            try {
                const updatedEstate = await createEstateSnapshot(data.id, value);
                if (onUpdate) onUpdate(updatedEstate);
                toast.success(`Склад маєтку "${data.name}" за ${value.date} р. успішно додано`, { position: "bottom-center" });
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
            <DialogHeader className="pb-4">
                <DialogTitle className="text-lg">Додати склад - {data.name}</DialogTitle>
            </DialogHeader>
            <div className="py-6 px-1 no-scrollbar max-h-[80vh] overflow-y-auto">
                <FieldGroup className="flex gap-4">
                    {/* Name field */}
                    <form.Field
                        name="name"
                        children={(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor="name-input">Назва маєтку *</FieldLabel>
                                    <Input
                                        id="name-input"
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="Київське староство"
                                    />
                                    {isInvalid && <FieldError className="text-xs" errors={field.state.meta.errors} />}
                                </Field>
                            )
                        }}
                    />

                    <div className="grid grid-cols-3 items-start gap-2">
                        {/* Date field */}
                        <form.Field
                            name="date"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid} className="col-span-1">
                                        <FieldLabel htmlFor="date-input">Рік *</FieldLabel>
                                        <Input
                                            id="date-input"
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="1710 або 1564-1565"
                                        />
                                        {isInvalid && <FieldError className="text-xs" errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        />
                        {/* State field */}
                        <form.Field
                            name="state"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field orientation="responsive" data-invalid={isInvalid} className="col-span-2">
                                        <FieldContent>
                                            <FieldLabel htmlFor="state-select">
                                                Держава *
                                            </FieldLabel>
                                        </FieldContent>
                                        <Select
                                            name={field.name}
                                            value={field.state.value}
                                            onValueChange={field.handleChange}
                                        >
                                            <SelectTrigger
                                                id="state-select"
                                                aria-invalid={isInvalid}
                                                className="min-w-[120px]"
                                            >
                                                <SelectValue placeholder="Держава" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" className="dark:border-[#374151] dark:bg-[#111827]">
                                                {Array.from(States.entries()).map(([key, value]) => (
                                                    <SelectItem key={key} value={key}>{value.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {isInvalid && <FieldError className="text-xs" errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-2 items-start gap-2">
                        {/* Province field */}
                        <form.Field
                            name="province"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor="province-input">Воєводство *</FieldLabel>
                                        <Input
                                            id="province-input"
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="Київське воєводство"
                                        />
                                        {isInvalid && <FieldError className="text-xs" errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        />

                        {/* District field */}
                        <form.Field
                            name="district"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor="district-input">Повіт</FieldLabel>
                                        <Input
                                            id="district-input"
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="Житомирський повіт"
                                        />
                                        {isInvalid && <FieldError className="text-xs" errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        />
                    </div>

                    {/* Owner field */}
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
                                        placeholder="Ян з Великих Кончиць Мнішек, староста львівський"
                                    />
                                    {isInvalid && <FieldError className="text-xs" errors={field.state.meta.errors} />}
                                </Field>
                            )
                        }}
                    />

                    {/* Notes field */}
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
                                        placeholder="Раніше у складі Галицького староства"
                                    />
                                    {isInvalid && <FieldError className="text-xs" errors={field.state.meta.errors} />}
                                </Field>
                            )
                        }}
                    />

                    <FieldSeparator />

                    <div className="grid grid-cols-4 gap-2">
                        {/* Source signature field */}
                        <form.Field
                            name="sourceSignature"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid} className="col-span-3">
                                        <FieldLabel htmlFor="signature-input">Джерело *</FieldLabel>
                                        <Input
                                            id="signature-input"
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="ЦДІАК 10-1-242"
                                        />
                                        {isInvalid && <FieldError className="text-xs" errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        />
                        {/* Source page field */}
                        <form.Field
                            name="sourcePage"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid} className="col-span-1">
                                        <FieldLabel htmlFor="page-input">Сторінка</FieldLabel>
                                        <Input
                                            id="page-input"
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="35зв"
                                        />
                                        {isInvalid && <FieldError className="text-xs" errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        />
                    </div>

                    {/* Source link field */}
                    <form.Field
                        name="sourceLink"
                        children={(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor="link-input">Посилання на джерело</FieldLabel>
                                    <Input
                                        id="link-input"
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="https://www.szukajwarchiwach.gov.pl/en/jednostka/-/jednostka/17711031"
                                    />
                                    {isInvalid && <FieldError className="text-xs" errors={field.state.meta.errors} />}
                                </Field>
                            )
                        }}
                    />

                    <FieldSeparator />

                    {/* Items list field */}
                    <form.Field
                        name="items"
                        children={(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor="items-input">Населені пункти *</FieldLabel>
                                    <Textarea
                                        id="items-input"
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="Львів (місто), Скнилів, Сокільники, Щирець (містечко), Красів" />
                                    {isInvalid && <FieldError className="text-xs" errors={field.state.meta.errors} />}
                                    <FieldDescription className="text-xs">Розділяйте населені пункти комою, крапкою з комою, рискою (|) або просто пишіть з нового рядка.</FieldDescription>
                                </Field>
                            )
                        }}
                    />
                </FieldGroup>
            </div>
            <DialogFooter className="pt-4">
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