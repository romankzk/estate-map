"use client"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Crown, MapPin, List } from "lucide-react";

interface InfoDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

export function InfoDrawer({ isOpen, onClose, data }: InfoDrawerProps) {
    if (!data) return null;

    return (
        <Drawer
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
            direction="right"
        >
            <DrawerContent className="h-full rounded-none dark:bg-[#111827]">
                <DrawerHeader>
                    <DrawerTitle className="text-xl font-bold">{data.name}</DrawerTitle>
                    <DrawerDescription className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                        <Crown size={14} />
                        <span className="capitalize">{data.type === 'royal' ? 'Королівщина' : data.type}</span>
                    </DrawerDescription>
                </DrawerHeader>
                <div className="no-scrollbar overflow-y-auto px-4 py-2">
                    <div className="space-y-6">
                        {data.center && (
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-100 dark:bg-[#1F2937]">
                                <MapPin size={18} className="text-zinc-500 mt-0.5 dark:text-white/60" />
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-white/60">Адміністративний центр</h3>
                                    <p className="text-sm font-medium">{data.center}</p>
                                </div>
                            </div>
                        )}

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
                                                    <span className="text-xs mr-1">Джерело:</span>
                                                    {record.sourceSygn && record.sourceLink && (
                                                        <a
                                                            href={record.sourceLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center transition-colors"
                                                        >
                                                            {record.sourceSygn}
                                                        </a>
                                                    )}
                                                    {record.sourceSygn && !record.sourceLink && (
                                                        <span
                                                            className="text-xs inline-flex items-center"
                                                        >
                                                            {record.sourceSygn}
                                                        </span>
                                                    )}
                                                    <div className="space-y-4">
                                                        <span className="text-xs mr-1">Староста:</span>
                                                        <span className="text-xs text-zinc-700 dark:text-white/70">{record.owner}</span>
                                                    </div>
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
                            <p className="text-sm text-zinc-500 italic px-1">Дані про склад відсутні.</p>
                        )}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
