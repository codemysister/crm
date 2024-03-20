import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const HeaderDatatable = ({
    children,
    stateAddModalFnc,
    resetFormFnc,
    resetErrorFnc,
    globalFilterValue,
    onGlobalFilterChange,
}) => {
    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };

    return (
        <div className="flex flex-row justify-between gap-2 align-items-center items-end">
            <div className="flex gap-2">
                <Button
                    label="Tambah"
                    className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                    icon={addButtonIcon}
                    onClick={() => {
                        stateAddModalFnc((prev) => (prev = true));
                        resetFormFnc();
                        resetErrorFnc();
                    }}
                    aria-controls="popup_menu_right"
                    aria-haspopup
                />

                {children}
            </div>
            <div className="w-[30%]">
                <span className="p-input-icon-left">
                    <i className="pi pi-search dark:text-white" />
                    <InputText
                        className="dark:bg-transparent dark:placeholder-white"
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Kata kunci pencarian..."
                    />
                </span>
            </div>
        </div>
    );
};

export default HeaderDatatable;
