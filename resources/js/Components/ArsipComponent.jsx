import HeaderDatatable from "@/Components/HeaderDatatable";
import SkeletonDatatable from "@/Components/SkeletonDatatable";
import { formateDate } from "@/Utils/formatDate";
import getViewportSize from "@/Utils/getViewportSize";
import { useForm } from "@inertiajs/react";
import { FilterMatchMode } from "primereact/api";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import {
    ConfirmDialog,
    ConfirmDialog as ConfirmDialog2,
    confirmDialog,
} from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { OverlayPanel } from "primereact/overlaypanel";
import { Sidebar } from "primereact/sidebar";
import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import PermissionErrorDialog from "./PermissionErrorDialog";

const ArsipComponent = ({
    auth,
    noFilter,
    users,
    showSuccess,
    showError,
    fetchUrl,
    restoreUrl,
    forceDeleteUrl,
    filterUrl,
    globalFilterFields,
    columns,
}) => {
    const [arsip, setArsip] = useState(null);
    const action = useRef(null);
    const viewportSize = getViewportSize();
    const isMobile = viewportSize.width < 992;
    const btnFilterRef = useRef(null);
    const [selectedData, setSelectedData] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [confirmIsVisible, setConfirmIsVisible] = useState();
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [sidebarFilter, setSidebarFilter] = useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [permissionErrorIsVisible, setPermissionErrorIsVisible] =
        useState(false);
    const { roles, permissions, data: currentUser } = auth.user;

    const {
        put,
        delete: destroy,
        reset,
    } = useForm({
        id: null,
        uuid: null,
        name: null,
        address: null,
        pic: null,
        total_members: null,
    });

    const {
        data: dataFilter,
        setData: setDataFilter,
        reset: resetFilter,
    } = useForm({
        user: null,
        delete_date: { start: null, end: null },
    });

    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    const getArsip = async () => {
        setIsLoadingData(true);
        let response = await fetch(fetchUrl);
        let data = await response.json();

        setArsip((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            setPreRenderLoad((prev) => (prev = false));
            await getArsip();
        };

        fetchData();
    }, []);

    const headerArsip = () => {
        return (
            <HeaderDatatable filters={filters} setFilters={setFilters}>
                {noFilter != true && (
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
                )}
            </HeaderDatatable>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <i
                    className="pi pi-ellipsis-h pointer cursor-pointer"
                    onClick={(event) => {
                        setSelectedData(rowData);
                        action.current.toggle(event);
                    }}
                ></i>
            </React.Fragment>
        );
    };

    const handleRestoreData = () => {
        let url = restoreUrl.replace(
            "{id}",
            selectedData.uuid ?? selectedData.id
        );
        confirmDialog({
            message: "Apakah Anda yakin mengembalikan data ini?",
            header: "Konfirmasi pemulihan",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-success",
            accept: async () => {
                put(url, {
                    onSuccess: () => {
                        getArsip();
                        showSuccess("Hapus");
                    },
                    onError: () => {
                        showError("Hapus");
                    },
                });
            },
        });
    };
    const confirmDeleteData = () => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: () => {
                setConfirmIsVisible(true);
            },
        });
    };

    const selectedOptionTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const optionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const handleDeleteData = () => {
        let url = forceDeleteUrl.replace(
            "{id}",
            selectedData.uuid ?? selectedData.id
        );
        destroy(url, {
            onSuccess: () => {
                getArsip();
                showSuccess("Hapus");
                reset();
            },
            onError: () => {
                showError("Hapus");
            },
        });
    };

    const handleFilter = async (e) => {
        e.preventDefault();
        setIsLoadingData(true);
        const formData = {
            user: dataFilter.user,
            delete_date: dataFilter.delete_date,
        };

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");

        const response = await axios.post(filterUrl, formData, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
        });
        const data = response.data;
        setArsip(data);
        setSidebarFilter(false);
        setIsLoadingData(false);
    };

    if (preRenderLoad) {
        return <SkeletonDatatable auth={auth} />;
    }

    return (
        <>
            <ConfirmDialog />
            <ConfirmDialog2
                group="declarative"
                visible={confirmIsVisible}
                onHide={() => setConfirmIsVisible(false)}
                message="Konfirmasi kembali jika anda yakin!"
                header="Konfirmasi kembali"
                icon="pi pi-info-circle"
                accept={handleDeleteData}
            />
            <PermissionErrorDialog
                dialogIsVisible={permissionErrorIsVisible}
                setDialogVisible={setPermissionErrorIsVisible}
            />

            {/* Sidebar filter */}
            <Sidebar
                header="Filter"
                visible={sidebarFilter}
                className="w-full md:w-[30%] px-3 dark:glass dark:text-white"
                position="right"
                onHide={() => setSidebarFilter(false)}
            >
                <form onSubmit={handleFilter}>
                    <div className="flex flex-col mt-3">
                        <label htmlFor="name">Berdasarkan user</label>
                        <Dropdown
                            optionLabel="name"
                            dataKey="id"
                            value={dataFilter.user}
                            onChange={(e) =>
                                setDataFilter("user", e.target.value)
                            }
                            options={users}
                            placeholder="Pilih User"
                            filter
                            showClear
                            valueTemplate={selectedOptionTemplate}
                            itemTemplate={optionTemplate}
                            className="flex justify-center  dark:text-gray-400   "
                        />
                    </div>

                    <div className="flex flex-col mt-3">
                        <label htmlFor="">Tanggal Hapus</label>
                        <div className="flex items-center gap-2">
                            <Calendar
                                value={
                                    dataFilter.delete_date.start
                                        ? new Date(dataFilter.delete_date.start)
                                        : null
                                }
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setDataFilter("delete_date", {
                                        ...dataFilter.delete_date,
                                        start: e.target.value,
                                    });
                                }}
                                placeholder="mulai"
                                showIcon
                                dateFormat="dd/mm/yy"
                            />
                            <span>-</span>
                            <Calendar
                                value={
                                    dataFilter.delete_date.end
                                        ? new Date(dataFilter.delete_date.end)
                                        : null
                                }
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setDataFilter("delete_date", {
                                        ...dataFilter.delete_date,
                                        end: e.target.value,
                                    });
                                }}
                                placeholder="selesai"
                                showIcon
                                dateFormat="dd/mm/yy"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row mt-5">
                        <Button
                            ref={btnFilterRef}
                            label="Terapkan"
                            className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        />
                        <Button
                            type="button"
                            label="Reset"
                            onClick={(e) => {
                                resetFilter();
                                setTimeout(() => {
                                    btnFilterRef.current.click();
                                }, 500);
                            }}
                            className="outline-purple-600 outline-1 outline-dotted bg-transparent text-slate-700  text-sm shadow-md rounded-lg mr-2"
                        />
                    </div>
                </form>
            </Sidebar>

            <OverlayPanel
                className="shadow-md p-1 dark:bg-slate-900 dark:text-gray-300"
                ref={action}
            >
                <div className="flex flex-col flex-wrap w-full">
                    <Button
                        icon="pi pi-replay"
                        label="pulihkan"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            if (selectedData.created_by) {
                                if (
                                    selectedData.created_by.id == currentUser.id
                                ) {
                                    handleRestoreData(selectedData);
                                } else {
                                    setPermissionErrorIsVisible(
                                        (prev) => (prev = true)
                                    );
                                }
                            } else {
                                handleRestoreData(selectedData);
                            }
                        }}
                    />
                    <Button
                        icon="pi pi-trash"
                        label="hapus permanen"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            if (selectedData.created_by) {
                                if (
                                    selectedData.created_by.id == currentUser.id
                                ) {
                                    confirmDeleteData();
                                } else {
                                    setPermissionErrorIsVisible(
                                        (prev) => (prev = true)
                                    );
                                }
                            } else {
                                confirmDeleteData();
                            }
                        }}
                    />
                </div>
            </OverlayPanel>

            <div className="flex mx-auto flex-col justify-center mt-5 gap-5">
                <div className="card p-fluid w-full h-full flex justify-center rounded-lg">
                    <DataTable
                        loading={isLoadingData}
                        className="w-full h-auto rounded-lg dark:glass border-none text-center shadow-md"
                        pt={{
                            bodyRow:
                                "dark:bg-transparent bg-transparent dark:text-gray-300",
                            table: "dark:bg-transparent bg-white dark:text-gray-300",
                            header: "",
                        }}
                        paginator
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        currentPageReportTemplate="{first} - {last} dari {totalRecords}"
                        rows={10}
                        filters={filters}
                        emptyMessage="Data tidak ditemukan."
                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                        header={headerArsip}
                        globalFilterFields={globalFilterFields}
                        value={arsip}
                        dataKey="id"
                    >
                        <Column
                            header="Aksi"
                            body={actionBodyTemplate}
                            align="center"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                        ></Column>
                        {columns.map((col) => {
                            return (
                                <Column
                                    field={col.field}
                                    header={col.header}
                                    body={col.body}
                                    style={col.style}
                                    frozen={col.frozen}
                                    align="left"
                                    className="dark:border-none bg-white"
                                    headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                ></Column>
                            );
                        })}

                        <Column
                            field="created_at"
                            className="dark:border-none bg-white lg:whitespace-nowrap lg:w-max"
                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                            header="Tanggal Input"
                            align="left"
                            body={(rowData) => {
                                return formateDate(rowData.created_at);
                            }}
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>

                        <Column
                            field="created_by"
                            className="dark:border-none bg-white lg:whitespace-nowrap lg:w-max"
                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                            header="Diinput Oleh"
                            align="left"
                            body={(rowData) => {
                                return rowData.created_by
                                    ? rowData.created_by.name
                                    : "-";
                            }}
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                    </DataTable>
                </div>
            </div>
        </>
    );
};

export default ArsipComponent;
