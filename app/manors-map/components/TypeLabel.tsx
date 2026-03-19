"use client"

import { Castle, Church, Crown, House } from "lucide-react";
import { OwnershipTypes } from "../utils/constants";

interface TypeLabelProps {
    typeKey: string, 
    iconSize: number
}

export function TypeLabel({typeKey, iconSize}: TypeLabelProps) {
    switch (typeKey) {
        case "royal":
            return (
                <>
                    <Crown size={iconSize} />
                    <span>{OwnershipTypes.get(typeKey).name}</span>
                </>
            );
        case "private":
            return (
                <>
                    <Castle size={iconSize} />
                    <span>{OwnershipTypes.get(typeKey).name}</span>
                </>
            );
        case "church":
            return (
                <>
                    <Church size={iconSize} />
                    <span>{OwnershipTypes.get(typeKey).name}</span>
                </>
            );
        default:
            return (
                <>
                    <House size={iconSize} />
                    <span>{OwnershipTypes.get(typeKey).name}</span>
                </>
            );
    }
}