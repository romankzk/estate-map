"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from 'leaflet'
import { PropertyTypes } from "./utils/enums";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TypeLabel } from "./components/ui/TypeLabel";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

function renderTypeBadge(type: string) {
    return (
        <Badge className={cn("inline-flex items-center gap-2",
            type == "royal" ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" :
                type == "private" ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300" :
                    type == "church" ? "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300" :
                        "bg-zinc-50 text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
        )}>
            <TypeLabel typeKey={type} iconSize={12} isShort={false} />
        </Badge>
    )
}

function setIcon(path: string) {
    return L.icon({
        iconUrl: path,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -16]
    })
};

const createClusterCustomIcon = (cluster: any) => {
    return L.divIcon({
        html: `<div class="bg-emerald-500/80 text-white font-bold rounded-full flex items-center justify-center shadow-lg" 
                  style="width: 40px; height: 40px;">
               ${cluster.getChildCount()}
             </div>`,
        className: "custom-marker-cluster",
        iconSize: L.point(40, 40, true),
    });
};

export default function LeafletMap({
    data,
    onOpenSheet
}: {
    data: any[],
    onOpenSheet: (marker: any) => void
}) {
    const position: [number, number] = [49.077, 31.410];
    const zoom = 6;

    // Use a memoized key to force a clean re-mount when needed, 
    // and avoid "Map container is being reused" error.
    const mapKey = useMemo(() => `map-${Date.now()}`, []);

    return (
        <div className="h-[70vh] w-full">
            <MapContainer
                key={mapKey}
                center={position}
                zoom={zoom}
                scrollWheelZoom={true}
                className="h-full w-full font-sans"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MarkerClusterGroup
                    chunkedLoading
                    maxClusterRadius={60}
                    spiderfyOnMaxZoom={true}
                    iconCreateFunction={createClusterCustomIcon}
                    showCoverageOnHover={false}
                >
                    {data.map((marker: any) =>
                        <Marker
                            key={marker.id}
                            position={marker.coords}
                            icon={setIcon(PropertyTypes.get(marker.propertyType).iconUrl)}
                        >
                            <Popup>
                                <h2 className="font-semibold text-base">{marker.name}</h2>
                                <p className="text-xs">
                                    {renderTypeBadge(marker.propertyType)}
                                </p>
                                <Button
                                    size="xs"
                                    variant="outline"
                                    className="cursor-pointer mt-2"
                                    onClick={() => onOpenSheet(marker)}
                                >
                                    Відкрити деталі <ArrowRight size={12} />
                                </Button>

                            </Popup>
                        </Marker>
                    )}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    )
}
