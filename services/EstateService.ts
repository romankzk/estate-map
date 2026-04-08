import { Estate } from "@/app/estate-map/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const EstateService = {
    async getAllEstates(supabase: any): Promise<Estate[]> {
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
            `);

        if (error) throw error;
        return data as Estate[];
    },

    async getEstateDetails(supabase: SupabaseClient, id: any): Promise<Estate> {
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
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Estate;
    }
}