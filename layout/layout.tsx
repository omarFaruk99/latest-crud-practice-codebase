"use client";
import type {AppTopbarRef, ChildContainerProps} from "@/types";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import PrimeReact from "primereact/api";
import {useEventListener, useMountEffect, useResizeListener, useUnmountEffect,} from "primereact/hooks";
import {classNames, DomHandler} from "primereact/utils";
import React, {useCallback, useContext, useEffect, useRef} from "react";
import AppBreadCrumb from "./AppBreadCrumb";
import AppProfileSidebar from "./AppProfileSidebar";
import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";
import {LayoutContext} from "./context/layoutcontext";


const Layout = (props: ChildContainerProps) => {
    const {
        layoutConfig,
        layoutState,
        setLayoutState,
        isSlim,
        isSlimPlus,
        isHorizontal,
        isDesktop,
        setAccessToken,
        accessToken
    } = useContext(LayoutContext);
    const topbarRef = useRef<AppTopbarRef>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] =
        useEventListener({
            type: "click",
            listener: (event) => {
                const isOutsideClicked = !(
                    sidebarRef.current?.isSameNode(event.target as Node) ||
                    sidebarRef.current?.contains(event.target as Node) ||
                    topbarRef.current?.menubutton?.isSameNode(
                        event.target as Node
                    ) ||
                    topbarRef.current?.menubutton?.contains(
                        event.target as Node
                    )
                );

                if (isOutsideClicked) {
                    hideMenu();
                }
            },
        });

    const router = useRouter();


    // Handle Refresh Token
    // useEffect(() => {
    //     const isLogin: any = localStorage?.getItem("isLogin");
    //     const handleRefresh = async () => {
    //         let newToken = "";
    //         try {
    //             const res = await fetch(`${baseUrl.url}/auth/refresh`, {
    //                 method: "GET",
    //                 credentials: "include",
    //             });
    //             if (res.ok) {
    //                 const resData = await res.json();
    //
    //                 const {access_token} = resData?.data
    //                 newToken = access_token;
    //                 setAccessToken(access_token);
    //             } else {
    //                 redirect("/auth/login");
    //             }
    //         } catch (error) {
    //             console.log("error", error);
    //         } finally {
    //             if (!newToken) {
    //                 router.push("/auth/login");
    //                 localStorage.setItem("isLogin", "0");
    //             }
    //         }
    //     };
    //     if (!accessToken && (!isLogin || +isLogin === 1)) {
    //         handleRefresh().then();
    //     }
    //
    //     // if (+isLogin === 0) {
    //     //     redirect("/auth/login");
    //     // }
    //
    //     const interval = setInterval(handleRefresh, 840000); // 14 minutes
    //     return () => clearInterval(interval);
    // }, [accessToken, router]);


    const [bindDocumentResizeListener, unbindDocumentResizeListener] =
        useResizeListener({
            listener: () => {
                if (isDesktop() && !DomHandler.isTouchDevice()) {
                    hideMenu();
                }
            },
        });

    let timeout: ReturnType<typeof setTimeout> | null = null;

    const onMouseEnter = () => {
        if (!layoutState.anchored) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                sidebarActive: true,
            }));
        }
    };

    const onMouseLeave = () => {
        if (!layoutState.anchored) {
            if (!timeout) {
                timeout = setTimeout(
                    () =>
                        setLayoutState((prevLayoutState) => ({
                            ...prevLayoutState,
                            sidebarActive: false,
                        })),
                    300
                );
            }
        }
    };

    const hideMenu = useCallback(() => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            overlayMenuActive: false,
            overlaySubmenuActive: false,
            staticMenuMobileActive: false,
            menuHoverActive: false,
            resetMenu:
                (isSlim() || isSlimPlus() || isHorizontal()) && isDesktop(),
        }));
    }, [isSlim, isSlimPlus, isHorizontal, isDesktop, setLayoutState]);

    const blockBodyScroll = () => {
        if (document.body.classList) {
            document.body.classList.add("blocked-scroll");
        } else {
            document.body.className += " blocked-scroll";
        }
    };

    const unblockBodyScroll = () => {
        if (document.body.classList) {
            document.body.classList.remove("blocked-scroll");
        } else {
            document.body.className = document.body.className.replace(
                new RegExp(
                    "(^|\\b)" +
                        "blocked-scroll".split(" ").join("|") +
                        "(\\b|$)",
                    "gi"
                ),
                " "
            );
        }
    };

    useMountEffect(() => {
        PrimeReact.ripple = true;
    });

    useEffect(() => {
        if (
            layoutState.overlayMenuActive ||
            layoutState.staticMenuMobileActive ||
            layoutState.overlaySubmenuActive
        ) {
            bindMenuOutsideClickListener();
        }

        if (layoutState.staticMenuMobileActive) {
            blockBodyScroll();
            (isSlim() || isSlimPlus() || isHorizontal()) &&
                bindDocumentResizeListener();
        }

        return () => {
            unbindMenuOutsideClickListener();
            unbindDocumentResizeListener();
            unblockBodyScroll();
        };
    }, [
        layoutState.overlayMenuActive,
        layoutState.staticMenuMobileActive,
        layoutState.overlaySubmenuActive,
    ]);

    useEffect(() => {
        const onRouteChange = () => {
            hideMenu();
        };
        onRouteChange();
    }, [pathname, searchParams]);

    useUnmountEffect(() => {
        unbindMenuOutsideClickListener();
    });

    // if(!accessToken){
    //     return (
    //         <div
    //             className={"h-screen flex align-items-center justify-content-center"}
    //         >
    //             <i
    //                 className="pi pi-spin pi-spinner text-primary"
    //                 style={{fontSize: "5rem"}}
    //             ></i>
    //         </div>
    //     );
    // }

    const containerClass = classNames({
        "layout-light": layoutConfig.colorScheme === "light",
        "layout-dim": layoutConfig.colorScheme === "dim",
        "layout-dark": layoutConfig.colorScheme === "dark",
        "layout-colorscheme-menu": layoutConfig.menuTheme === "colorScheme",
        "layout-primarycolor-menu": layoutConfig.menuTheme === "primaryColor",
        "layout-transparent-menu": layoutConfig.menuTheme === "transparent",
        "layout-overlay": layoutConfig.menuMode === "overlay",
        "layout-static": layoutConfig.menuMode === "static",
        "layout-slim": layoutConfig.menuMode === "slim",
        "layout-slim-plus": layoutConfig.menuMode === "slim-plus",
        "layout-horizontal": layoutConfig.menuMode === "horizontal",
        "layout-reveal": layoutConfig.menuMode === "reveal",
        "layout-drawer": layoutConfig.menuMode === "drawer",
        "layout-static-inactive":
            layoutState.staticMenuDesktopInactive &&
            layoutConfig.menuMode === "static",
        "layout-overlay-active": layoutState.overlayMenuActive,
        "layout-mobile-active": layoutState.staticMenuMobileActive,
        "p-input-filled": layoutConfig.inputStyle === "filled",
        "p-ripple-disabled": !layoutConfig.ripple,
        "layout-sidebar-active": layoutState.sidebarActive,
        "layout-sidebar-anchored": layoutState.anchored,
    });



    return (
        <React.Fragment>
            <div className={classNames("layout-container", containerClass)}>
                <div
                    ref={sidebarRef}
                    className="layout-sidebar"
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    <AppSidebar />
                </div>
                <div className="layout-content-wrapper">
                    <AppTopbar ref={topbarRef} />

                    <AppBreadCrumb className="content-breadcrumb"></AppBreadCrumb>
                    <div className="layout-content">{props.children}</div>
                </div>
                <AppProfileSidebar />
                {/*<AppConfig />*/}
                <div className="layout-mask"></div>
            </div>
        </React.Fragment>
    );
};


export default Layout;
