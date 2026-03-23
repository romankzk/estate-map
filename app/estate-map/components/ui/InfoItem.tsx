'use client';

import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface InfoItemProps {
    iconName: string;
    label: string;
    value: string;
}

export function InfoItem({ iconName, label, value }: InfoItemProps) {
    const Icon = Icons[iconName as keyof typeof Icons] as LucideIcon;
    
    if (!Icon) return null;

    return (
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-[#1F2937]">
            <Icon size={18} className="text-zinc-500 mt-0.5 dark:text-white/60" />
            <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-white/60">{label}</h3>
                <p className="text-sm font-medium">{value}</p>
            </div>
        </div>
    )
}