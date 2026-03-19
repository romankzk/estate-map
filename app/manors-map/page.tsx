import { List, Map } from "lucide-react";
import { LeafletMapWrapper } from "./LeafletMapWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function HistoricalMapPage({ searchParams }: { searchParams: Promise<{ lat?: string, lng?: string }> }) {
    const params = await searchParams;

    const data = (await import("@/data/markers.json")).default;

    let initialCenter: [number, number] = [49.55, 25.59];
    let initialZoom = 8;

    if (params.lat && params.lng) {
        initialCenter = [parseFloat(params.lat), parseFloat(params.lng)];
        initialZoom = 15;
    }

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-gray-900 dark:text-[#F3F4F6] text-[24px] md:text-[28px] lg:text-[32px] font-bold mb-[10px]">Староства та ключі</h1>
                <Tabs defaultValue="overview">
                    <TabsList variant="line">
                        <TabsTrigger value="map"><Map /> Карта</TabsTrigger>
                        <TabsTrigger value="list"><List /> Список</TabsTrigger>
                    </TabsList>
                    <TabsContent value="map">
                        {/* Map */}
                        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <LeafletMapWrapper data={data} center={initialCenter} zoom={initialZoom} />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="list">
                       Список
                    </TabsContent>
                </Tabs>

            </div>
        </main>
    );
}