import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import DashboardLayout from "@/Layouts/DashboardLayout";
import HeaderModule from "@/Components/HeaderModule";
import { router, useForm, usePage } from "@inertiajs/react";
import {
    ConfirmDialog,
    ConfirmDialog as ConfirmDialog2,
    confirmDialog,
} from "primereact/confirmdialog";
import { Link } from "@inertiajs/react";
import { FilterMatchMode } from "primereact/api";
import { ProgressSpinner } from "primereact/progressspinner";
import { OverlayPanel } from "primereact/overlaypanel";
import getViewportSize from "@/Utils/getViewportSize";
import { Sidebar } from "primereact/sidebar";
import SkeletonDatatable from "@/Components/SkeletonDatatable";
import HeaderDatatable from "@/Components/HeaderDatatable";
import { TabPanel, TabView } from "primereact/tabview";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { formatNPWP } from "@/Utils/formatNPWP";
import LogComponent from "@/Components/LogComponent";
import { handleSelectedDetailInstitution } from "@/Utils/handleSelectedDetailInstitution";
import { formateDate } from "@/Utils/formatDate";
import ArsipComponent from "@/Components/ArsipComponent";
import PermissionErrorDialog from "@/Components/PermissionErrorDialog";

export default function Index({ auth, usersProp }) {
    const [mous, setMous] = useState();
    const [pathMou, setPathMou] = useState({
        partner_name: null,
        code: null,
        word: null,
        pdf: null,
    });
    const [selectedData, setSelectedData] = useState(null);
    const [users, setUsers] = useState(usersProp);

    const [isLoadingData, setIsLoadingData] = useState(false);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const viewportSize = getViewportSize();
    const isMobile = viewportSize.width < 992;
    const [confirmIsVisible, setConfirmIsVisible] = useState(false);
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const op = useRef(null);
    const action = useRef(null);
    const btnFilterRef = useRef(null);
    const [sidebarFilter, setSidebarFilter] = useState(null);
    const windowEscapeRef = useRef(null);
    const toast = useRef(null);
    const { roles, permissions, data: currentUser } = auth.user;
    const [permissionErrorIsVisible, setPermissionErrorIsVisible] =
        useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

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
                    return "-";
                } else {
                    return rowData.partner?.npwp !== null
                        ? formatNPWP(rowData.partner.npwp)
                        : "-";
                }
            },
        },

        {
            field: "mou_doc",
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
                            href={rowData.mou_doc}
                            download={`MOU_${rowData.partner_name}`}
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
            field: "partner_pic",
            header: "PIC",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },
        {
            field: "url_subdomain",
            header: "Url Subdomain",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },

        {
            field: "price_card",
            header: "Harga Kartu",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },
        {
            field: "price_lanyard",
            header: "Harga Lanyard",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },
        {
            field: "price_subscription_system",
            header: "Harga Langganan Sistem",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },
        {
            field: "period_subscription",
            header: "Langganan Per-",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },
        {
            field: "price_training_offline",
            header: "Harga Training Offline",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },
        {
            field: "price_training_online",
            header: "Harga Training Online",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },
        {
            field: "fee_purchase_cazhpoin",
            header: "Isi Kartu via CazhPOIN",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },
        {
            field: "fee_bill_cazhpoin",
            header: "Bayar Tagihan via CazhPOIN",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },
        {
            field: "fee_topup_cazhpos",
            header: "Topup Kartu via CazhPos",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },
        {
            field: "fee_withdraw_cazhpos",
            header: "Withdraw Kartu via Cazh POS",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },
        {
            field: "fee_bill_saldokartu",
            header: "Bayar Tagihan via Saldo Kartu",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },
        {
            field: "bank",
            header: "Bank",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },
        {
            field: "account_bank_number",
            header: "Nomor Rekening",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },
        {
            field: "expired_date",
            header: "Tanggal Kadaluarsa",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },
        {
            field: "profit_sharing",
            header: "Bagi Hasil",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },
    ];

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
        institution_type: null,
    });

    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const getMous = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/mou");
        let data = await response.json();

        setMous((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        if (activeIndexTab == 0) {
            fetchData(getMous);
        }
    }, [activeIndexTab]);

    useEffect(() => {
        fetchData(getMous);
    }, []);

    const fetchData = async (fnc) => {
        try {
            await Promise.all([fnc()]);
            setIsLoadingData(false);
            setPreRenderLoad((prev) => (prev = false));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
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

    const exportExcel = () => {
        const exports = mous.map((data) => {
            return {
                Kode: data.code ?? "-",
                Lembaga: data.partner_name ?? "-",
                NPWP: data.lead == undefined ? data.partner.npwp : "-",
                Link_Dokumen: {
                    v: window.location.origin + "/" + data.memo_doc ?? "-",
                    h: "link",
                    l: {
                        Target:
                            window.location.origin + "/" + data.memo_doc ?? "-",
                        Tooltip: "Klik untuk membuka dokumen",
                    },
                },
                Tanggal_Pembuatan: formateDate(data.created_at),
                Diinput_Oleh: data.created_at.name,
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

            saveAsExcelFile(excelBuffer, "memo_" + formateDate(new Date()));
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

    const handleDeleteMOU = () => {
        destroy("mou/" + selectedData.uuid, {
            onSuccess: () => {
                getMous();
                showSuccess("Hapus");
            },
            onError: () => {
                showError("Hapus");
            },
        });
    };

    const confirmDeleteMou = () => {
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
            institution_type: dataFilter.institution_type,
        };

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");

        const response = await axios.post("/mou/filter", formData, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
        });
        const data = response.data;
        setMous(data);
        setSidebarFilter(false);
        setIsLoadingData(false);
    };

    const globalFilterFields = ["partner_name", "code", "date"];

    const objectKeyToIndo = (key) => {
        let keyIndo;
        const keySplit = key.split(".");
        const firstKey = keySplit[0];
        if (firstKey == "code") {
            keyIndo = "Kode";
        } else if (firstKey == "date") {
            keyIndo = "Tanggal Kesepakatan";
        } else if (firstKey == "partner_name") {
            keyIndo = "Lembaga";
        } else if (firstKey == "partner_pic") {
            keyIndo = "PIC";
        } else if (firstKey == "url_subdomain") {
            keyIndo = "Url Subdomain";
        } else if (firstKey == "price_card") {
            keyIndo = "Harga Kartu";
        } else if (firstKey == "price_lanyard") {
            keyIndo = "Harga Lanyard";
        } else if (firstKey == "price_subscription_system") {
            keyIndo = "Harga Langganan Sistem";
        } else if (firstKey == "period_subscription") {
            keyIndo = "Periode Langganan";
        } else if (firstKey == "price_training_offline") {
            keyIndo = "Harga Training Offline";
        } else if (firstKey == "price_training_online") {
            keyIndo = "Harga Training Online";
        } else if (firstKey == "fee_qris") {
            keyIndo = "Harga QRIS";
        } else if (firstKey == "fee_purchase_cazhpoin") {
            keyIndo = "Harga Pembelian Cazhpoin";
        } else if (firstKey == "fee_withdraw_cazhpos") {
            keyIndo = "Harga Penarikan Cazhpos";
        } else if (firstKey == "fee_bill_saldokartu") {
            keyIndo = "Harga Pembayaran Saldokartu";
        } else if (firstKey == "bank") {
            keyIndo = "Bank Lembaga";
        } else if (firstKey == "account_bank_number") {
            keyIndo = "No Rekening Lembaga";
        } else if (firstKey == "account_bank_name") {
            keyIndo = "Atas Nama Bank Lembaga";
        } else if (firstKey == "expired_date") {
            keyIndo = "Tanggal Kadaluarsa";
        } else if (firstKey == "profit_sharing") {
            keyIndo = "Bagi Hasil";
        } else if (firstKey == "profit_sharing_detail") {
            keyIndo = "Detail Bagi Hasil";
        } else if (firstKey == "signature_name") {
            keyIndo = "Tanda Tangan";
        }

        return keyIndo;
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

    if (preRenderLoad) {
        return <SkeletonDatatable auth={auth} />;
    }

    return (
        <DashboardLayout auth={auth.user} className="">
            <Toast ref={toast} />
            <PermissionErrorDialog
                dialogIsVisible={permissionErrorIsVisible}
                setDialogVisible={setPermissionErrorIsVisible}
            />
            <HeaderModule title="Mou">
                {permissions.includes("tambah mou") && (
                    <Link
                        href="/mou/create"
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
                                permissions.includes("edit mou") &&
                                selectedData.created_by.id == currentUser.id
                            ) {
                                router.get("/mou/" + selectedData.uuid);
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
                                permissions.includes("hapus mou") &&
                                selectedData.created_by.id == currentUser.id
                            ) {
                                confirmDeleteMou();
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
                <TabPanel header="Semua Mou">
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
                                accept={handleDeleteMOU}
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
                                                "dark:bg-transparent bg-transparent dark:text-gray-300",
                                            table: "dark:bg-transparent bg-white rounded-lg dark:text-gray-300",
                                            header: "",
                                        }}
                                        paginator
                                        filters={filters}
                                        rows={5}
                                        emptyMessage="Mou tidak ditemukan."
                                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                                        header={header}
                                        value={mous}
                                        globalFilterFields={globalFilterFields}
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
                                                    align="left"
                                                    className="dark:border-none bg-white"
                                                    headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                                ></Column>
                                            );
                                        })}
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
                            fetchUrl={"/api/mou/logs"}
                            filterUrl={"/mou/logs/filter"}
                            deleteUrl={"/mou/logs"}
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
                            fetchUrl={"/api/mou/arsip"}
                            forceDeleteUrl={"/mou/{id}/force"}
                            restoreUrl={"/mou/{id}/restore"}
                            filterUrl={"/mou/arsip/filter"}
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
