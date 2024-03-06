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
import { InputTextarea } from "primereact/inputtextarea";
import { useForm } from "@inertiajs/react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Steps } from "primereact/steps";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Badge } from "primereact/badge";
import { TabMenu } from "primereact/tabmenu";
import { TabPanel, TabView } from "primereact/tabview";
import { Skeleton } from "primereact/skeleton";
import { FilterMatchMode } from "primereact/api";
import { SelectButton } from "primereact/selectbutton";
import { Menu } from "primereact/menu";
import { Fieldset } from "primereact/fieldset";
import { Tooltip } from "primereact/tooltip";
import { Card } from "primereact/card";
import { OverlayPanel } from "primereact/overlaypanel";
import { MultiSelect } from "primereact/multiselect";

const Account = ({
    partners,
    showSuccess,
    showError,
    handleSelectedDetailPartner,
}) => {
    const [accounts, setAccounts] = useState([]);
    const [modalAccountIsVisible, setModalAccountIsVisible] = useState(false);
    const [modalEditAccountIsVisible, setModalEditAccountIsVisible] =
        useState(false);
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

        let response = await fetch("/api/partners/accounts");
        let data = await response.json();

        setAccounts((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            await getAccounts();
        };

        fetchData();
    }, []);

    const {
        data: dataAccount,
        setData: setDataAccount,
        post: postAccount,
        put: putAccount,
        delete: destroyAccount,
        reset: resetAccount,
        processing: processingAccount,
        errors: errorAccount,
    } = useForm({
        uuid: "",
        partner: {},
        subdomain: "",
        email_super_admin: "",
        cas_link_partner: "",
        card_number: "",
    });

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

    const header = () => {
        return (
            <div className="flex flex-row justify-between gap-2 align-items-center items-end">
                <div>
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalAccountIsVisible((prev) => (prev = true));
                            resetAccount();
                        }}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                </div>
                <div className="w-[30%]">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search dark:text-white" />
                        <InputText
                            className="dark:bg-transparent dark:placeholder-white"
                            value={globalFilterValue}
                            onChange={onGlobalFilterChange}
                            placeholder="Keyword Search"
                        />
                    </span>
                </div>
            </div>
        );
    };

    const actionBodyTemplateAccount = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => handleEditAccount(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => {
                        handleDeleteAccount(rowData);
                    }}
                />
            </React.Fragment>
        );
    };

    const handleSubmitFormAccount = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            postAccount("/partners/accounts", {
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
            putAccount("/partners/accounts/" + dataAccount.uuid, {
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
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroyAccount("partners/accounts/" + account.uuid, {
                    onSuccess: () => {
                        getAccounts();
                        showSuccess("Hapus");
                    },
                    onError: () => {
                        showError("Hapus");
                    },
                });
            },
        });
    };

    return (
        <>
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
                        rows={5}
                        emptyMessage="Langganan partner tidak ditemukan."
                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                        header={header}
                        filters={filters}
                        globalFilterFields={[
                            "partner.name",
                            "account_bank_name",
                            "subdomain",
                            "email_super_admin",
                            "cas_link_partner",
                            "card_number",
                            "",
                        ]}
                        value={accounts}
                        dataKey="id"
                    >
                        <Column
                            header="No"
                            body={(_, { rowIndex }) => rowIndex + 1}
                            className="dark:border-none pl-6"
                            headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        />
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
                            field="uuid"
                            hidden
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Nama"
                            align="left"
                        ></Column>
                        <Column
                            field="subdomain"
                            header="Subdomain"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            field="email_super_admin"
                            header="Email Super Admin"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            field="cas_link_partner"
                            header="CAS Link Partner"
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
                            header="Nomor Kartu (8 digit)"
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            header="Action"
                            body={actionBodyTemplateAccount}
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                        ></Column>
                    </DataTable>
                </div>
            </div>
        </>
    );
};

export default Account;
