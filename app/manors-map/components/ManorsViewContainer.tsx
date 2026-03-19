'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { InfoSheet } from './InfoSheet';
import { DataTable } from './DataTable';
import { columns } from './Columns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { List, Map } from "lucide-react";

// Dynamically import the client-side map, disabling SSR
const LeafletMap = dynamic<{
    data: any[];
    center: [number, number];
    zoom: number;
    onOpenDrawer: (marker: any) => void;
}>(
    () => import('../LeafletMap'),
    { 
        ssr: false, 
        loading: () => (
            <div className="w-full h-[70vh] flex items-center justify-center bg-white dark:bg-slate-900 text-slate-400">
                Завантаження карти...
            </div>
        )
    }
);

interface ManorsViewContainerProps {
    data: any[];
    center: [number, number];
    zoom: number;
}

export function ManorsViewContainer({ data, center, zoom }: ManorsViewContainerProps) {
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleOpenSheet = (item: any) => {
        // Handle both Leaflet marker objects and DataTable row objects
        const dataToSet = item.original ? item.original : item;
        setSelectedItem(dataToSet);
        setIsSheetOpen(true);
    };

    const handleCloseSheet = () => {
        setIsSheetOpen(false);
    };

    return (
        <>
            <Tabs defaultValue="map">
                <div className="mb-6">
                    <TabsList variant="line">
                        <TabsTrigger value="map"><Map className="size-4 mr-1" /> Карта</TabsTrigger>
                        <TabsTrigger value="list"><List className="size-4 mr-1" /> Список</TabsTrigger>
                    </TabsList>
                </div>
                
                <TabsContent value="map" className="mt-0 outline-none">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden border dark:border-gray-800">
                        <div className="overflow-x-auto">
                            <LeafletMap 
                                data={data} 
                                center={center} 
                                zoom={zoom} 
                                onOpenDrawer={handleOpenSheet} 
                            />
                        </div>
                    </div>
                </TabsContent>
                
                <TabsContent value="list" className="mt-0 outline-none">
                   <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 border dark:border-gray-800">
                       <div className="overflow-x-auto">
                            <DataTable 
                                columns={columns} 
                                data={data} 
                                onOpenDrawer={handleOpenSheet} 
                            />
                        </div>
                   </div>
                </TabsContent>
            </Tabs>

            <InfoSheet 
                isOpen={isSheetOpen} 
                onClose={handleCloseSheet} 
                data={selectedItem} 
            />
        </>
    );
}
