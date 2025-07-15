"use client";
import React, {useContext, useEffect, useRef, useState} from 'react';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {handleDelete} from "@/app/utilis/helper";
import {Toast} from "primereact/toast";
import {LayoutContext} from "@/layout/context/layoutcontext";
import {ConfirmPopup} from "primereact/confirmpopup";
import {useRouter} from "next/navigation";
import {Image} from "primereact/image";
import {baseUrl} from "@/app/utilis/webinfo";
import {useFetch} from "@/layout/hooks/useFetch";
import PageHeading from "@/components/PageHeading";
import ActionTemplate from "@/components/ActionTemplate";


const Home = () => {
    const {
        accessToken,
    } = useContext(LayoutContext);
    const router = useRouter()
    const toast = useRef<Toast | null>(null);
    const deleteRef = useRef<number>(0);

    //Pagination && Filter
    const [limitData, setLimitData] = useState<number>(2);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [update, setUpdate] = useState<boolean>(false)
    const [foodData, setFoodData] = useState<any>([]);

    // Get Company Data /api/food_waste_event?page=0&size=10&sort=-id
    const {
        data,
        loading,
        totalData, notFound
    } = useFetch(`/api/food_waste_event?page=${currentPage}&size=${limitData}&sort=-id`, [update])

    // Set Current Page
    useEffect(() => {
        let pages = Math.ceil(pageNumber / limitData);
        setCurrentPage(pages)
    }, [pageNumber, limitData]);


    useEffect(() => {
        if (data) {
            setFoodData(data)
        }
        if (notFound) {
            setFoodData([])
        }

    }, [data, notFound]);

    // Handle Delete Accept
    const deleteAccept: any = () => {
        const deleteParams: deleteParams = {
            id: deleteRef?.current,
            endPoint: `/api/food_waste_event`,
            name: "Food",
            toast: toast,
            token: accessToken,
            data: foodData,
            // setData: setFoodData,
            update: update,
            setUpdate: setUpdate,
            currentPage: currentPage,
            setCurrentPage: setCurrentPage
        }
        handleDelete(deleteParams).then()
    }


    // Row Expansion Template
    // const rowExpansionBodyTemplate = (data: {infrastructure: any[], machine:any[]}) => {
    //     const {infrastructure, machine} = data;
    //     return (
    //         <div>
    //             {machine?.length > 0 && <div className={"pb-5"}>
    //                 <div className={"mb-3"}>
    //                     <span className={"surface-hover font-medium text-800 py-2 px-3 border-round-sm "}>Attendance Machine</span>
    //                 </div>
    //                 <DataTable value={machine} emptyMessage={"No infrastructure found"}>
    //                     <Column header={"Name"} field={"machine.name"}/>
    //                     <Column header={"IP"} field={"machine.ip"}/>
    //                     <Column header={"Port"} field={"machine.port"}/>
    //                 </DataTable>
    //             </div>}
    //
    //             <div className={"mb-3"}>
    //                 <span className={"surface-hover font-medium text-800 py-2 px-3 border-round-sm "}>Infrastructure Details</span>
    //             </div>
    //             <DataTable value={infrastructure} emptyMessage={"No infrastructure found"}>
    //                 <Column header={"Name"} body={(data) => {
    //                     const {name,latitude, longitude} = data
    //                     return(
    //                         <div className={"flex gap-2 align-items-center"}>
    //                             <Button icon={"pi pi-map-marker"} text severity={"secondary"}
    //                                     onClick={() => {
    //                                         setVisibleLocationModal(true)
    //                                         setPosition({
    //                                             latitude, longitude
    //                                         })
    //                                     }}
    //                             />
    //                             <span>{name}</span>
    //
    //                         </div>
    //                     )
    //                 }}/>
    //                 <Column header={"Attendance Machine"} body={(data) => {
    //                     const {machine} = data
    //                     return(
    //                         <div className={"flex gap-2 flex-wrap"}>
    //                             {
    //                                 machine?.length > 0 ? machine?.map((current: any, index: number) => {
    //                                     return (
    //                                         <Chip key={index} label={current?.machine?.name}  className={"m-1"}/>
    //                                     )
    //                                 }) : "N/A"
    //                             }
    //
    //                         </div>
    //                     )
    //                 }}/>
    //             </DataTable>
    //         </div>
    //     );
    // }

    return (
        <div className={"card"}>
            <ConfirmPopup/>
            <Toast ref={toast}/>

            {/*Page Heading*/}
            <PageHeading title={"Company"} back={true} isCreate={true}
                         createFunction={() => {

                         }}
            />

            {/*Company Data Table*/}
            <DataTable
                value={data}
                dataKey="id"
                className="datatable-responsive myTable"
                emptyMessage="No company found."
                rowHover={true}
                paginator={data?.length}
                loading={loading}
                lazy
                first={pageNumber}
                rows={limitData}
                totalRecords={totalData}
                onPage={(e) => {
                    setPageNumber(e.first);
                    setLimitData(e.rows);
                }}
                // paginatorTemplate={paginationTemplate}
                // rowsPerPageOptions={tablePerPageOptions}
                // expandedRows={expandedRows}
                // onRowToggle={(e) => {
                //     setExpandedRows(e.data);
                // }}
                // rowExpansionTemplate={rowExpansionBodyTemplate}
            >
                <Column expander={(data) => data?.infrastructure?.length} style={{width: "5rem"}}/>
                <Column
                    field="name"
                    header={"Name"}
                    body={(data) => {
                        const {name, image_url} = data
                        return <div className={"flex align-items-center gap-2"}>
                            <Image
                                src={`${baseUrl?.url}${image_url}`}
                                alt="company"
                                height="25"
                                className={"w-auto"} preview/>
                            <span>{name}</span>
                        </div>
                    }}
                />

                <Column
                    header={"Action"}
                    headerClassName={"flex justify-content-end w-full"}
                    body={(data) => {
                        const {id} = data

                        // console.log("ids", ids)
                        return <ActionTemplate
                            id={id}
                            name={"food"}
                            accept={deleteAccept}
                            deleteRef={deleteRef}
                            editFunction={() => {

                            }}
                        />
                    }}
                />
            </DataTable>

        </div>
    );
};

export default Home;
