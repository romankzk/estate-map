import fs from 'fs';
import path from 'path';

export async function getAllManors() {
    let data = (await import("@/data/data.json")).default;
    return data;
}

export async function addManor(userData: any) {
    let data = await getAllManors();

    data.push({
        id: data.length + 1,
        ...userData,
        contents: []
    });
    const jsonString = JSON.stringify(data);
    return data;
}