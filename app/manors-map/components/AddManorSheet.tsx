'use client';

import { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useForm } from "@tanstack/react-form"
import * as z from "zod"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { addManor } from '@/lib/data-utils';

const formSchema = z.object({
    name: z.string(),
    type: z.string(),
    voivodeship: z.string(),
    district: z.string(),
    center: z.string(),
    coords: z.string()
})

interface AddManorSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddManorSheet({ isOpen, onClose }: AddManorSheetProps) {
    const form = useForm({
        defaultValues: {
            name: '',
            type: 'royal',
            voivodeship: '',
            district: '',
            center: '',
            coords: ''
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            let result = await addManor(value);
            console.log(result);
        },
    })

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="right" className="sm:max-w-md w-full p-0 flex flex-col h-full border-l dark:border-[#374151] dark:bg-[#111827]">
                <SheetHeader className="p-6 border-b dark:border-[#374151]">
                    <SheetTitle className="text-xl font-bold flex items-center gap-2">
                        Додати нову інформацію
                    </SheetTitle>
                    <SheetDescription>
                        Заповніть основну інформацію про староство чи ключ
                    </SheetDescription>
                </SheetHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                    className="flex-1 overflow-y-auto no-scrollbar"
                >
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
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
                                                    placeholder="Львівське староство"
                                                />
                                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                            </Field>
                                        )
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <form.Field
                                    name="type"
                                    children={(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field orientation="responsive" data-invalid={isInvalid}>
                                                <FieldContent>
                                                    <FieldLabel htmlFor="type-select">
                                                        Тип власності
                                                    </FieldLabel>
                                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                                </FieldContent>
                                                <Select
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onValueChange={field.handleChange}
                                                >
                                                    <SelectTrigger
                                                        id="type-select"
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
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <form.Field
                                    name="voivodeship"
                                    children={(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel htmlFor="voivodeship-input">Воєводство</FieldLabel>
                                                <Input
                                                    id="voivodeship-input"
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    aria-invalid={isInvalid}
                                                    placeholder="Руське"
                                                />
                                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                            </Field>
                                        )
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
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
                                                    placeholder="Львівський"
                                                />
                                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                            </Field>
                                        )
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
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
                                                    placeholder="Львів"
                                                />
                                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                            </Field>
                                        )
                                    }}
                                />
                            </div>
                        </div>

                        {/* Coordinates */}
                        <div className="space-y-4">
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
                                                placeholder="49.12, 50.11"
                                            />
                                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                        </Field>
                                    )
                                }}
                            />
                        </div>
                    </div>

                    <SheetFooter className="p-6 border-t dark:border-[#374151] flex flex-row gap-3 sm:justify-end">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
                            Скасувати
                        </Button>
                        <Button type="submit" className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white">
                            Зберегти
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
