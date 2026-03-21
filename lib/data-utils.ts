'use server';

import { Estate } from '@/app/estate-map/types';
import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'data.json');

/**
 * Get the list of all estates
 * @returns 
 */
export async function getAllEstates(): Promise<Estate[]> {
    const fileContent = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(fileContent);
}

/**
 * Create new estate
 * @param userData Data for the new entity to create
 * @returns Created entity
 */
export async function createEstate(userData: any): Promise<Estate> {
    const data = await getAllEstates();
    
    let coordsArray = [49.8397, 24.0297]; // Default to Lviv if parsing fails
    if (userData.coords && typeof userData.coords === 'string') {
        const parts = userData.coords.split(',').map((p: any) => parseFloat(p.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            coordsArray = [parts[0], parts[1]];
        }
    } else if (Array.isArray(userData.coords)) {
        coordsArray = userData.coords;
    }

    const newEstateData = {
        id: data.length > 0 ? Math.max(...data.map((m: any) => m.id)) + 1 : 1,
        propertyType: userData.propertyType,
        estateType: userData.estateType,
        name: userData.name,
        center: userData.center,
        voivodeship: userData.voivodeship,
        district: userData.district,
        coords: coordsArray,
        contents: []
    };
    
    data.push(newEstateData);

    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(DATA_PATH, jsonString, 'utf-8');
    
    return newEstateData;
}

/**
 * Create new estate snapshot
 * @param id Estated ID
 * @param snapshotData New snapshot data
 * @returns Estate with the snapshot added
 */
export async function createEstateSnapshot(id: number, snapshotData: any): Promise<Estate> {
    const data = await getAllEstates();
    const targetEstate = data.find((estate: any) => estate.id === id);

    if (!targetEstate) {
        throw new Error(`Estate with id ${id} not found`);
    }

    let items = snapshotData.items;
    const delimitersRegex = /[,;|\n\r]+/;

    if (typeof items === 'string') {
        items = items.split(delimitersRegex).map(i => i.trim()).filter(i => i !== '');
    }

    targetEstate.contents?.push({
        ...snapshotData,
        items
    });

    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(DATA_PATH, jsonString, 'utf-8');
    
    return targetEstate;
}