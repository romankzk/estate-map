'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Estate, EstateSnapshot } from '../types'
import { Statuses } from '../utils/enums'

export async function getAllEstates() {
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

    if (error) throw error;
    return data as Estate[];
}

export async function getPendingSnapshots() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('estate_snapshots')
        .select(`
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
        `)
        .eq('status', Statuses.Pending);

    if (error) throw error;
    return data as EstateSnapshot[];
}