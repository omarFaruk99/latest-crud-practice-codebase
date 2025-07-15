"use client";
import callToast, {
    formattedDateTime,
    handleDelete,
    tablePerPageOptions,
} from "@/app/utilis/helper";
import {paginationTemplate} from "@/app/utilis/templates";
import {baseUrl} from "@/app/utilis/webinfo";
import ActionTemplate from "@/components/ActionTemplate";
import Label from "@/components/Label";
import PageHeading from "@/components/PageHeading";
import {LayoutContext} from "@/layout/context/layoutcontext";
import {useFetch} from "@/layout/hooks/useFetch";
import {InventoryTrace} from "@/types/inventoryTrace";
import {Column} from "primereact/column";
import {ConfirmPopup} from "primereact/confirmpopup";
import {DataTable} from "primereact/datatable";
import {Dialog} from "primereact/dialog";
import {Dropdown} from "primereact/dropdown";
import {InputNumber} from "primereact/inputnumber";
import {Toast} from "primereact/toast";
import {useContext, useEffect, useRef, useState} from "react";

const IngredientTest = () => {
    const {accessToken} = useContext(LayoutContext); // Get accessToken
    const [foodIngredientData, setFoodIngredientData] = useState<
        InventoryTrace[]
    >([]);

    const [update, setUpdate] = useState<boolean>(false);

    const toast = useRef<Toast>(null);

    // This is a React ref used to store the id of the row you want to delete.
    const deleteRef = useRef<any>(null);

    // State to hold the filter text for ingredient name search in the dropdown
    const [filterIngredientsName, setFilterIngredientsName] =
        useState<string>("");

    // ======> Incredients options dropdown
    const [ingredientsOptionData, setIngredientsOptionData] = useState<name[]>(
        []
    );
    // =======>Supplier option for the dropdown
    const [suppliersOption, setSuppliersOption] = useState<name[]>([]);

    //Pagination && filter
    const [limitData, setLimitData] = useState<number>(10);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);

    // dialog popup
    const [ingredientDialog, setIngredientDialog] = useState<boolean>(false);

    // Holds the form data for creating or updating an ingredient
    // Used for both create and update
    const [ingredient, setIngredient] = useState<any>({
        food_ingredient_id: null,
        supplier: null,
        quantity: 10,
        total_amount: null,
    });

    // Tracks if we are updating an existing ingredient
    // If null, we are creating a new one
    // If it has an id, we are updating the ingredient with that id
    const [updatedId, setUpdatedId] = useState<number | null>(null);

    useEffect(() => {
        let pages = Math.ceil(pageNumber / limitData);
        setCurrentPage(pages);
    }, [pageNumber, limitData]);

    // api food_ingredient_inventory_trace
    const endpoint = `/api/food_ingredient_inventory_trace?page=${currentPage}&size=${limitData}&sort=-id`;

    const {
        data: foodIngre,
        loading,
        totalData,
        notFound,
    } = useFetch(endpoint, [update]);

    useEffect(() => {
        if (foodIngre) {
            setFoodIngredientData(foodIngre);
        }
    }, [foodIngre, notFound]);

    // Fetch the ingredient list from the API, filtered by name if the user types in the dropdown filter
    const {data: ingredientsList} = useFetch(
        `/api/food_ingredient?page=0&size=20${
            filterIngredientsName
                ? `&filters=[["name","like","${filterIngredientsName}"]]`
                : ""
        }`,
        [filterIngredientsName]
    );

    // Transform the API data to only include id and name for the dropdown=> incredients
    useEffect(() => {
        if (ingredientsList) {
            const modifyData = ingredientsList.map((data: any) => {
                const {id, name} = data;
                return {id, name};
            });
            setIngredientsOptionData(modifyData); // Set the dropdown options
        }
    }, [ingredientsList]);

    //Fetch Supplier Data from the API, but here do not filter
    const {data: suppliersList} = useFetch("/api/supplier?page=0&size=20");

    // Transform the API data to only include id and name for the dropdown=> Supplierlist
    useEffect(() => {
        if (suppliersList) {
            const modifyData = suppliersList.map((data: any) => {
                const {id, name} = data;
                return {id, name}; // Only keep id and name
            });
            setSuppliersOption(modifyData); // Set the dropdown options
        }
    }, [suppliersList]);

    // closing the Dialog
    const hideDialog = () => {
        setIngredientDialog(false);
        setUpdatedId(null);
        setIngredient({});
    };

    //update the form state when you type or select something
    const handleChange = (name: string, value: any) => {
        setIngredient({...ingredient, [name]: value});
    };

    // Submitting the Form(Create or Update)
    const handleCreate = async (id?: number | null) => {
        // Validation: check if all required fields are filled
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

        // Prepare the data to send to the backend
        const payload = {
            food_ingredient_id: ingredient.food_ingredient_id.id,
            supplier_id: ingredient.supplier?.id,
            quantity: ingredient.quantity,
            total_amount: ingredient.total_amount,
        };

        try {
            // If id is present, it's an update (PUT). If not, it's a creation (POST).
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
                setIngredientDialog(false); // Close the dialog
                setIngredient({}); // Reset the form
                setUpdate(!update); // Refresh the table
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

    const deleteAccept = () => {
        // Prepare the parameters for the delete helper function
        const deleteParams: deleteParams = {
            id: deleteRef?.current, // The id of the row to delete
            endPoint: "/api/food_ingredient_inventory_trace", // API endpoint for delete
            name: "Employee", // (Probably should be "Ingredient" here)
            toast: toast, // For showing notifications
            token: accessToken, // Auth token
            update, // Current update state
            setUpdate, // Function to trigger table refresh
            data: foodIngredientData, // Current table data
            currentPage, // Current page in pagination
            setCurrentPage, // Function to update page if needed
        };
        handleDelete(deleteParams).then(); // Call the helper to perform delete
    };

    return (
        <div className={"card"}>
            <Toast ref={toast}/>
            <ConfirmPopup/>
            <PageHeading
                title={"Test Ingredient"}
                isCreate={true}
                createFunction={() => setIngredientDialog(true)}
            />

            {/*    Data Table*/}
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
            >
                <Column
                    header={"Ingredient"}
                    body={(rowData) => rowData.food_ingredient.name}
                    style={{minWidth: "12rem"}}
                />
                <Column
                    header={"Supplier"}
                    body={(rowData) => rowData.supplier.name}
                    style={{minWidth: "12rem"}}
                />
                <Column header={"Quantity"} field={"quantity"}/>
                <Column header={"Total Amount"} field={"total_amount"}/>
                <Column
                    header={"Purchase Date"}
                    body={(rowData) => formattedDateTime(rowData.event_time)}
                    style={{minWidth: "10rem"}}
                />
                <Column
                    header={"Action"}
                    headerClassName={"flex justify-content-end w-full"}
                    body={(data) => {
                        const {
                            id,
                            food_ingredient,
                            supplier,
                            quantity,
                            total_amount,
                        } = data;
                        const ids: any = [{id}];

                        return (
                            <ActionTemplate
                                id={ids}
                                name={food_ingredient?.name}
                                accept={deleteAccept} // This function is called when delete is confirmed
                                deleteRef={deleteRef} // Used to keep track of which row to delete
                                editFunction={() => {
                                    setIngredientDialog(true); // Open dialog
                                    setUpdatedId(id); // Set id for update
                                    setIngredient({
                                        // Fill form with row data
                                        food_ingredient_id: {
                                            id: food_ingredient.id,
                                            name: food_ingredient.name,
                                        },
                                        supplier: {
                                            id: supplier.id,
                                            name: supplier.name,
                                        },
                                        quantity: quantity,
                                        total_amount: total_amount,
                                    });
                                }}
                            />
                        );
                    }}
                />
            </DataTable>

            <Dialog
                visible={ingredientDialog}
                onHide={hideDialog}
                style={{width: "32rem"}}
                header={`${updatedId ? "Update" : "Create"} Ingredient`}
                breakpoints={{"960px": "75vw", "641px": "90vw"}}
                modal
                className="p-fluid"
            >
                <div className="field">
                    <Label label="Ingredient" required={true}/>
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
                        // Updates the filter state when user types
                        onFilter={(e) => setFilterIngredientsName(e.filter)}
                    />
                </div>
                <div className="field">
                    <Label label={"supplier"} required={true}/>
                    <Dropdown
                        placeholder={"Select Supplier"}
                        optionLabel={"name"} // Show the supplier's name in the dropdown
                        value={ingredient?.supplier} // The currently selected supplier (object with id and name)
                        options={suppliersOption} // All supplier options
                        onChange={(e) => handleChange("supplier", e?.value)} // Update form state when changed
                        filter
                        showClear
                        showFilterClear
                    />
                </div>
                <div className="field">
                    <Label label="Quantity" required={true}/>
                    <InputNumber
                        id="quantity"
                        value={ingredient.quantity}
                        placeholder={"Quantity"}
                        onChange={(e) => handleChange("quantity", e?.value)}
                    />
                </div>
                <div className="field">
                    <Label label="Total Amount" required={true}/>
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

export default IngredientTest;
