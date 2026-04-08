'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Estate } from './types'
import { Statuses } from './utils/enums'

export async function getApprovedEstates() {
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