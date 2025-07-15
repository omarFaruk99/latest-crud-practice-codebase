import Link from "next/link";
import { useContext } from "react";
import AppMenu from "./AppMenu";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import { LayoutState } from "../types/layout";
import {useRouter} from "next/navigation";

const AppSidebar = () => {
    const { setLayoutState } = useContext(LayoutContext);
    const router = useRouter();
    const anchor = () => {
        setLayoutState((prevLayoutState: LayoutState) => ({
            ...prevLayoutState,
            anchored: !prevLayoutState.anchored,
        }));
    };
    return (
        <>
            <div className="sidebar-header">
                <div className="app-logo" onClick={() => {
                    router.push('/')
                }}>
                    <img
                        src='/Logo (500 x 500 px).png'
                        className={"app-logo-normal w-5rem  h-full cursor-pointer"}
                        alt={"logo"}
                    />

                    <img src="/Logo (48 x 48 px).png" alt="Logo" height="27"
                         className="app-logo-small" onClick={() => {
                    }}/>
                </div>
                <button
                    className="layout-sidebar-anchor p-link z-2 mb-2"
                    type="button"
                    onClick={anchor}
                ></button>
            </div>

            <div className="layout-menu-container">
                <MenuProvider>
                    <AppMenu />
                </MenuProvider>
            </div>
        </>
    );
};

export default AppSidebar;
