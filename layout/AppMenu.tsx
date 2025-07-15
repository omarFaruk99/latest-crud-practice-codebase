import type { MenuModel } from "@/types";
import AppSubMenu from "./AppSubMenu";

const AppMenu = () => {
    const model: MenuModel[] = [
        {
            label: "Dashboards",
            icon: "pi pi-home",
            items: [
                {
                    label: "Home",
                    icon: "pi pi-fw pi-home",
                    to: "/",
                },
                {
                    label: "Food Ingredient",
                    icon: "pi pi-fw pi-home",
                    to: "/foodIngredient",
                },
                {
                    label: "Demo",
                    icon: "pi pi-fw pi-home",
                    to: "/demo",
                },
                {
                    label: "Ingredient Test",
                    icon: "pi pi-fw pi-home",
                    to: "/ingredientTest",
                },
                {
                    label: "Ingredient Test Two",
                    icon: "pi pi-fw pi-home",
                    to: "/ingredientTestTwo",
                },
                {
                    label: "Ingredient Test Three",
                    icon: "pi pi-fw pi-home",
                    to: "/ingredientTestThree",
                },

            ],
        },
        // {
        //     label: "Apps",
        //     icon: "pi pi-th-large",
        //     items: [
        //         {
        //             label: "Blog",
        //             icon: "pi pi-fw pi-comment",
        //             items: [
        //                 {
        //                     label: "Details",
        //                     icon: "pi pi-fw pi-image",
        //                     // to: "/",
        //                 },
        //             ],
        //         },
        //     ]
        // },
    ];

    return <AppSubMenu model={model} />;
};

export default AppMenu;
