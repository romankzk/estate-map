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
import { MapPin, List, Landmark, Map, Plus, Shield } from "lucide-react";
import { EstateTypes, PropertyTypes, Statuses } from "../utils/enums";
import { TypeLabel } from "./ui/TypeLabel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AddSnapshotForm } from "../forms/AddSnapshotForm";
import { InfoItem } from "./ui/InfoItem";
import { EstateSnapshot } from "../types";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";

function renderPropertyType(type: string) {
    return (
        <SheetDescription className={cn("flex items-center gap-1.5 font-medium",
            type == "royal" ? "text-blue-600 dark:text-blue-400" :
                type == "private" ? "text-rose-600 dark:text-rose-400" :
                    type == "church" ? "text-orange-600 dark:text-orange-400" :
                        "text-purple-600 dark:text-purple-400"
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
        .filter((s: EstateSnapshot) => s.status === Statuses.Approved)
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
                        <div className="grid grid-cols-2 gap-3">
                            {data.estateType && (
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-white/60">Тип маєтку</h3>
                                    <p className="text-sm font-medium">{data.estateType}</p>
                                </div>
                            )}

                            {data.center && (
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-white/60">Центр</h3>
                                    <p className="text-sm font-medium">{data.center}</p>
                                </div>
                            )}
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <div className="flex flex-row items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <List size={16} className="text-zinc-500 dark:text-white/70" />
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-white/70">Склад маєтку</h3>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Plus size={12} /> Додати
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="dark:bg-[#111827] border-b border-gray-300 dark:border-[#374151]">
                                        <AddSnapshotForm onClose={onClose} data={data} onUpdate={onUpdate} />
                                    </DialogContent>
                                </Dialog>
                            </div>
                            {approvedContents.length > 0 ? (
                                <Accordion type="single" collapsible className="w-full">
                                    {approvedContents.map((record: any, idx: number) => (
                                        <AccordionItem key={`${record.date}-${idx}`} value={`item-${idx}`} className="border-zinc-200 dark:border-[#374151]">

                                            {/* Snapshot title */}
                                            <AccordionTrigger className="hover:no-underline py-3 px-1 font-medium">
                                                <span>{record.date}</span>
                                            </AccordionTrigger>

                                            {/* Snapshot content */}
                                            <AccordionContent className="px-0.5 pb-4 pt-2 space-y-2">
                                                <Item size="sm">
                                                    <ItemContent>
                                                        <ItemTitle>{record.name}</ItemTitle>
                                                        <ItemDescription>Руське воєводство, Львівський повіт</ItemDescription>
                                                    </ItemContent>
                                                </Item>

                                                <Item size="sm" variant="outline">
                                                    <ItemContent>
                                                        <ItemTitle>Загальна інформація</ItemTitle>
                                                        <ItemDescription className="space-y-4 pt-2">
                                                            {record.owner && (
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-white/70">Власник</span>
                                                                    <span className="text-xs text-zinc-700 dark:text-zinc-300">{record.owner}</span>
                                                                </div>
                                                            )}

                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-white/70">Джерело</span>
                                                                {record.sourceSignature && record.sourceLink ? (
                                                                    <a
                                                                        href={record.sourceLink}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center transition-colors"
                                                                    >
                                                                        {record.sourceSignature}
                                                                        {record.sourcePage && (
                                                                            <> - с. {record.sourcePage}</>
                                                                        )}
                                                                    </a>
                                                                ) : (
                                                                    <span className="text-xs text-zinc-700 dark:text-zinc-300">
                                                                        {record.sourceSignature}
                                                                        {record.sourcePage && (
                                                                            <> - с. {record.sourcePage}</>
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {record.notes && (
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-white/70">Примітки</span>
                                                                    <span className="text-xs text-zinc-700 dark:text-zinc-300">{record.notes}</span>
                                                                </div>
                                                            )}
                                                        </ItemDescription>
                                                    </ItemContent>
                                                </Item>

                                                <Item size="sm" variant="outline">
                                                    <ItemContent>
                                                        <ItemTitle>Населені пункти</ItemTitle>
                                                        <ItemDescription className="space-y-4 pt-2">
                                                            <ol className="list-decimal list-inside grid grid-cols-1 gap-1">
                                                                {record.items.map((item: any, i: number) => (
                                                                    <li key={i} className="text-sm text-zinc-700 dark:text-white/80">
                                                                        {item}
                                                                    </li>
                                                                ))}
                                                            </ol>
                                                        </ItemDescription>
                                                    </ItemContent>
                                                </Item>
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
