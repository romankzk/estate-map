import { LeafletMapWrapper } from "./LeafletMapWrapper";

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
                {/* Map */}
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <LeafletMapWrapper data={data} center={initialCenter} zoom={initialZoom} />
                    </div>
                </div>
            </div>
        </main>
    );
}