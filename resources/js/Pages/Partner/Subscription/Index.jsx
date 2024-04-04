import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import DashboardLayout from "@/Layouts/DashboardLayout";
import HeaderModule from "@/Components/HeaderModule";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useForm } from "@inertiajs/react";
import {
    ConfirmDialog,
    ConfirmDialog as ConfirmDialog2,
    confirmDialog,
} from "primereact/confirmdialog";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Badge } from "primereact/badge";
import { TabMenu } from "primereact/tabmenu";
import { TabPanel, TabView } from "primereact/tabview";
import { FilterMatchMode } from "primereact/api";

import InputError from "@/Components/InputError";
import getViewportSize from "@/Pages/Utils/getViewportSize";
import SkeletonDatatable from "@/Components/SkeletonDatatable";
import { Sidebar } from "primereact/sidebar";
import HeaderDatatable from "@/Components/HeaderDatatable";
import { OverlayPanel } from "primereact/overlaypanel";

const Index = ({ auth, partnersProp, usersProp }) => {
    const [partners, setPartners] = useState(partnersProp);
    const [users, setUsers] = useState(usersProp);
    const [subscriptions, setSubscriptions] = useState([]);
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const [confirmIsVisible, setConfirmIsVisible] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [sidebarFilter, setSidebarFilter] = useState(false);
    const viewportSize = getViewportSize();
    const isMobile = viewportSize.width < 992;
    const btnFilterRef = useRef(null);
    const toast = useRef(null);
    const action = useRef(null);
    const { roles, permissions } = auth.user;
    const [modalSubscriptionIsVisible, setModalSubscriptionIsVisible] =
        useState(false);
    const [modalEditSubscriptionIsVisible, setModalEditSubscriptionIsVisible] =
        useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const infoPriceTrainingOnlineRef = useRef(null);

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

    const {
        data: dataSubscription,
        setData: setDataSubscription,
        post: postSubscription,
        put: putSubscription,
        delete: destroySubscription,
        reset: resetSubscription,
        processing: processingSubscription,
        errors: errorSubscription,
    } = useForm({
        uuid: "",
        partner: {},
        bill: null,
        nominal: 0,
        ppn: 0,
        total_ppn: 0,
        total_bill: 0,
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
            await getSubscriptions();
            setPreRenderLoad((prev) => (prev = false));
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (activeIndexTab == 0) {
            getSubscriptions();
        }
    }, [activeIndexTab]);

    const getSubscriptions = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/subscriptions");
        let data = await response.json();

        setSubscriptions((prev) => data);

        setIsLoadingData(false);
    };

    const confirmDeleteSubscription = (Subscription) => {
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

    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
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

        const response = await axios.post("/subscriptions/filter", formData, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
        });
        const data = response.data;
        setSubscriptions(data);
        setSidebarFilter(false);
        setIsLoadingData(false);
    };

    const exportExcel = () => {
        const exports = subscriptions.map((data) => {
            return {
                Lembaga: data.partner ? data.partner.name : "-",
                Tagihan: data.bill ? data.bill : "-",
                Nominal: data.nominal ? data.nominal : "-",
                Pajak: data.ppn ? data.ppn : "-",
                Jumlah_Pajak: data.total_ppn ? data.total_ppn : "-",
                Jumlah_Tagihan: data.total_bill ? data.total_bill : "-",
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

            saveAsExcelFile(excelBuffer, "Langganan");
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

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <i
                    className="pi pi-ellipsis-h pointer cursor-pointer"
                    onClick={(event) => {
                        setSelectedSubscription(rowData);
                        action.current.toggle(event);
                    }}
                ></i>
            </React.Fragment>
        );
    };

    const headerSubscription = (
        <HeaderDatatable
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
        >
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

    const handleSubmitFormSubscription = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            postSubscription("/subscriptions", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalSubscriptionIsVisible((prev) => (prev = false));
                    getSubscriptions();
                    resetSubscription();
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            putSubscription("/subscriptions/" + dataSubscription.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditSubscriptionIsVisible((prev) => (prev = false));
                    getSubscriptions();
                    resetSubscription();
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
    };

    const handleEditSubscription = (subscription) => {
        setDataSubscription((data) => ({
            ...data,
            uuid: subscription.uuid,
            partner: subscription.partner,
            bill: subscription.bill,
            nominal: subscription.nominal,
            ppn: subscription.ppn,
            total_ppn: subscription.total_ppn,
            total_bill: subscription.total_bill,
        }));

        setModalEditSubscriptionIsVisible(true);
    };

    const handleDeleteSubscription = (subscription) => {
        destroySubscription("/subscriptions/" + subscription.uuid, {
            onSuccess: () => {
                getSubscriptions();
                showSuccess("Hapus");
            },
            onError: () => {
                showError("Hapus");
            },
        });
    };

    if (preRenderLoad) {
        return <SkeletonDatatable auth={auth} />;
    }

    return (
        <DashboardLayout auth={auth.user}>
            {/* Tombol Aksi */}
            <OverlayPanel
                className=" shadow-md p-1 dark:bg-slate-900 dark:text-gray-300"
                ref={action}
            >
                <div className="flex flex-col flex-wrap w-full">
                    <Button
                        icon="pi pi-pencil"
                        label="edit"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            handleEditSubscription(selectedSubscription);
                        }}
                    />
                    <Button
                        icon="pi pi-trash"
                        label="hapus"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            confirmDeleteSubscription();
                        }}
                    />
                </div>
            </OverlayPanel>

            <HeaderModule title="Langganan">
                {permissions.includes("tambah langganan") && (
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalSubscriptionIsVisible(
                                (prev) => (prev = true)
                            );
                            resetSubscription();
                            clearErrors();
                        }}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                )}
            </HeaderModule>

            <Toast ref={toast} />

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

            <TabView
                activeIndex={activeIndexTab}
                onTabChange={(e) => {
                    setActiveIndexTab(e.index);
                }}
                className="mt-2"
            >
                <TabPanel header="Semua Langganan">
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
                                accept={handleDeleteSubscription}
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
                                        header={headerSubscription}
                                        emptyMessage="Langganan tidak ditemukan."
                                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                                        globalFilterFields={["partner.name"]}
                                        value={subscriptions}
                                        dataKey="id"
                                        scrollable
                                    >
                                        <Column
                                            header="Aksi"
                                            body={actionBodyTemplate}
                                            frozen
                                            style={
                                                !isMobile
                                                    ? {
                                                          width: "max-content",
                                                          whiteSpace: "nowrap",
                                                      }
                                                    : null
                                            }
                                            className="dark:border-none lg:w-max bg-white lg:whitespace-nowrap text-center"
                                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300 text-center"
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
                                            header="Partner"
                                            body={(rowData) => (
                                                <button
                                                    onClick={() =>
                                                        handleSelectedDetailPartner(
                                                            rowData.partner
                                                        )
                                                    }
                                                    className="hover:text-blue-700"
                                                >
                                                    {rowData.partner.name}
                                                </button>
                                            )}
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            align="left"
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>

                                        <Column
                                            header="Tagihan"
                                            body={(rowData) => {
                                                return rowData.bill ?? "-";
                                            }}
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            align="left"
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>

                                        <Column
                                            header="Nominal"
                                            body={(rowData) => {
                                                return (
                                                    "Rp " +
                                                    rowData.nominal?.toLocaleString(
                                                        "id-ID"
                                                    )
                                                );
                                            }}
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            align="left"
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>

                                        <Column
                                            header="Pajak"
                                            body={(rowData) => {
                                                return (
                                                    rowData.ppn + "%" ??
                                                    "tidak ada"
                                                );
                                            }}
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            align="left"
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>

                                        <Column
                                            header="Jumlah Pajak"
                                            body={(rowData) => {
                                                return (
                                                    "Rp " +
                                                        rowData.total_ppn.toLocaleString(
                                                            "id-ID"
                                                        ) ?? "tidak ada"
                                                );
                                            }}
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            align="left"
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>

                                        <Column
                                            header="Total Tagihan"
                                            body={(rowData) => {
                                                return (
                                                    "Rp " +
                                                    rowData.total_bill.toLocaleString(
                                                        "id-ID"
                                                    )
                                                );
                                            }}
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            align="left"
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
                        <Log
                            auth={auth}
                            users={users}
                            showSuccess={showSuccess}
                            showError={showError}
                        />
                    )}
                </TabPanel>

                <TabPanel header="Arsip">
                    {activeIndexTab == 2 && (
                        <Arsip
                            auth={auth}
                            handleSelectedDetailPartner={
                                handleSelectedDetailPartner
                            }
                            showSuccess={showSuccess}
                            showError={showError}
                        />
                    )}
                </TabPanel>
            </TabView>

            {/* Modal tambah langganan */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Langganan"
                    headerClassName="dark:glass dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                    contentClassName="dark:glass dark:text-white"
                    visible={modalSubscriptionIsVisible}
                    onHide={() => setModalSubscriptionIsVisible(false)}
                >
                    <form
                        onSubmit={(e) =>
                            handleSubmitFormSubscription(e, "tambah")
                        }
                    >
                        <div className="flex flex-col justify-around gap-4 mt-1">
                            <div className="flex flex-col mt-3">
                                <label htmlFor="partner_subcription">
                                    Partner
                                </label>
                                <Dropdown
                                    optionLabel="name"
                                    value={dataSubscription.partner}
                                    onChange={(e) =>
                                        setDataSubscription(
                                            "partner",
                                            e.target.value
                                        )
                                    }
                                    options={partners}
                                    placeholder="Pilih Partner"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                                <InputError
                                    message={errorSubscription.partner}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="bill">Tagihan *</label>

                                <InputText
                                    value={dataSubscription.bill}
                                    onChange={(e) =>
                                        setDataSubscription(
                                            "bill",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="bill"
                                    aria-describedby="bill-help"
                                />
                                <InputError
                                    message={errorSubscription.bill}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="nominal">
                                    Nominal Langganan *
                                </label>
                                <InputNumber
                                    value={dataSubscription.nominal}
                                    onChange={(e) => {
                                        const total_bill =
                                            (e.value * dataSubscription.ppn) /
                                            100;
                                        setDataSubscription({
                                            ...dataSubscription,
                                            nominal: e.value,
                                            total_ppn: total_bill,
                                            total_bill:
                                                dataSubscription.ppn === 0
                                                    ? e.value
                                                    : total_bill,
                                        });
                                    }}
                                    locale="id-ID"
                                />
                                <InputError
                                    message={errorSubscription.nominal}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="ppn">PPN(%)</label>
                                <InputNumber
                                    value={dataSubscription.ppn}
                                    onChange={(e) => {
                                        const total_ppn =
                                            (e.value *
                                                dataSubscription.nominal) /
                                            100;
                                        setDataSubscription({
                                            ...dataSubscription,
                                            ppn: e.value,
                                            total_ppn: total_ppn,
                                            total_bill:
                                                dataSubscription.nominal +
                                                total_ppn,
                                        });
                                    }}
                                    locale="id-ID"
                                />
                                <InputError
                                    message={errorSubscription.ppn}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="ppn">Jumlah Pajak</label>
                                <InputNumber
                                    value={dataSubscription.total_ppn}
                                    onChange={(e) => {
                                        setDataSubscription({
                                            ...dataSubscription,
                                            total_ppn: e.value,
                                        });
                                    }}
                                    locale="id-ID"
                                />
                                <InputError
                                    message={errorSubscription.total_ppn}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="ppn">
                                    Total Tagihan(nominal + pajak)
                                </label>
                                <InputNumber
                                    value={dataSubscription.total_bill}
                                    onChange={(e) => {
                                        setDataSubscription({
                                            ...dataSubscription,
                                            total_bill: e.value,
                                        });
                                    }}
                                    locale="id-ID"
                                />
                                <InputError
                                    message={errorSubscription.total_bill}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-5">
                            <Button
                                label="Submit"
                                disabled={processingSubscription}
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>

            {/* Modal edit langganan */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Langganan"
                    headerClassName="dark:glass dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                    contentClassName="dark:glass dark:text-white"
                    visible={modalEditSubscriptionIsVisible}
                    onHide={() => setModalEditSubscriptionIsVisible(false)}
                >
                    <form
                        onSubmit={(e) =>
                            handleSubmitFormSubscription(e, "update")
                        }
                    >
                        <div className="flex flex-col justify-around gap-4 mt-1">
                            <div className="flex flex-col mt-3">
                                <label htmlFor="bill">Tagihan *</label>

                                <InputText
                                    value={dataSubscription.bill}
                                    onChange={(e) =>
                                        setDataSubscription(
                                            "bill",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="bill"
                                    aria-describedby="bill-help"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="nominal">
                                    Nominal Langganan *
                                </label>
                                <InputNumber
                                    value={dataSubscription.nominal}
                                    onChange={(e) => {
                                        const total_bill =
                                            (e.value * dataSubscription.ppn) /
                                            100;
                                        console.log(total_bill);
                                        setDataSubscription({
                                            ...dataSubscription,
                                            nominal: e.value,
                                            total_ppn: total_bill,
                                            total_bill:
                                                dataSubscription.ppn === 0
                                                    ? e.value
                                                    : e.value + total_bill,
                                        });
                                    }}
                                    locale="id-ID"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="ppn">PPN(%)</label>
                                <InputNumber
                                    value={dataSubscription.ppn}
                                    onChange={(e) => {
                                        const total_ppn =
                                            (e.value *
                                                dataSubscription.nominal) /
                                            100;
                                        setDataSubscription({
                                            ...dataSubscription,
                                            ppn: e.value,
                                            total_ppn: total_ppn,
                                            total_bill:
                                                dataSubscription.nominal +
                                                total_ppn,
                                        });
                                    }}
                                    locale="id-ID"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="ppn">Jumlah Pajak</label>
                                <InputNumber
                                    value={dataSubscription.total_ppn}
                                    onChange={(e) => {
                                        setDataSubscription({
                                            ...dataSubscription,
                                            total_ppn: e.value,
                                        });
                                    }}
                                    locale="id-ID"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="ppn">
                                    Total Tagihan(nominal + pajak)
                                </label>
                                <InputNumber
                                    value={dataSubscription.total_bill}
                                    onChange={(e) => {
                                        setDataSubscription({
                                            ...dataSubscription,
                                            total_bill: e.value,
                                        });
                                    }}
                                    locale="id-ID"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-5">
                            <Button
                                label="Submit"
                                disabled={processingSubscription}
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default Index;
