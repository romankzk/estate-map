export interface ManorRecord {
    date: string,
    sourceSignature: string,
    sourceLink?: string,
    owner?: string,
    items?: string[]
}

export interface Manor {
    id: number,
    type: string,
    name: string,
    center: string,
    voivodeship: string,
    district?: string,
    coords: number[],
    contents?: ManorRecord[]
}