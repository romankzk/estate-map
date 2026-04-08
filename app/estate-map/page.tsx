import { Suspense } from "react";
import { AppContainer } from "./AppContainer";
import { supabase } from '@/lib/supabase/client';
import { EstateService } from "@/services/EstateService";

export default async function EstatePage({ searchParams }: { searchParams: Promise<{ lat?: string, lng?: string }> }) {
    const data = await EstateService.getAllEstates(supabase);

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-[#111827] font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Suspense>
                    <AppContainer
                        data={data}
                    />
                </Suspense>
            </div>
        </main>
    );
}
