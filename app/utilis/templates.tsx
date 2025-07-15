export const paginationTemplate = {
    layout: "CurrentPageReport FirstPageLink PrevPageLink PageLinks  NextPageLink LastPageLink  RowsPerPageDropdown",
    CurrentPageReport: (options: any) => {
        return (
            <span className={""}>
                    {options.first} - {options.last} of {options.totalRecords}
                </span>
        );
    },
}
