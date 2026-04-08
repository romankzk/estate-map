import { AppContainer } from "./AppContainer";
import { Statuses } from "./utils/enums";
import { Estate } from "./types";
import { createClient } from "@/lib/supabase/server";

async function fetchEstates() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('estates')
        .select(`
            id,
            name,
            center,
            status,
            propertyType:property_type,
            estateType:estate_type,
            coords,
            snapshots:estate_snapshots (
                id,
                name,
                province,
                district,
                year,
                owner,
                notes,
                sourceSignature:source_signature,
                sourcePage:source_page,
                sourceLink:source_link,
                status,
                items
            )
        `)
        .eq('status', Statuses.Approved);

    if (error) throw error;
    return data as Estate[];
}

export default async function EstatePage() {
    const estates = await fetchEstates();

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-[#111827] font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <AppContainer
                    estates={estates}
                />
            </div>
        </main>
    );
}
