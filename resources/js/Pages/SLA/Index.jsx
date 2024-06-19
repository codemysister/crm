import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import DashboardLayout from "@/Layouts/DashboardLayout";
import HeaderModule from "@/Components/HeaderModule";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Link, router, useForm } from "@inertiajs/react";
import {
    ConfirmDialog,
    ConfirmDialog as ConfirmDialog2,
    confirmDialog,
} from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { Calendar } from "primereact/calendar";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
import { OverlayPanel } from "primereact/overlaypanel";
import { Image } from "primereact/image";
import SkeletonDatatable from "@/Components/SkeletonDatatable";
import getViewportSize from "../../Utils/getViewportSize";
import HeaderDatatable from "@/Components/HeaderDatatable";
import { Sidebar } from "primereact/sidebar";
import { TabPanel, TabView } from "primereact/tabview";
import { formateDate } from "../../Utils/formatDate";
import { handleSelectedDetailInstitution } from "@/Utils/handleSelectedDetailInstitution";
import PermissionErrorDialog from "@/Components/PermissionErrorDialog";
import LogComponent from "@/Components/LogComponent";
import ArsipComponent from "@/Components/ArsipComponent";
import LoadingDocument from "@/Components/LoadingDocument";
import { BlockUI } from "primereact/blockui";
import { formatNPWP } from "@/Utils/formatNPWP";
registerPlugin(FilePondPluginFileValidateSize);

export default function Index({ auth }) {
    const [slas, setSlas] = useState("");
    const [users, setUsers] = useState("");
    const [activities, setActivities] = useState(null);
    const [positions, setPositions] = useState("");
    const [blocked, setBlocked] = useState(false);
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const [permissionErrorIsVisible, setPermissionErrorIsVisible] =
        useState(false);
    const [confirmIsVisible, setConfirmIsVisible] = useState(false);
    const [actionMode, setActionMode] = useState("sla");
    const [selectedSLA, setSelectedSLA] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [sidebarFilter, setSidebarFilter] = useState(false);
    const viewportSize = getViewportSize();
    const isMobile = viewportSize.width < 992;
    const btnFilterRef = useRef(null);
    const toast = useRef(null);
    const action = useRef(null);
    const activityPanelRef = useRef(null);
    const actionActivityRef = useRef(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [modalEditActivityIsVisible, setModalEditActivityIsVisible] =
        useState(false);
    const [popupActivities, setPopupActivities] = useState(false);
    const [expandedRows, setExpandedRows] = useState(null);
    useState(false);
    const op = useRef(null);
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
        id: "",
        sla_id: "",
        activity: "",
        cazh_pic: "",
        duration: "",
        estimation_date: "",
        realization_date: "",
        realization: null,
        information: null,
    });

    const {
        data: dataFilter,
        setData: setDataFilter,
        reset: resetFilter,
    } = useForm({
        user: null,
        input_date: { start: null, end: null },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([getSlas()]);
                setIsLoadingData(false);
                setPreRenderLoad((prev) => (prev = false));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (activeIndexTab == 0) {
            getSlas();
        }
    }, [activeIndexTab]);

    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const getSlas = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/sla");
        let data = await response.json();

        setSlas((prev) => data.sla);
        setPositions((prev) => data.roles);
        setUsers((prev) => data.users);
        setIsLoadingData(false);
    };

    const getActivities = async (id) => {
        setIsLoadingData(true);

        let response = await fetch("/api/activity/" + id);
        let data = await response.json();
        setActivities((prev) => (prev = data));
        setIsLoadingData(false);
    };

    const confirmDeleteSLA = (SLA) => {
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

    const handleFilter = async (e) => {
        e.preventDefault();
        setIsLoadingData(true);
        const formData = {
            user: dataFilter.user,
            input_date: dataFilter.input_date,
        };

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");

        const response = await axios.post("/sla/filter", formData, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
        });
        const data = response.data;
        setSlas(data);
        setSidebarFilter(false);
        setIsLoadingData(false);
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

    const filterButtonIcon = () => {
        return (
            <i
                className="pi pi-filter"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };
    const exportButtonIcon = () => {
        return (
            <i
                className="pi pi-file-excel
                "
                style={{ fontSize: "0.8rem", paddingRight: "5px" }}
            ></i>
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

    const exportExcel = () => {
        const exports = slas.map((data) => {
            return {
                Kode: data.code ?? "-",
                Lembaga: data.partner ? data.partner.name : "-",
                Link_Dokumen: {
                    v: window.location.origin + "/" + data.sla_doc ?? "-",
                    h: "link",
                    l: {
                        Target:
                            window.location.origin + "/" + data.sla_doc ?? "-",
                        Tooltip: "Klik untuk membuka dokumen",
                    },
                },
                Tanggal_Pembuatan: formateDate(data.created_at),
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

            saveAsExcelFile(excelBuffer, "SLA" + formateDate(new Date()));
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

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <i
                    className="pi pi-ellipsis-h pointer cursor-pointer"
                    onClick={(event) => {
                        if (actionMode == "sla") {
                            setSelectedSLA(rowData);
                            setActivities(rowData.sla_activities);
                            action.current.toggle(event);
                        } else {
                            setSelectedActivity(rowData);
                            actionActivityRef.current.toggle(event);
                        }
                    }}
                ></i>
            </React.Fragment>
        );
    };

    const handleEditActivity = (activity) => {
        setData((data) => ({
            ...data,
            uuid: activity.uuid,
            sla_id: activity.sla_id,
            activity: activity.activity,
            cazh_pic: activity.cazh_pic,
            duration: activity.duration,
            estimation_date: activity.estimation_date,
            realization_date: activity.realization_date,
            realization: activity.realization,
            information: activity.information,
        }));
        setModalEditActivityIsVisible(true);
    };

    const handleDeleteActivity = (activity) => {
        destroy("activity/" + activity.uuid, {
            onSuccess: () => {
                getSlas();
                showSuccess("Hapus");
            },
            onError: () => {
                showError("Hapus");
            },
        });
    };

    const objectKeyToIndo = (key) => {
        let keyIndo;
        const keySplit = key.split(".");
        const firstKey = keySplit[0];
        if (firstKey == "partner_name") {
            keyIndo = "Lembaga";
        } else if (firstKey == "partner_phone_number") {
            keyIndo = "Nomor Lembaga";
        } else if (firstKey == "code") {
            keyIndo = "Kode";
        } else if (firstKey == "partner_pic") {
            keyIndo = "PIC";
        } else if (firstKey == "partner_pic_email") {
            keyIndo = "Email PIC";
        } else if (firstKey == "partner_pic_number") {
            keyIndo = "Nomor PIC";
        } else if (firstKey == "referral_name") {
            keyIndo = "Referral";
        } else if (firstKey == "signature_name") {
            keyIndo = "Tanda Tangan";
        } else if (firstKey == "activities") {
            keyIndo = "Aktivitas";
        }

        return keyIndo;
    };

    const handleDeleteSla = () => {
        destroy("sla/" + selectedSLA.uuid, {
            onSuccess: () => {
                getSlas();
                showSuccess("Hapus");
            },
            onError: () => {
                showError("Hapus");
            },
        });
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
                    {rowData.partner_name}
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
            field: "sla_doc",
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
                            href={rowData.sla_doc}
                            download={`SLA_${rowData.partner_name}`}
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
    ];

    const renderHeader = () => {
        return (
            <HeaderDatatable filters={filters} setFilters={setFilters}>
                <Button
                    icon={filterButtonIcon}
                    className="shadow-md border border-slate-600 bg-transparent text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-lg"
                    label="filter"
                    onClick={() => setSidebarFilter(true)}
                />
                <Button
                    icon={exportButtonIcon}
                    className="shadow-md bg-transparent text-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:border rounded-lg"
                    label="export"
                    onClick={exportExcel}
                    data-pr-tooltip="XLS"
                />
            </HeaderDatatable>
        );
    };

    const header = renderHeader();

    const handleSubmitForm = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            post("/products", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalProductIsVisible((prev) => false);
                    getProducts();
                    reset("name", "category", "price", "unit", "description");
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            setBlocked(true);
            post(`activity/${data.uuid}`, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditActivityIsVisible((prev) => false);
                    getSlas();
                    getActivities(data.sla_id);
                    setBlocked(false);
                    reset();
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
    };

    const globalFilterFields = [
        "code",
        "partner.name",
        "partner.npwp",
        "created_at.name",
    ];

    if (preRenderLoad) {
        return <SkeletonDatatable auth={auth} />;
    }

    return (
        <BlockUI blocked={blocked} template={LoadingDocument}>
            <DashboardLayout auth={auth.user} className="">
                <Toast ref={toast} />
                <PermissionErrorDialog
                    dialogIsVisible={permissionErrorIsVisible}
                    setDialogVisible={setPermissionErrorIsVisible}
                />

                <HeaderModule title="Service Level Agreement">
                    {permissions.includes("tambah sla") && (
                        <Link
                            href="/sla/create"
                            className="bg-purple-600 block text-white py-2 px-3 font-semibold text-sm shadow-md rounded-lg mr-2"
                        >
                            <i
                                className="pi pi-plus"
                                style={{
                                    fontSize: "0.7rem",
                                    paddingRight: "5px",
                                }}
                            ></i>
                            Tambah
                        </Link>
                    )}
                </HeaderModule>
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
                            <label htmlFor="">Tanggal Input</label>
                            <div className="flex items-center gap-2">
                                <Calendar
                                    value={
                                        dataFilter.input_date.start
                                            ? new Date(
                                                  dataFilter.input_date.start
                                              )
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
                                            ? new Date(
                                                  dataFilter.input_date.end
                                              )
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
                <TabView
                    activeIndex={activeIndexTab}
                    onTabChange={(e) => {
                        setActiveIndexTab(e.index);
                    }}
                    className="mt-2"
                >
                    <TabPanel header="Semua SLA">
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
                                    accept={handleDeleteSla}
                                />

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
                                            filters={filters}
                                            rows={10}
                                            emptyMessage="SLA tidak ditemukan."
                                            paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                                            header={header}
                                            globalFilterFields={
                                                globalFilterFields
                                            }
                                            value={slas}
                                            dataKey="id"
                                            scrollable
                                        >
                                            <Column
                                                header="Aksi"
                                                body={actionBodyTemplate}
                                                align="center"
                                                frozen
                                                style={
                                                    !isMobile
                                                        ? {
                                                              width: "max-content",
                                                              whiteSpace:
                                                                  "nowrap",
                                                          }
                                                        : null
                                                }
                                                className="dark:border-none text-center lg:w-max bg-white lg:whitespace-nowrap "
                                                headerClassName="dark:border-none text-center bg-white dark:bg-slate-900 dark:text-gray-300"
                                            ></Column>
                                            <Column
                                                field="uuid"
                                                hidden
                                                className="dark:border-none"
                                                headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                                header="Nama"
                                                align="left"
                                                style={{
                                                    width: "max-content",
                                                    whiteSpace: "nowrap",
                                                }}
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
                                                header="Diinput Oleh"
                                                body={(rowData) =>
                                                    rowData.created_by.name
                                                }
                                                className="dark:border-none"
                                                headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                                align="left"
                                                frozen={!isMobile}
                                                style={{
                                                    width: "max-content",
                                                    whiteSpace: "nowrap",
                                                }}
                                            ></Column>
                                            <Column
                                                header="Diinput Pada"
                                                body={(rowData) =>
                                                    formateDate(
                                                        rowData.created_at
                                                    )
                                                }
                                                className="dark:border-none"
                                                headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                                align="left"
                                                frozen={!isMobile}
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
                                fetchUrl={"/api/sla/logs"}
                                filterUrl={"/sla/logs/filter"}
                                deleteUrl={"/sla/logs"}
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
                                fetchUrl={"/api/sla/arsip"}
                                forceDeleteUrl={"/sla/{id}/force"}
                                restoreUrl={"/sla/{id}/restore"}
                                filterUrl={"/sla/arsip/filter"}
                                columns={columns}
                                showSuccess={showSuccess}
                                showError={showError}
                                globalFilterFields={globalFilterFields}
                            />
                        )}
                    </TabPanel>
                </TabView>
                <div className="card flex justify-content-center">
                    <Dialog
                        header="Aktivitas"
                        headerClassName="dark:glass shadow-md dark:text-white"
                        className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                        contentClassName=" dark:glass dark:text-white"
                        visible={modalEditActivityIsVisible}
                        onHide={() => setModalEditActivityIsVisible(false)}
                    >
                        <form onSubmit={(e) => handleSubmitForm(e, "update")}>
                            <div className="flex flex-col justify-around gap-4 mt-4">
                                <div className="flex flex-col">
                                    <label htmlFor="activity">Aktivitas</label>
                                    <InputText
                                        value={data.activity}
                                        onChange={(e) =>
                                            setData("activity", e.target.value)
                                        }
                                        disabled
                                        className="dark:bg-gray-300"
                                        id="activity"
                                        aria-describedby="activity-help"
                                    />
                                </div>
                                {/* <div className="flex flex-col">
                                <label htmlFor="activity">
                                    Penanggungjawab
                                </label>
                                <Dropdown
                                    value={data.cazh_pic}
                                    onChange={(e) => {
                                        setData("cazh_pic", e.target.value);
                                    }}
                                    disabled
                                    options={users}
                                    optionLabel="name"
                                    optionValue="name"
                                    placeholder="Pilih Penanggungjawab"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                    editable
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price">Estimasi Waktu</label>
                                <InputText
                                    value={data.duration}
                                    onChange={(e) =>
                                        setData("duration", e.target.value)
                                    }
                                    disabled
                                    className="dark:bg-gray-300"
                                    id="duration"
                                    aria-describedby="duration-help"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="estimation_date">Tanggal</label>
                                <Calendar
                                    value={
                                        data.estimation_date
                                            ? new Date(data.estimation_date)
                                            : null
                                    }
                                    disabled
                                    style={{ height: "35px" }}
                                    onChange={(e) => {
                                        setData(
                                            "estimation_date",
                                            e.target.value
                                        );
                                    }}
                                    showIcon
                                    dateFormat="dd/mm/yy"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="realization">Realisasi</label>
                                <Calendar
                                    value={
                                        data.realization_date
                                            ? new Date(data.realization_date)
                                            : null
                                    }
                                    disabled
                                    style={{ height: "35px" }}
                                    onChange={(e) => {
                                        setData(
                                            "realization_date",
                                            e.target.value
                                        );
                                    }}
                                    showIcon
                                    dateFormat="dd/mm/yy"
                                />
                            </div> */}
                                <div className="flex flex-col">
                                    <label htmlFor="realization">
                                        Bukti (foto) *
                                    </label>
                                    <div className="App">
                                        {data.realization !== null &&
                                        typeof data.realization == "string" ? (
                                            <>
                                                <FilePond
                                                    files={
                                                        "/storage/" +
                                                        data.realization
                                                    }
                                                    onaddfile={(
                                                        error,
                                                        fileItems
                                                    ) => {
                                                        if (!error) {
                                                            setData(
                                                                "realization",
                                                                fileItems.file
                                                            );
                                                        }
                                                    }}
                                                    onremovefile={() => {
                                                        setData(
                                                            "realization",
                                                            null
                                                        );
                                                    }}
                                                    maxFileSize="2mb"
                                                    labelMaxFileSizeExceeded="File terlalu besar"
                                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <FilePond
                                                    onaddfile={(
                                                        error,
                                                        fileItems
                                                    ) => {
                                                        if (!error) {
                                                            setData(
                                                                "realization",
                                                                fileItems.file
                                                            );
                                                        }
                                                    }}
                                                    onremovefile={() => {
                                                        setData(
                                                            "realization",
                                                            null
                                                        );
                                                    }}
                                                    maxFileSize="2mb"
                                                    labelMaxFileSizeExceeded="File terlalu besar"
                                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="information">Catatan</label>
                                    <InputTextarea
                                        value={data.information}
                                        onChange={(e) =>
                                            setData(
                                                "information",
                                                e.target.value
                                            )
                                        }
                                        rows={5}
                                        cols={30}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center mt-5">
                                <Button
                                    label="Submit"
                                    disabled={processing}
                                    className="bg-purple-600 text-sm shadow-md rounded-lg"
                                />
                            </div>
                        </form>
                    </Dialog>
                </div>
                {/* Tombol Aksi SLA*/}
                <OverlayPanel
                    className=" shadow-md p-1 dark:bg-slate-900 dark:text-gray-300"
                    ref={action}
                >
                    <div className="flex flex-col flex-wrap w-full">
                        <Button
                            icon="pi pi-check-circle"
                            label="Aktivitas"
                            className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                            onClick={(e) => {
                                setPopupActivities(true);
                                setActionMode("activity");
                            }}
                        />

                        <Button
                            icon="pi pi-pencil"
                            label="edit"
                            className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                            onClick={() => {
                                if (
                                    permissions.includes("edit sla") &&
                                    selectedSLA.created_by.id == currentUser.id
                                ) {
                                    router.get("sla/" + selectedSLA.uuid);
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
                                    permissions.includes("hapus sla") &&
                                    selectedSLA.created_by.id == currentUser.id
                                ) {
                                    confirmDeleteSLA();
                                } else {
                                    setPermissionErrorIsVisible(
                                        (prev) => (prev = true)
                                    );
                                }
                            }}
                        />
                    </div>
                </OverlayPanel>
                {/* Tombol Aksi Aktivitas*/}
                <OverlayPanel
                    className=" shadow-md p-1 dark:bg-slate-900 dark:text-gray-300"
                    ref={actionActivityRef}
                >
                    <div className="flex flex-col flex-wrap w-full">
                        <Button
                            icon="pi pi-pencil"
                            label="edit"
                            className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                            onClick={() => {
                                if (
                                    roles.includes("super admin") ||
                                    (permissions.includes(
                                        "edit aktifitas sla"
                                    ) &&
                                        selectedActivity.user_id ==
                                            currentUser.id)
                                ) {
                                    handleEditActivity(selectedActivity);
                                } else {
                                    setPermissionErrorIsVisible(
                                        (prev) => (prev = true)
                                    );
                                }
                            }}
                        />
                    </div>
                </OverlayPanel>
                <Dialog
                    header="Aktivitas"
                    visible={popupActivities}
                    maximizable
                    className="w-full lg:w-[70vw]"
                    onHide={() => {
                        setPopupActivities(false);
                        setActionMode("sla");
                    }}
                >
                    <div className="flex mx-auto flex-col justify-center mt-5 gap-5">
                        <div className="card p-fluid w-full h-full flex justify-center rounded-lg">
                            <DataTable
                                loading={isLoadingData}
                                className="w-full h-auto rounded-lg dark:glass border-none text-center"
                                pt={{
                                    bodyRow:
                                        "dark:bg-transparent bg-transparent dark:text-gray-300",
                                    table: "dark:bg-transparent bg-white dark:text-gray-300",
                                    header: "",
                                }}
                                paginator
                                rowsPerPageOptions={[10, 25, 50]}
                                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                currentPageReportTemplate="{first} - {last} dari {totalRecords}"
                                filters={filters}
                                rows={25}
                                emptyMessage="SLA tidak ditemukan."
                                paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                                globalFilterFields={["activity", "cazh_pic"]}
                                value={activities}
                                dataKey="id"
                                scrollable
                            >
                                <Column
                                    header="Aksi"
                                    body={actionBodyTemplate}
                                    style={
                                        !isMobile
                                            ? {
                                                  width: "max-content",
                                                  whiteSpace: "nowrap",
                                              }
                                            : null
                                    }
                                    align="center"
                                    className="dark:border-none lg:w-max bg-white lg:whitespace-nowrap "
                                    headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                ></Column>
                                <Column
                                    field="uuid"
                                    hidden
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    header="Nama"
                                    align="left"
                                    style={{
                                        width: "max-content",
                                        whiteSpace: "nowrap",
                                    }}
                                ></Column>
                                <Column
                                    field="activity"
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    header="Tahapan"
                                    align="left"
                                    style={{
                                        width: "max-content",
                                        whiteSpace: "nowrap",
                                    }}
                                ></Column>
                                <Column
                                    field="cazh_pic"
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    header="Penanggungjawab"
                                    align="left"
                                    style={{
                                        width: "max-content",
                                        whiteSpace: "nowrap",
                                    }}
                                ></Column>
                                <Column
                                    field="duration"
                                    header="Estimasi Waktu"
                                    style={{
                                        width: "max-content",
                                        whiteSpace: "nowrap",
                                    }}
                                    headerClassName="dark:border-none bg-white dark:bg-transparent dark:text-gray-300"
                                ></Column>
                                <Column
                                    field="estimation_date"
                                    header="Tanggal"
                                    body={(rowData) => {
                                        return new Date(
                                            rowData.estimation_date
                                        ).toLocaleDateString("id");
                                    }}
                                    style={{
                                        width: "max-content",
                                        whiteSpace: "nowrap",
                                    }}
                                    headerClassName="dark:border-none bg-white dark:bg-transparent dark:text-gray-300"
                                ></Column>
                                <Column
                                    field="realization_date"
                                    header="Realisasi"
                                    body={(rowData) => {
                                        return rowData.realization_date !== null
                                            ? new Date(
                                                  rowData.realization_date
                                              ).toLocaleDateString("id")
                                            : "-";
                                    }}
                                    style={{
                                        width: "max-content",
                                        whiteSpace: "nowrap",
                                    }}
                                    headerClassName="dark:border-none bg-white dark:bg-transparent dark:text-gray-300"
                                ></Column>
                                <Column
                                    field="realization"
                                    header="Bukti"
                                    body={(rowData) => {
                                        return rowData.realization ? (
                                            <div className="flex justify-center">
                                                <Image
                                                    src={
                                                        "/storage/" +
                                                        rowData.realization
                                                    }
                                                    alt="Bukti"
                                                    width="50%"
                                                    height="50%"
                                                    preview
                                                    downloadable
                                                />
                                            </div>
                                        ) : (
                                            "-"
                                        );
                                    }}
                                    style={{
                                        width: "8rem",
                                        // whiteSpace: "nowrap",
                                    }}
                                    headerClassName="dark:border-none bg-white dark:bg-transparent dark:text-gray-300"
                                ></Column>
                                <Column
                                    field="realization"
                                    header="Catatan"
                                    body={(rowData) => {
                                        return rowData.information ?? "-";
                                    }}
                                    style={{
                                        width: "max-content",
                                        whiteSpace: "nowrap",
                                    }}
                                    headerClassName="dark:border-none bg-white dark:bg-transparent dark:text-gray-300"
                                ></Column>
                            </DataTable>
                        </div>
                    </div>
                </Dialog>
            </DashboardLayout>
        </BlockUI>
    );
}
