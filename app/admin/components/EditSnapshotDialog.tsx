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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { updateEstateSnapshot } from "@/lib/data-utils";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
    date: z.string().min(1).max(30),
    sourceSignature: z.string().min(2).max(50),
    sourceLink: z.string().url({
        message: "Введіть URL-адресу у форматі http:// або https://"
    }).or(z.literal("")).optional(),
    owner: z.string().max(250).optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
    items: z.string().min(2)
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
            date: snapshot.date,
            sourceSignature: snapshot.sourceSignature,
            sourceLink: snapshot.sourceLink || '',
            owner: snapshot.owner || '',
            notes: snapshot.notes || '',
            items: snapshot.items?.join('\n') || '',
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
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Редагувати запис складу</DialogTitle>
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
                        <form.Field
                            name="sourceSignature"
                            children={(field) => (
                                <Field>
                                    <FieldLabel htmlFor="edit-snap-sig">Джерело: сигнатура</FieldLabel>
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
                            name="sourceLink"
                            children={(field) => (
                                <Field>
                                    <FieldLabel htmlFor="edit-snap-link">Джерело: посилання</FieldLabel>
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
                                    <FieldDescription>Розділяйте населені пункти комою або новим рядком.</FieldDescription>
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Скасувати
                        </Button>
                        <Button type="submit">Зберегти зміни</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
