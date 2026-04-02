export interface EstateSnapshot {
    name: string,
    state: string,
    province: string,
    district?: string,
    date: string,
    sourceSignature: string,
    sourcePage?: string,
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
    province: string,
    district?: string,
    coords: number[],
    contents?: EstateSnapshot[],
    status?: string
}