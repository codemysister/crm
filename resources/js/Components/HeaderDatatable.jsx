import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const HeaderDatatable = ({
    children,
    globalFilterValue,
    onGlobalFilterChange,
    setSidebarFilter,
    isMobile,
    exportExcel,
}) => {
    return (
        <div className="flex flex-row justify-between gap-2 align-items-center items-end">
            <div>
                <span className="p-input-icon-left border-none">
                    <i className="pi pi-search dark:text-white" />
                    <InputText
                        className="dark:bg-transparent dark:placeholder-white border-none"
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Kata kunci pencarian..."
                    />
                </span>
            </div>
            <div className="flex w-[30%] justify-end gap-2">
                {children}
                <Button
                    className="shadow-md w-[10px] lg:w-[90px] border border-slate-600 bg-transparent text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-lg"
                    onClick={() => setSidebarFilter(true)}
                >
                    <span className="w-full flex justify-center items-center gap-1">
                        <i
                            className="pi pi-filter"
                            style={{ fontSize: "0.7rem" }}
                        ></i>{" "}
                        {!isMobile && <span>filter</span>}
                    </span>
                </Button>
                <Button
                    className="shadow-md w-[10px] lg:w-[90px] bg-transparent text-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:border rounded-lg"
                    onClick={exportExcel}
                    data-pr-tooltip="XLS"
                >
                    <span className="w-full flex items-center justify-center gap-1">
                        <i
                            className="pi pi-file-excel"
                            style={{ fontSize: "0.8rem" }}
                        ></i>{" "}
                        {!isMobile && <span>export</span>}
                    </span>
                </Button>
            </div>
        </div>
    );
};

export default HeaderDatatable;
