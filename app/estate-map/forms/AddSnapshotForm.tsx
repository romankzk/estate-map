"use client";

import { useForm } from "@tanstack/react-form";
import * as z from "zod"
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DistrictsList, ProvincesList } from "../utils/enums";
import { InputAutocomplete } from "../components/ui/InputAutocomplete";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { createSnapshot } from "./actions";

function getItemsCount(value: string) {
    const delimitersRegex = /[,;|\n\r]+/;
    let items = value.split(delimitersRegex).map(i => i.trim()).filter(i => i !== '');

    return items.length;
}

const formSchema = z.object({
    name: z.string()
        .min(2, "Поле не може бути порожнім")
        .max(50, "Поле повинне містити не більше 50 символів"),
    province: z.string()
        .min(2, "Поле не може бути порожнім")
        .max(50, "Поле повинне містити не більше 50 символів"),
    district: z.string(),
    year: z.string()
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
}

export function AddSnapshotForm({ onClose, data }: AddSnapshotFormProps) {
    const form = useForm({
        defaultValues: {
            name: data.name,
            province: '',
            district: '',
            year: '',
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
                await createSnapshot(data.id, value);
                toast.success(`Склад маєтку "${data.name}" за ${value.year} р. успішно додано`, { position: "bottom-center" });
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
                    <div className="grid grid-cols-3 items-start gap-2">
                        {/* Year field */}
                        <form.Field
                            name="year"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid} className="col-span-1">
                                        <FieldLabel htmlFor="year-input">
                                            Рік
                                            <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <Input
                                            id="year-input"
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="1710"
                                        />
                                        {isInvalid && <FieldError className="text-xs" errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        />

                        {/* Name field */}
                        <form.Field
                            name="name"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid} className="col-span-2">
                                        <FieldLabel htmlFor="name-input">
                                            Назва маєтку
                                            <span className="text-destructive">*</span>
                                        </FieldLabel>
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
                    </div>
                    <div className="grid grid-cols-2 items-start gap-2">
                        {/* Province field */}
                        <form.Field
                            name="province"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor="province-input">
                                            Воєводство
                                            <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <InputAutocomplete
                                            id="province-input"
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(val) => field.handleChange(val)}
                                            options={ProvincesList}
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
                                        <InputAutocomplete
                                            id="district-input"
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(val) => field.handleChange(val)}
                                            options={DistrictsList}
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
                                        <FieldLabel htmlFor="signature-input">
                                            Джерело
                                            <span className="text-destructive">*</span>
                                        </FieldLabel>
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
                                    <FieldLabel htmlFor="items-input">
                                        Населені пункти
                                        <Badge variant="secondary">{getItemsCount(field.state.value)}</Badge>
                                    </FieldLabel>
                                    <FieldDescription className="text-xs">
                                        Населені пункти можна розділяти через кому, крапку з комою або писати кожен з нового рядка.
                                    </FieldDescription>
                                    <Textarea
                                        id="items-input"
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="Львів (місто), Скнилів, Сокільники, Щирець (містечко), Красів" />
                                    {isInvalid && <FieldError className="text-xs" errors={field.state.meta.errors} />}
                                </Field>
                            )
                        }}
                    />
                    <Alert>
                        <InfoIcon />
                        <AlertTitle>Зверніть увагу</AlertTitle>
                        <AlertDescription>
                            Після збереження інформацію буде надіслано на перевірку адміністраторам. Запис з'явиться в реєстрі лише після підтвердження.
                        </AlertDescription>
                    </Alert>
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