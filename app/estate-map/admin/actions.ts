'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { Estate, EstateSnapshot } from '../types'
import { Statuses } from '../utils/enums'

function parseCoords(value: string) {
    let coordsArray = [];
    const parts = value.split(',').map((p: any) => parseFloat(p.trim()));

    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        coordsArray = [parts[0], parts[1]];
        return coordsArray
    } else return false;
}

function parseItems(value: string): string[] {
    const delimitersRegex = /[,;|\n\r]+/;
    let items = [];

    items = value.split(delimitersRegex).map(i => i.trim()).filter(i => i !== '');
    return items;
}

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
        .order('id', { ascending: false })
        .order('year', { referencedTable: 'estate_snapshots', ascending: true });

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
        .eq('status', Statuses.Pending)
        .order('id', { ascending: false });

    if (error) throw error;
    return data as EstateSnapshot[];
}

export async function updateEstate(id: any, formData: any) {
    const supabase = await createClient();

    let values = {
        name: formData.name,
        center: formData.center,
        property_type: formData.propertyType,
        estate_type: formData.estateType,
        coords: parseCoords(formData.coords),
    };

    const { data, error } = await supabase
        .from('estates')
        .update(values)
        .eq('id', id)
        .select();

    if (error) throw error;

    revalidatePath('/estate-map/admin');

    return data;
}

export async function deleteEstate(id: any) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('estates')
        .delete()
        .eq('id', id);

    if (error) throw error;

    revalidatePath('/estate-map/admin');
}

export async function approveEstate(id: any) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('estates')
        .update({
            status: Statuses.Approved
        })
        .eq('id', id)
        .select();

    if (error) throw error;

    revalidatePath('/estate-map/admin');

    return data;
}


export async function updateSnapshot(id: any, formData: any) {
    const supabase = await createClient();

    let values = {
        name: formData.name,
        province: formData.province,
        district: formData.district || null,
        year: formData.year,
        owner: formData.owner || null,
        notes: formData.notes || null,
        source_signature: formData.sourceSignature,
        source_page: formData.sourcePage || null,
        source_link: formData.sourceLink || null,
        items: parseItems(formData.items)
    };

    const { data, error } = await supabase
        .from('estate_snapshots')
        .update(values)
        .eq('id', id)
        .select();

    if (error) throw error;

    revalidatePath('/estate-map/admin');

    return data;
}

export async function approveSnapshot(id: any) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('estate_snapshots')
        .update({
            status: Statuses.Approved
        })
        .eq('id', id)
        .select();

    if (error) throw error;

    revalidatePath('/estate-map/admin');

    return data;
}

export async function deleteSnapshot(id: any) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('estate_snapshots')
        .delete()
        .eq('id', id);

    if (error) throw error;

    revalidatePath('/estate-map/admin');
}