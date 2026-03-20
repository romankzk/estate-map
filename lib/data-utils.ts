'use server';

import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'data.json');

export async function getAllManors() {
    const fileContent = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(fileContent);
}

export async function addManor(userData: any) {
    const data = await getAllManors();
    
    // Parse coordinates robustly
    let coordsArray = [49.8397, 24.0297]; // Default to Lviv if parsing fails
    if (userData.coords && typeof userData.coords === 'string') {
        const parts = userData.coords.split(',').map((p: any) => parseFloat(p.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            coordsArray = [parts[0], parts[1]];
        }
    } else if (Array.isArray(userData.coords)) {
        coordsArray = userData.coords;
    }

    const newManorData = {
        id: data.length > 0 ? Math.max(...data.map((m: any) => m.id)) + 1 : 1,
        propertyType: userData.propertyType,
        manorType: userData.manorType,
        name: userData.name,
        center: userData.center,
        voivodeship: userData.voivodeship,
        district: userData.district,
        coords: coordsArray,
        contents: []
    };
    
    data.push(newManorData);

    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(DATA_PATH, jsonString, 'utf-8');
    
    return newManorData;
}

export async function addManorRecord(id: number, recordData: any) {
    const data = await getAllManors();
    const targetManor = data.find((manor: any) => manor.id === id);

    if (!targetManor) {
        throw new Error(`Manor with id ${id} not found`);
    }

    let items = recordData.items;
    const delimitersRegex = /[,;|\n\r]+/;

    if (typeof items === 'string') {
        items = items.split(delimitersRegex).map(i => i.trim()).filter(i => i !== '');
    }

    targetManor.contents.push({
        ...recordData,
        items
    });

    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(DATA_PATH, jsonString, 'utf-8');
    
    return targetManor;
}