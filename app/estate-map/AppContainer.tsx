'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, use, Suspense } from 'react';
import { List, Map, Plus } from "lucide-react";
import { ViewEstateSheet } from './components/ViewEstateSheet';
import { EstatesDataTable } from './components/EstatesDataTable';
import { columns } from './components/Columns';
import { AddEstateSheet } from './components/AddEstateSheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Estate } from './types';

// Dynamically import the client-side map, disabling SSR
const LeafletMap = dynamic<{
    data: any;
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
    estates: Estate[];
}

export function AppContainer({ estates }: AppContainerProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
    const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

    // Handling 'id' param in the url
    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            const item = estates.find(e => String(e.id) === id);
            if (item) {
                setSelectedItem(item);
                setIsViewSheetOpen(true);
            } else {
                setIsViewSheetOpen(false);
            }
        } else {
            setIsViewSheetOpen(false);
            setSelectedItem(null);
        }
    }, [searchParams, estates]);

    // When estate details sheets is opened
    const handleOpenSheet = (item: any) => {
        const params = new URLSearchParams(searchParams);

        // Handle both Leaflet marker objects and DataTable row objects
        const dataToSet = item.original ? item.original : item;
        params.set('id', dataToSet.id);
        replace(`${pathname}?${params.toString()}`);
    };

    // When estate details sheets is closed
    const handleCloseSheet = () => {
        const params = new URLSearchParams(searchParams);

        params.delete('id');
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="text-gray-900 dark:text-[#F3F4F6] text-[24px] md:text-[28px] lg:text-[32px] font-bold">
                    Реєстр маєтків
                </h1>
                <Button
                    variant="default"
                    className="cursor-pointer p-3 bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors"
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
                                    data={estates}
                                    onOpenSheet={handleOpenSheet}
                                />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="list" className="mt-0 outline-none">
                    <div className="bg-white dark:bg-[#1F2937] rounded-lg shadow-sm p-6 border dark:border-[#374151] overflow-x-auto">
                        <EstatesDataTable
                            columns={columns}
                            data={estates}
                            onOpenDrawer={handleOpenSheet}
                        />
                    </div>
                </TabsContent>
            </Tabs>

            {/* View estate details sheet */}
            <ViewEstateSheet
                isOpen={isViewSheetOpen}
                onClose={handleCloseSheet}
                data={selectedItem}
            />

            {/* Add new estate form sheet */}
            <AddEstateSheet
                isOpen={isAddSheetOpen}
                onClose={() => setIsAddSheetOpen(false)}
            />
        </>
    );
}
