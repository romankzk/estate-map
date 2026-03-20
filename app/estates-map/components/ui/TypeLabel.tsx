"use client"

import { Castle, Church, Crown, House } from "lucide-react";
import { PropertyTypes} from "../../utils/enums";

interface TypeLabelProps {
    typeKey: string, 
    iconSize: number,
    isShort?: boolean
}

export function TypeLabel({typeKey, iconSize, isShort = true}: TypeLabelProps) {
    let label = '';

    if (isShort) {
        label = PropertyTypes.get(typeKey).label;
    } else {
        label = `${PropertyTypes.get(typeKey).label} власність`
    }

    switch (typeKey) {
        case "royal":
            return (
                <>
                    <Crown size={iconSize} />
                    <span>{label}</span>
                </>
            );
        case "private":
            return (
                <>
                    <Castle size={iconSize} />
                    <span>{label}</span>
                </>
            );
        case "church":
            return (
                <>
                    <Church size={iconSize} />
                    <span>{label}</span>
                </>
            );
        default:
            return (
                <>
                    <House size={iconSize} />
                    <span>{label}</span>
                </>
            );
    }
}