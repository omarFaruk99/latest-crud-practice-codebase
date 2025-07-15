import React from "react";
import {Button} from "primereact/button";
import {useRouter} from "next/navigation";
import {Avatar} from "primereact/avatar";

const PageHeading = ({
                         title,
                         subtitle,
                         back = false,
                         backFunction = null,
                         isCreate = false,
                         createFunction = null,
                         avatar,
                         icon = "pi pi-plus",
                         isIcon = true,
                         loading = false,
                         isText = false,
                         buttonText,
                         buttonPosition,
                     }: {
    title?: string;
    subtitle?: string;
    back?: boolean;
    backFunction?: any;
    create?: string;
    isCreate?: boolean,
    createFunction?: any;
    avatar?: string;
    icon?: string,
    isIcon?: boolean,
    loading?: boolean,
    isText?: boolean,
    buttonText?: string,
    buttonPosition?: string
}) => {
    const router = useRouter();
    return (
        <div
            className="flex flex-column sm:flex-row sm:align-items-center sm:justify-content-between py-4 md:pt-0 gap-0 sm:gap-2 lg:gap-4 surface-border">
            <div className="flex align-items-center md:justify-content-start">
                {back && (
                    <Button
                        type="button"
                        icon="pi pi-chevron-left"
                        text
                        className="p-button-plain md:mr-3"
                        onClick={() => {
                            if (!backFunction) {
                                router.back()
                            } else {
                                backFunction()
                            }
                        }}
                    ></Button>
                )}
                <div className="flex gap-2 align-items-center">
                    {avatar && <Avatar image={avatar} size="large"/>}
                    <div>
            <span className="block text-800 font-semibold white-space-nowrap text-base sm:text-xl">
              {title}
            </span>
                        {subtitle && <p className="text-sm text-600 mt-2">{subtitle}</p>}
                    </div>
                </div>
            </div>
            <div
                className={`w-full flex ${buttonPosition ? buttonPosition : "justify-content-end"} gap-3`}>
                {/*buttonPosition*/}
                {
                    isCreate && (
                        <Button
                            label={buttonText}
                            icon={`${isIcon && icon}`}
                            size="small"
                            outlined
                            text={isText}
                            onClick={createFunction}
                            loading={loading}
                        />
                    )
                }
            </div>
        </div>
    );
};

export default PageHeading;