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
    {
        stateLabel: "Річ Посполита",
        prefix: "воєводство",
        provinces: ["Руське", "Белзьке", "Київське", "Волинське", "Подільське", "Брацлавське", "Чернігівське", "Берестейське", "Підляське"]
    },
    {
        stateLabel: "Угорське королівство",
        prefix: "(комітат)",
        provinces: ["Мармарош", "Унг", "Берег", "Угоча", "Земплін", "Шариш", "Спиш"]
    },
    {
        stateLabel: "Молдавське князівство",
        prefix: "цинут",
        provinces: ["Чернівецький", "Хотинський", "Сучавський"]
    },
];

export const States = new Map<string, any>([
    ["poland", {
        label: "Річ Посполита"
    }],
    ["russia", {
        label: "російська імперія"
    }],
    ["austria", {
        label: "Австрійська імперія"
    }],
    ["hungary", {
        label: "Угорське королівство"
    }],
    ["moldavia", {
        label: "Молдавське князівство"
    }],
    ["transylvania", {
        label: "Трансильванське князівство"
    }],
]);

export const Statuses = {
    Pending: "pending",
    Approved: "approved"
}