import L from 'leaflet'

export const OwnershipTypes = new Map<string, any>([
    ["royal",
        {
            key: "royal",
            name: "Королівська власність",
            ownerTitle: "Староста",
            icon: L.icon({
                iconUrl: "/map-pin-royal.png",
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -16]
            })
        }
    ],
    ["private", 
        {
            key: "private",
            name: "Приватна власність",
            ownerTitle: "Власник",
            icon: L.icon({
                iconUrl: "/map-pin-private.png",
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -16]
            })
        }
    ],
    ["church", 
        {
            key: "church",
            name: "Духовна власність",
            ownerTitle: "Власник",
            icon: L.icon({
                iconUrl: "/map-pin-church.png",
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -16]
            })
        }
    ],
    ["mixed", 
        {
            key: "mixed",
            name: "Різні типи власності",
            ownerTitle: "Власник",
            icon: L.icon({
                iconUrl: "/map-pin-mixed.png",
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -16]
            })
        }
    ],
]);