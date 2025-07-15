"use client";
import type {Breadcrumb, ChildContainerProps, LayoutConfig, LayoutContextProps, LayoutState,} from "@/types";
import Head from "next/head";
import React, {useState} from "react";

export const LayoutContext = React.createContext({} as LayoutContextProps);

export const LayoutProvider = (props: ChildContainerProps) => {
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
        ripple: true,
        inputStyle: "outlined",
        menuMode: "static",
        menuTheme: "colorScheme",
        colorScheme: "light",
        theme: "green",
        scale: 14,
    });

    const token = process.env.NEXT_PUBLIC_AUTH_TOKEN
    const [accessToken, setAccessToken] = useState<string>("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsInVzZXJuYW1lIjoiYWRtaW5AYWRtaW4uY29tIiwicm9sZXMiOlsiQWRtaW4iXSwiaWF0IjoxNzUxNTE1NzA0LCJleHAiOjE3NTY2OTk3MDQsImp0aSI6IjBhZTFhYjkxLWQxOWYtNDIzOC1hMDhiLTM5YTk4NTI3ODhiNSJ9.Y_tH9oEINvIWXkZo_oe2A-bZKdj7gjBfRxT7fAdnaT6FAN7uraNeXfqEv4MmfYIE2qh7A3Nmweg1BYzfNU0E8IinLcbbr0p9n9_HfIFkRVRNJe7vqVjCePOwZgZjWh3_AFMUoNbhJi4INScYG458Z0nOE1U-qztuqy_3Kw3MqGMzjzsrHRwVx1gUyR9pk04knTI_suUggSA0x0kQnTveqJaj_omvpKkBomGUq8EqigSjA_uUOdwn46ZHykTDiXL4wjb-hMcjxKBNADVCo8bnfp4MuZ2_HTnjz3vjVtDX217u-_fEQfL0c6ADp07jtxoG13VDt7uYIbcVYLtr_NuVFQ")
    const [layoutState, setLayoutState] = useState<LayoutState>({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        overlaySubmenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
        resetMenu: false,
        sidebarActive: false,
        anchored: false,
    });

    const onMenuToggle = () => {
        if (isOverlay()) {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                overlayMenuActive: !prevLayoutState.overlayMenuActive,
            }));
        }

        if (isDesktop()) {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                staticMenuDesktopInactive:
                    !prevLayoutState.staticMenuDesktopInactive,
            }));
        } else {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive,
            }));
        }
    };

    const showConfigSidebar = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            configSidebarVisible: true,
        }));
    };

    const showProfileSidebar = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            profileSidebarVisible: !prevLayoutState.profileSidebarVisible,
        }));
    };

    const isOverlay = () => {
        return layoutConfig.menuMode === "overlay";
    };

    const isSlim = () => {
        return layoutConfig.menuMode === "slim";
    };

    const isSlimPlus = () => {
        return layoutConfig.menuMode === "slim-plus";
    };

    const isHorizontal = () => {
        return layoutConfig.menuMode === "horizontal";
    };

    const isDesktop = () => {
        return window.innerWidth > 991;
    };

    const value = {
        layoutConfig,
        setLayoutConfig,
        layoutState,
        setLayoutState,
        onMenuToggle,
        showConfigSidebar,
        showProfileSidebar,
        isSlim,
        isSlimPlus,
        isHorizontal,
        isDesktop,
        breadcrumbs,
        setBreadcrumbs,
        accessToken,
        setAccessToken
    };

    return (
        <LayoutContext.Provider value={value}>
            <>
                <Head>
                    <title>Boilerplate</title>
                    <meta charSet="UTF-8"/>
                    <meta
                        name="description"
                        content="The ultimate collection of design-agnostic, flexible and accessible React UI Components."
                    />
                    <meta name="robots" content="index, follow"/>
                    <meta
                        name="viewport"
                        content="initial-scale=1, width=device-width"
                    />
                    <meta property="og:type" content="website"></meta>
                    <meta
                        property="og:title"
                        content="PrimeReact for Next.js"
                    ></meta>
                    {/*<meta*/}
                    {/*    property="og:url"*/}
                    {/*    content="https://www.primefaces.org/apollo-react"*/}
                    {/*></meta>*/}
                    <meta
                        property="og:description"
                        content="The ultimate collection of design-agnostic, flexible and accessible React UI Components."
                    />
                    {/*<meta*/}
                    {/*    property="og:image"*/}
                    {/*    content="https://www.primefaces.org/static/social/apollo-react.png"*/}
                    {/*></meta>*/}
                    <meta property="og:ttl" content="604800"></meta>
                    <link
                        rel="icon"
                        href={`/favicon.ico`}
                        type="image/x-icon"
                    ></link>
                </Head>
                {props.children}
            </>
        </LayoutContext.Provider>
    );
};
