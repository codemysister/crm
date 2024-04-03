import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { router, useForm } from "@inertiajs/react";
import { FilterMatchMode } from "primereact/api";
import {
    ConfirmDialog,
    ConfirmDialog as ConfirmDialog2,
    confirmDialog,
} from "primereact/confirmdialog";
import InputError from "@/Components/InputError";
import DashboardLayout from "@/Layouts/DashboardLayout";
import getViewportSize from "@/Pages/Utils/getViewportSize";
import HeaderDatatable from "@/Components/HeaderDatatable";
import SkeletonDatatable from "@/Components/SkeletonDatatable";
import { useRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import HeaderModule from "@/Components/HeaderModule";
import { Toast } from "primereact/toast";
import { Sidebar } from "primereact/sidebar";
import { Calendar } from "primereact/calendar";
import { TabPanel, TabView } from "primereact/tabview";

const Index = ({ auth, partnersProp, usersProp }) => {
    const [partners, setPartners] = useState(partnersProp);
    const [users, setUsers] = useState(usersProp);
    const [banks, setBanks] = useState([]);
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const [confirmIsVisible, setConfirmIsVisible] = useState(false);
    const [selectedBank, setSelectedBank] = useState(null);
    const [modalBankIsVisible, setModalBankIsVisible] = useState(false);
    const [modalEditBankIsVisible, setModalEditBankIsVisible] = useState(false);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [sidebarFilter, setSidebarFilter] = useState(false);
    const viewportSize = getViewportSize();
    const isMobile = viewportSize.width < 992;
    const btnFilterRef = useRef(null);
    const toast = useRef(null);
    const action = useRef(null);
    const { roles, permissions } = auth.user;
    const [isLoadingData, setIsLoadingData] = useState(false);
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
        data: dataBank,
        setData: setDataBank,
        post: postBank,
        put: putBank,
        delete: destroyBank,
        reset: resetBank,
        processing: processingBank,
        errors: errorBank,
        clearErrors,
    } = useForm({
        uuid: null,
        partner: {},
        bank: null,
        account_bank_number: null,
        account_bank_name: null,
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
            setPreRenderLoad((prev) => (prev = false));
            await getBanks();
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (activeIndexTab == 0) {
            getBanks();
        }
    }, [activeIndexTab]);

    const confirmDeleteBank = () => {
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

    const getBanks = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/banks");
        let data = await response.json();

        setBanks((prev) => data);

        setIsLoadingData(false);
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

        const response = await axios.post("/banks/filter", formData, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
        });
        const data = response.data;
        setBanks(data);
        setSidebarFilter(false);
        setIsLoadingData(false);
    };
    const handleSelectedDetailPartner = (partner) => {
        router.get(`/partners?uuid=${partner.uuid}`);
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
        const exports = banks.map((data) => {
            return {
                Bank: data.bank,
                Lembaga: data.partner ? data.partner.name : "-",
                No_Rekening: data.account_bank_number
                    ? data.account_bank_number
                    : "-",
                Atas_Nama: data.account_bank_name
                    ? data.account_bank_name
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

            saveAsExcelFile(excelBuffer, "bank");
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

    const header = () => {
        return (
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
    };

    const handleEditBank = (bank) => {
        setDataBank((data) => ({ ...data, uuid: bank.uuid }));
        setDataBank((data) => ({ ...data, partner: bank.partner }));
        setDataBank((data) => ({ ...data, bank: bank.bank }));
        setDataBank((data) => ({
            ...data,
            account_bank_number: bank.account_bank_number,
        }));
        setDataBank((data) => ({
            ...data,
            account_bank_name: bank.account_bank_name,
        }));

        setModalEditBankIsVisible(true);
    };

    const handleSubmitFormBank = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            postBank("/banks", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalBankIsVisible((prev) => false);
                    getBanks();
                    resetBank(
                        "partner",
                        "bank",
                        "account_bank_number",
                        "account_bank_name"
                    );
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            putBank("/banks/" + dataBank.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditBankIsVisible((prev) => false);
                    getBanks();
                    resetBank(
                        "partner",
                        "bank",
                        "account_bank_number",
                        "account_bank_name"
                    );
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <i
                    className="pi pi-ellipsis-h pointer cursor-pointer"
                    onClick={(event) => {
                        setSelectedBank(rowData);
                        action.current.toggle(event);
                    }}
                ></i>
            </React.Fragment>
        );
    };

    const handleDeleteBank = (bank) => {
        destroyBank("/banks/" + selectedBank.uuid, {
            onSuccess: () => {
                getBanks();
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
                            handleEditBank(selectedBank);
                        }}
                    />
                    <Button
                        icon="pi pi-trash"
                        label="hapus"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            confirmDeleteBank();
                        }}
                    />
                </div>
            </OverlayPanel>

            <HeaderModule title="Bank">
                {permissions.includes("tambah bank") && (
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalBankIsVisible((prev) => (prev = true));
                            reset();
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
                <TabPanel header="Semua Bank">
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
                                accept={handleDeleteBank}
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
                                        emptyMessage="Bank tidak ditemukan."
                                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                                        header={header}
                                        globalFilterFields={[
                                            "name",
                                            "category",
                                        ]}
                                        value={banks}
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
                                            field="bank"
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            header="Bank"
                                            align="left"
                                            frozen={!isMobile}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>
                                        <Column
                                            field="uuid"
                                            hidden
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            header="Nama"
                                            align="left"
                                        ></Column>

                                        <Column
                                            field="account_bank_number"
                                            header="Nomor Rekening"
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            align="left"
                                            body={(rowData) => {
                                                return (
                                                    rowData.account_bank_number ??
                                                    "-"
                                                );
                                            }}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>
                                        <Column
                                            field="account_bank_name"
                                            header="Atas Nama"
                                            body={(rowData) => {
                                                return (
                                                    rowData.account_bank_name ??
                                                    "-"
                                                );
                                            }}
                                            className="dark:border-none"
                                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
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

            {/* Modal tambah bank */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Bank"
                    headerClassName="dark:glass dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                    contentClassName="dark:glass dark:text-white"
                    visible={modalBankIsVisible}
                    onHide={() => setModalBankIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitFormBank(e, "tambah")}>
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="partner_subcription">
                                    Partner
                                </label>
                                <Dropdown
                                    dataKey="name"
                                    optionLabel="name"
                                    value={dataBank.partner}
                                    onChange={(e) =>
                                        setDataBank("partner", e.target.value)
                                    }
                                    options={partners}
                                    placeholder="Pilih Lembaga"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                                <InputError
                                    message={errorBank.partner}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="bank">Bank</label>
                                <InputText
                                    value={dataBank.bank}
                                    onChange={(e) =>
                                        setDataBank("bank", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="bank"
                                    aria-describedby="bank-help"
                                />
                                <InputError
                                    message={errorBank.bank}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="account_bank_number">
                                    Nomor Rekening
                                </label>
                                <InputText
                                    value={dataBank.account_bank_number}
                                    onChange={(e) =>
                                        setDataBank(
                                            "account_bank_number",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="account_bank_number"
                                    aria-describedby="account_bank_number-help"
                                />
                                <InputError
                                    message={errorBank.account_bank_number}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="account_bank_name">
                                    Atas Nama
                                </label>
                                <InputText
                                    value={dataBank.account_bank_name}
                                    onChange={(e) =>
                                        setDataBank(
                                            "account_bank_name",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="account_bank_name"
                                    aria-describedby="account_bank_name-help"
                                />
                                <InputError
                                    message={errorBank.account_bank_name}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-5">
                            <Button
                                label="Submit"
                                disabled={processingBank}
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>

            {/* Modal edit bank */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Bank"
                    headerClassName="dark:glass dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                    contentClassName="dark:glass dark:text-white"
                    visible={modalEditBankIsVisible}
                    onHide={() => setModalEditBankIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitFormBank(e, "update")}>
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="partner_subcription">
                                    Partner
                                </label>
                                <Dropdown
                                    dataKey="name"
                                    optionLabel="name"
                                    value={dataBank.partner}
                                    onChange={(e) =>
                                        setDataBank("partner", e.target.value)
                                    }
                                    options={partners}
                                    placeholder="Pilih Partner"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                                <InputError
                                    message={errorBank.partner}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="bank">Bank</label>
                                <InputText
                                    value={dataBank.bank}
                                    onChange={(e) =>
                                        setDataBank("bank", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="bank"
                                    aria-describedby="bank-help"
                                />
                                <InputError
                                    message={errorBank.bank}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="account_bank_number">
                                    Nomor Rekening
                                </label>
                                <InputText
                                    value={dataBank.account_bank_number}
                                    onChange={(e) =>
                                        setDataBank(
                                            "account_bank_number",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="account_bank_number"
                                    aria-describedby="account_bank_number-help"
                                />
                                <InputError
                                    message={errorBank.account_bank_number}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="account_bank_name">
                                    Atas Nama
                                </label>
                                <InputText
                                    value={dataBank.account_bank_name}
                                    onChange={(e) =>
                                        setDataBank(
                                            "account_bank_name",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="account_bank_name"
                                    aria-describedby="account_bank_name-help"
                                />
                                <InputError
                                    message={errorBank.account_bank_name}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-5">
                            <Button
                                label="Submit"
                                disabled={processingBank}
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
