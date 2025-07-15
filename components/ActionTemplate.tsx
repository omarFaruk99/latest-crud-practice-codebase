import React, {useEffect, useState} from 'react';
import {Button} from "primereact/button";
import {confirmPopup} from "primereact/confirmpopup";
import {hidePopup} from "@/app/utilis/helper";



interface actionParams {
    name?: string,
    id: number,
    toolTip?: string,
    editFunction?: any,
    editTooltip?: string,
    accept?: any,
    deleteRef?: any,
    plus?: boolean,
    plusFunction?: any,
    download?: boolean,
    exportFunction?: any,
    plusTooltip?: string
    exportLoad?: boolean,
    end?: boolean,
    newButton?: boolean,
    newTooltip?: string,
    newFunction?: any,
    newIcon?: string,
    newSeverity?: string

}

const ActionTemplate = ({
                            deleteRef = null,
                            editFunction = null,
                            editTooltip = "Edit",
                            accept = null,
                            newIcon = "",
                            newButton = false,
                            newTooltip = "",
                            newFunction,
                            // newSeverity="success",
                            end = true,
                            id,
                            name = "",
                            plusTooltip = "Add",
                            plus = false,
                            plusFunction = null,
                            download = false,
                            exportFunction = null,
                            exportLoad = false
                        }: actionParams) => {
    const [exportId, setExportId] = useState<number | null>(null)
    useEffect(() => {
        if (!exportLoad) {
            setExportId(null)
        }
    }, [exportLoad]);

    return (
        <div className={`flex gap-2 align-items-center h-full ${end && `justify-content-end`}`}>
            {
                plus && <Button
                    type="button"
                    tooltip={plusTooltip}
                    tooltipOptions={{position: "top"}}
                    icon="pi pi-plus"
                    className="h-2rem w-2rem mr-2"
                    severity={"secondary"}
                    onClick={plusFunction}
                ></Button>
            }

            {
                newButton && <Button
                    type="button"
                    tooltip={newTooltip}
                    tooltipOptions={{position: "top"}}
                    icon={newIcon}
                    className="h-2rem w-2rem mr-2"
                    severity={"info"}
                    onClick={newFunction}
                ></Button>
            }
            {
                download && <Button
                    type="button"
                    tooltip="Download PDF"
                    tooltipOptions={{position: "top"}}
                    icon="pi pi-file"
                    className="h-2rem w-2rem mr-2"
                    severity={"info"}
                    onClick={() => {
                        setExportId(id)
                        exportFunction()

                    }}
                    loading={exportId === id ? exportLoad : false}
                ></Button>
            }

            {
                editFunction && <Button
                    type="button"
                    severity={"success"}
                    tooltip={editTooltip}
                    tooltipOptions={{position: "top"}}
                    icon="pi pi-pencil"
                    className="h-2rem w-2rem mr-2"
                    onClick={editFunction}
                ></Button>
            }


            {
                deleteRef && <Button
                    type="button"
                    tooltip="Delete"
                    tooltipOptions={{position: "top"}}
                    icon="pi pi-trash"
                    severity="danger"
                    className="h-2rem w-2rem mr-2"
                    onClick={(event) => {
                        deleteRef.current = id
                        confirmPopup({
                            target: event.currentTarget,
                            message: `Do you want to delete this ${name}?`,
                            icon: 'pi pi-info-circle',
                            acceptClassName: 'p-button-danger',
                            accept,
                            onHide() {
                                hidePopup(deleteRef)

                            }
                        })
                    }}
                ></Button>
            }

        </div>
    );
};

export default ActionTemplate;
