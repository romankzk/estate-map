'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { InfoSheet } from './components/InfoSheet';

// Dynamically import the client-side map, disabling SSR
const LeafletMap = dynamic<{
    data: any[];
    center: [number, number];
    zoom: number;
    onOpenDrawer: (marker: any) => void;
}>(
    () => import('./LeafletMap'),
    { 
        ssr: false, 
        loading: () => (
            <div className="w-full h-[70vh] flex items-center justify-center bg-white-900 dark:bg-slate-900 text-slate-400">
                Завантаження карти...
            </div>
        )
    }
);

interface LeafletMapWrapperProps {
    data: any[];
    center: [number, number];
    zoom: number;
}

export function LeafletMapWrapper({ data, center, zoom }: LeafletMapWrapperProps) {
    const [selectedMarker, setSelectedMarker] = useState<any>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleOpenDrawer = (marker: any) => {
        setSelectedMarker(marker);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    return (
        <>
            <LeafletMap 
                data={data} 
                center={center} 
                zoom={zoom} 
                onOpenDrawer={handleOpenDrawer} 
            />
            <InfoSheet 
                isOpen={isDrawerOpen} 
                onClose={handleCloseDrawer} 
                data={selectedMarker} 
            />
        </>
    );
}
