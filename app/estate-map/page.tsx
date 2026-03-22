import { AppContainer } from "./AppContainer";
import { getApprovedEstates } from "@/lib/data-utils";

export default async function EstatePage({ searchParams }: { searchParams: Promise<{ lat?: string, lng?: string }> }) {
    const params = await searchParams;

    const data = await getApprovedEstates();

    let initialCenter: [number, number] = [49.077, 31.410];
    let initialZoom = 6;

    if (params.lat && params.lng) {
        initialCenter = [parseFloat(params.lat), parseFloat(params.lng)];
        initialZoom = 15;
    }

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-[#111827] font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <AppContainer 
                    data={data} 
                    center={initialCenter} 
                    zoom={initialZoom} 
                />
            </div>
        </main>
    );
}
