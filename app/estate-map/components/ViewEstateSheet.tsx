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
import { MapPin, List, Landmark, Map, Plus, Shield, User, Link as LinkIcon, FileText, Navigation, Layers, Info, TableOfContents, ScrollText } from "lucide-react";
import { EstateTypes, NumberingLabels, Statuses } from "../utils/enums";
import { TypeLabel } from "./ui/TypeLabel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AddSnapshotForm } from "../forms/AddSnapshotForm";
import { EstateSnapshot } from "../types";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

function renderPropertyType(type: string) {
    const colors = {
        royal: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
        private: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
        church: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
        mixed: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
    };

    const activeColor = colors[type as keyof typeof colors] || "bg-zinc-50 text-zinc-700 border-zinc-200";

    return (
        <Badge variant="outline" className={cn("flex items-center gap-1.5 px-2 py-0.5 font-semibold transition-colors", activeColor)}>
            <TypeLabel typeKey={type} iconSize={12} isShort={false} />
        </Badge>
    )
};

function renderNumberEndings(number: number) {
    const lastDigit = Math.abs(number % 10);
    
    return NumberingLabels.get(lastDigit);
}

interface ViewEstateSheetProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

export function ViewEstateSheet({ isOpen, onClose, data }: ViewEstateSheetProps) {
    if (!data) return;

    return (
        <Sheet
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
        >
            <SheetContent
                side="right"
                className="sm:max-w-md w-full p-0 pb-2 flex flex-col h-full border-l dark:border-[#374151] dark:bg-[#111827]"
            >
                <SheetHeader className="p-6 space-y-4 border-b dark:border-[#374151] bg-zinc-50/50 dark:bg-[#1F2937]/30 space-y-2">
                    <SheetTitle className="text-2xl font-bold tracking-tight">{data.name}</SheetTitle>
                    <div className="flex items-center justify-between">
                        {renderPropertyType(data.propertyType)}
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-4">
                    {/* Quick Information Section */}
                    <section className="grid grid-cols-2 gap-3">
                        {data.estateType && (
                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-[#1F2937]">
                                <Landmark size={18} className="text-zinc-500 mt-0.5 dark:text-white/60" />
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-white/60">
                                        Тип маєтку
                                    </h3>

                                    <p className="text-sm font-medium">{EstateTypes.get(data.estateType).label}</p>
                                </div>
                            </div>
                        )}
                        {data.center && (
                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-[#1F2937]">
                                <MapPin size={18} className="text-zinc-500 mt-0.5 dark:text-white/60" />
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-white/60">Центр</h3>
                                    <p className="text-sm font-medium">{data.center}</p>
                                </div>
                            </div>
                        )}
                    </section>

                    <Separator className="opacity-50" />

                    {/* Contents Section */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold tracking-tight">Хронологія складу</h3>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-semibold">
                                        <Plus size={14} /> Додати запис
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="dark:border-[#374151] dark:bg-[#111827] sm:max-w-[500px]">
                                    <AddSnapshotForm onClose={onClose} data={data} />
                                </DialogContent>
                            </Dialog>
                        </div>

                        {data.snapshots.length > 0 ? (
                            <Accordion type="single" collapsible className="w-full space-y-3 overflow-y-auto">
                                {data.snapshots.map((record: any, idx: number) => (
                                    <AccordionItem
                                        key={`${record.year}-${idx}`}
                                        value={`item-${idx}`}
                                        className="border rounded-xl overflow-hidden px-0 bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-[#374151]"
                                    >
                                        <AccordionTrigger
                                            className="hover:no-underline flex items-center py-2 px-2 bg-zinc-50/50 dark:bg-[#111827]/50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="h-6 px-2 text-sm bg-white dark:border-[#374151] dark:bg-[#111827]">
                                                    {record.year}
                                                </Badge>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">
                                                        {record.name || data.name}
                                                    </span>
                                                    <span className="text-xs font-normal text-muted-foreground dark:text-muted-foreground truncate max-w-[200px]">
                                                        {record.items.length} {renderNumberEndings(record.items.length)}
                                                    </span>
                                                </div>

                                            </div>
                                        </AccordionTrigger>

                                        <AccordionContent className="p-4 space-y-6 dark:border-[#374151] dark:bg-[#111827]">
                                            {/* Meta Info */}
                                            <div className="grid gap-4">
                                                {true && (
                                                    <div className="flex flex-col space-y-2">
                                                        <div className="flex items-center gap-2 min-w-[100px] text-zinc-400">
                                                            <Map size={14} />
                                                            <h4 className="text-xs font-semibold uppercase tracking-wider">Устрій</h4>
                                                        </div>
                                                        <p className="text-xs text-zinc-900 dark:text-zinc-200">
                                                            {record.province}
                                                            {record.district ? ", " : ""}
                                                            {record.district}
                                                        </p>
                                                    </div>
                                                )}

                                                {record.owner && (
                                                    <div className="flex flex-col space-y-2">
                                                        <div className="flex items-center gap-2 min-w-[100px] text-zinc-400">
                                                            <User size={14} />
                                                            <h4 className="text-xs font-semibold uppercase tracking-wider">Власник</h4>
                                                        </div>
                                                        <p className="text-xs text-zinc-900 dark:text-zinc-200">{record.owner}</p>
                                                    </div>
                                                )}

                                                {record.sourceSignature && (
                                                    <div className="flex flex-col space-y-2">
                                                        <div className="flex items-center gap-2 min-w-[100px] text-zinc-400">
                                                            <LinkIcon size={14} />
                                                            <h4 className="text-xs font-semibold uppercase tracking-wider">Джерело</h4>
                                                        </div>
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
                                                            <span className="text-xs text-zinc-900 dark:text-zinc-200">
                                                                {record.sourceSignature || "Не вказано"}
                                                                {record.sourcePage && (
                                                                    <> - с. {record.sourcePage}</>
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {record.notes && (
                                                    <div className="flex flex-col space-y-2">
                                                        <div className="flex items-center gap-2 min-w-[100px] text-zinc-400">
                                                            <FileText size={14} />
                                                            <h4 className="text-xs font-semibold uppercase tracking-wider">Примітки</h4>
                                                        </div>
                                                        <p className="text-xs italic leading-relaxed text-zinc-600 dark:text-zinc-400">{record.notes}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Settlements */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <List size={14} />
                                                    <h4 className="text-xs font-semibold uppercase tracking-wider">Населені пункти</h4>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
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
                            <Empty className="border border-dashed text-muted-foreground">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon" className="text-muted-foreground dark:bg-[#1F2937]">
                                        <ScrollText />
                                    </EmptyMedia>
                                    <EmptyTitle>Поки що порожньо</EmptyTitle>
                                    <EmptyDescription>
                                        Маєте інформацію про {data.name}? Сміливо тисніть «Додати запис»
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        )}
                    </section>
                </div>
            </SheetContent>
        </Sheet >
    )
}
