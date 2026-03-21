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
import { EstateTypes, PropertyTypes } from "../utils/enums";
import { TypeLabel } from "./ui/TypeLabel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AddSnapshotForm } from "../forms/AddSnapshotForm";
import { InfoItem } from "./ui/InfoItem";
import { EstateSnapshot } from "../types";

function renderPropertyType(type: string) {
    return (
        <SheetDescription className={cn("flex items-center gap-1.5 font-medium",
            type == "royal" ? "text-blue-600 dark:text-blue-400" :
                type == "private" ? "text-rose-600 dark:text-rose-400" :
                    type == "church" ? "text-orange-600 dark:text-orange-400" :
                        "text-zinc-600 dark:text-zinc-400"
        )}>
            <TypeLabel typeKey={type} iconSize={14} isShort={false} />
        </SheetDescription>
    )
};

interface ViewEstateSheetProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    onUpdate?: (updatedManor: any) => void;
}

export function ViewEstateSheet({ isOpen, onClose, data, onUpdate }: ViewEstateSheetProps) {
    if (!data) return null;

    const approvedContents = [...(data.contents || [])]
        .filter((s: EstateSnapshot) => s.status === 'approved')
        .sort((a: any, b: any) => a.date.localeCompare(b.date));

    return (
        <Sheet
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
        >
            <SheetContent side="right" className="sm:max-w-md w-full p-0 flex flex-col h-full border-l dark:border-[#374151] dark:bg-[#111827]">
                <SheetHeader className="p-6 border-b dark:border-[#374151]">
                    <SheetTitle className="text-xl font-bold">{data.name}</SheetTitle>
                    {renderPropertyType(data.propertyType)}
                </SheetHeader>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <div className="px-6 pb-6 space-y-6">
                        <div className="grid grid-cols-1 gap-3">
                            {data.estateType && (
                                <InfoItem iconName="ChessRook" label="Тип маєтку" value={EstateTypes.get(data.estateType).label} />
                            )}

                            {data.voivodeship && (
                                <InfoItem iconName="Landmark" label="Воєводство" value={data.voivodeship} />
                            )}

                            {data.district && (
                                <InfoItem iconName="Map" label="Повіт" value={data.district} />
                            )}

                            {data.center && (
                                <InfoItem iconName="MapPin" label="Адміністративний центр" value={data.center} />
                            )}

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Plus size={12} /> Додати склад {EstateTypes.get(data.estateType).labelGenitive.toLowerCase()}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="dark:bg-[#111827] border-b border-gray-300 dark:border-[#374151]">
                                    <AddSnapshotForm onClose={onClose} data={data} onUpdate={onUpdate} />
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-1">
                                <List size={16} className="text-zinc-500 dark:text-white/70" />
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-white/70">Склад {EstateTypes.get(data.estateType).labelGenitive.toLowerCase()}</h3>
                            </div>
                            {approvedContents.length > 0 ? (
                                <Accordion type="single" collapsible className="w-full">
                                    {approvedContents.map((record: any, idx: number) => (
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
                                                            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-white/70">{EstateTypes.get(data.estateType).owner}:</span>
                                                            <span className="text-xs text-zinc-700 dark:text-zinc-300">{record.owner}</span>
                                                        </div>
                                                    )}

                                                    {record.notes && (
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-white/70">Примітки:</span>
                                                            <span className="text-xs text-zinc-700 dark:text-zinc-300">{record.notes}</span>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-white/70 mb-2">Населені пункти:</h4>
                                                        <ol className="list-decimal list-inside grid grid-cols-1 gap-1">
                                                            {record.items.map((item: any, i: number) => (
                                                                <li key={i} className="text-sm text-zinc-700 dark:text-white/80">
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
                            ) : (
                                <p className="text-sm text-zinc-500 px-1">Дані про склад наразі відсутні.</p>
                            )}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
