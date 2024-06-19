import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import DashboardLayout from "@/Layouts/DashboardLayout";
import HeaderModule from "@/Components/HeaderModule";
import { InputText } from "primereact/inputtext";
import { router, useForm, usePage } from "@inertiajs/react";
import {
    ConfirmDialog,
    ConfirmDialog as ConfirmDialog2,
    confirmDialog,
} from "primereact/confirmdialog";
import { Skeleton } from "primereact/skeleton";
import { Link } from "@inertiajs/react";
import { FilterMatchMode } from "primereact/api";
import { ProgressSpinner } from "primereact/progressspinner";
import { Sidebar } from "primereact/sidebar";
import SkeletonDatatable from "@/Components/SkeletonDatatable";
import { ConfirmPopup } from "primereact/confirmpopup";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { OverlayPanel } from "primereact/overlaypanel";
import { TabPanel, TabView } from "primereact/tabview";
import { handleSelectedDetailInstitution } from "@/Utils/handleSelectedDetailInstitution";
import getViewportSize from "@/Utils/getViewportSize";
import HeaderDatatable from "@/Components/HeaderDatatable";
import { formatNPWP } from "@/Utils/formatNPWP";
import PermissionErrorDialog from "@/Components/PermissionErrorDialog";
import { formateDate } from "@/Utils/formatDate";
import LogComponent from "@/Components/LogComponent";
import ArsipComponent from "@/Components/ArsipComponent";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Index({ auth, spdsDefault, usersProp }) {
    const [spds, setSpds] = useState(spdsDefault);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [sidebarFilter, setSidebarFilter] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [users, setUsers] = useState(usersProp);
    const btnFilterRef = useRef(null);
    const toast = useRef(null);
    const action = useRef(null);
    const windowEscapeRef = useRef(null);
    const [confirmIsVisible, setConfirmIsVisible] = useState(false);
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const viewportSize = getViewportSize();
    const isMobile = viewportSize.width < 992;
    const [permissionErrorIsVisible, setPermissionErrorIsVisible] =
        useState(false);
    const { data: currentUser, roles, permissions } = auth.user;
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        reset,
        processing,
        errors,
    } = useForm({
        uuid: "",
        name: "",
        category: "",
        price: "",
        unit: "",
        description: "",
    });

    const {
        data: dataFilter,
        setData: setDataFilter,
        reset: resetFilter,
    } = useForm({
        user: null,
        input_date: { start: null, end: null },
        payment_metode: null,
    });

    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const getSpds = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/stpd");
        let data = await response.json();

        setSpds((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        if (activeIndexTab == 0) {
            fetchData(getSpds);
        }
    }, [activeIndexTab]);

    const fetchData = async (fnc) => {
        try {
            await Promise.all([fnc()]);
            setIsLoadingData(false);
            setPreRenderLoad((prev) => (prev = false));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([getSpds()]);
                setIsLoadingData(false);
                setPreRenderLoad((prev) => (prev = false));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

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

    // fungsi toast
    const showSuccess = (type) => {
        toast.current.show({
            severity: "success",
            summary: "Success",
            detail: `${type} data berhasil`,
            life: 3000,
        });
    };

    const showError = (type) => {
        toast.current.show({
            severity: "error",
            summary: "Error",
            detail: `${type} data gagal`,
            life: 3000,
        });
    };

    const handleDelete = (stpd) => {
        destroy("stpd/" + selectedData.uuid, {
            onSuccess: () => {
                getSpds();
                showSuccess("Hapus");
            },
            onError: () => {
                showError("Hapus");
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

    const header = () => {
        return (
            <HeaderDatatable filters={filters} setFilters={setFilters}>
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
            </HeaderDatatable>
        );
    };

    const handleFilter = async (e) => {
        e.preventDefault();
        setIsLoadingData(true);
        const formData = {
            user: dataFilter.user,
            input_date: dataFilter.input_date,
            status: dataFilter.status,
        };

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");

        const response = await axios.post("/stpd/filter", formData, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
        });
        const data = response.data;
        setSpds(data);
        setSidebarFilter(false);
        setIsLoadingData(false);
    };

    const columns = [
        {
            field: "code",
            header: "Kode",
            frozen: !isMobile,
            style: !isMobile
                ? {
                      width: "max-content",
                      whiteSpace: "nowrap",
                  }
                : null,
        },

        {
            header: "Lembaga",
            frozen: !isMobile,
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
            body: (rowData) => (
                <button
                    onClick={() => handleSelectedDetailInstitution(rowData)}
                    className="hover:text-blue-700 text-left"
                >
                    {rowData.institution_name}
                </button>
            ),
        },

        {
            field: "npwp",
            header: "NPWP",
            frozen: !isMobile,
            style: !isMobile
                ? {
                      width: "max-content",
                      whiteSpace: "nowrap",
                  }
                : null,
            body: (rowData) => {
                if (rowData.lead != undefined) {
                    return rowData.lead?.npwp !== null
                        ? formatNPWP(rowData.lead.npwp)
                        : "-";
                } else if (rowData.partner != undefined) {
                    return rowData.partner?.npwp !== null
                        ? formatNPWP(rowData.partner.npwp)
                        : "-";
                } else {
                    return "-";
                }
            },
        },

        {
            field: "stpd_doc",
            header: "Dokumen",
            frozen: !isMobile,
            style: !isMobile
                ? {
                      width: "max-content",
                      whiteSpace: "nowrap",
                  }
                : null,
            body: (rowData) => {
                return (
                    <div className="flex w-full h-full items-center justify-center">
                        <a
                            href={rowData.stpd_doc}
                            download={`STPD_${rowData.institution_name}`}
                            class="font-bold  w-full h-full text-center rounded-full "
                        >
                            <i
                                className="pi pi-file-pdf"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    fontSize: "1.5rem",
                                }}
                            ></i>
                        </a>
                    </div>
                );
            },
        },

        {
            field: "departure_date",
            header: "Tanggal Berangkat",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
            body: (rowData) => {
                return new Date(rowData.departure_date).toLocaleDateString(
                    "id"
                );
            },
        },
        {
            field: "return_date",
            header: "Tanggal Kembali",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
            body: (rowData) => {
                return new Date(rowData.return_date).toLocaleDateString("id");
            },
        },

        {
            field: "accommodation",
            header: "Akomodasi",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },
    ];

    const confirmDelete = () => {
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

    const exportExcel = () => {
        const exports = spds.map((data) => {
            return {
                Kode: data.code ?? "-",
                Lembaga: data.institution_name ?? "-",
                NPWP: data.lead == undefined ? data.partner.npwp : "-",
                Link_Dokumen: {
                    v: window.location.origin + "/" + data.sph_doc ?? "-",
                    h: "link",
                    l: {
                        Target:
                            window.location.origin + "/" + data.spd_doc ?? "-",
                        Tooltip: "Klik untuk membuka dokumen",
                    },
                },
                Tanggal_Pembuatan: formateDate(data.created_at),
                Diinput_Oleh: data.created_by.name,
            };
        });

        import("xlsx").then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(exports);
            const workbook = {
                Sheets: { data: worksheet },
                SheetNames: ["data"],
            };
            const excelBuffer = xlsx.write(workbook, {
                bookType: "xlsx",
                type: "array",
            });

            saveAsExcelFile(excelBuffer, "sph_" + formateDate(new Date()));
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import("file-saver").then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE =
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
                let EXCEL_EXTENSION = ".xlsx";
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE,
                });

                module.default.saveAs(data, fileName + EXCEL_EXTENSION);
            }
        });
    };

    const objectKeyToIndo = (key) => {
        let keyIndo;
        const keySplit = key.split(".");
        const firstKey = keySplit[0];
        if (firstKey == "institution_name") {
            keyIndo = "Lembaga";
        } else if (firstKey == "departure_date") {
            keyIndo = "Tanggal Keberangkatan";
        } else if (firstKey == "return_date") {
            keyIndo = "Tanggal Kembali";
        } else if (firstKey == "transportation") {
            keyIndo = "Transportasi";
        } else if (firstKey == "accommodation") {
            keyIndo = "Akomodasi";
        } else if (firstKey == "code") {
            keyIndo = "Kode";
        } else if (firstKey == "signature_name") {
            keyIndo = "Tanda Tangan";
        }

        return keyIndo;
    };

    const globalFilterFields = ["institution_name", "code"];

    if (preRenderLoad) {
        return <SkeletonDatatable auth={auth} />;
    }

    return (
        <DashboardLayout auth={auth.user} className="">
            <Toast ref={toast} />
            <ConfirmPopup />

            <HeaderModule title="Surat Perjalanan Dinas">
                {permissions.includes("tambah stpd") && (
                    <Link
                        href="/stpd/create"
                        className="bg-purple-600 block text-white py-2 px-3 font-semibold text-sm shadow-md rounded-lg mr-2"
                    >
                        <i
                            className="pi pi-plus"
                            style={{ fontSize: "0.7rem", paddingRight: "5px" }}
                        ></i>
                        Tambah
                    </Link>
                )}
            </HeaderModule>

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
                        <label htmlFor="name">Berdasarkan penginput</label>
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
                        <label htmlFor="institution_type">Tipe Lembaga</label>
                        <Dropdown
                            value={dataFilter.institution_type}
                            onChange={(e) =>
                                setDataFilter(
                                    "institution_type",
                                    e.target.value
                                )
                            }
                            showClear
                            options={[{ name: "Lead" }, { name: "Partner" }]}
                            optionLabel="name"
                            optionValue="name"
                            placeholder="Pilih tipe"
                            className="w-full md:w-14rem"
                        />
                    </div>

                    <div className="flex flex-col mt-3">
                        <label htmlFor="">Tanggal Input</label>
                        <div className="flex items-center gap-2">
                            <Calendar
                                value={
                                    dataFilter.input_date.start
                                        ? new Date(dataFilter.input_date.start)
                                        : null
                                }
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setDataFilter("input_date", {
                                        ...dataFilter.input_date,
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
                                    dataFilter.input_date.end
                                        ? new Date(dataFilter.input_date.end)
                                        : null
                                }
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setDataFilter("input_date", {
                                        ...dataFilter.input_date,
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

            {/* Tombol Aksi */}
            <OverlayPanel
                className=" shadow-md p-1 dark:bg-slate-800 dark:text-gray-300"
                ref={action}
            >
                <div className="flex flex-col flex-wrap w-full">
                    <Button
                        icon="pi pi-pencil"
                        label="edit"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            if (
                                permissions.includes("edit stpd") &&
                                selectedData.created_by.id == currentUser.id
                            ) {
                                router.get("/stpd/" + selectedData.uuid);
                            } else {
                                setPermissionErrorIsVisible(
                                    (prev) => (prev = true)
                                );
                            }
                        }}
                    />

                    <Button
                        icon="pi pi-trash"
                        label="hapus"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            if (
                                permissions.includes("hapus stpd") &&
                                selectedData.created_by.id == currentUser.id
                            ) {
                                confirmDelete();
                            } else {
                                setPermissionErrorIsVisible(
                                    (prev) => (prev = true)
                                );
                            }
                        }}
                    />
                </div>
            </OverlayPanel>

            <TabView
                activeIndex={activeIndexTab}
                onTabChange={(e) => {
                    setActiveIndexTab(e.index);
                }}
                className="mt-2"
            >
                <TabPanel header="Semua Invoice">
                    {activeIndexTab == 0 && (
                        <>
                            <ConfirmDialog />
                            <ConfirmDialog2
                                group="declarative"
                                visible={confirmIsVisible}
                                onHide={() => setConfirmIsVisible(false)}
                                message="Konfirmasi kembali jika anda yakin!"
                                header="Konfirmasi kembali"
                                icon="pi pi-info-circle"
                                accept={handleDelete}
                            />

                            <div
                                className="flex mx-auto flex-col justify-center mt-5 gap-5"
                                ref={windowEscapeRef}
                            >
                                <div className="card p-fluid w-full h-full flex justify-center rounded-lg">
                                    <DataTable
                                        loading={isLoadingData}
                                        className="w-full h-auto rounded-lg dark:glass border-none text-center shadow-md"
                                        pt={{
                                            bodyRow:
                                                "dark:bg-transparent  dark:text-gray-300",
                                            table: "dark:bg-transparent bg-white dark:text-gray-300",
                                        }}
                                        paginator
                                        rowsPerPageOptions={[10, 25, 50, 100]}
                                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                        currentPageReportTemplate="{first} - {last} dari {totalRecords}"
                                        filters={filters}
                                        rows={10}
                                        emptyMessage="Surat perjalanan dinas tidak ditemukan."
                                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                                        header={header}
                                        globalFilterFields={globalFilterFields}
                                        scrollable
                                        value={spds}
                                        dataKey="id"
                                    >
                                        <Column
                                            header="Aksi"
                                            body={actionBodyTemplate}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                            frozen
                                            align="center"
                                            className="dark:border-none bg-white"
                                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                        ></Column>

                                        {columns.map((col) => {
                                            return (
                                                <Column
                                                    field={col.field}
                                                    header={col.header}
                                                    body={col.body}
                                                    style={col.style}
                                                    frozen={col.frozen}
                                                    editor={col.editor}
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
                                                return formateDate(
                                                    rowData.created_at
                                                );
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
                                                return rowData.created_by.name;
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
                    )}
                </TabPanel>

                <TabPanel header="Log">
                    {activeIndexTab == 1 && (
                        <LogComponent
                            auth={auth}
                            fetchUrl={"/api/stpd/logs"}
                            filterUrl={"/stpd/logs/filter"}
                            deleteUrl={"/stpd/logs"}
                            objectKeyToIndo={objectKeyToIndo}
                            users={users}
                            showSuccess={showSuccess}
                            showError={showError}
                        />
                    )}
                </TabPanel>

                <TabPanel header="Arsip">
                    {activeIndexTab == 2 && (
                        <ArsipComponent
                            auth={auth}
                            users={users}
                            fetchUrl={"/api/stpd/arsip"}
                            forceDeleteUrl={"/stpd/{id}/force"}
                            restoreUrl={"/stpd/{id}/restore"}
                            filterUrl={"/stpd/arsip/filter"}
                            columns={columns}
                            showSuccess={showSuccess}
                            showError={showError}
                            globalFilterFields={globalFilterFields}
                        />
                    )}
                </TabPanel>
            </TabView>
        </DashboardLayout>
    );
}
