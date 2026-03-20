'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { List, Map, Plus } from "lucide-react";
import { ViewEstateSheet } from './components/ViewEstateSheet';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { AddEstateSheet } from './components/AddEstateSheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";

// Dynamically import the client-side map, disabling SSR
const LeafletMap = dynamic<{
    data: any[];
    center: [number, number];
    zoom: number;
    onOpenSheet: (marker: any) => void;
}>(
    () => import('./LeafletMap'),
    { 
        ssr: false, 
        loading: () => (
            <div className="w-full h-[70vh] flex items-center justify-center bg-white dark:bg-slate-900 text-slate-400">
                Завантаження карти...
            </div>
        )
    }
);

interface AppContainerProps {
    data: any[];
    center: [number, number];
    zoom: number;
}

export function AppContainer({ data: initialData, center, zoom }: AppContainerProps) {
    const [data, setData] = useState(initialData);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

    const handleOpenSheet = (item: any) => {
        // Handle both Leaflet marker objects and DataTable row objects
        const dataToSet = item.original ? item.original : item;
        setSelectedItem(dataToSet);
        setIsSheetOpen(true);
    };

    const handleCloseSheet = () => {
        setIsSheetOpen(false);
    };

    const handleUpdateEstate = (updatedEstate: any) => {
        setData(prev => prev.map(m => m.id === updatedEstate.id ? updatedEstate : m));
        setSelectedItem(updatedEstate);
    };

    const handleAddEstate = (newEstate: any) => {
        setData(prev => [...prev, newEstate]);
    };

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="text-gray-900 dark:text-[#F3F4F6] text-[24px] md:text-[28px] lg:text-[32px] font-bold">Реєстр маєтностей</h1>
                <Button 
                    variant="default" 
                    className="cursor-pointer"
                    onClick={() => setIsAddSheetOpen(true)}
                >
                    <Plus className="size-4 mr-0.5" /> Додати
                </Button>
            </div>

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
                                onOpenSheet={handleOpenSheet} 
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

            <ViewEstateSheet 
                isOpen={isSheetOpen} 
                onClose={handleCloseSheet} 
                data={selectedItem}
                onUpdate={handleUpdateEstate}
            />

            <AddEstateSheet 
                isOpen={isAddSheetOpen} 
                onClose={() => setIsAddSheetOpen(false)} 
                onSubmit={handleAddEstate} 
            />
        </>
    );
}
