import L from 'leaflet'

export const PropertyTypes = new Map<string, any>([
    ["royal",
        {
            key: "royal",
            name: "Королівська",
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
            name: "Приватна",
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
            name: "Духовна",
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
            name: "Змішана",
            icon: L.icon({
                iconUrl: "/map-pin-mixed.png",
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -16]
            })
        }
    ],
]);

export const ManorTypes = new Map<string, any>([
    ["starostwo", {
        name: "Староство"
    }],
    ["klucz", {
        name: "Ключ"
    }],
])