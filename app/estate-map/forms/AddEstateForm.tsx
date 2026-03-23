import { Button } from "@/components/ui/button";
import { SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectSeparator,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { createEstate } from "@/lib/data-utils";
import { useForm } from "@tanstack/react-form"
import * as z from "zod"
import { toast } from "sonner";
import { EstateTypes, PropertyTypes, ProvincesList } from "../utils/enums";

const formSchema = z.object({
    name: z.string()
        .min(2, "Поле не може бути порожнім")
        .max(50, "Поле повинне містити не більше 50 символів"),
    propertyType: z.string()
        .min(2, "Поле не може бути порожнім")
        .max(50, "Поле повинне містити не більше 50 символів"),
    estateType: z.string()
        .min(2, "Поле не може бути порожнім")
        .max(50, "Поле повинне містити не більше 50 символів"),
    voivodeship: z.string()
        .min(2, "Поле не може бути порожнім")
        .max(50, "Поле повинне містити не більше 50 символів"),
    district: z.string(),
    center: z.string(),
    coords: z.string()
        .min(2, "Поле не може бути порожнім")
        .max(50, "Поле повинне містити не більше 50 символів"),
})

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
        validators: {
            onSubmit: formSchema
        },
        onSubmit: async ({ value }) => {
            try {
                await createEstate(value);
                toast.success(`${value.name} додано, очікує перевірки адміністратором`, { position: "bottom-center" });
                form.reset();
                onSheetClose();
            } catch (error) {
                console.error("Failed to add estate", error);
                toast.error(`Сталася помилка: ${error}`, { position: "bottom-center" });
            }
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
                                <FieldLabel htmlFor="name-input">Назва *</FieldLabel>
                                <Input
                                    id="name-input"
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    aria-invalid={isInvalid}
                                    placeholder="Львівське староство"
                                />
                                {isInvalid && <FieldError className="text-xs" errors={field.state.meta.errors} />}
                            </Field>
                        )
                    }}
                />
                <div className="grid grid-cols-2 gap-4">
                    {/* Property Type field */}
                    <form.Field
                        name="propertyType"
                        children={(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field orientation="responsive" data-invalid={isInvalid}>
                                    <FieldContent>
                                        <FieldLabel htmlFor="property-type-select">
                                            Форма власності *
                                        </FieldLabel>
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
                                        <SelectContent position="item-aligned" className="dark:border-[#374151] dark:bg-[#111827]">
                                            {Array.from(PropertyTypes.entries()).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>{value.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {isInvalid && <FieldError className="text-xs" errors={field.state.meta.errors} />}
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
                                            Тип маєтності *
                                        </FieldLabel>
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
                                        <SelectContent position="item-aligned" className="dark:border-[#374151] dark:bg-[#111827]">
                                            {Array.from(EstateTypes.entries()).map(([key, value]) => (
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
                {/* Voivodeship field */}
                <form.Field
                    name="voivodeship"
                    children={(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field orientation="responsive" data-invalid={isInvalid}>
                                <FieldContent>
                                    <FieldLabel htmlFor="voivodeship-select">
                                        Воєводство (комітат, цинут) *
                                    </FieldLabel>
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
                                    <SelectContent position="item-aligned" className="dark:border-[#374151] dark:bg-[#111827]">
                                        {ProvincesList.map((state, sIdx) => (
                                            <SelectGroup key={sIdx}>
                                                <SelectLabel>{state.stateLabel}</SelectLabel>
                                                {state.provinces.map((province, pIdx) => (
                                                    <SelectItem key={pIdx} value={province}>{province} {state.prefix}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        ))}
                                        <SelectSeparator />
                                    </SelectContent>
                                </Select>
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
                                    placeholder="Житомирський"
                                />
                                {isInvalid && <FieldError className="text-xs" errors={field.state.meta.errors} />}
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
                                    placeholder="Галич"
                                />
                                {isInvalid && <FieldError className="text-xs" errors={field.state.meta.errors} />}
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
                                <FieldLabel htmlFor="coords-input">Координати *</FieldLabel>
                                <Input
                                    id="coords-input"
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    aria-invalid={isInvalid}
                                    placeholder="напр. 49.12, 50.11"
                                />
                                {isInvalid && <FieldError className="text-xs" errors={field.state.meta.errors} />}
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
                <Button type="submit" variant="default" className="flex-1 sm:flex-none cursor-pointer bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors">
                    Зберегти
                </Button>
            </SheetFooter>
        </form>
    )
}