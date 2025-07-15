"use client";
import callToast, {
    formattedDateTime,
    handleDelete,
    tablePerPageOptions,
} from "@/app/utilis/helper"; // Import callToast
import {paginationTemplate} from "@/app/utilis/templates";
import {baseUrl} from "@/app/utilis/webinfo";
import ActionTemplate from "@/components/ActionTemplate";
import Label from "@/components/Label"; // Import baseUrl
import PageHeading from "@/components/PageHeading";
import {LayoutContext} from "@/layout/context/layoutcontext"; // Import LayoutContext
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

const FoodIngredientPage = () => {
    const {accessToken} = useContext(LayoutContext); // Get accessToken
    const toast = useRef<Toast>(null);
    const deleteRef = useRef<any>(null);
    // Dropdown filter
    const [filterIngredientsName, setFilterIngredientsName] =
        useState<string>("");
    const [foodData, setFoodData] = useState<InventoryTrace[]>([]);
    const [ingredientDialog, setIngredientDialog] = useState<boolean>(false);
    const [ingredient, setIngredient] = useState<any>({
        food_ingredient_id: null,
        supplier: null,
        quantity: 10,
        total_amount: null,
    });
    // const [submitted, setSubmitted] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);
    //Pagination && filter
    const [limitData, setLimitData] = useState<number>(10);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [updatedId, setUpdatedId] = useState<number | null>(null);

    useEffect(() => {
        let pages = Math.ceil(pageNumber / limitData);
        setCurrentPage(pages);
    }, [pageNumber, limitData]);

    const endpoint = `/api/food_ingredient_inventory_trace?page=${currentPage}&size=${limitData}&sort=-id`;

    // Pass refresh state to useFetch dependency array to allow manual refresh
    const {
        data: foodIngre,
        loading,
        totalData,
        notFound,
    } = useFetch(endpoint, [update]);

    const {data: ingredientsList} = useFetch(
        `/api/food_ingredient?page=0&size=20${
            filterIngredientsName
                ? `&filters=[["name","like", "${filterIngredientsName}"]]`
                : ""
        }`,
        [filterIngredientsName]
    );
    const {data: suppliersList} = useFetch("/api/supplier?page=0&size=20");

    const [ingredientsOptionData, setIngredientsOptionData] = useState<name[]>(
        []
    );
    const [suppliersOption, setSuppliersOption] = useState<name[]>([]);

    // console.log("ingredientsList", ingredientsList)\

    useEffect(() => {
        if (ingredientsList) {
            const modifyData = ingredientsList.map((data: any) => {
                const {id, name} = data;
                return {id, name};
            });
            setIngredientsOptionData(modifyData);
        }
    }, [ingredientsList]);

    useEffect(() => {
        if (suppliersList) {
            const modifyData = suppliersList.map((data: any) => {
                const {id, name} = data;
                return {id, name};
            });
            setSuppliersOption(modifyData);
        }
    }, [suppliersList]);

    useEffect(() => {
        if (foodIngre) {
            setFoodData(foodIngre);
        }
        if (notFound) {
            setFoodData([]);
        }
    }, [foodIngre, notFound]);

    const hideDialog = () => {
        setIngredientDialog(false);
        setUpdatedId(null);
        setIngredient({});
    };

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
            const response = await fetch(`${baseUrl?.url}/api/food_ingredient_inventory_trace${id ? `/${id}` : "" }`,
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
                // setIngredient(emptyIngredient);
                setIngredient({});
                setUpdate(!update); // Trigger a refresh of the data table
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

    // const onDropdownChange = (e: DropdownChangeEvent, name: string) => {
    //     setIngredient((prevState: any) => ({...prevState, [name]: e.value}));
    // }
    //
    // const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
    //     setIngredient((prevState: any) => ({...prevState, [name]: e.value}));
    // }

    const handleChange = (name: string, value: any) => {
        setIngredient({...ingredient, [name]: value});
    };

    // console.log("ingredient", ingredient)

    const deleteAccept = () => {
        const deleteParams: deleteParams = {
            id: deleteRef?.current,
            endPoint: "/api/food_ingredient_inventory_trace",
            name: "Employee",
            toast: toast,
            token: accessToken,
            update,
            setUpdate,
            data: foodData,
            currentPage,
            setCurrentPage,
        };
        handleDelete(deleteParams).then();
    };

    console.log("ingredient", ingredient);
    // console.log("ingredientsOptionData", ingredientsOptionData)
    console.log(1);

    return (
        <div className={"card"}>
            <Toast ref={toast}/>
            <ConfirmPopup/>

            <PageHeading
                title={"Food Ingredient Inventory"}
                isCreate={true}
                createFunction={() => setIngredientDialog(true)}
            />
            {/*<Toolbar className="mb-4" end={endContent}></Toolbar>*/}
            <DataTable
                value={foodData}
                className="datatable-responsive myTable"
                emptyMessage="No visit data found."
                rowHover={true}
                paginator={foodData.length > 0}
                rows={limitData}
                totalRecords={totalData}
                loading={loading}
                // filterDisplay="row"
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
                    header="Ingredient"
                    body={(rowData) => rowData.food_ingredient.name}
                    style={{minWidth: "12rem"}}
                />
                <Column
                    header="Supplier"
                    body={(rowData) => rowData.supplier.name}
                    style={{minWidth: "12rem"}}
                />
                <Column field="quantity" header="Quantity"/>
                <Column field="total_amount" header="Total Amount"/>
                <Column
                    header="Purchase Date"
                    body={(rowData) => formattedDateTime(rowData.event_time)}
                    style={{minWidth: "10rem"}}
                />
                {/*<Column header="Actions" body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }} />*/}
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
                        // console.log("data", data)

                        return (
                            <ActionTemplate
                                id={ids}
                                name={food_ingredient?.name}
                                accept={deleteAccept}
                                deleteRef={deleteRef}
                                editFunction={() => {
                                    setIngredientDialog(true);
                                    setUpdatedId(id);
                                    setIngredient({
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
                style={{width: "32rem"}}
                breakpoints={{"960px": "75vw", "641px": "90vw"}}
                header={`${updatedId ? "Update" : "Create"} Ingredient`}
                modal
                className="p-fluid"
                onHide={hideDialog}
            >
                <div className="field">
                    {/*<label htmlFor="ingredient" className="font-bold">Ingredient</label>*/}
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
                        // onFilter={(e) => setFilterIngredientsName(e.filter)}
                    />
                </div>
                <div className="field">
                    <Label label={"supplier"}/>
                    <Dropdown
                        placeholder={"..."}
                        optionLabel={"name"}
                        value={ingredient?.supplier}
                        options={suppliersOption}
                        onChange={(e) => handleChange("supplier", e?.value)}
                        filter
                        showClear
                        // showFilterClear
                    />
                </div>
                <div className="field">
                    <InputNumber
                        id="quantity"
                        value={ingredient.quantity}
                        placeholder={"Quantity"}
                        onChange={(e) => handleChange("quantity", e?.value)}
                    />
                </div>
                <div className="field">
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

export default FoodIngredientPage;
