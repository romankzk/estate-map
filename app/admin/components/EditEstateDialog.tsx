"use client";

import { Estate } from "@/app/estate-map/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field';
import { updateEstate } from "@/lib/data-utils";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { toast } from "sonner";
import { EstateTypes, PropertyTypes } from "@/app/estate-map/utils/enums";

const formSchema = z.object({
    name: z.string().min(2).max(50),
    propertyType: z.string(),
    estateType: z.string(),
    voivodeship: z.string().min(2).max(50),
    district: z.string().optional().or(z.literal('')),
    center: z.string().optional().or(z.literal('')),
    coords: z.string().min(2).max(50)
});

const voivodeshipsList = [
    "Підляське", "Руське", "Белзьке", "Волинське", "Подільське", "Київське", "Брацлавське", "Чернігівське", "Берестейське"
];

interface EditEstateDialogProps {
    estate: Estate;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EditEstateDialog({ estate, open, onOpenChange, onSuccess }: EditEstateDialogProps) {
    const form = useForm({
        defaultValues: {
            name: estate.name,
            propertyType: estate.propertyType,
            estateType: estate.estateType,
            voivodeship: estate.voivodeship,
            district: estate.district || '',
            center: estate.center || '',
            coords: estate.coords.join(', ')
        },
        onSubmit: async ({ value }) => {
            try {
                await updateEstate(estate.id, value);
                toast.success(`Маєток "${value.name}" оновлено`);
                onSuccess();
                onOpenChange(false);
            } catch (error) {
                toast.error(`Помилка: ${error}`);
            }
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Редагувати маєток</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-4 py-4"
                >
                    <form.Field
                        name="name"
                        children={(field) => (
                            <Field>
                                <FieldLabel htmlFor="edit-name">Назва</FieldLabel>
                                <Input
                                    id="edit-name"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="напр. Львівське староство"
                                />
                                {field.state.meta.errors.length > 0 && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <form.Field
                            name="propertyType"
                            children={(field) => (
                                <Field>
                                    <FieldLabel htmlFor="edit-property-type">Форма власності</FieldLabel>
                                    <Select
                                        value={field.state.value}
                                        onValueChange={field.handleChange}
                                    >
                                        <SelectTrigger id="edit-property-type">
                                            <SelectValue placeholder="Тип" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from(PropertyTypes.entries()).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>{value.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                            )}
                        />
                        <form.Field
                            name="estateType"
                            children={(field) => (
                                <Field>
                                    <FieldLabel htmlFor="edit-estate-type">Тип маєтності</FieldLabel>
                                    <Select
                                        value={field.state.value}
                                        onValueChange={field.handleChange}
                                    >
                                        <SelectTrigger id="edit-estate-type">
                                            <SelectValue placeholder="Тип" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from(EstateTypes.entries()).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>{value.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                            )}
                        />
                    </div>

                    <form.Field
                        name="voivodeship"
                        children={(field) => (
                            <Field>
                                <FieldLabel htmlFor="edit-voivodeship">Воєводство</FieldLabel>
                                <Select
                                    value={field.state.value}
                                    onValueChange={field.handleChange}
                                >
                                    <SelectTrigger id="edit-voivodeship">
                                        <SelectValue placeholder="Виберіть зі списку" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {voivodeshipsList.map((voivodeship, idx) => (
                                            <SelectItem key={idx} value={voivodeship}>{voivodeship}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <form.Field
                            name="district"
                            children={(field) => (
                                <Field>
                                    <FieldLabel htmlFor="edit-district">Повіт</FieldLabel>
                                    <Input
                                        id="edit-district"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="напр. Львівський"
                                    />
                                </Field>
                            )}
                        />
                        <form.Field
                            name="center"
                            children={(field) => (
                                <Field>
                                    <FieldLabel htmlFor="edit-center">Центр</FieldLabel>
                                    <Input
                                        id="edit-center"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="напр. Львів"
                                    />
                                </Field>
                            )}
                        />
                    </div>

                    <form.Field
                        name="coords"
                        children={(field) => (
                            <Field>
                                <FieldLabel htmlFor="edit-coords">Координати</FieldLabel>
                                <Input
                                    id="edit-coords"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="напр. 49.12, 50.11"
                                />
                            </Field>
                        )}
                    />

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
