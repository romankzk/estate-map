'use client';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { AddManorForm } from "../forms/AddManorForm";

interface AddManorSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export function AddManorSheet({ isOpen, onClose, onSubmit }: AddManorSheetProps) {
    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="right" className="sm:max-w-md w-full p-0 flex flex-col h-full border-l dark:border-[#374151] dark:bg-[#111827]">
                <SheetHeader className="p-6 border-b dark:border-[#374151]">
                    <SheetTitle className="text-xl font-bold flex items-center gap-2">
                        Додати нову інформацію
                    </SheetTitle>
                </SheetHeader>

                <AddManorForm onSheetClose={onClose} onSubmit={onSubmit}/>
            </SheetContent>
        </Sheet >
    );
}
