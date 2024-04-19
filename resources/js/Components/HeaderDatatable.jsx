import { Button } from "primereact/button";
import { useDebounce } from "primereact/hooks";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { memo } from "react";

const HeaderDatatable = memo(
    ({
        children,
        filters,
        setFilters,
        setSidebarFilter,
        isMobile,
        exportExcel,
    }) => {
        const [globalFilterValue, dbValue, setGlobalFilterValue] = useDebounce(
            "",
            500
        );
        const [localGlobalFilterValue, setLocalGlobalFilterValue] =
            useState("");

        const onGlobalFilterChange = (e) => {
            setLocalGlobalFilterValue(e.target.value);
        };

        const applyGlobalFilter = () => {
            let _filters = { ...filters };
            _filters["global"].value = localGlobalFilterValue;
            setFilters(_filters);
        };

        return (
            <div className="flex flex-row  justify-between gap-2 align-items-center items-end">
                <div className="p-inputgroup self-center lg:w-[30%]">
                    <InputText
                        className=" dark:placeholder-white dark:bg-slate-700"
                        value={localGlobalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Cari data..."
                    />
                    <Button onClick={applyGlobalFilter}>
                        <i className="pi pi-search"></i>
                    </Button>
                </div>
                <div className="flex justify-end gap-2">{children}</div>
            </div>
        );
    }
);

export default HeaderDatatable;
