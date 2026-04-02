export interface EstateSnapshot {
    name: string,
    status: string,
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
}

export interface Estate {
    id: number,
    name: string,
    status: string
    estateType: string,
    propertyType: string,
    center: string,
    coords: number[],
    contents?: EstateSnapshot[],
}