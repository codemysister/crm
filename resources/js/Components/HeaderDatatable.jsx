import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const HeaderDatatable = ({
    children,
    globalFilterValue,
    onGlobalFilterChange,
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
            <div className="flex gap-2">{children}</div>
        </div>
    );
};

export default HeaderDatatable;
