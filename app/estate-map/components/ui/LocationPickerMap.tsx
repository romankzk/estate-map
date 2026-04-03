"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { useState, useEffect } from "react";

// Fix for default marker icon in Leaflet + Next.js
const defaultIcon = L.icon({
    iconUrl: "/map-pin-royal.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

interface LocationPickerMapProps {
    value: [number, number];
    onChange: (coords: [number, number]) => void;
}

function MapEvents({ onChange }: { onChange: (coords: [number, number]) => void }) {
    useMapEvents({
        click(e) {
            onChange([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
}

export default function LocationPickerMap({ value, onChange }: LocationPickerMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <MapContainer
            center={value || [50.4488, 30.5255]}
            zoom={7}
            scrollWheelZoom={true}
            className="h-full w-full"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEvents onChange={onChange} />
            {value && (
                <Marker position={value} icon={defaultIcon} />
            )}
        </MapContainer>
    );
}
