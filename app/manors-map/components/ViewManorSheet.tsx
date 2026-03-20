"use client"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { MapPin, List, Landmark, Map, Plus } from "lucide-react";
import { OwnershipTypes } from "../utils/constants";
import { TypeLabel } from "./TypeLabel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AddRecordForm } from "../forms/AddRecordForm";

function renderOwnershipType(type: string) {
    return (
        <SheetDescription className={cn("flex items-center gap-1.5 font-medium",
            type == "royal" ? "text-blue-600 dark:text-blue-400" :
                type == "private" ? "text-rose-600 dark:text-rose-400" :
                    type == "church" ? "text-orange-600 dark:text-orange-400" :
                        "text-zinc-600 dark:text-zinc-400"
        )}>
            <TypeLabel typeKey={type} iconSize={14} />
        </SheetDescription>
    )
};

interface ViewManorSheetProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    onUpdate?: (updatedManor: any) => void;
}

export function ViewManorSheet({ isOpen, onClose, data, onUpdate }: ViewManorSheetProps) {
    if (!data) return null;

    return (
        <Sheet
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
        >
            <SheetContent side="right" className="sm:max-w-md w-full p-0 flex flex-col h-full border-l dark:border-[#374151] dark:bg-[#111827]">
                <SheetHeader className="p-6 border-b dark:border-[#374151]">
                    <SheetTitle className="text-xl font-bold">{data.name}</SheetTitle>
                    {renderOwnershipType(data.type)}
                </SheetHeader>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 gap-3">
                            {data.voivodeship && (
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-100 dark:bg-[#1F2937]">
                                    <Landmark size={18} className="text-zinc-500 mt-0.5 dark:text-white/60" />
                                    <div>
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-white/60">Воєводство</h3>
                                        <p className="text-sm font-medium">{data.voivodeship}</p>
                                    </div>
                                </div>
                            )}

                            {data.district && (
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-100 dark:bg-[#1F2937]">
                                    <Map size={18} className="text-zinc-500 mt-0.5 dark:text-white/60" />
                                    <div>
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-white/60">Повіт</h3>
                                        <p className="text-sm font-medium">{data.district}</p>
                                    </div>
                                </div>
                            )}

                            {data.center && (
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-100 dark:bg-[#1F2937]">
                                    <MapPin size={18} className="text-zinc-500 mt-0.5 dark:text-white/60" />
                                    <div>
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-white/60">Адміністративний центр</h3>
                                        <p className="text-sm font-medium">{data.center}</p>
                                    </div>
                                </div>
                            )}

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Plus size={12} /> Додати склад
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <AddRecordForm onClose={onClose} data={data} onUpdate={onUpdate}/>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {data.contents && data.contents.length > 0 ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 px-1">
                                    <List size={16} className="text-zinc-500 dark:text-white/70" />
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-white/70">Склад</h3>
                                </div>
                                <Accordion type="single" collapsible className="w-full">
                                    {data.contents.map((record: any, idx: number) => (
                                        <AccordionItem key={`${record.date}-${idx}`} value={`item-${idx}`} className="border-zinc-200 dark:border-[#374151]">
                                            <AccordionTrigger className="hover:no-underline py-3 px-1 font-medium">
                                                <span>{record.date} р.</span>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-1 pb-4">
                                                <div className="space-y-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-white/70">Джерело:</span>
                                                        {record.sourceSignature && record.sourceLink ? (
                                                            <a
                                                                href={record.sourceLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center transition-colors"
                                                            >
                                                                {record.sourceSignature}
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs text-zinc-700 dark:text-zinc-300">{record.sourceSignature}</span>
                                                        )}
                                                    </div>

                                                    {record.owner && (
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-white/70">{OwnershipTypes.get(data.type).ownerTitle}:</span>
                                                            <span className="text-xs text-zinc-700 dark:text-zinc-300">{record.owner}</span>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-white/70 mb-2">Населені пункти:</h4>
                                                        <ol className="list-decimal list-inside grid grid-cols-1 gap-1">
                                                            {record.items.map((item: any, i: number) => (
                                                                <li key={i} className="text-sm text-zinc-700 dark:text-zinc-300">
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ol>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 px-1">
                                    <List size={16} className="text-zinc-500 dark:text-white/70" />
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-white/70">Склад</h3>
                                </div>
                                <p className="text-sm text-zinc-500 px-1">Дані про склад наразі відсутні.</p>
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
