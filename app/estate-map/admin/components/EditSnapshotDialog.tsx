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
import { updateEstateSnapshot } from "@/lib/data-utils";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { States } from "../../utils/enums";

const formSchema = z.object({
    name: z.string()
        .min(2, "Поле не може бути порожнім")
        .max(50, "Поле повинне містити не більше 50 символів"),
    state: z.string(),
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
        .max(500, "Поле повинне містити не більше 500 символів"),
});

interface EditSnapshotDialogProps {
    estateId: number;
    snapshot: EstateSnapshot;
    snapshotIndex: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EditSnapshotDialog({ estateId, snapshot, snapshotIndex, open, onOpenChange, onSuccess }: EditSnapshotDialogProps) {
    const form = useForm({
        defaultValues: {
            name: snapshot.name,
            state: snapshot.state,
            province: snapshot.province,
            district: snapshot.district || '',
            date: snapshot.date,
            sourceSignature: snapshot.sourceSignature,
            sourcePage: snapshot.sourcePage,
            sourceLink: snapshot.sourceLink || '',
            owner: snapshot.owner || '',
            notes: snapshot.notes || '',
            items: snapshot.items?.join('\n') || '',
        },
        validators: {
            onSubmit: formSchema
        },
        onSubmit: async ({ value }) => {
            try {
                await updateEstateSnapshot(estateId, snapshotIndex, value);
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
                        <div className="grid grid-cols-2 gap-2">
                            <form.Field
                                name="date"
                                children={(field) => (
                                    <Field>
                                        <FieldLabel htmlFor="edit-snap-date">Рік</FieldLabel>
                                        <Input
                                            id="edit-snap-date"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="напр. 1710"
                                        />
                                        {field.state.meta.errors.length > 0 && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )}
                            />
                            {/* State field */}
                            <form.Field
                                name="state"
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field orientation="vertical" data-invalid={isInvalid}>
                                            <FieldContent>
                                                <FieldLabel htmlFor="state-select">Держава</FieldLabel>
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
                                        placeholder="напр. Примітки..."
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
                                        placeholder="напр. https://..."
                                    />
                                </Field>
                            )}
                        />

                        <form.Field
                            name="items"
                            children={(field) => (
                                <Field>
                                    <FieldLabel htmlFor="edit-snap-items">Населені пункти</FieldLabel>
                                    <Textarea
                                        id="edit-snap-items"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className="min-h-[150px]"
                                        placeholder="напр. Львів (місто), Скнилів, Сокільники"
                                    />
                                    <FieldDescription className="text-xs">Розділяйте населені пункти комою або новим рядком.</FieldDescription>
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
