import { Plus } from "lucide-react";
import { ManorsViewContainer } from "./components/ManorsViewContainer";
import { Button } from "@/components/ui/button";

export default async function ManorsPage({ searchParams }: { searchParams: Promise<{ lat?: string, lng?: string }> }) {
    const params = await searchParams;

    const data = (await import("@/data/markers.json")).default;

    let initialCenter: [number, number] = [49.55, 25.59];
    let initialZoom = 8;

    if (params.lat && params.lng) {
        initialCenter = [parseFloat(params.lat), parseFloat(params.lng)];
        initialZoom = 15;
    }

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-[#111827] font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h1 className="text-gray-900 dark:text-[#F3F4F6] text-[24px] md:text-[28px] lg:text-[32px] font-bold">Староства та ключі</h1>
                    <Button variant="default" className="cursor-pointer">
                        <Plus className="size-4 mr-0.5" /> Додати
                    </Button>
                </div>

                <ManorsViewContainer 
                    data={data} 
                    center={initialCenter} 
                    zoom={initialZoom} 
                />
            </div>
        </main>
    );
}
