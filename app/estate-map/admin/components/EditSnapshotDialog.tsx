"use client";

import { EstateSnapshot } from "@/app/estate-map/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { updateSnapshot } from "../actions";

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
        .max(500, "Поле повинне містити не більше 500 символів"),
});

interface EditSnapshotDialogProps {
    snapshot: EstateSnapshot;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EditSnapshotDialog({ snapshot, open, onOpenChange, onSuccess }: EditSnapshotDialogProps) {
    const form = useForm({
        defaultValues: {
            name: snapshot.name,
            province: snapshot.province,
            district: snapshot.district || '',
            year: snapshot.year,
            sourceSignature: snapshot.sourceSignature,
            sourcePage: snapshot.sourcePage || '',
            sourceLink: snapshot.sourceLink || '',
            owner: snapshot.owner || '',
            notes: snapshot.notes || '',
            items: snapshot.items.join('\n') || '',
        },
        validators: {
            onSubmit: formSchema
        },
        onSubmit: async ({ value }) => {
            try {
                await updateSnapshot(snapshot.id, value);
                toast.success("Запис оновлено");
                onSuccess();
                onOpenChange(false);
            } catch (error) {
                toast.error(`Помилка: ${error}`);
            }
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto dark:border-[#374151] dark:bg-[#111827]">
                <DialogHeader>
                    <DialogTitle className="text-lg">Редагувати запис</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-4 py-4"
                >
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-2">
                            <form.Field
                                name="name"
                                children={(field) => (
                                    <Field>
                                        <FieldLabel htmlFor="edit-snap-name">Назва</FieldLabel>
                                        <Input
                                            id="edit-snap-name"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder=""
                                        />
                                        {field.state.meta.errors.length > 0 && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )}
                            />
                            <form.Field
                                name="year"
                                children={(field) => (
                                    <Field>
                                        <FieldLabel htmlFor="edit-snap-year">Рік</FieldLabel>
                                        <Input
                                            id="edit-snap-year"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="1710"
                                        />
                                        {field.state.meta.errors.length > 0 && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <form.Field
                                name="province"
                                children={(field) => (
                                    <Field>
                                        <FieldLabel htmlFor="edit-snap-province">Воєводство</FieldLabel>
                                        <Input
                                            id="edit-snap-province"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder=""
                                        />
                                        {field.state.meta.errors.length > 0 && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )}
                            />
                            <form.Field
                                name="district"
                                children={(field) => (
                                    <Field>
                                        <FieldLabel htmlFor="edit-snap-district">Повіт</FieldLabel>
                                        <Input
                                            id="edit-snap-district"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder=""
                                        />
                                        {field.state.meta.errors.length > 0 && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )}
                            />
                        </div>
                        <form.Field
                            name="owner"
                            children={(field) => (
                                <Field>
                                    <FieldLabel htmlFor="edit-snap-owner">Власник / староста</FieldLabel>
                                    <Input
                                        id="edit-snap-owner"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="напр. Адам Потоцький"
                                    />
                                </Field>
                            )}
                        />
                        <form.Field
                            name="notes"
                            children={(field) => (
                                <Field>
                                    <FieldLabel htmlFor="edit-snap-notes">Примітки</FieldLabel>
                                    <Input
                                        id="edit-snap-notes"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="Раніше у складі Галицького староства"
                                    />
                                </Field>
                            )}
                        />
                        <div className="grid grid-cols-4 gap-2">
                            <form.Field
                                name="sourceSignature"
                                children={(field) => (
                                    <Field className="col-span-3">
                                        <FieldLabel htmlFor="edit-snap-sig">Сигнатура</FieldLabel>
                                        <Input
                                            id="edit-snap-sig"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="напр. ЦДІАК 10-1-242 - арк. 35зв"
                                        />
                                        {field.state.meta.errors.length > 0 && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )}
                            />
                            <form.Field
                                name="sourcePage"
                                children={(field) => (
                                    <Field className="col-span-1">
                                        <FieldLabel htmlFor="edit-snap-page">Сторінка</FieldLabel>
                                        <Input
                                            id="edit-snap-page"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="напр. 35зв"
                                        />
                                        {field.state.meta.errors.length > 0 && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )}
                            />
                        </div>
                        <form.Field
                            name="sourceLink"
                            children={(field) => (
                                <Field>
                                    <FieldLabel htmlFor="edit-snap-link">Посилання на джерело</FieldLabel>
                                    <Input
                                        id="edit-snap-link"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="https://www.szukajwarchiwach.gov.pl/en/jednostka/-/jednostka/17711031"
                                    />
                                </Field>
                            )}
                        />

                        <form.Field
                            name="items"
                            children={(field) => (
                                <Field>
                                    <FieldLabel htmlFor="edit-snap-items">
                                        Населені пункти
                                        <Badge variant="secondary">{getItemsCount(field.state.value)}</Badge>
                                    </FieldLabel>
                                    <Textarea
                                        id="edit-snap-items"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className="min-h-[150px]"
                                        placeholder="Львів (місто), Скнилів, Сокільники"
                                    />
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Скасувати
                        </Button>
                        <Button type="submit" className="cursor-pointer bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors">Зберегти зміни</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
