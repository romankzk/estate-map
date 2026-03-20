import { Button } from "@/components/ui/button";
import { SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { addEstate } from "@/lib/data-utils";
import { useForm } from "@tanstack/react-form"
import * as z from "zod"
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(2).max(50),
    propertyType: z.string(),
    estateType: z.string(),
    voivodeship: z.string().min(2).max(50),
    district: z.string().optional(),
    center: z.string().optional(),
    coords: z.string().min(2).max(50)
})

const voivodeshipsList = [
    "Підляське", "Руське", "Белзьке", "Волинське", "Подільське", "Київське", "Брацлавське", "Чернігівське", "Берестейське"
]

interface AddEstateFormProps {
    onSheetClose: () => void;
    onSubmit: (data: any) => void;
}

export function AddEstateForm({ onSheetClose, onSubmit }: AddEstateFormProps) {
    const form = useForm({
        defaultValues: {
            name: '',
            propertyType: 'royal',
            estateType: 'starostwo',
            voivodeship: '',
            district: '',
            center: '',
            coords: ''
        },
        onSubmit: async ({ value }) => {
            const result = formSchema.safeParse(value);
            if (!result.success) {
                console.error("Validation failed", result.error);
                return;
            }

            const newManor = await addEstate(value);
            toast.success(`${value.name} успішно додано!`, { position: "bottom-center" });
            onSubmit(newManor);
            form.reset();
            onSheetClose();
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
            }}
            className="flex-1 overflow-y-auto no-scrollbar"
        >
            {/* Name field */}
            <div className="px-6 pb-6 space-y-6">
                <form.Field
                    name="name"
                    children={(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor="name-input">Назва</FieldLabel>
                                <Input
                                    id="name-input"
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    aria-invalid={isInvalid}
                                    placeholder="напр. Львівське староство"
                                />
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        )
                    }}
                />
                {/* Property Type field */}
                <form.Field
                    name="propertyType"
                    children={(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field orientation="responsive" data-invalid={isInvalid}>
                                <FieldContent>
                                    <FieldLabel htmlFor="property-type-select">
                                        Форма власності
                                    </FieldLabel>
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </FieldContent>
                                <Select
                                    name={field.name}
                                    value={field.state.value}
                                    onValueChange={field.handleChange}
                                >
                                    <SelectTrigger
                                        id="property-type-select"
                                        aria-invalid={isInvalid}
                                        className="min-w-[120px]"
                                    >
                                        <SelectValue placeholder="Тип" />
                                    </SelectTrigger>
                                    <SelectContent position="item-aligned">
                                        <SelectItem value="royal">Королівська</SelectItem>
                                        <SelectItem value="private">Приватна</SelectItem>
                                        <SelectItem value="church">Духовна</SelectItem>
                                        <SelectItem value="mixed">Різна</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        )
                    }}
                />
                {/* Estate Type field */}
                <form.Field
                    name="estateType"
                    children={(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field orientation="responsive" data-invalid={isInvalid}>
                                <FieldContent>
                                    <FieldLabel htmlFor="estate-type-select">
                                        Тип маєтності
                                    </FieldLabel>
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </FieldContent>
                                <Select
                                    name={field.name}
                                    value={field.state.value}
                                    onValueChange={field.handleChange}
                                >
                                    <SelectTrigger
                                        id="estate-type-select"
                                        aria-invalid={isInvalid}
                                        className="min-w-[120px]"
                                    >
                                        <SelectValue placeholder="Тип" />
                                    </SelectTrigger>
                                    <SelectContent position="item-aligned">
                                        <SelectItem value="starostwo">Староство</SelectItem>
                                        <SelectItem value="klucz">Ключ</SelectItem>
                                        <SelectItem value="dzierzawa">Держава</SelectItem>
                                        <SelectItem value="other">Інше</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        )
                    }}
                />
                {/* Voivodeship field */}
                <form.Field
                    name="voivodeship"
                    children={(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field orientation="responsive" data-invalid={isInvalid}>
                                <FieldContent>
                                    <FieldLabel htmlFor="voivodeship-select">
                                        Воєводство
                                    </FieldLabel>
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </FieldContent>
                                <Select
                                    name={field.name}
                                    value={field.state.value}
                                    onValueChange={field.handleChange}
                                >
                                    <SelectTrigger
                                        id="voivodeship-type-select"
                                        aria-invalid={isInvalid}
                                        className="min-w-[120px]"
                                    >
                                        <SelectValue placeholder="Виберіть зі списку" />
                                    </SelectTrigger>
                                    <SelectContent position="item-aligned">
                                        {voivodeshipsList.map(voivodeship => (
                                            <SelectItem value={voivodeship}>{voivodeship}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                    placeholder="напр. Львівський"
                                />
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        )
                    }}
                />
                {/* Center field */}
                <form.Field
                    name="center"
                    children={(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor="center-input">Центр</FieldLabel>
                                <Input
                                    id="center-input"
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    aria-invalid={isInvalid}
                                    placeholder="напр. Львів"
                                />
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        )
                    }}
                />
                {/* Coordinates field */}
                <form.Field
                    name="coords"
                    children={(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor="coords-input">Координати</FieldLabel>
                                <Input
                                    id="coords-input"
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    aria-invalid={isInvalid}
                                    placeholder="напр. 49.12, 50.11"
                                />
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        )
                    }}
                />
                <p className="text-muted-foreground">Населені пункти маєтку можна буде додати після створення</p>
            </div>
            {/* Submit/Cancel buttons section */}
            <SheetFooter className="p-6 border-t dark:border-[#374151] flex flex-row gap-3 sm:justify-end">
                <Button type="button" variant="outline" onClick={onSheetClose} className="flex-1 sm:flex-none">
                    Скасувати
                </Button>
                <Button type="submit" variant="default">
                    Зберегти
                </Button>
            </SheetFooter>
        </form>
    )
}