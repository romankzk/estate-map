'use client';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { AddEstateForm } from "../forms/AddEstateForm";

interface AddEstateSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export function AddEstateSheet({ isOpen, onClose, onSubmit }: AddEstateSheetProps) {
    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="right" className="sm:max-w-md w-full p-0 flex flex-col h-full border-l dark:border-[#374151] dark:bg-[#111827]">
                <SheetHeader className="p-6 border-b dark:border-[#374151]">
                    <SheetTitle className="text-2xl font-bold tracking-tight">Додати маєток</SheetTitle>
                </SheetHeader>

                <AddEstateForm onSheetClose={onClose} onSubmit={onSubmit}/>
            </SheetContent>
        </Sheet >
    );
}
