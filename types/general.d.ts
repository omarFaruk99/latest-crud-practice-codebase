interface dropdown {
    id?: number,
    name?: string
}

interface name{
    id: number,
    name: string
}


interface deleteParams{
    id: number | any[],
    endPoint: string,
    name: string,
    data?: any[],
    setData?: Function,
    update?: boolean,
    setUpdate?: Function,
    refetch?: Function
    toast: Toast | any,
    token: string,
    currentPage?: number,
    setCurrentPage?: Function,
}
