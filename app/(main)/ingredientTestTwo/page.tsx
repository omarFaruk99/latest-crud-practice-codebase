// ======================= Imports =======================
"use client";
import callToast, {
    formattedDateTime,
    getFilterSearchParams,
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
import { InventoryTrace } from "@/types/inventoryTrace";
import { Column } from "primereact/column";
import { ConfirmPopup } from "primereact/confirmpopup";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { useContext, useEffect, useRef, useState } from "react";

// ======================= Component =======================
const IngredientTestTwo = () => {
    // ========== Context ==========
    const { accessToken } = useContext(LayoutContext);

    // ========== State ==========
    // Table data
    const [foodIngredientData, setFoodIngredientData] = useState<
        InventoryTrace[]
    >([]);
    // For triggering data refresh
    const [update, setUpdate] = useState<boolean>(false);
    // Filter for ingredient name in dropdown
    const [filterIngredientsName, setFilterIngredientsName] =
        useState<string>("");
    // Dropdown options
    const [ingredientsOptionData, setIngredientsOptionData] = useState<name[]>(
        []
    );
    const [suppliersOption, setSuppliersOption] = useState<name[]>([]);
    // Pagination
    const [limitData, setLimitData] = useState<number>(10);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    // Dialog visibility
    const [ingredientDialog, setIngredientDialog] = useState<boolean>(false);
    // Form data for create/update
    const [ingredient, setIngredient] = useState<any>({
        food_ingredient_id: null,
        supplier: null,
        quantity: 10,
        total_amount: null,
    });
    // Track if updating (id) or creating (null)
    const [updatedId, setUpdatedId] = useState<number | null>(null);

    // :::::::::::::::::::::::::::::::column specific filters state
    const [filterQueryParams, setFilterQueryParams] = useState<string>("");
    const [filters, setFilters] = useState({
        food_ingredient_id: null,
    });

    // ::::::::::::::::::::::column specific filters function
    const handleFilter = async (name: string, value: number | string) => {
        const updatedFilters = { ...filters, [name]: value };
        const queryParams = getFilterSearchParams(updatedFilters);
        setFilterQueryParams(queryParams);
        setFilters(updatedFilters);
    };

    const handleFilterChange = (name: string, value: any) => {
        setFilters({ ...filters, [name]: value });
    };
    // ::::::::::::::::::::::End

    // ========== Refs ==========
    const toast = useRef<Toast>(null);
    const deleteRef = useRef<any>(null);

    // ========== Derived Variables ==========
    const endpoint = `/api/food_ingredient_inventory_trace?page=${currentPage}&size=${limitData}&sort=-id${filterQueryParams}`;

    // ========== Data Fetching ==========
    // Main table data
    const {
        data: foodIngre,
        loading,
        totalData,
        notFound,
    } = useFetch(endpoint, [update, filterQueryParams]);

    // Ingredient dropdown data
    const { data: ingredientsList } = useFetch(
        `/api/food_ingredient?page=0&size=20${
            filterIngredientsName
                ? `&filters=[["name","like","${filterIngredientsName}"]]`
                : ""
        }`,
        [filterIngredientsName]
    );

    // Supplier dropdown data
    const { data: suppliersList } = useFetch("/api/supplier?page=0&size=20");

    // ========== Effects ==========
    // Update current page when pagination changes
    useEffect(() => {
        let pages = Math.ceil(pageNumber / limitData);
        setCurrentPage(pages);
    }, [pageNumber, limitData]);

    // Set table data when fetched
    useEffect(() => {
        if (foodIngre) {
            setFoodIngredientData(foodIngre);
        } else {
            setFoodIngredientData([]);
        }
    }, [foodIngre, notFound]);

    // Set ingredient dropdown options
    useEffect(() => {
        if (ingredientsList) {
            const modifyData = ingredientsList.map((data: any) => {
                const { id, name } = data;
                return { id, name };
            });
            setIngredientsOptionData(modifyData);
        }
    }, [ingredientsList]);

    // Set supplier dropdown options
    useEffect(() => {
        if (suppliersList) {
            const modifyData = suppliersList.map((data: any) => {
                const { id, name } = data;
                return { id, name };
            });
            setSuppliersOption(modifyData);
        }
    }, [suppliersList]);

    // ========== Handlers & Functions ==========
    // Close dialog and reset form
    const hideDialog = () => {
        setIngredientDialog(false);
        setUpdatedId(null);
        setIngredient({});
    };

    // Update form state
    const handleChange = (name: string, value: any) => {
        setIngredient({ ...ingredient, [name]: value });
    };

    // Create or update ingredient
    const handleCreate = async (id?: number | null) => {
        if (!ingredient.food_ingredient_id?.id) {
            return callToast(toast, false, "food ingredient is required");
        }
        if (!ingredient.supplier?.id) {
            return callToast(toast, false, "supplier is required");
        }
        if (!ingredient.quantity) {
            return callToast(toast, false, "quantity is required");
        }
        if (!ingredient.total_amount) {
            return callToast(toast, false, "total amount is required");
        }

        const payload = {
            food_ingredient_id: ingredient.food_ingredient_id.id,
            supplier_id: ingredient.supplier?.id,
            quantity: ingredient.quantity,
            total_amount: ingredient.total_amount,
        };

        try {
            const response = await fetch(
                `${baseUrl?.url}/api/food_ingredient_inventory_trace${
                    id ? `/${id}` : ""
                }`,
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
                callToast(toast, true, "Ingredient saved successfully.");
                setIngredientDialog(false);
                setIngredient({});
                setUpdate(!update);
            } else {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Failed to save ingredient."
                );
            }
        } catch (error: any) {
            callToast(toast, false, error.message);
        }
    };

    // update Ingredient
    const handleEdit = (data: any) => {
        setIngredientDialog(true);
        setUpdatedId(data.id);
        setIngredient({
            food_ingredient_id: {
                id: data.food_ingredient.id,
                name: data.food_ingredient.name,
            },
            supplier: {
                id: data.supplier.id,
                name: data.supplier.name,
            },
            quantity: data.quantity,
            total_amount: data.total_amount,
        });
    };

    // Delete ingredient
    const deleteAccept = () => {
        const deleteParams: deleteParams = {
            id: deleteRef?.current,
            endPoint: "/api/food_ingredient_inventory_trace",
            name: "Employee", // (Probably should be "Ingredient")
            toast: toast,
            token: accessToken,
            update,
            setUpdate,
            data: foodIngredientData,
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
                title={"Test Ingredient"}
                isCreate={true}
                createFunction={() => setIngredientDialog(true)}
            />

            {/* Data Table */}
            <DataTable
                value={foodIngredientData}
                className="datatable-responsive myTable"
                emptyMessage="No visit data found."
                rowHover={true}
                paginator={foodIngredientData.length > 0}
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
                filterDisplay={"row"} //::::::::::::::::column specific filters props
            >
                <Column
                    header={"Ingredient"}
                    body={(rowData) => rowData.food_ingredient.name}
                    //::::::::::::::::column specific filters dropdown
                    filter
                    filterField={"food"}
                    showFilterMenu={false}
                    filterElement={(options) => {
                        console.log(options);
                        return (
                            <Dropdown
                                value={filters.food_ingredient_id}
                                options={ingredientsOptionData}
                                optionLabel={"name"}
                                filter
                                showClear
                                showFilterClear
                                placeholder={"Food ingredient"}
                                onChange={(e) => {
                                    handleFilterChange(
                                        "food_ingredient_id",
                                        e?.value
                                    );
                                    handleFilter("food_ingredient_id", e.value);
                                }}
                                onFilter={(e) =>
                                    setFilterIngredientsName(e.filter)
                                }
                            />
                        );
                    }}
                    /*::::::::::::::::::*/
                    style={{ minWidth: "12rem" }}
                />
                <Column
                    header={"Supplier"}
                    body={(rowData) => rowData.supplier.name}
                    style={{ minWidth: "12rem" }}
                />
                <Column header={"Quantity"} field={"quantity"} />
                <Column header={"Total Amount"} field={"total_amount"} />
                <Column
                    header={"Purchase Date"}
                    body={(rowData) => formattedDateTime(rowData.event_time)}
                    style={{ minWidth: "10rem" }}
                />
                <Column
                    header={"Action"}
                    headerClassName={"flex justify-content-end w-full"}
                    body={(data) => {
                        const { id, food_ingredient } = data;
                        const ids: any = [{ id }];

                        return (
                            <ActionTemplate
                                id={ids}
                                name={food_ingredient?.name}
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
                visible={ingredientDialog}
                onHide={hideDialog}
                style={{ width: "32rem" }}
                header={`${updatedId ? "Update" : "Create"} Ingredient`}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                modal
                className="p-fluid"
            >
                <div className="field">
                    <Label label="Ingredient" required={true} />
                    <Dropdown
                        value={ingredient.food_ingredient_id}
                        options={ingredientsOptionData}
                        optionLabel="name"
                        placeholder="Select an Ingredient"
                        filter
                        showFilterClear
                        showClear
                        onChange={(e) => {
                            handleChange("food_ingredient_id", e?.value);
                        }}
                        onFilter={(e) => setFilterIngredientsName(e.filter)}
                    />
                </div>
                <div className="field">
                    <Label label={"supplier"} required={true} />
                    <Dropdown
                        placeholder={"Select Supplier"}
                        optionLabel={"name"}
                        value={ingredient?.supplier}
                        options={suppliersOption}
                        onChange={(e) => handleChange("supplier", e?.value)}
                        filter
                        showClear
                        showFilterClear
                    />
                </div>
                <div className="field">
                    <Label label="Quantity" required={true} />
                    <InputNumber
                        id="quantity"
                        value={ingredient.quantity}
                        placeholder={"Quantity"}
                        onChange={(e) => handleChange("quantity", e?.value)}
                    />
                </div>
                <div className="field">
                    <Label label="Total Amount" required={true} />
                    <InputNumber
                        id="total_amount"
                        value={ingredient.total_amount}
                        placeholder={"Total Amount"}
                        onChange={(e) => handleChange("total_amount", e?.value)}
                    />
                </div>
                <div>
                    <button onClick={() => handleCreate(updatedId)}>
                        button
                    </button>
                </div>
            </Dialog>
        </div>
    );
};

export default IngredientTestTwo;
