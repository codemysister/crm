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
import { FilterMatchMode } from "primereact/api";
import InputError from "@/Components/InputError";
import getViewportSize from "@/Utils/getViewportSize";
import HeaderDatatable from "@/Components/HeaderDatatable";
import SkeletonDatatable from "@/Components/SkeletonDatatable";
import { Sidebar } from "primereact/sidebar";
import { OverlayPanel } from "primereact/overlaypanel";
import { Calendar } from "primereact/calendar";
import { TabPanel, TabView } from "primereact/tabview";

const Index = ({ auth, partnersProp, usersProp }) => {
    const [partners, setPartners] = useState(partnersProp);
    const [users, setUsers] = useState(usersProp);
    const [accounts, setAccounts] = useState([]);
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const [confirmIsVisible, setConfirmIsVisible] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [modalAccountIsVisible, setModalAccountIsVisible] = useState(false);
    const [modalEditAccountIsVisible, setModalEditAccountIsVisible] =
        useState(false);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [sidebarFilter, setSidebarFilter] = useState(false);
    const viewportSize = getViewportSize();
    const isMobile = viewportSize.width < 992;
    const btnFilterRef = useRef(null);
    const toast = useRef(null);
    const action = useRef(null);
    const { roles, permissions } = auth.user;
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const getAccounts = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/accounts");
        let data = await response.json();

        setAccounts((prev) => data);

        setIsLoadingData(false);
    };

    const {
        data: dataAccount,
        setData: setDataAccount,
        post: postAccount,
        put: putAccount,
        delete: destroyAccount,
        reset: resetAccount,
        processing: processingAccount,
        errors: errorAccount,
        clearErrors: clearErrorsAccount,
    } = useForm({
        uuid: "",
        partner: {},
        subdomain: "",
        email_super_admin: "",
        cas_link_partner: "",
        card_number: "",
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
            await getAccounts();
            setPreRenderLoad((prev) => (prev = false));
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (activeIndexTab == 0) {
            getAccounts();
        }
    }, [activeIndexTab]);

    const confirmDeleteAccount = (Account) => {
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

        const response = await axios.post("/accounts/filter", formData, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
        });
        const data = response.data;
        setAccounts(data);
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
        const exports = accounts.map((data) => {
            return {
                Lembaga: data.partner ? data.partner.name : "-",
                Subdomain: data.subdomain ? data.subdomain : "-",
                Email_Super_Admin: data.email_super_admin
                    ? data.email_super_admin
                    : "-",
                Cas_Link_Partner: data.cas_link_partner
                    ? data.cas_link_partner
                    : "-",
                Nomor_Kartu: data.card_number ? data.card_number : "-",
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

            saveAsExcelFile(excelBuffer, "Akun");
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

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <i
                    className="pi pi-ellipsis-h pointer cursor-pointer"
                    onClick={(event) => {
                        setSelectedAccount(rowData);
                        action.current.toggle(event);
                    }}
                ></i>
            </React.Fragment>
        );
    };

    const handleSubmitFormAccount = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            postAccount("/accounts", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalAccountIsVisible((prev) => false);
                    getAccounts();
                    resetAccount();
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            putAccount("/accounts/" + dataAccount.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditAccountIsVisible((prev) => false);
                    getAccounts();
                    resetAccount();
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
    };

    const handleEditAccount = (account) => {
        clearErrorsAccount();
        setDataAccount((data) => ({
            ...data,
            uuid: account.uuid,
            partner: account.partner,
            subdomain: account.subdomain,
            email_super_admin: account.email_super_admin,
            cas_link_partner: account.cas_link_partner,
            card_number: account.card_number,
        }));

        setModalEditAccountIsVisible(true);
    };

    const handleDeleteAccount = (account) => {
        destroyAccount("/accounts/" + account.uuid, {
            onSuccess: () => {
                getAccounts();
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
                            handleEditAccount(selectedAccount);
                        }}
                    />
                    <Button
                        icon="pi pi-trash"
                        label="hapus"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            confirmDeleteAccount();
                        }}
                    />
                </div>
            </OverlayPanel>

            <HeaderModule title="Akun">
                {permissions.includes("tambah akun") && (
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalAccountIsVisible((prev) => (prev = true));
                            resetAccount();
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
                <TabPanel header="Semua Account">
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
                                accept={handleDeleteAccount}
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
                                        emptyMessage="Account tidak ditemukan."
                                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                                        header={header}
                                        globalFilterFields={[
                                            "name",
                                            "category",
                                        ]}
                                        value={accounts}
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
                                            field="subdomain"
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            header="Subdomain"
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
                                            field="email_super_admin"
                                            header="Email Super Admin"
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            align="left"
                                            body={(rowData) => {
                                                return (
                                                    rowData.email_super_admin ??
                                                    "-"
                                                );
                                            }}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>
                                        <Column
                                            field="cas_link_partner"
                                            header="CAS Link Partner"
                                            body={(rowData) => {
                                                return (
                                                    rowData.cas_link_partner ??
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
                                        <Column
                                            field="card_number"
                                            header="Nomor Kartu"
                                            body={(rowData) => {
                                                return (
                                                    rowData.card_number ?? "-"
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

            {/* Modal tambah akun */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Akun"
                    headerClassName="dark:glass dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                    contentClassName="dark:glass dark:text-white"
                    visible={modalAccountIsVisible}
                    onHide={() => setModalAccountIsVisible(false)}
                >
                    <form
                        onSubmit={(e) => handleSubmitFormAccount(e, "tambah")}
                    >
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="partner_subcription">
                                    Partner
                                </label>
                                <Dropdown
                                    dataKey="name"
                                    optionLabel="name"
                                    value={dataAccount.partner}
                                    onChange={(e) =>
                                        setDataAccount(
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
                                    message={errorAccount.partner}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="subdomain">Subdomain</label>
                                <InputText
                                    value={dataAccount.subdomain}
                                    onChange={(e) =>
                                        setDataAccount(
                                            "subdomain",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="subdomain"
                                    aria-describedby="subdomain-help"
                                />
                                <InputError
                                    message={errorAccount.subdomain}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="email_super_admin">
                                    Email Super Admin
                                </label>
                                <InputText
                                    value={dataAccount.email_super_admin}
                                    onChange={(e) =>
                                        setDataAccount(
                                            "email_super_admin",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="email_super_admin"
                                    aria-describedby="email_super_admin-help"
                                />
                                <InputError
                                    message={errorAccount.email_super_admin}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="cars_link_partner">
                                    CAS link partner
                                </label>
                                <InputText
                                    value={dataAccount.cas_link_partner}
                                    onChange={(e) =>
                                        setDataAccount(
                                            "cas_link_partner",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="cars_link_partner"
                                    aria-describedby="cars_link_partner-help"
                                />
                                <InputError
                                    message={errorAccount.cas_link_partner}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="card_number">
                                    Nomor Kartu (8 digit)
                                </label>
                                <InputText
                                    value={dataAccount.card_number}
                                    onChange={(e) =>
                                        setDataAccount(
                                            "card_number",
                                            e.target.value
                                        )
                                    }
                                    keyfilter="int"
                                    className="dark:bg-gray-300"
                                    id="card_number"
                                    aria-describedby="card_number-help"
                                />
                                <InputError
                                    message={errorAccount.card_number}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-5">
                            <Button
                                label="Submit"
                                disabled={processingAccount}
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>

            {/* Modal edit akun */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Akun"
                    headerClassName="dark:glass dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                    contentClassName="dark:glass dark:text-white"
                    visible={modalEditAccountIsVisible}
                    onHide={() => setModalEditAccountIsVisible(false)}
                >
                    <form
                        onSubmit={(e) => handleSubmitFormAccount(e, "update")}
                    >
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="partner_subcription">
                                    Partner
                                </label>
                                <Dropdown
                                    dataKey="name"
                                    optionLabel="name"
                                    value={dataAccount.partner}
                                    onChange={(e) =>
                                        setDataAccount(
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
                                    message={errorAccount.partner}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="subdomain">Subdomain</label>
                                <InputText
                                    value={dataAccount.subdomain}
                                    onChange={(e) =>
                                        setDataAccount(
                                            "subdomain",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="subdomain"
                                    aria-describedby="subdomain-help"
                                />
                                <InputError
                                    message={errorAccount.subdomain}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="email_super_admin">
                                    Email Super Admin
                                </label>
                                <InputText
                                    value={dataAccount.email_super_admin}
                                    onChange={(e) =>
                                        setDataAccount(
                                            "email_super_admin",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="email_super_admin"
                                    aria-describedby="email_super_admin-help"
                                />
                                <InputError
                                    message={errorAccount.email_super_admin}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="cars_link_partner">
                                    CAS link partner
                                </label>
                                <InputText
                                    value={dataAccount.cas_link_partner}
                                    onChange={(e) =>
                                        setDataAccount(
                                            "cas_link_partner",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="cars_link_partner"
                                    aria-describedby="cars_link_partner-help"
                                />
                                <InputError
                                    message={errorAccount.cas_link_partner}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="card_number">
                                    Nomor Kartu (8 digit)
                                </label>
                                <InputText
                                    value={dataAccount.card_number}
                                    onChange={(e) =>
                                        setDataAccount(
                                            "card_number",
                                            e.target.value
                                        )
                                    }
                                    keyfilter="int"
                                    className="dark:bg-gray-300"
                                    id="card_number"
                                    aria-describedby="card_number-help"
                                />
                                <InputError
                                    message={errorAccount.card_number}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-5">
                            <Button
                                label="Submit"
                                disabled={processingAccount}
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
