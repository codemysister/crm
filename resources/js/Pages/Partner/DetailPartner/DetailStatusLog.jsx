import HeaderDatatable from "@/Components/HeaderDatatable";
import { useForm } from "@inertiajs/react";
import { FilterMatchMode } from "primereact/api";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

const DetailStatusLog = ({
    partner,
    handleSelectedDetailPartner,
    showSuccess,
    showError,
}) => {
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [logs, setLogs] = useState(null);
    const op = useRef();
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const getLog = async () => {
        setIsLoadingData(true);
        let response = await fetch("/api/partners/status/logs");
        let data = await response.json();

        setLogs((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            setPreRenderLoad((prev) => (prev = false));
            await getLog();
        };

        fetchData();
    }, []);

    const headerStatus = () => {
        return (
            <HeaderDatatable
                globalFilterValue={globalFilterValue}
                onGlobalFilterChange={onGlobalFilterChange}
            ></HeaderDatatable>
        );
    };
    return (
        <>
            {console.log(logs)}
            <div className="flex mx-auto flex-col justify-center gap-5">
                <div className="card p-fluid w-full h-full flex justify-center rounded-lg">
                    <DataTable
                        id="tablelog"
                        loading={isLoadingData}
                        className="w-full h-full rounded-lg border-none text-center"
                        pt={{
                            bodyRow:
                                "dark:bg-transparent bg-transparent dark:text-gray-300 h-full",
                            table: "dark:bg-transparent bg-white dark:text-gray-300 h-full",
                            header: "",
                            thead: "hidden",
                        }}
                        style={{ height: "300px" }}
                        showGridlines
                        paginator
                        filters={filters}
                        rows={10}
                        emptyMessage="Status tidak ditemukan."
                        paginatorClassName="dark:bg-transparent paginator-status-log dark:text-gray-300 rounded-b-lg"
                        globalFilterFields={["name", "category", "causer.name"]}
                        value={logs}
                        dataKey="id"
                    >
                        <Column
                            field="causer"
                            hidden
                            className="border-none"
                            headerClassName="border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                            body={(rowData) => {
                                return rowData.causer.name;
                            }}
                        ></Column>
                        <Column
                            field="uuid"
                            hidden
                            className="border-none"
                            headerClassName="border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            className="border-none"
                            headerClassName="border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                            body={(rowData) => {
                                return (
                                    <div className="flex justify-between w-full gap-2">
                                        <div className="flex gap-4">
                                            <Badge
                                                value={
                                                    rowData.properties
                                                        .attributes[
                                                        "status.name"
                                                    ]
                                                }
                                                className="w-20 text-white"
                                                style={{
                                                    backgroundColor:
                                                        "#" +
                                                        rowData.properties
                                                            .attributes[
                                                            "status.color"
                                                        ],
                                                }}
                                            ></Badge>
                                            <p>
                                                {rowData.causer.name +
                                                    " " +
                                                    "memperbaharui status partner"}
                                            </p>
                                        </div>
                                        {rowData.event !== "deleted" ? (
                                            <div>
                                                <Button
                                                    label="detail"
                                                    className="p-0 underline bg-transparent text-blue-700 text-left"
                                                    onClick={(e) => {
                                                        op.current.toggle(e);
                                                        console.log(rowData);
                                                        setSelectedStatus(
                                                            (prev) =>
                                                                (prev = rowData)
                                                        );
                                                    }}
                                                    aria-controls="popup_menu_right"
                                                    aria-haspopup
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            }}
                        ></Column>
                    </DataTable>
                </div>
                <OverlayPanel
                    className="w-[40%] shadow-md md:max-w-[50%] dark:bg-slate-900 dark:text-gray-300"
                    ref={op}
                    showCloseIcon
                >
                    <div className="flex flex-wrap flex-col gap-2 p-4">
                        <p className="font-semibold">Keterangan</p>
                        <p className="text-justify">
                            {selectedStatus?.note_status}
                        </p>
                    </div>
                </OverlayPanel>
            </div>
        </>
    );
};

export default DetailStatusLog;
