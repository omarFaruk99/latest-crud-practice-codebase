import { baseUrl } from "@/app/utilis/webinfo";
import moment from "moment";
import { Toast } from "primereact/toast";

export default function callToast(
    toast: React.RefObject<Toast | null>,
    type: boolean | string,
    msg: string,
    life: number = 3000
) {
    if (toast?.current) {
        toast?.current?.show({
            severity: type === "warn" ? "warn" : type ? "success" : "error",
            summary:
                type === "warn" ? "Warning" : type ? "Successful" : "Error",
            detail: msg,
            life: life,
        });
    }
}

// Date Format Function
export const formattedDateTime = (
    date: string | Date,
    isTime: boolean = false
) => {
    return moment(date).format(`${isTime ? `h:mm A,` : ""} Do MMM YYYY`);
};

export const handleChangeData = (
    name: string,
    value: any,
    allData: {
        [key: string]: string | name | any;
    },
    setAllData: any
) => {
    return setAllData({
        ...allData,
        [name]: value,
    });
};

//Validation function
export const validateForm = (values: any, schema: any) => {
    const errors: any = {};
    for (const key in schema) {
        const error = schema[key](values[key]);
        if (error) {
            errors[key] = error;
        }
    }
    return errors;
};

// delete function:
export const handleDelete = async (params: deleteParams) => {
    const {
        id,
        endPoint,
        name,
        data = [],
        refetch,
        setData,
        token,
        toast,
        setUpdate,
        currentPage,
        setCurrentPage,
    } = params;
    const isArray = Array.isArray(id);
    const url = `${baseUrl?.url}${endPoint}${isArray ? "" : `/${id}`}`;
    const arrayPayload: { id: number }[] | null = isArray
        ? id?.map((item: any) => {
              return {
                  id: item?.id,
              };
          })
        : null;

    const options: RequestInit = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        ...(isArray && { body: JSON.stringify(arrayPayload) }),
    };

    const filteredData = isArray
        ? data.filter((item: any) => !id.includes(item?.id))
        : data.filter((item: any) => item?.id !== id);

    try {
        const res = await fetch(url, options);
        if (res.ok) {
            if (data.length === 1 && currentPage && setCurrentPage) {
                setCurrentPage(currentPage - 1);
            }
            if (data?.length > 0 && setData) {
                setData(filteredData);
            }
            if (refetch) {
                refetch();
            }
            if (setUpdate) {
                setUpdate((previous: boolean) => !previous);
            }
            callToast(toast, true, `${name} deleted successfully`);
        } else {
            const responseData = await res.json();
            callToast(toast, false, responseData?.message);
        }
    } catch (error: any) {
        callToast(toast, false, error?.message);
    }
};

export const tablePerPageOptions = [10, 20, 30, 50, 100];

//Hide popup
export const hidePopup = (ref: { current: number }) => {
    ref.current = 0;
};

export const getFilterSearchParams = (filtersObj: any) => {
    const urlArray: string[] = [];

    Object.entries(filtersObj).forEach(([key, value]: any) => {
        if(value?.value !== null) {
            if(typeof value === "object") {
                urlArray.push(`["${key}",${value?.id}]`);
            } else {
                urlArray.push(`["${key}"],[LIKE],["${value}"]`);
            }
        }
    });

    return urlArray.length > 0 ? `&filters=[${urlArray.join(',["AND"],')}]` : "";
}
