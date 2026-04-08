'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from 'next/cache'

function parseItems(value: string) {
    const delimitersRegex = /[,;|\n\r]+/;
    let items = [];

    items = value.split(delimitersRegex).map(i => i.trim()).filter(i => i !== '');
    return items;
}

export async function createEstate(formData: any) {
    const supabase = await createClient();

    let values = {
        name: formData.name,
        center: formData.center,
        property_type: formData.propertyType,
        estate_type: formData.estateType,
        coords: formData.coords,
    };

    const { data, error } = await supabase
        .from('estates')
        .insert(values)
        .select();

    if (error) throw error;

    revalidatePath('/estate-map/');

    return data;
}

export async function createSnapshot(estateId: any, formData: any) {
    const supabase = await createClient();

    let values = {
        name: formData.name,
        province: formData.province,
        district: formData.district,
        year: formData.year,
        owner: formData.owner,
        notes: formData.notes,
        source_signature: formData.sourceSignature,
        source_page: formData.sourcePage,
        source_link: formData.sourceLink,
        items: parseItems(formData.items),
        estate_id: estateId
    };

    const { data, error } = await supabase
        .from('estate_snapshots')
        .insert(values)
        .select();

    if (error) throw error;

    revalidatePath('/estate-map/');

    return data;
}