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
import { useForm } from "@tanstack/react-form"
import * as z from "zod"
import { toast } from "sonner";
import { EstateTypes, PropertyTypes, ProvincesList } from "../utils/enums";
import dynamic from "next/dynamic";
import { InfoIcon, MapPin } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createEstate } from "./actions";

// Dynamically import the map to avoid SSR issues
const LocationPickerMap = dynamic(() => import("../components/ui/LocationPickerMap"), {
    ssr: false,
    loading: () => <div className="h-48 w-full bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg flex items-center justify-center text-zinc-400 text-xs">Завантаження карти...</div>
});

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
    center: z.string()
        .min(2, "Поле не може бути порожнім")
        .max(50, "Поле повинне містити не більше 50 символів"),
    coords: z.tuple([z.number(), z.number()]).refine((val) => val.length === 2, {
        message: "Виберіть місце на карті",
    }),
})

interface AddEstateFormProps {
    onSheetClose: () => void;
    onUpdate?: () => void;
}

export function AddEstateForm({ onSheetClose, onUpdate }: AddEstateFormProps) {
    const form = useForm({
        defaultValues: {
            name: '',
            propertyType: 'royal',
            estateType: 'starostwo',
            center: '',
            coords: [50.4488, 30.5255] as [number, number] // Default to Kyiv
        },
        validators: {
            onSubmit: formSchema
        },
        onSubmit: async ({ value }) => {
            try {
                await createEstate(value);
                toast.success(`${value.name} додано, очікує перевірки адміністратором`, { position: "bottom-center" });
                if (onUpdate) onUpdate();
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
            className="flex flex-col h-full"
        >
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="px-6 pb-6 space-y-6">
                    {/* Name field */}
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
                                            <SelectContent position="popper" className="dark:border-[#374151] dark:bg-[#111827]">
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
                                                Тип маєтку *
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
                                            <SelectContent position="popper" className="dark:border-[#374151] dark:bg-[#111827]">
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

                    {/* Center field */}
                    <form.Field
                        name="center"
                        children={(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor="center-input">Центр *</FieldLabel>
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

                    {/* Coordinates field with Map */}
                    <form.Field
                        name="coords"
                        children={(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <div className="flex items-center justify-between">
                                        <FieldLabel className="flex items-center gap-2">
                                            Розташування на карті *
                                        </FieldLabel>
                                        {field.state.value && (
                                            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                                                {field.state.value[0].toFixed(4)}, {field.state.value[1].toFixed(4)}
                                            </span>
                                        )}

                                    </div>
                                    <FieldDescription className="text-xs">Оберіть місце розташування центру маєтку на карті</FieldDescription>
                                    <div className="h-48 w-full rounded-lg overflow-hidden border dark:border-[#374151]">
                                        <LocationPickerMap
                                            value={field.state.value}
                                            onChange={(coords) => field.handleChange(coords)}
                                        />
                                    </div>
                                    {isInvalid && <FieldError className="text-xs" errors={field.state.meta.errors} />}
                                </Field>
                            )
                        }}
                    />
                    <Alert>
                        <InfoIcon />
                        <AlertTitle>Зверніть увагу</AlertTitle>
                        <AlertDescription>
                            Після збереження інформацію буде надіслано на перевірку адміністраторам. Маєток з'явиться в реєстрі лише після підтвердження.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
            {/* Submit/Cancel buttons section */}
            <SheetFooter className="p-6 border-t dark:border-[#374151] flex flex-row gap-3 sm:justify-end bg-zinc-50/50 dark:bg-zinc-900/50">
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