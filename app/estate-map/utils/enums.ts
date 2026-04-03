export const PropertyTypes = new Map<string, any>([
    ["royal",
        {
            label: "Державна",
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
        label: "Староство",
        labelGenitive: "Староства",
        owner: "Староста"
    }],
    ["dzierzawa", {
        label: "Держава",
        labelGenitive: "Держави",
        owner: "Державець"
    }],
    ["ekonomia", {
        label: "Економія",
        labelGenitive: "Економії",
        owner: "Староста"
    }],
    ["klucz", {
        label: "Ключ",
        labelGenitive: "Ключа",
        owner: "Власник"
    }],
    ["ordynacja", {
        label: "Ординація",
        labelGenitive: "Ординації",
        owner: "Власник"
    }],
    ["ksiestwo", {
        label: "Князівство",
        labelGenitive: "Князівства",
        owner: "Князь"
    }],
    ["hrabstwo", {
        label: "Графство",
        labelGenitive: "Графства",
        owner: "Власник"
    }],
    ["kraina", {
        label: "Країна",
        labelGenitive: "Країни",
        owner: "Крайник"
    }],
    ["wlosc", {
        label: "Волость",
        labelGenitive: "Волості",
        owner: "Власник"
    }],
    ["dominia", {
        label: "Домінія",
        labelGenitive: "Домінії",
        owner: "Власник"
    }],
]);

export const ProvincesList = [
    "Руське воєводство",
    "Белзьке воєводство",
    "Київське воєводство",
    "Волинське воєводство",
    "Подільське воєводство",
    "Брацлавське воєводство",
    "Чернігівське воєводство",
    "Берестейське воєводство",
    "Підляське воєводство",
    "Комітат Мармарош",
    "Комітат Унг",
    "Комітат Берег",
    "Комітат Угоча",
    "Комітат Земплін",
    "Комітат Шариш",
    "Комітат Спиш",
    "Королівство Галичини та Володимирії",
];

export const DistrictsList = [
    "Львівський повіт",
    "Житомирський повіт",
    "Київський повіт",
    "Галицький повіт",
    "Луцький повіт"
]

export const Statuses = {
    Pending: "pending",
    Approved: "approved"
}

export const NumberingLabels = new Map<number, string>([
    [1, "населений пункт"],
    [2, "населені пункти"],
    [3, "населені пункти"],
    [4, "населені пункти"],
    [5, "населених пунктів"],
    [6, "населених пунктів"],
    [7, "населених пунктів"],
    [8, "населених пунктів"],
    [9, "населених пунктів"],
    [0, "населених пунктів"]
])