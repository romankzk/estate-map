'use server';

import { Estate } from '@/app/estate-map/types';
import { Statuses } from '@/app/estate-map/utils/enums';
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
 * Get the list of approved estates
 * @returns 
 */
export async function getApprovedEstates(): Promise<Estate[]> {
    const fileContent = await fs.readFile(DATA_PATH, 'utf-8');
    let estates = JSON.parse(fileContent);
    return estates.filter((e: Estate) => e.status === Statuses.Approved);
}

export async function getPendingItems() {
    let estates = await getAllEstates();

    const pendingItems: any[] = [];

    estates.forEach(estate => {
        if (estate.status === Statuses.Pending) {
            pendingItems.push({
                ...estate,
                type: 'estate',
                displayName: estate.name,
                displayType: 'Маєток'
            });
        }

        estate.contents?.forEach((snapshot, index) => {
            if (snapshot.status === Statuses.Pending) {
                pendingItems.push({
                    ...snapshot,
                    id: `${estate.id}-${index}`,
                    estateId: estate.id,
                    snapshotIndex: index,
                    type: 'snapshot',
                    displayName: `${estate.name} (${snapshot.date})`,
                    displayType: 'Склад маєтку'
                });
            }
        });
    });

    return pendingItems;
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
        province: userData.province,
        district: userData.district,
        coords: coordsArray,
        status: Statuses.Pending,
        contents: []
    };

    data.push(newEstateData);

    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(DATA_PATH, jsonString, 'utf-8');

    return newEstateData;
}

/**
 * Update an existing estate
 * @param id Estate ID
 * @param updatedData Data to update
 * @returns Updated estate
 */
export async function updateEstate(id: number, updatedData: any): Promise<Estate> {
    const data = await getAllEstates();
    const index = data.findIndex((estate: any) => estate.id === id);

    if (index === -1) {
        throw new Error(`Estate with id ${id} not found`);
    }

    let coordsArray = data[index].coords;
    if (updatedData.coords) {
        if (typeof updatedData.coords === 'string') {
            const parts = updatedData.coords.split(',').map((p: any) => parseFloat(p.trim()));
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                coordsArray = [parts[0], parts[1]];
            }
        } else if (Array.isArray(updatedData.coords)) {
            coordsArray = updatedData.coords;
        }
    }

    data[index] = {
        ...data[index],
        ...updatedData,
        coords: coordsArray,
        id: id // Ensure ID doesn't change
    };

    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(DATA_PATH, jsonString, 'utf-8');

    return data[index];
}

/**
 * Delete an estate
 * @param id Estate ID
 */
export async function deleteEstate(id: number): Promise<void> {
    const data = await getAllEstates();
    const newData = data.filter((estate: any) => estate.id !== id);

    if (data.length === newData.length) {
        throw new Error(`Estate with id ${id} not found`);
    }

    const jsonString = JSON.stringify(newData, null, 2);
    await fs.writeFile(DATA_PATH, jsonString, 'utf-8');
}

/**
 * Create a new estate snapshot
 * @param estateId Estate ID
 * @param snapshotData Snapshot data
 * @returns Updated estate
 */
export async function createEstateSnapshot(estateId: number, snapshotData: any): Promise<Estate> {
    const data = await getAllEstates();
    const targetEstate = data.find((estate: any) => estate.id === estateId);

    if (!targetEstate) {
        throw new Error(`Estate with id ${estateId} not found`);
    }

    if (!targetEstate.contents) {
        targetEstate.contents = [];
    }

    let items = snapshotData.items;
    const delimitersRegex = /[,;|\n\r]+/;

    if (typeof items === 'string') {
        items = items.split(delimitersRegex).map(i => i.trim()).filter(i => i !== '');
    }

    const newSnapshot = {
        ...snapshotData,
        status: Statuses.Pending,
        items
    };

    targetEstate.contents.push(newSnapshot);

    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(DATA_PATH, jsonString, 'utf-8');

    return targetEstate;
}

/**
 * Update an estate snapshot
 * @param estateId Estate ID
 * @param snapshotIndex Index of the snapshot in the contents array
 * @param updatedSnapshotData New snapshot data
 * @returns Updated estate
 */
export async function updateEstateSnapshot(estateId: number, snapshotIndex: number, updatedSnapshotData: any): Promise<Estate> {
    const data = await getAllEstates();
    const targetEstate = data.find((estate: any) => estate.id === estateId);

    if (!targetEstate) {
        throw new Error(`Estate with id ${estateId} not found`);
    }

    if (!targetEstate.contents || !targetEstate.contents[snapshotIndex]) {
        throw new Error(`Snapshot at index ${snapshotIndex} not found in estate ${estateId}`);
    }

    let items = updatedSnapshotData.items;
    const delimitersRegex = /[,;|\n\r]+/;

    if (typeof items === 'string') {
        items = items.split(delimitersRegex).map(i => i.trim()).filter(i => i !== '');
    }

    targetEstate.contents[snapshotIndex] = {
        ...targetEstate.contents[snapshotIndex],
        ...updatedSnapshotData,
        items
    };

    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(DATA_PATH, jsonString, 'utf-8');

    return targetEstate;
}

/**
 * Delete an estate snapshot
 * @param estateId Estate ID
 * @param snapshotIndex Index of the snapshot to delete
 * @returns Updated estate
 */
export async function deleteEstateSnapshot(estateId: number, snapshotIndex: number): Promise<Estate> {
    const data = await getAllEstates();
    const targetEstate = data.find((estate: any) => estate.id === estateId);

    if (!targetEstate) {
        throw new Error(`Estate with id ${estateId} not found`);
    }

    if (!targetEstate.contents || !targetEstate.contents[snapshotIndex]) {
        throw new Error(`Snapshot at index ${snapshotIndex} not found in estate ${estateId}`);
    }

    targetEstate.contents.splice(snapshotIndex, 1);

    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(DATA_PATH, jsonString, 'utf-8');

    return targetEstate;
}