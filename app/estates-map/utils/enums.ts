export const PropertyTypes = new Map<string, any>([
    ["royal",
        {
            label: "Королівська",
            iconUrl: "/map-pin-royal.png"
        }
    ],
    ["private", 
        {
            label: "Приватна",
            iconUrl: "/map-pin-private.png"
        }
    ],
    ["church", 
        {
            label: "Духовна",
            iconUrl: "/map-pin-church.png"
        }
    ],
    ["mixed", 
        {
            label: "Змішана",
            iconUrl: "/map-pin-mixed.png"
        }
    ],
]);

export const EstateTypes = new Map<string, any>([
    ["starostwo", {
        label: "Староство"
    }],
    ["klucz", {
        label: "Ключ"
    }],
])