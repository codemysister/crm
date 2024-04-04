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
import { router, useForm } from "@inertiajs/react";
import {
    ConfirmDialog,
    ConfirmDialog as ConfirmDialog2,
    confirmDialog,
} from "primereact/confirmdialog";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { TabMenu } from "primereact/tabmenu";
import { TabPanel, TabView } from "primereact/tabview";
import { FilterMatchMode } from "primereact/api";
import { Sidebar } from "primereact/sidebar";
import { OverlayPanel } from "primereact/overlaypanel";
import InputError from "@/Components/InputError";
import SkeletonDatatable from "@/Components/SkeletonDatatable";
import getViewportSize from "@/Pages/Utils/getViewportSize";
import HeaderDatatable from "@/Components/HeaderDatatable";

const Index = ({ auth, partnersProp, usersProp }) => {
    const [partners, setPartners] = useState(partnersProp);
    const [users, setUsers] = useState(usersProp);
    const [priceLists, setPriceLists] = useState([]);
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const [confirmIsVisible, setConfirmIsVisible] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [sidebarFilter, setSidebarFilter] = useState(false);
    const viewportSize = getViewportSize();
    const isMobile = viewportSize.width < 992;
    const btnFilterRef = useRef(null);
    const toast = useRef(null);
    const action = useRef(null);
    const { roles, permissions } = auth.user;
    const [modalPriceListIsVisible, setModalPriceListIsVisible] =
        useState(false);
    const [modalEditPriceListIsVisible, setModalEditPriceListIsVisible] =
        useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const infoPriceTrainingOfflineRef = useRef(null);
    const infoPriceTrainingOnlineRef = useRef(null);
    const [visibleColumnsPriceList, setVisibleColumnsPriceList] = useState([
        { field: "price_lanyard", header: "Harga Lanyard" },
        {
            field: "price_subscription_system",
            header: "Harga Langganan Sistem",
        },
        {
            field: "price_training_offline",
            header: "Harga Training Offline",
        },
        { field: "price_training_online", header: "Harga Training Online" },
        {
            field: "fee_purchase_cazhpoin",
            header: "Fee Isi Kartu via CazhPOIN",
        },
        {
            field: "fee_bill_cazhpoin",
            header: "Fee Bayar Tagihan via CazhPOIN",
        },
        {
            field: "fee_topup_cazhpos",
            header: "Fee Topup Kartu via CazhPos",
        },
        {
            field: "fee_withdraw_cazhpos",
            header: "Fee Withdraw Kartu via Cazh POS",
        },
        {
            field: "fee_bill_saldokartu",
            header: "Fee Bayar Tagihan via Saldo Kartu",
        },
    ]);
    const columnsPriceList = [
        { field: "price_lanyard", header: "Harga Lanyard" },
        {
            field: "price_subscription_system",
            header: "Harga Langganan Sistem",
        },
        { field: "price_training_offline", header: "Harga Training Offline" },
        { field: "price_training_online", header: "Harga Training Online" },
        {
            field: "fee_purchase_cazhpoin",
            header: "Fee Isi Kartu via CazhPOIN",
        },
        {
            field: "fee_bill_cazhpoin",
            header: "Fee Bayar Tagihan via CazhPOIN",
        },
        { field: "fee_topup_cazhpos", header: "Fee Topup Kartu via CazhPos" },
        {
            field: "fee_withdraw_cazhpos",
            header: "Fee Withdraw Kartu via Cazh POS",
        },
        {
            field: "fee_bill_saldokartu",
            header: "Fee Bayar Tagihan via Saldo Kartu",
        },
    ];
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
        data: dataPriceList,
        setData: setDataPriceList,
        post: postPriceList,
        put: putPriceList,
        delete: destroyPriceList,
        reset: resetPriceList,
        processing: processingPriceList,
        errors: errorPriceList,
        clearErrors,
    } = useForm({
        uuid: "",
        partner: {},
        price_card: {
            price: "",
            type: "",
        },
        price_training_online: null,
        price_training_offline: null,
        price_lanyard: null,
        price_subscription_system: null,
        fee_purchase_cazhpoin: null,
        fee_bill_cazhpoin: null,
        fee_topup_cazhpos: null,
        fee_withdraw_cazhpos: null,
        fee_bill_saldokartu: null,
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
            await getPriceLists();
            setPreRenderLoad((prev) => (prev = false));
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (activeIndexTab == 0) {
            getPriceLists();
        }
    }, [activeIndexTab]);

    const getPriceLists = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/prices");
        let data = await response.json();

        setPriceLists((prev) => (prev = data));

        setIsLoadingData(false);
    };

    const confirmDeletePrice = (Price) => {
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

    let cardCategories = [{ type: "digital" }, { type: "cetak" }];

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

        const response = await axios.post("/prices/filter", formData, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
        });
        const data = response.data;
        setPriceLists(data);
        setSidebarFilter(false);
        setIsLoadingData(false);
    };

    const handleSelectedDetailPartner = (partner) => {
        router.get(`/partners?uuid=${partner.uuid}`);
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

    const exportExcel = () => {
        const exports = priceLists.map((data) => {
            return {
                Lembaga: data.partner ? data.partner.name : "-",
                Harga_Kartu: data.price_card
                    ? JSON.parse(data.price_card).price
                    : "-",
                Jenis_Kartu: data.price_card
                    ? JSON.parse(data.price_card).type
                    : "-",
                Harga_Lanyard: data.price_lanyard ? data.price_lanyard : "-",
                Harga_Langganan_Sistem: data.price_subscription_system
                    ? data.price_subscription_system
                    : "-",
                Harga_Training_Offline: data.price_training_offline
                    ? data.price_training_offline
                    : "-",
                Harga_Training_Online: data.price_training_online
                    ? data.price_training_online
                    : "-",
                Harga_Purchase_Cazhpoin: data.fee_purchase_cazhpoin
                    ? data.fee_purchase_cazhpoin
                    : "-",
                Harga_Tagihan_Cazhpoin: data.fee_bill_cazhpoin
                    ? data.fee_bill_cazhpoin
                    : "-",
                Harga_Topup_Cazhpos: data.fee_topup_cazhpos
                    ? data.fee_topup_cazhpos
                    : "-",
                Harga_Withdraw_Cazhpos: data.fee_withdraw_cazhpos
                    ? data.fee_withdraw_cazhpos
                    : "-",
                Harga_Tagihan_Saldokartu: data.fee_bill_saldokartu
                    ? data.fee_bill_saldokartu
                    : "-",
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

            saveAsExcelFile(excelBuffer, "Harga");
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

    const headerPriceList = (
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

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <i
                    className="pi pi-ellipsis-h pointer cursor-pointer"
                    onClick={(event) => {
                        setSelectedPrice(rowData);
                        action.current.toggle(event);
                    }}
                ></i>
            </React.Fragment>
        );
    };

    const handleSubmitFormPriceList = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            postPriceList("/prices", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalPriceListIsVisible((prev) => (prev = false));
                    getPriceLists();
                    resetPriceList();
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            putPriceList("/prices/" + dataPriceList.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditPriceListIsVisible((prev) => (prev = false));
                    getPriceLists();
                    resetPriceList();
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
    };

    const handleEditPriceList = (priceList) => {
        setDataPriceList((data) => ({
            ...data,
            uuid: priceList.uuid,
            partner: priceList.partner,
            price_card: JSON.parse(priceList.price_card),
            price_subscription_system: priceList.price_subscription_system,
            price_training_online: priceList.price_training_online,
            price_training_offline: priceList.price_training_offline,
            price_lanyard: priceList.price_lanyard,
            price_priceList_system: priceList.price_priceList_system,
            fee_purchase_cazhpoin: priceList.fee_purchase_cazhpoin,
            fee_bill_cazhpoin: priceList.fee_bill_cazhpoin,
            fee_topup_cazhpos: priceList.fee_topup_cazhpos,
            fee_withdraw_cazhpos: priceList.fee_withdraw_cazhpos,
            fee_bill_saldokartu: priceList.fee_bill_saldokartu,
        }));

        clearErrors();
        setModalEditPriceListIsVisible(true);
    };

    const handleDeletePrice = () => {
        destroyPriceList("/prices/" + selectedPrice.uuid, {
            onSuccess: () => {
                getPriceLists();
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
                            handleEditPriceList(selectedPrice);
                        }}
                    />
                    <Button
                        icon="pi pi-trash"
                        label="hapus"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            confirmDeletePrice();
                        }}
                    />
                </div>
            </OverlayPanel>

            <HeaderModule title="Harga">
                {permissions.includes("tambah akun") && (
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalPriceListIsVisible((prev) => (prev = true));
                            resetPriceList();
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
                <TabPanel header="Semua Harga">
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
                                accept={handleDeletePrice}
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
                                        emptyMessage="Price tidak ditemukan."
                                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                                        header={headerPriceList}
                                        globalFilterFields={[
                                            "name",
                                            "category",
                                        ]}
                                        value={priceLists}
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
                                            className="dark:border-none bg-white"
                                            headerClassName="dark:border-none bg-white dark:bg-transparent dark:text-gray-300"
                                            align="left"
                                            frozen={!isMobile}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>

                                        <Column
                                            header="Harga Kartu"
                                            body={(rowData) =>
                                                JSON.parse(
                                                    rowData.price_card
                                                ).price?.toLocaleString("id-ID")
                                                    ? JSON.parse(
                                                          rowData.price_card
                                                      ).price.toLocaleString(
                                                          "id-ID"
                                                      ) +
                                                      ` (${
                                                          JSON.parse(
                                                              rowData.price_card
                                                          ).type
                                                      })`
                                                    : "-"
                                            }
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            align="left"
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>

                                        {visibleColumnsPriceList.map((col) => (
                                            <Column
                                                key={col.field}
                                                style={{
                                                    width: "max-content",
                                                    whiteSpace: "nowrap",
                                                }}
                                                headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                                                field={col.field}
                                                header={col.header}
                                                body={(rowData) => {
                                                    return rowData[
                                                        col.field
                                                    ]?.toLocaleString("id-ID")
                                                        ? rowData[
                                                              col.field
                                                          ].toLocaleString(
                                                              "id-ID"
                                                          )
                                                        : "-";
                                                }}
                                            />
                                        ))}

                                        <Column
                                            header="Diinput Oleh"
                                            body={(rowData) => {
                                                return rowData.created_by.name;
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

            {/* Modal tambah harga */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Harga"
                    headerClassName="dark:glass dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                    contentClassName="dark:glass dark:text-white"
                    visible={modalPriceListIsVisible}
                    onHide={() => setModalPriceListIsVisible(false)}
                >
                    <form
                        onSubmit={(e) => handleSubmitFormPriceList(e, "tambah")}
                    >
                        <div className="flex flex-col justify-around gap-4 mt-1">
                            <div className="flex flex-col mt-3">
                                <label htmlFor="partner_subcription">
                                    Partner *
                                </label>
                                <Dropdown
                                    dataKey="name"
                                    optionLabel="name"
                                    value={dataPriceList.partner}
                                    onChange={(e) =>
                                        setDataPriceList(
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
                                    message={errorPriceList.partner}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Kartu *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={
                                                dataPriceList.price_card.price
                                            }
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    price_card: {
                                                        ...dataPriceList.price_card,
                                                        price: Number(
                                                            e.target.value
                                                        ),
                                                    },
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="account_bank_name"
                                            aria-describedby="account_bank_name-help"
                                            locale="id-ID"
                                        />
                                        <Dropdown
                                            dataKey="type"
                                            value={
                                                dataPriceList.price_card.type
                                            }
                                            onChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    price_card: {
                                                        ...dataPriceList.price_card,
                                                        type: e.target.value,
                                                    },
                                                })
                                            }
                                            options={cardCategories}
                                            optionLabel="type"
                                            optionValue="type"
                                            placeholder="kategori"
                                            className="w-full md:w-14rem"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={errorPriceList.price_card}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Lanyard *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={dataPriceList.price_lanyard}
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    price_lanyard: Number(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="lanyard"
                                            aria-describedby="lanyard-help"
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={errorPriceList.price_lanyard}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Langganan Sistem *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={
                                                dataPriceList.price_subscription_system
                                            }
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    price_subscription_system:
                                                        e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="account_bank_name"
                                            aria-describedby="account_bank_name-help"
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={
                                        errorPriceList.price_subscription_system
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Pelatihan Offline *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <div className="p-inputgroup flex-1 h-full">
                                            <InputNumber
                                                value={
                                                    dataPriceList.price_training_offline
                                                }
                                                onChange={(e) =>
                                                    setDataPriceList({
                                                        ...dataPriceList,
                                                        price_training_offline:
                                                            e.value,
                                                    })
                                                }
                                                className={`h-full`}
                                                locale="id-ID"
                                            />

                                            <Button
                                                type="button"
                                                className="h-[35px]"
                                                icon="pi pi-info-circle"
                                                onClick={(e) =>
                                                    infoPriceTrainingOfflineRef.current.toggle(
                                                        e
                                                    )
                                                }
                                            />
                                            <OverlayPanel
                                                className="shadow-md"
                                                id="overpanel-info"
                                                ref={
                                                    infoPriceTrainingOfflineRef
                                                }
                                            >
                                                <ul className="list-disc list-inside">
                                                    <li>Jawa - 15.000.000</li>
                                                    <li>
                                                        Kalimatan - 25.000.000
                                                    </li>
                                                    <li>
                                                        Sulawesi - 27.000.000
                                                    </li>
                                                    <li>
                                                        Sumatra - 23.000.000
                                                    </li>
                                                    <li>Bali - 26.000.000</li>
                                                    <li>
                                                        Jabodetabek - 15.000.000
                                                    </li>
                                                </ul>
                                            </OverlayPanel>
                                        </div>
                                    </div>
                                </div>
                                <InputError
                                    message={
                                        errorPriceList.price_training_offline
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Pelatihan Online *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <div className="p-inputgroup flex-1 h-full">
                                            <InputNumber
                                                value={
                                                    dataPriceList.price_training_online
                                                }
                                                onChange={(e) =>
                                                    setDataPriceList({
                                                        ...dataPriceList,
                                                        price_training_online:
                                                            e.value,
                                                    })
                                                }
                                                className={`h-full`}
                                                locale="id-ID"
                                            />

                                            <Button
                                                type="button"
                                                className="h-[35px]"
                                                icon="pi pi-info-circle"
                                                onClick={(e) =>
                                                    infoPriceTrainingOnlineRef.current.toggle(
                                                        e
                                                    )
                                                }
                                            />
                                            <OverlayPanel
                                                className="shadow-md"
                                                ref={infoPriceTrainingOnlineRef}
                                                id="overpanel-info"
                                            >
                                                <ul className="list-disc list-inside">
                                                    <li>
                                                        Harga Implementasi
                                                        Training dan/atau
                                                        sosialisasi secara
                                                        Daring/Online
                                                    </li>
                                                    <li>
                                                        Harga implementasi 3x
                                                        sesi training secara
                                                        gratis. (Harga yang di
                                                        imput adalah harga
                                                        training tambahan)
                                                    </li>
                                                </ul>
                                            </OverlayPanel>
                                        </div>
                                    </div>
                                </div>
                                <InputError
                                    message={
                                        errorPriceList.price_training_online
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Isi Kartu Via Cazhpoin *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={
                                                dataPriceList.fee_purchase_cazhpoin
                                            }
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    fee_purchase_cazhpoin:
                                                        Number(e.target.value),
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="lanyard"
                                            aria-describedby="lanyard-help"
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={
                                        errorPriceList.fee_purchase_cazhpoin
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Bayar Tagihan via CazhPOIN *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={
                                                dataPriceList.fee_bill_cazhpoin
                                            }
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    fee_bill_cazhpoin: Number(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="lanyard"
                                            aria-describedby="lanyard-help"
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={errorPriceList.fee_bill_cazhpoin}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga TopUp Kartu via Cazh POS *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={
                                                dataPriceList.fee_topup_cazhpos
                                            }
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    fee_topup_cazhpos: Number(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="lanyard"
                                            aria-describedby="lanyard-help"
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={errorPriceList.fee_topup_cazhpos}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Penarikan Saldo Kartu via Cazh POS *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={
                                                dataPriceList.fee_withdraw_cazhpos
                                            }
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    fee_withdraw_cazhpos:
                                                        Number(e.target.value),
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="lanyard"
                                            aria-describedby="lanyard-help"
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={
                                        errorPriceList.fee_withdraw_cazhpos
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Pembayaran Tagihan via Saldo Kartu *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={
                                                dataPriceList.fee_bill_saldokartu
                                            }
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    fee_bill_saldokartu: Number(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="lanyard"
                                            aria-describedby="lanyard-help"
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={errorPriceList.fee_bill_saldokartu}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-5">
                            <Button
                                label="Submit"
                                disabled={processingPriceList}
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>

            {/* Modal edit harga */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Harga"
                    headerClassName="dark:glass dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                    contentClassName="dark:glass dark:text-white"
                    visible={modalEditPriceListIsVisible}
                    onHide={() => setModalEditPriceListIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitFormPriceList(e)}>
                        <div className="flex flex-col justify-around gap-4 mt-1">
                            <div className="flex flex-col mt-3">
                                <label htmlFor="partner_subcription">
                                    Partner *
                                </label>
                                <Dropdown
                                    dataKey="name"
                                    optionLabel="name"
                                    value={dataPriceList.partner}
                                    onChange={(e) =>
                                        setDataPriceList(
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
                                    message={errorPriceList.partner}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Kartu *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={
                                                dataPriceList.price_card.price
                                            }
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    price_card: {
                                                        ...dataPriceList.price_card,
                                                        price: Number(
                                                            e.target.value
                                                        ),
                                                    },
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="account_bank_name"
                                            aria-describedby="account_bank_name-help"
                                            locale="id-ID"
                                        />
                                        <Dropdown
                                            dataKey="type"
                                            value={
                                                dataPriceList.price_card.type
                                            }
                                            onChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    price_card: {
                                                        ...dataPriceList.price_card,
                                                        type: e.target.value,
                                                    },
                                                })
                                            }
                                            options={cardCategories}
                                            optionValue="type"
                                            optionLabel="type"
                                            placeholder="kategori"
                                            className="w-full md:w-14rem"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={errorPriceList.price_card}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Lanyard *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={dataPriceList.price_lanyard}
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    price_lanyard: Number(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="lanyard"
                                            aria-describedby="lanyard-help"
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={errorPriceList.price_lanyard}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Langganan Sistem *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={
                                                dataPriceList.price_subscription_system
                                            }
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    price_subscription_system:
                                                        e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="account_bank_name"
                                            aria-describedby="account_bank_name-help"
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={
                                        errorPriceList.price_subscription_system
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Pelatihan Offline *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <div className="p-inputgroup flex-1 h-full">
                                            <InputNumber
                                                value={
                                                    dataPriceList.price_training_offline
                                                }
                                                onChange={(e) =>
                                                    setDataPriceList({
                                                        ...dataPriceList,
                                                        price_training_offline:
                                                            e.value,
                                                    })
                                                }
                                                className={`h-full`}
                                                locale="id-ID"
                                            />

                                            <Button
                                                type="button"
                                                className="h-[35px]"
                                                icon="pi pi-info-circle"
                                                onClick={(e) =>
                                                    infoPriceTrainingOfflineRef.current.toggle(
                                                        e
                                                    )
                                                }
                                            />
                                            <OverlayPanel
                                                className="shadow-md"
                                                id="overpanel-info"
                                                ref={
                                                    infoPriceTrainingOfflineRef
                                                }
                                            >
                                                <ul className="list-disc list-inside">
                                                    <li>Jawa - 15.000.000</li>
                                                    <li>
                                                        Kalimatan - 25.000.000
                                                    </li>
                                                    <li>
                                                        Sulawesi - 27.000.000
                                                    </li>
                                                    <li>
                                                        Sumatra - 23.000.000
                                                    </li>
                                                    <li>Bali - 26.000.000</li>
                                                    <li>
                                                        Jabodetabek - 15.000.000
                                                    </li>
                                                </ul>
                                            </OverlayPanel>
                                        </div>
                                    </div>
                                </div>
                                <InputError
                                    message={
                                        errorPriceList.price_training_offline
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Pelatihan Online *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <div className="p-inputgroup flex-1 h-full">
                                            <InputNumber
                                                value={
                                                    dataPriceList.price_training_online
                                                }
                                                onChange={(e) =>
                                                    setDataPriceList({
                                                        ...dataPriceList,
                                                        price_training_online:
                                                            e.value,
                                                    })
                                                }
                                                className={`h-full`}
                                                locale="id-ID"
                                            />

                                            <Button
                                                type="button"
                                                className="h-[35px]"
                                                icon="pi pi-info-circle"
                                                onClick={(e) =>
                                                    infoPriceTrainingOnlineRef.current.toggle(
                                                        e
                                                    )
                                                }
                                            />
                                            <OverlayPanel
                                                className="shadow-md"
                                                ref={infoPriceTrainingOnlineRef}
                                                id="overpanel-info"
                                            >
                                                <ul className="list-disc list-inside">
                                                    <li>
                                                        Harga Implementasi
                                                        Training dan/atau
                                                        sosialisasi secara
                                                        Daring/Online
                                                    </li>
                                                    <li>
                                                        Harga implementasi 3x
                                                        sesi training secara
                                                        gratis. (Harga yang di
                                                        imput adalah harga
                                                        training tambahan)
                                                    </li>
                                                </ul>
                                            </OverlayPanel>
                                        </div>
                                    </div>
                                </div>
                                <InputError
                                    message={
                                        errorPriceList.price_training_online
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Isi Kartu Via Cazhpoin *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={
                                                dataPriceList.fee_purchase_cazhpoin
                                            }
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    fee_purchase_cazhpoin:
                                                        Number(e.target.value),
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="lanyard"
                                            aria-describedby="lanyard-help"
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={
                                        errorPriceList.fee_purchase_cazhpoin
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Bayar Tagihan via CazhPOIN *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={
                                                dataPriceList.fee_bill_cazhpoin
                                            }
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    fee_bill_cazhpoin: Number(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="lanyard"
                                            aria-describedby="lanyard-help"
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={errorPriceList.fee_bill_cazhpoin}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga TopUp Kartu via Cazh POS *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={
                                                dataPriceList.fee_topup_cazhpos
                                            }
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    fee_topup_cazhpos: Number(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="lanyard"
                                            aria-describedby="lanyard-help"
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={errorPriceList.fee_topup_cazhpos}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Penarikan Saldo Kartu via Cazh POS *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={
                                                dataPriceList.fee_withdraw_cazhpos
                                            }
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    fee_withdraw_cazhpos:
                                                        Number(e.target.value),
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="lanyard"
                                            aria-describedby="lanyard-help"
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={
                                        errorPriceList.fee_withdraw_cazhpos
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Pembayaran Tagihan via Saldo Kartu *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={
                                                dataPriceList.fee_bill_saldokartu
                                            }
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    fee_bill_saldokartu: Number(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="lanyard"
                                            aria-describedby="lanyard-help"
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={errorPriceList.fee_bill_saldokartu}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-5">
                            <Button
                                label="Submit"
                                disabled={processingPriceList}
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
