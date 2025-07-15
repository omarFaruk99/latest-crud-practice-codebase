import {useEffect, useState, useMemo, useContext} from "react";
import {LayoutContext} from "@/layout/context/layoutcontext";
import {baseUrl} from "@/app/utilis/webinfo";

export const useFetch = (
    endpoint: string,
    dependencies: any[] = [],
    condition: boolean = false,
    id: any = "",
) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [data, setData] = useState<any>();
    const [totalData, setTotalData] = useState<number>(0);
    // const [approvalLevel, setApprovalLevel] = useState(null)
    const [notFound, setNotfound] = useState(false);
    const {accessToken} = useContext(LayoutContext);

    const memoizedFetchData = useMemo(() => {
        let count = 0;
        return async () => {
            if (!accessToken) {
                return;
            }

            // condition
            if (condition && !id) {
                return;
            }

            try {
                count = count + 1;
                // fetch one time
                if (count > 1) {
                    return;
                }
                setLoading(true);
                const res = await fetch(`${baseUrl?.url}${endpoint}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }, );

                if (res.status === 204) {
                    setNotfound(true);
                    setData([]);
                    return;
                }
                const resData = await res.json();
                if (res.ok && res.status !== 204) {
                    return resData;
                } else {
                    return [];
                }
            } catch (e: any) {
                setError(e.message);
                return [];
            } finally {
                setLoading(false);
            }
        };

    }, [endpoint, condition, id, accessToken, ...dependencies]);

    useEffect(() => {
        const getData = async () => {
            const fetchData = memoizedFetchData();
            const processedData = await fetchData;
            if (processedData?.data?.total) {
                setTotalData(processedData.data.total);
            }
            setData(processedData?.data?.items);
        };

        getData().then();
    }, [memoizedFetchData]);

    return { loading, error, data, setData, totalData, notFound};
};
