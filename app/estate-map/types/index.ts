export interface EstateSnapshot {
    id: number,
    name: string,
    status: string,
    province: string,
    district?: string,
    year: string,
    sourceSignature: string,
    sourcePage?: string,
    sourceLink?: string,
    owner?: string,
    notes?: string,
    items: string[],
}

export interface Estate {
    id: number,
    name: string,
    status: string
    estateType: string,
    propertyType: string,
    center: string,
    coords: number[],
    snapshots?: EstateSnapshot[],
}