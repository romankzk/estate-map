export interface EstateSnapshot {
    date: string,
    sourceSignature: string,
    sourceLink?: string,
    owner?: string,
    notes?: string,
    items?: string[],
    status?: string
}

export interface Estate {
    id: number,
    estateType: string,
    propertyType: string,
    name: string,
    center: string,
    voivodeship: string,
    district?: string,
    coords: number[],
    contents?: EstateSnapshot[],
    status?: string
}