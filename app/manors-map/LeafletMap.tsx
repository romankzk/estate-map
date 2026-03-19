"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from 'leaflet'

const icon = L.icon({
    iconUrl: "/map-pin.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -16]
});

const createClusterCustomIcon = (cluster: any) => {
  return L.divIcon({
      html: `<div class="bg-blue-500/80 text-white font-bold rounded-full flex items-center justify-center shadow-lg" 
                  style="width: 40px; height: 40px;">
               ${cluster.getChildCount()}
             </div>`,
      className: "custom-marker-cluster",
      iconSize: L.point(40, 40, true),
    });
};

export default function LeafletMap({ 
    data, 
    center, 
    zoom,
    onOpenDrawer 
}: { 
    data: any[], 
    center: [number, number], 
    zoom: number,
    onOpenDrawer: (marker: any) => void
}) {
    const position: [number, number] = center;

    return (
        <div className="h-[70vh] w-full">
            <MapContainer 
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
                    <Marker key={marker.id} position={marker.coords} icon={icon}>
                        <Popup>
                            <h2 className="font-semibold text-base">{marker.name}</h2>
                            <button 
                                className="text-xs text-blue-600 hover:underline cursor-pointer"
                                onClick={() => onOpenDrawer(marker)}
                            >
                                Переглянути більше
                            </button>
                        </Popup>
                    </Marker>
                )}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    )
}
