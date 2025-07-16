// ======================= Imports =======================
"use client";
import callToast, {
    handleDelete,
    tablePerPageOptions,
} from "@/app/utilis/helper";
import { paginationTemplate } from "@/app/utilis/templates";
import { baseUrl } from "@/app/utilis/webinfo";
import ActionTemplate from "@/components/ActionTemplate";
import Label from "@/components/Label";
import PageHeading from "@/components/PageHeading";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { useFetch } from "@/layout/hooks/useFetch";
import { Column } from "primereact/column";
import { ConfirmPopup } from "primereact/confirmpopup";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { useContext, useEffect, useRef, useState } from "react";

// ======================= Template Component =======================
const CrudTemplatePage = () => {
    // ========== Context ==========
    const { accessToken } = useContext(LayoutContext);

    // ========== State ==========
    // Table data
    const [tableData, setTableData] = useState<any[]>([]);
    // For triggering data refresh
    const [update, setUpdate] = useState<boolean>(false);
    // Filter for dropdown search
    const [filterName, setFilterName] = useState<string>("");
    // Dropdown options
    const [dropdownOptions, setDropdownOptions] = useState<any[]>([]);
    // Pagination
    const [limitData, setLimitData] = useState<number>(10);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    // Dialog visibility
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    // Form data for create/update
    const [formData, setFormData] = useState<any>({
        // Example fields:
        // field1: null,
        // field2: null,
    });
    // Track if updating (id) or creating (null)
    const [updatedId, setUpdatedId] = useState<number | null>(null);

    // ========== Refs ==========
    const toast = useRef<Toast>(null);
    const deleteRef = useRef<any>(null);

    // ========== Derived Variables ==========
    // Change endpoint as needed
    const endpoint = `/api/your_resource?page=${currentPage}&size=${limitData}&sort=-id`;

    // ========== Data Fetching ==========
    // Main table data
    const {
        data: fetchedData,
        loading,
        totalData,
        notFound,
    } = useFetch(endpoint, [update]);

    // Dropdown data (example)
    const { data: dropdownList } = useFetch(
        `/api/your_dropdown_resource?page=0&size=20${
            filterName ? `&filters=[["name","like","${filterName}"]]` : ""
        }`,
        [filterName]
    );

    // ========== Effects ==========
    // Update current page when pagination changes
    useEffect(() => {
        let pages = Math.ceil(pageNumber / limitData);
        setCurrentPage(pages);
    }, [pageNumber, limitData]);

    // Set table data when fetched
    useEffect(() => {
        if (fetchedData) {
            setTableData(fetchedData);
        } else {
            setTableData([]);
        }
    }, [fetchedData, notFound]);

    // Set dropdown options
    useEffect(() => {
        if (dropdownList) {
            const modifyData = dropdownList.map((data: any) => {
                const { id, name } = data;
                return { id, name };
            });
            setDropdownOptions(modifyData);
        }
    }, [dropdownList]);

    // ========== Handlers & Functions ==========
    // Close dialog and reset form
    const hideDialog = () => {
        setDialogVisible(false);
        setUpdatedId(null);
        setFormData({});
    };

    // Update form state
    const handleChange = (name: string, value: any) => {
        setFormData({ ...formData, [name]: value });
    };

    // Create or update resource
    const handleCreate = async (id?: number | null) => {
        // Add your validation here
        // if (!formData.field1) return callToast(toast, false, "Field1 is required");

        const payload = {
            // Map your form fields here
            // field1: formData.field1,
            // field2: formData.field2,
        };

        try {
            const response = await fetch(
                `${baseUrl?.url}/api/your_resource${id ? `/${id}` : ""}`,
                {
                    method: id ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (response.ok) {
                callToast(toast, true, "Saved successfully.");
                setDialogVisible(false);
                setFormData({});
                setUpdate(!update);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save.");
            }
        } catch (error: any) {
            callToast(toast, false, error.message);
        }
    };

    // Edit handler
    const handleEdit = (data: any) => {
        setDialogVisible(true);
        setUpdatedId(data.id);
        setFormData({
            // Map your fields from data
            // field1: data.field1,
            // field2: data.field2,
        });
    };

    // Delete handler
    const deleteAccept = () => {
        const deleteParams: deleteParams = {
            id: deleteRef?.current,
            endPoint: "/api/your_resource",
            name: "Resource",
            toast: toast,
            token: accessToken,
            update,
            setUpdate,
            data: tableData,
            currentPage,
            setCurrentPage,
        };
        handleDelete(deleteParams).then();
    };

    // ========== Render ==========
    return (
        <div className={"card"}>
            <Toast ref={toast} />
            <ConfirmPopup />
            <PageHeading
                title={"Resource Title"}
                isCreate={true}
                createFunction={() => setDialogVisible(true)}
            />

            {/* Data Table */}
            <DataTable
                value={tableData}
                className="datatable-responsive myTable"
                emptyMessage="No data found."
                rowHover={true}
                paginator={tableData.length > 0}
                rows={limitData}
                totalRecords={totalData}
                loading={loading}
                lazy
                first={pageNumber}
                onPage={(e) => {
                    setPageNumber(e.first);
                    setLimitData(e.rows);
                }}
                paginatorTemplate={paginationTemplate}
                rowsPerPageOptions={tablePerPageOptions}
            >
                {/* Example Column */}
                <Column
                    header={"Name"}
                    body={(rowData) => rowData.name}
                    style={{ minWidth: "12rem" }}
                />
                {/* Add more columns as needed */}
                <Column
                    header={"Action"}
                    headerClassName={"flex justify-content-end w-full"}
                    body={(data) => {
                        const { id, name } = data;
                        const ids: any = [{ id }];

                        return (
                            <ActionTemplate
                                id={ids}
                                name={name}
                                accept={deleteAccept}
                                deleteRef={deleteRef}
                                editFunction={() => handleEdit(data)}
                            />
                        );
                    }}
                />
            </DataTable>

            {/* Dialog for Create/Update */}
            <Dialog
                visible={dialogVisible}
                onHide={hideDialog}
                style={{ width: "32rem" }}
                header={`${updatedId ? "Update" : "Create"} Resource`}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                modal
                className="p-fluid"
            >
                <div className="field">
                    <Label label="Name" required={true} />
                    <Dropdown
                        value={formData.name}
                        options={dropdownOptions}
                        optionLabel="name"
                        placeholder="Select"
                        filter
                        showFilterClear
                        showClear
                        onChange={(e) => {
                            handleChange("name", e?.value);
                        }}
                        onFilter={(e) => setFilterName(e.filter)}
                    />
                </div>
                {/* Add more form fields as needed */}
                <div>
                    <button onClick={() => handleCreate(updatedId)}>
                        Save
                    </button>
                </div>
            </Dialog>
        </div>
    );
};

export default CrudTemplatePage;
