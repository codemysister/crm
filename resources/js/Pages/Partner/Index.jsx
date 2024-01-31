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

export default function Index({ auth }) {
    const [partners, setPartners] = useState("");
    const [pics, setPics] = useState("");
    const [sales, setSales] = useState("");
    const [banks, setBanks] = useState("");
    const [subscriptions, setSubscriptions] = useState("");
    const [account_managers, setAccountManagers] = useState("");
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [modalPartnersIsVisible, setModalPartnersIsVisible] = useState(false);
    const [modalEditPartnersIsVisible, setModalEditPartnersIsVisible] =
        useState(false);
    const [modalPicIsVisible, setModalPicIsVisible] = useState(false);
    const [modalEditPicIsVisible, setModalEditPicIsVisible] = useState(false);
    const [modalBankIsVisible, setModalBankIsVisible] = useState(false);
    const [modalEditBankIsVisible, setModalEditBankIsVisible] = useState(false);
    const [modalSubscriptionIsVisible, setModalSubscriptionIsVisible] =
        useState(false);
    const [modalEditSubscriptionIsVisible, setModalEditSubscriptionIsVisible] =
        useState(false);
    const toast = useRef(null);
    const btnSubmit = useRef(null);
    const modalPartner = useRef(null);
    const infoPriceTrainingOnlineRef = useRef(null);
    const { roles, permissions } = auth.user;
    const [activeIndex, setActiveIndex] = useState(0);
    const dummyArray = Array.from({ length: 5 }, (v, i) => i);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [inputPriceCard, setInputPriceCard] = useState(false);
    const [inputPriceLanyard, setInputPriceLanyard] = useState(false);
    const [inputPriceSubscriptionSystem, setInputPriceSubscriptionSystem] =
        useState(false);
    const [inputPriceTrainingOffline, setInputPriceTrainingOffline] =
        useState(false);
    const [inputPriceTrainingOnline, setInputPriceTrainingOnline] =
        useState(false);
    const [inputFeePurchaseCazhpoin, setInputFeePurchaseCazhpoin] =
        useState(false);
    const [inputFeeBillCazhpoin, setInputFeeBillCazhpoin] = useState(false);
    const [inputFeeTopupCazhpos, setInputFeeTopupCazhpos] = useState(false);
    const [inputFeeWithdrawCazhpos, setInputFeeWithdrawCazhpos] =
        useState(false);
    const [inputFeeBillSaldokartu, setInputFeeBillSaldokartu] = useState(false);
    const [selectedDetailPartner, setSelectedDetailPartner] = useState("");

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [activeMenu, setActiveMenu] = useState("lembaga");
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const columnsSubscription = [
        { field: "nominal", header: "Nominal" },
        { field: "ppn", header: "PPN (%)" },
        { field: "total_bill", header: "Total Tagihan (nominal + ppn)" },
        { field: "period", header: "Periode Langganan" },
        { field: "price_lanyard", header: "Tarif Lanyard" },
        { field: "price_subcription_system", header: "Tarif Langganan Sistem" },
        { field: "price_training_offline", header: "Tarif Training Offline" },
        { field: "price_training_online", header: "Tarif Training Online" },
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
    const [visibleColumnsSubscription, setVisibleColumnsSubscription] =
        useState([
            { field: "nominal", header: "Nominal" },
            { field: "ppn", header: "PPN (%)" },
            { field: "total_bill", header: "Total Tagihan (nominal + ppn)" },
            { field: "period", header: "Periode Langganan" },
            { field: "price_lanyard", header: "Tarif Lanyard" },
        ]);

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
        partner: {
            uuid: "",
            sales: {},
            account_manager: {},
            name: "",
            phone_number: "",
            onboarding_date: new Date(),
            onboarding_age: null,
            live_date: null,
            live_age: null,
            monitoring_date_after_3_month_live: null,
            address: null,
            status: "",
        },
        pic: {
            name: "",
            number: "",
            position: "",
            address: "",
        },
        account_setting: {
            subdomain: "",
            email_super_admin: "",
            cas_link_partner: "",
            card_number: "",
        },
        bank: {
            bank: "",
            account_bank_number: "",
            account_bank_name: "",
        },
        subscription: {
            nominal: 0,
            period: null,
            price_card: {
                price: "",
                type: "",
            },
            ppn: 0,
            total_bill: 0,
            price_training_online: null,
            price_training_offline: null,
            price_lanyard: null,
            price_subscription_system: null,
            fee_purchase_cazhpoin: null,
            fee_bill_cazhpoin: null,
            fee_topup_cazhpos: null,
            fee_withdraw_cazhpos: null,
            fee_bill_saldokartu: null,
        },
    });

    const {
        data: dataPIC,
        setData: setDataPIC,
        post: postPIC,
        put: putPIC,
        delete: destroyPIC,
        reset: resetPIC,
        processing: processingPIC,
        errors: errorPIC,
    } = useForm({
        uuid: "",
        partner: {},
        name: "",
        number: "",
        position: "",
        address: "",
    });

    const {
        data: dataBank,
        setData: setDataBank,
        post: postBank,
        put: putBank,
        delete: destroyBank,
        reset: resetBank,
        processing: processingBank,
        errors: errorBank,
    } = useForm({
        uuid: "",
        partner: {},
        bank: "",
        account_bank_number: "",
        account_bank_name: "",
    });

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
        nominal: 0,
        period: null,
        price_card: {
            price: "",
            type: "",
        },
        ppn: 0,
        total_bill: 0,
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

    const status = [
        { name: "Proses" },
        { name: "Aktif" },
        { name: "CLBK" },
        { name: "Non Aktif" },
    ];

    const option_period_subscription = [
        { name: "kartu/bulan" },
        { name: "kartu/tahun" },
        { name: "lembaga/bulan" },
        { name: "lembaga/tahun" },
    ];

    const option_training_offline = [
        { name: "Jawa", price: 15000000 },
        { name: "Kalimantan", price: 25000000 },
        { name: "Sulawesi", price: 27000000 },
        { name: "Sumatra", price: 23000000 },
        { name: "Bali", price: 26000000 },
        { name: "Jabodetabek", price: 15000000 },
    ];

    const option_price_lanyard = [
        { name: "Lanyard Polos", price: 10000 },
        { name: "Lanyard Sablon", price: 12000 },
        { name: "Lanyard Printing", price: 20000 },
    ];

    const option_fee = [{ name: 1000 }, { name: 2000 }, { name: 2500 }];

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

    const selectedOptionTrainingTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.price}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const optionTrainingTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>
                    {option.name} - {option.price}
                </div>
            </div>
        );
    };

    const getPartners = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/partners");
        let data = await response.json();

        setPartners((prev) => data.partners);
        setSales((prev) => data.sales);
        setAccountManagers((prev) => data.account_managers);

        setIsLoadingData(false);
    };

    const getPics = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/partners/pics");
        let data = await response.json();

        setPics((prev) => data);

        setIsLoadingData(false);
    };

    const getBanks = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/partners/banks");
        let data = await response.json();

        setBanks((prev) => data);

        setIsLoadingData(false);
    };

    const getSubscriptions = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/partners/subscriptions");
        let data = await response.json();

        setSubscriptions((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (activeIndexTab == 0) {
                    await getPartners();
                    setPreRenderLoad((prev) => (prev = false));
                } else if (activeIndexTab == 1) {
                    await getPics();
                } else if (activeIndexTab == 2) {
                    await getBanks();
                } else if (activeIndexTab == 3) {
                    await getSubscriptions();
                } else {
                    await getPartners();
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [activeIndexTab]);

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => handleEditPartner(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => {
                        handleDeletePartner(rowData);
                    }}
                />
            </React.Fragment>
        );
    };

    const actionBodyTemplateBank = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => handleEditBank(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => {
                        handleDeleteBank(rowData);
                    }}
                />
            </React.Fragment>
        );
    };

    const actionBodyTemplatePIC = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => handleEditPIC(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => {
                        handleDeletePIC(rowData);
                    }}
                />
            </React.Fragment>
        );
    };

    const actionBodyTemplateSubscriptipn = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => handleEditSubscription(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => {
                        handleDeleteSubscription(rowData);
                    }}
                />
            </React.Fragment>
        );
    };

    let cardCategories = [{ name: "digital" }, { name: "cetak" }];

    let trainingCategories = [{ name: "offline" }, { name: "online" }];

    const items = [
        {
            label: "Lembaga",
        },
        {
            label: "PIC",
        },
        {
            label: "Bank",
        },
        {
            label: "Akun",
        },
        {
            label: "Langganan",
        },
    ];

    let menuDetailPartnerItems = [
        {
            label: "Lembaga",
            className: `${activeMenu == "lembaga" ? "p-menuitem-active" : ""}`,
            command: () => {
                setActiveMenu((prev) => (prev = "lembaga"));
            },
        },
        {
            label: "PIC",
            className: `${activeMenu == "pic" ? "p-menuitem-active" : ""}`,
            command: () => {
                setActiveMenu((prev) => (prev = "pic"));
            },
        },
        {
            label: "Bank",
            className: `${activeMenu == "bank" ? "p-menuitem-active" : ""}`,
            command: () => {
                setActiveMenu((prev) => (prev = "bank"));
            },
        },
        {
            label: "Langganan",
            className: `${
                activeMenu == "langganan" ? "p-menuitem-active" : ""
            }`,
            command: () => {
                setActiveMenu((prev) => (prev = "langganan"));
            },
        },
    ];

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

    const handleEditPartner = (partner) => {
        setData((prevData) => ({
            ...prevData,
            partner: {
                ...prevData.partner,
                uuid: partner.uuid,
                name: partner.name,
                phone_number: partner.phone_number,
                sales: partner.sales,
                account_manager: partner.account_manager,
                onboarding_date: partner.onboarding_date,
                onboarding_age: partner.onboarding_age,
                live_age: partner.live_age,
                monitoring_date_after_3_month_live:
                    partner.monitoring_date_after_3_month_live,
                live_date: partner.live_date,
                address: partner.address,
                status: partner.status,
            },
        }));
        setModalEditPartnersIsVisible(true);
    };

    const handleDeletePartner = (partner) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroy("partners/" + partner.uuid, {
                    onSuccess: () => {
                        getPartners();
                        showSuccess("Hapus");
                    },
                    onError: () => {
                        showError("Hapus");
                    },
                });
            },
        });
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

    const handleDeleteBank = (bank) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroyBank("partners/banks/" + bank.uuid, {
                    onSuccess: () => {
                        getBanks();
                        showSuccess("Hapus");
                    },
                    onError: () => {
                        showError("Hapus");
                    },
                });
            },
        });
    };

    const handleEditPIC = (pic) => {
        setDataPIC((data) => ({ ...data, uuid: pic.uuid }));
        setDataPIC((data) => ({ ...data, partner: pic.partner }));
        setDataPIC((data) => ({ ...data, name: pic.name }));
        setDataPIC((data) => ({ ...data, number: pic.number }));
        setDataPIC((data) => ({ ...data, position: pic.position }));
        setDataPIC((data) => ({ ...data, address: pic.address }));

        setModalEditPicIsVisible(true);
    };

    const handleDeletePIC = (pic) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroyPIC("partners/pics/" + pic.uuid, {
                    onSuccess: () => {
                        getPics();
                        showSuccess("Hapus");
                    },
                    onError: () => {
                        showError("Hapus");
                    },
                });
            },
        });
    };

    const handleEditSubscription = (subscription) => {
        setDataSubscription((data) => ({
            ...data,
            uuid: subscription.uuid,
            partner: subscription.partner,
            nominal: subscription.nominal,
            period: subscription.period,
            price_card: JSON.parse(subscription.price_card),
            ppn: subscription.ppn,
            total_bill: subscription.total_bill,
            price_training_online: subscription.price_training_online,
            price_training_offline: subscription.price_training_offline,
            price_lanyard: subscription.price_lanyard,
            price_subscription_system: subscription.price_subscription_system,
            fee_purchase_cazhpoin: subscription.fee_purchase_cazhpoin,
            fee_bill_cazhpoin: subscription.fee_bill_cazhpoin,
            fee_topup_cazhpos: subscription.fee_topup_cazhpos,
            fee_withdraw_cazhpos: subscription.fee_withdraw_cazhpos,
            fee_bill_saldokartu: subscription.fee_bill_saldokartu,
        }));

        setModalEditSubscriptionIsVisible(true);
    };

    const handleDeleteSubscription = (subscription) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroySubscription(
                    "partners/subscriptions/" + subscription.uuid,
                    {
                        onSuccess: () => {
                            getSubscriptions();
                            showSuccess("Hapus");
                        },
                        onError: () => {
                            showError("Hapus");
                        },
                    }
                );
            },
        });
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-row justify-left gap-2 align-items-center items-end">
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

    const header = renderHeader();

    const onColumnToggle = (event) => {
        let selectedColumns = event.value;
        let orderedSelectedColumns = columnsSubscription.filter((col) =>
            selectedColumns.some((sCol) => sCol.field === col.field)
        );

        setVisibleColumnsSubscription(orderedSelectedColumns);
    };

    const headerSubscription = (
        <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex w-full sm:w-[30%] flex-row justify-left gap-2 align-items-center items-end">
                <div className="w-full">
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
            <MultiSelect
                value={visibleColumnsSubscription}
                options={columnsSubscription}
                optionLabel="header"
                onChange={onColumnToggle}
                className="w-full sm:w-[30%] p-0"
                display="chip"
            />
        </div>
    );

    const footerTemplate = () => {
        return (
            <div className="flex shadow-footer justify-between w-full sticky bg-white z-10 py-[5px] bottom-0">
                <Button
                    type="button"
                    icon="pi pi-angle-left"
                    disabled={activeIndex == 0}
                    onClick={() => setActiveIndex((prev) => prev - 1)}
                    className="bg-purple-600 text-sm shadow-md rounded-lg"
                />
                <Button
                    type="submit"
                    label="Submit"
                    disabled={processing || activeIndex !== 4}
                    className="bg-purple-600 text-sm shadow-md rounded-lg"
                    onClick={() => btnSubmit.current.click()}
                />
                <Button
                    type="button"
                    icon="pi pi-angle-right"
                    disabled={activeIndex == 4}
                    onClick={() => setActiveIndex((prev) => prev + 1)}
                    className="bg-purple-600 text-sm shadow-md rounded-lg"
                />
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

    const handleSubmitForm = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            post("/partners", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalPartnersIsVisible((prev) => false);
                    getPartners();
                    reset("partner", "pic", "subscription");
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            put("/partners/" + data.partner.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditPartnersIsVisible((prev) => false);
                    getPartners();
                    reset("partner", "pic", "subscription");
                },
                onError: () => {
                    showError("Update");
                },
            });
        }

        setActiveIndex((prev = prev = 0));
    };

    const handleSubmitFormPIC = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            postPIC("/partners/pics", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalPicIsVisible((prev) => false);
                    getPics();
                    resetPIC(
                        "partner",
                        "name",
                        "number",
                        "position",
                        "address"
                    );
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            putPIC("/partners/pics/" + dataPIC.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditPicIsVisible((prev) => false);
                    getPics();
                    resetPIC(
                        "partner",
                        "name",
                        "number",
                        "position",
                        "address"
                    );
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
    };

    const handleSubmitFormBank = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            postBank("/partners/banks", {
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
            putBank("/partners/banks/" + dataBank.uuid, {
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

    const handleSubmitFormSubscription = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            postSubscription("/partners/subscriptions", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalSubscriptionIsVisible((prev) => (prev = false));
                    getSubscriptions();
                    resetSubscription(
                        "partner",
                        "nominal",
                        "period",
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
            putSubscription(
                "/partners/subscriptions/" + dataSubscription.uuid,
                {
                    onSuccess: () => {
                        showSuccess("Update");
                        setModalEditSubscriptionIsVisible(
                            (prev) => (prev = false)
                        );
                        getSubscriptions();
                        resetSubscription(
                            "partner",
                            "nominal",
                            "period",
                            "bank",
                            "account_bank_number",
                            "account_bank_name"
                        );
                    },
                    onError: () => {
                        showError("Update");
                    },
                }
            );
        }
    };

    const handleSelectedDetailPartner = (partner) => {
        setSelectedDetailPartner(partner);
        setActiveIndexTab((prev) => (prev = 4));
    };

    if (preRenderLoad) {
        return (
            <>
                <DashboardLayout auth={auth.user} className="">
                    <div className="card my-5">
                        <DataTable
                            value={dummyArray}
                            className="p-datatable-striped"
                        >
                            <Column
                                style={{ width: "25%" }}
                                body={<Skeleton />}
                            ></Column>
                            <Column
                                style={{ width: "25%" }}
                                body={<Skeleton />}
                            ></Column>
                            <Column
                                style={{ width: "25%" }}
                                body={<Skeleton />}
                            ></Column>
                            <Column
                                style={{ width: "25%" }}
                                body={<Skeleton />}
                            ></Column>
                        </DataTable>
                    </div>
                </DashboardLayout>
            </>
        );
    }

    const headerFieldsetPartner = (
        <div className="flex tooltip-partner justify-center items-center">
            Partner
        </div>
    );

    return (
        <DashboardLayout auth={auth.user} className="">
            <Toast ref={toast} />
            <ConfirmDialog />

            <HeaderModule
                title={
                    activeIndexTab == 0
                        ? "Partner"
                        : null || activeIndexTab == 1
                        ? "PIC"
                        : null || activeIndexTab == 2
                        ? "Bank"
                        : null || activeIndexTab == 3
                        ? "Langganan"
                        : null || activeIndexTab == 4
                        ? "Detail Partner"
                        : null
                }
            >
                {activeIndexTab == 0 && (
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalPartnersIsVisible((prev) => (prev = true));
                            reset("partner");
                        }}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                )}

                {activeIndexTab == 1 && (
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalPicIsVisible((prev) => (prev = true));
                            resetPIC();
                        }}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                )}

                {activeIndexTab == 2 && (
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalBankIsVisible((prev) => (prev = true));
                            resetBank();
                        }}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                )}

                {activeIndexTab == 3 && (
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalSubscriptionIsVisible(
                                (prev) => (prev = true)
                            );
                            resetSubscription();
                        }}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                )}

                {activeIndexTab == 4 && (
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalSubscriptionIsVisible(
                                (prev) => (prev = true)
                            );
                        }}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                )}
            </HeaderModule>

            <TabView
                className="mt-3"
                activeIndex={activeIndexTab}
                onTabChange={(e) => setActiveIndexTab(e.index)}
            >
                <TabPanel header="List Partner">
                    {/* Modal tambah partner */}
                    <div className="card flex justify-content-center">
                        <Dialog
                            ref={modalPartner}
                            header="Partner"
                            headerClassName="dark:glass dark:text-white"
                            className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                            contentClassName=" dark:glass dark:text-white"
                            visible={modalPartnersIsVisible}
                            onHide={() => setModalPartnersIsVisible(false)}
                            footer={footerTemplate}
                        >
                            <Steps
                                model={items}
                                activeIndex={activeIndex}
                                className="sticky top-0 bg-white z-10 text-sm"
                            />

                            <form
                                onSubmit={(e) => handleSubmitForm(e, "tambah")}
                            >
                                {/* form partner */}
                                {activeIndex == 0 && (
                                    <>
                                        <div className="flex flex-col justify-around gap-4 mt-1">
                                            <div className="flex flex-col">
                                                <label htmlFor="name">
                                                    Nama *
                                                </label>
                                                <InputText
                                                    value={data.partner.name}
                                                    onChange={(e) =>
                                                        setData("partner", {
                                                            ...data.partner,
                                                            name: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="dark:bg-gray-300"
                                                    id="name"
                                                    aria-describedby="name-help"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <label htmlFor="name">
                                                    Nomor Telepon *
                                                </label>
                                                <InputText
                                                    keyfilter="int"
                                                    value={
                                                        data.partner
                                                            .phone_number
                                                    }
                                                    onChange={(e) =>
                                                        setData("partner", {
                                                            ...data.partner,
                                                            phone_number:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="dark:bg-gray-300"
                                                    id="phone_number"
                                                    aria-describedby="phone_number-help"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <label htmlFor="sales">
                                                    Sales *
                                                </label>
                                                <Dropdown
                                                    value={data.partner.sales}
                                                    onChange={(e) =>
                                                        setData("partner", {
                                                            ...data.partner,
                                                            sales: e.target
                                                                .value,
                                                        })
                                                    }
                                                    options={sales}
                                                    optionLabel="name"
                                                    placeholder="Pilih Sales"
                                                    filter
                                                    valueTemplate={
                                                        selectedOptionTemplate
                                                    }
                                                    itemTemplate={
                                                        optionTemplate
                                                    }
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <label htmlFor="account_manager">
                                                    Account Manager (AM)
                                                </label>
                                                <Dropdown
                                                    value={
                                                        data.partner
                                                            .account_manager
                                                    }
                                                    onChange={(e) =>
                                                        setData("partner", {
                                                            ...data.partner,
                                                            account_manager:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={account_managers}
                                                    optionLabel="name"
                                                    placeholder="Pilih Account Manager (AM)"
                                                    filter
                                                    valueTemplate={
                                                        selectedOptionTemplate
                                                    }
                                                    itemTemplate={
                                                        optionTemplate
                                                    }
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <label htmlFor="register_date">
                                                    Tanggal Onboarding *
                                                </label>
                                                <Calendar
                                                    value={
                                                        data.partner
                                                            .onboarding_date
                                                            ? new Date(
                                                                  data.partner.onboarding_date
                                                              )
                                                            : null
                                                    }
                                                    style={{ height: "35px" }}
                                                    onChange={(e) => {
                                                        setData("partner", {
                                                            ...data.partner,
                                                            onboarding_date:
                                                                e.target.value,
                                                        });
                                                    }}
                                                    showIcon
                                                    dateFormat="dd/mm/yy"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <label htmlFor="live_date">
                                                    Tanggal Live
                                                </label>
                                                <Calendar
                                                    value={
                                                        data.partner.live_date
                                                            ? new Date(
                                                                  data.partner.live_date
                                                              )
                                                            : null
                                                    }
                                                    style={{ height: "35px" }}
                                                    onChange={(e) => {
                                                        const onboarding_age =
                                                            Math.ceil(
                                                                (e.target
                                                                    .value -
                                                                    data.partner
                                                                        .onboarding_date) /
                                                                    (1000 *
                                                                        60 *
                                                                        60 *
                                                                        24)
                                                            );

                                                        const live_age =
                                                            Math.ceil(
                                                                (new Date() -
                                                                    e.target
                                                                        .value) /
                                                                    (1000 *
                                                                        60 *
                                                                        60 *
                                                                        24)
                                                            );

                                                        const monitoring_date_after_3_month_live =
                                                            new Date(
                                                                e.target.value
                                                            ).setMonth(
                                                                new Date(
                                                                    e.target.value
                                                                ).getMonth() +
                                                                    3,
                                                                new Date(
                                                                    e.target.value
                                                                ).getDate() - 1
                                                            );

                                                        console.log(
                                                            monitoring_date_after_3_month_live
                                                        );

                                                        setData("partner", {
                                                            ...data.partner,
                                                            live_date:
                                                                e.target.value,
                                                            onboarding_age:
                                                                onboarding_age,
                                                            live_age: live_age,
                                                            monitoring_date_after_3_month_live:
                                                                new Date(
                                                                    monitoring_date_after_3_month_live
                                                                ),
                                                        });
                                                    }}
                                                    showIcon
                                                    dateFormat="dd/mm/yy"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <label htmlFor="name">
                                                    Umur Onboarding (hari)
                                                </label>
                                                <InputText
                                                    value={
                                                        data.partner
                                                            .onboarding_age
                                                    }
                                                    onChange={(e) =>
                                                        setData("partner", {
                                                            ...data.partner,
                                                            onboarding_age:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="dark:bg-gray-300"
                                                    id="onboarding_age"
                                                    aria-describedby="onboarding_age-help"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <label htmlFor="name">
                                                    Umur Live (hari)
                                                </label>
                                                <InputText
                                                    value={
                                                        data.partner.live_age
                                                    }
                                                    onChange={(e) =>
                                                        setData("partner", {
                                                            ...data.partner,
                                                            live_age:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="dark:bg-gray-300"
                                                    id="live_age"
                                                    aria-describedby="live_age-help"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <label htmlFor="live_date">
                                                    Tanggal Monitoring 3 Bulan
                                                    After Live
                                                </label>
                                                <Calendar
                                                    value={
                                                        data.partner
                                                            .monitoring_date_after_3_month_live
                                                            ? new Date(
                                                                  data.partner.monitoring_date_after_3_month_live
                                                              )
                                                            : null
                                                    }
                                                    style={{ height: "35px" }}
                                                    onChange={(e) => {
                                                        setData("partner", {
                                                            ...data.partner,
                                                            monitoring_date_after_3_month_live:
                                                                e.target.value,
                                                        });
                                                    }}
                                                    showIcon
                                                    dateFormat="yy-mm-dd"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <label htmlFor="address">
                                                    Alamat
                                                </label>
                                                <InputTextarea
                                                    value={data.partner.address}
                                                    onChange={(e) =>
                                                        setData("partner", {
                                                            ...data.partner,
                                                            address:
                                                                e.target.value,
                                                        })
                                                    }
                                                    rows={5}
                                                    cols={30}
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <label htmlFor="status">
                                                    Status *
                                                </label>
                                                <Dropdown
                                                    value={data.partner.status}
                                                    onChange={(e) =>
                                                        setData("partner", {
                                                            ...data.partner,
                                                            status: e.target
                                                                .value,
                                                        })
                                                    }
                                                    options={status}
                                                    optionLabel="name"
                                                    placeholder="Pilih Status"
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* form pic */}
                                {activeIndex == 1 && (
                                    <>
                                        <div className="flex flex-col justify-around gap-4 mt-1">
                                            <div className="flex flex-col">
                                                <label htmlFor="name">
                                                    Nama *
                                                </label>
                                                <InputText
                                                    value={data.pic.name}
                                                    onChange={(e) =>
                                                        setData("pic", {
                                                            ...data.pic,
                                                            name: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="dark:bg-gray-300"
                                                    id="name"
                                                    aria-describedby="name-help"
                                                />
                                            </div>

                                            {/* <div className='flex flex-col'>   
                                        <label htmlFor="email">Email</label>
                                        <InputText value={data.pic.email} type="email" onChange={(e) => setData('pic',{...data.pic, email: e.target.value})} className='dark:bg-gray-300' id="email" aria-describedby="email-help" />
                                    </div> */}

                                            <div className="flex flex-col">
                                                <label htmlFor="number">
                                                    No.Hp *
                                                </label>
                                                <InputText
                                                    value={data.pic.number}
                                                    keyfilter="int"
                                                    min={0}
                                                    onChange={(e) =>
                                                        setData("pic", {
                                                            ...data.pic,
                                                            number: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="dark:bg-gray-300"
                                                    id="number"
                                                    aria-describedby="number-help"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <label htmlFor="position">
                                                    Jabatan *
                                                </label>
                                                <InputText
                                                    value={data.pic.position}
                                                    onChange={(e) =>
                                                        setData("pic", {
                                                            ...data.pic,
                                                            position:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="dark:bg-gray-300"
                                                    id="position"
                                                    aria-describedby="position-help"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <label htmlFor="address">
                                                    Alamat *
                                                </label>
                                                <InputTextarea
                                                    value={data.pic.address}
                                                    onChange={(e) =>
                                                        setData("pic", {
                                                            ...data.pic,
                                                            address:
                                                                e.target.value,
                                                        })
                                                    }
                                                    rows={5}
                                                    cols={30}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* form bank */}
                                {activeIndex == 2 && (
                                    <>
                                        <div className="flex flex-col justify-around gap-4 mt-4">
                                            <div className="flex flex-col">
                                                <label htmlFor="bank">
                                                    Bank *
                                                </label>
                                                <InputText
                                                    value={data.bank.bank}
                                                    onChange={(e) =>
                                                        setData("bank", {
                                                            ...data.bank,
                                                            bank: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="dark:bg-gray-300"
                                                    id="bank"
                                                    aria-describedby="bank-help"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <label htmlFor="account_bank_number">
                                                    Nomor Rekening *
                                                </label>
                                                <InputText
                                                    value={
                                                        data.bank
                                                            .account_bank_number
                                                    }
                                                    onChange={(e) =>
                                                        setData("bank", {
                                                            ...data.bank,
                                                            account_bank_number:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="dark:bg-gray-300"
                                                    id="account_bank_number"
                                                    aria-describedby="account_bank_number-help"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <label htmlFor="account_bank_name">
                                                    Atas Nama *
                                                </label>
                                                <InputText
                                                    value={
                                                        data.bank
                                                            .account_bank_name
                                                    }
                                                    onChange={(e) =>
                                                        setData("bank", {
                                                            ...data.bank,
                                                            account_bank_name:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="dark:bg-gray-300"
                                                    id="account_bank_name"
                                                    aria-describedby="account_bank_name-help"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* form setting akun */}
                                {activeIndex == 3 && (
                                    <>
                                        <div className="flex flex-col justify-around gap-4 mt-1">
                                            <div className="flex flex-col">
                                                <label htmlFor="subdomain">
                                                    Subdomain
                                                </label>
                                                <InputText
                                                    value={
                                                        data.account_setting
                                                            .subdomain
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "account_setting",
                                                            {
                                                                ...data.account_setting,
                                                                subdomain:
                                                                    e.target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                    className="dark:bg-gray-300"
                                                    id="subdomain"
                                                    aria-describedby="name-help"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <label htmlFor="email_super_admin">
                                                    Email super admin
                                                </label>
                                                <InputText
                                                    value={
                                                        data.account_setting
                                                            .email_super_admin
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "account_setting",
                                                            {
                                                                ...data.account_setting,
                                                                email_super_admin:
                                                                    e.target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                    className="dark:bg-gray-300"
                                                    id="email_super_admin"
                                                    aria-describedby="email_super_admin-help"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <label htmlFor="cas_link_partner">
                                                    CAS link partner
                                                </label>
                                                <InputText
                                                    value={
                                                        data.account_setting
                                                            .cas_link_partner
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "account_setting",
                                                            {
                                                                ...data.account_setting,
                                                                cas_link_partner:
                                                                    e.target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                    className="dark:bg-gray-300"
                                                    id="cas_link_partner"
                                                    aria-describedby="cas_link_partner-help"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <label htmlFor="card_number">
                                                    Nomor Kartu (8 digit)
                                                </label>
                                                <InputText
                                                    keyfilter="int"
                                                    value={
                                                        data.account_setting
                                                            .card_number
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "account_setting",
                                                            {
                                                                ...data.account_setting,
                                                                card_number:
                                                                    e.target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                    className="dark:bg-gray-300"
                                                    id="card_number"
                                                    aria-describedby="card_number-help"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* form langganan */}
                                {activeIndex == 4 && (
                                    <>
                                        <div className="flex flex-col justify-around gap-4 mt-1">
                                            <div className="flex flex-col">
                                                <label htmlFor="nominal">
                                                    Nominal Langganan *
                                                </label>
                                                <InputNumber
                                                    value={
                                                        data.subscription
                                                            .nominal
                                                    }
                                                    onValueChange={(e) => {
                                                        const total_bill =
                                                            (e.target.value *
                                                                data
                                                                    .subscription
                                                                    .ppn) /
                                                            100;
                                                        setData(
                                                            "subscription",
                                                            {
                                                                ...data.subscription,
                                                                nominal:
                                                                    e.target
                                                                        .value,
                                                                total_bill:
                                                                    data
                                                                        .subscription
                                                                        .ppn ===
                                                                    0
                                                                        ? e
                                                                              .target
                                                                              .value
                                                                        : total_bill,
                                                            }
                                                        );
                                                    }}
                                                    locale="id-ID"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label htmlFor="ppn">
                                                    PPN(%)
                                                </label>
                                                <InputNumber
                                                    value={
                                                        data.subscription.ppn
                                                    }
                                                    onValueChange={(e) => {
                                                        const ppn =
                                                            (e.target.value *
                                                                data
                                                                    .subscription
                                                                    .nominal) /
                                                            100;
                                                        console.log(ppn);
                                                        setData(
                                                            "subscription",
                                                            {
                                                                ...data.subscription,
                                                                ppn: e.target
                                                                    .value,
                                                                total_bill:
                                                                    data
                                                                        .subscription
                                                                        .nominal +
                                                                    ppn,
                                                            }
                                                        );
                                                    }}
                                                    locale="id-ID"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label htmlFor="ppn">
                                                    Total Tagihan(nominal + ppn)
                                                </label>
                                                <InputNumber
                                                    value={
                                                        data.subscription
                                                            .total_bill
                                                    }
                                                    onValueChange={(e) => {
                                                        setData(
                                                            "subscription",
                                                            {
                                                                ...data.subscription,
                                                                total_bill:
                                                                    e.target
                                                                        .value,
                                                            }
                                                        );
                                                    }}
                                                    locale="id-ID"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <label htmlFor="period">
                                                    Periode*
                                                </label>
                                                <Dropdown
                                                    value={
                                                        data.subscription.period
                                                    }
                                                    onChange={(e) => {
                                                        setData(
                                                            "subscription",
                                                            {
                                                                ...data.subscription,
                                                                period: e.target
                                                                    .value,
                                                            }
                                                        );
                                                    }}
                                                    options={
                                                        option_period_subscription
                                                    }
                                                    optionLabel="name"
                                                    placeholder="Langganan Per-"
                                                    valueTemplate={
                                                        selectedOptionTemplate
                                                    }
                                                    itemTemplate={
                                                        optionTemplate
                                                    }
                                                    className={`w-full md:w-14rem 
                                        `}
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="flex justify-center">
                                                    {!inputPriceCard && (
                                                        <Button
                                                            label="Input Tarif Kartu"
                                                            className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm"
                                                            icon="pi pi-plus-circle"
                                                            onClick={() =>
                                                                setInputPriceCard(
                                                                    (prev) =>
                                                                        (prev = true)
                                                                )
                                                            }
                                                            aria-controls="popup_menu_right"
                                                            aria-haspopup
                                                        />
                                                    )}
                                                </div>

                                                {inputPriceCard && (
                                                    <>
                                                        <label htmlFor="price_card">
                                                            Tarif Kartu
                                                        </label>

                                                        <div className="flex justify-between gap-1 w-full items-center">
                                                            <div className="w-[93%] flex gap-2 h-full">
                                                                <InputNumber
                                                                    placeholder="tarif"
                                                                    value={
                                                                        data
                                                                            .subscription
                                                                            .price_card
                                                                            .price
                                                                    }
                                                                    onValueChange={(
                                                                        e
                                                                    ) =>
                                                                        setData(
                                                                            "subscription",
                                                                            {
                                                                                ...data.subscription,
                                                                                price_card:
                                                                                    {
                                                                                        ...data
                                                                                            .subscription
                                                                                            .price_card,
                                                                                        price: e
                                                                                            .target
                                                                                            .value,
                                                                                    },
                                                                            }
                                                                        )
                                                                    }
                                                                    className="dark:bg-gray-300 w-full"
                                                                    id="account_bank_name"
                                                                    aria-describedby="account_bank_name-help"
                                                                    locale="id-ID"
                                                                />
                                                                <Dropdown
                                                                    value={
                                                                        data
                                                                            .subscription
                                                                            .price_card
                                                                            .type
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setData(
                                                                            "subscription",
                                                                            {
                                                                                ...data.subscription,
                                                                                price_card:
                                                                                    {
                                                                                        ...data
                                                                                            .subscription
                                                                                            .price_card,
                                                                                        type: e
                                                                                            .target
                                                                                            .value,
                                                                                    },
                                                                            }
                                                                        )
                                                                    }
                                                                    options={
                                                                        cardCategories
                                                                    }
                                                                    optionLabel="name"
                                                                    placeholder="kategori"
                                                                    className="w-full md:w-14rem"
                                                                />
                                                            </div>
                                                            <div className="h-full flex items-center">
                                                                <Button
                                                                    className="bg-red-500 h-1 w-1 shadow-md rounded-full "
                                                                    icon={() => (
                                                                        <i
                                                                            className="pi pi-minus"
                                                                            style={{
                                                                                fontSize:
                                                                                    "0.7rem",
                                                                            }}
                                                                        ></i>
                                                                    )}
                                                                    onClick={() => {
                                                                        setInputPriceCard(
                                                                            (
                                                                                prev
                                                                            ) =>
                                                                                (prev = false)
                                                                        );
                                                                        setData(
                                                                            "subscription",
                                                                            {
                                                                                ...data.subscription,
                                                                                price_card:
                                                                                    {
                                                                                        ...data
                                                                                            .subscription
                                                                                            .price_card,
                                                                                        price: null,
                                                                                        type: null,
                                                                                    },
                                                                            }
                                                                        );
                                                                    }}
                                                                    aria-controls="popup_menu_right"
                                                                    aria-haspopup
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="flex justify-center">
                                                    {!inputPriceLanyard && (
                                                        <Button
                                                            label="Input Tarif Lanyard"
                                                            className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm"
                                                            icon="pi pi-plus-circle"
                                                            onClick={() =>
                                                                setInputPriceLanyard(
                                                                    (prev) =>
                                                                        (prev = true)
                                                                )
                                                            }
                                                            aria-controls="popup_menu_right"
                                                            aria-haspopup
                                                        />
                                                    )}
                                                </div>

                                                {inputPriceLanyard && (
                                                    <>
                                                        <label htmlFor="price_card">
                                                            Tarif Lanyard
                                                        </label>

                                                        <div className="flex justify-between gap-1 w-full items-center">
                                                            <div className="w-[93%] flex gap-2 h-full">
                                                                <Dropdown
                                                                    value={
                                                                        data
                                                                            .subscription
                                                                            .price_lanyard
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setData(
                                                                            "subscription",
                                                                            {
                                                                                ...data.subscription,
                                                                                price_lanyard:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            }
                                                                        )
                                                                    }
                                                                    options={
                                                                        option_price_lanyard
                                                                    }
                                                                    optionLabel="price"
                                                                    optionValue="price"
                                                                    placeholder="Pilih Tarif"
                                                                    editable
                                                                    valueTemplate={
                                                                        selectedOptionTrainingTemplate
                                                                    }
                                                                    itemTemplate={
                                                                        optionTrainingTemplate
                                                                    }
                                                                    className="w-full md:w-14rem"
                                                                />
                                                            </div>
                                                            <div className="h-full flex items-center">
                                                                <Button
                                                                    className="bg-red-500 h-1 w-1 shadow-md rounded-full "
                                                                    icon={() => (
                                                                        <i
                                                                            className="pi pi-minus"
                                                                            style={{
                                                                                fontSize:
                                                                                    "0.7rem",
                                                                            }}
                                                                        ></i>
                                                                    )}
                                                                    onClick={() => {
                                                                        setInputPriceLanyard(
                                                                            (
                                                                                prev
                                                                            ) =>
                                                                                (prev = false)
                                                                        );
                                                                        setData(
                                                                            "subscription",
                                                                            {
                                                                                ...data.subscription,
                                                                                price_lanyard:
                                                                                    null,
                                                                            }
                                                                        );
                                                                    }}
                                                                    aria-controls="popup_menu_right"
                                                                    aria-haspopup
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="flex justify-center">
                                                    {!inputPriceSubscriptionSystem && (
                                                        <Button
                                                            label="Input Tarif Langganan Sistem"
                                                            className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm"
                                                            icon="pi pi-plus-circle"
                                                            onClick={() =>
                                                                setInputPriceSubscriptionSystem(
                                                                    (prev) =>
                                                                        (prev = true)
                                                                )
                                                            }
                                                            aria-controls="popup_menu_right"
                                                            aria-haspopup
                                                        />
                                                    )}
                                                </div>

                                                {inputPriceSubscriptionSystem && (
                                                    <>
                                                        <label htmlFor="price_card">
                                                            Tarif Langganan
                                                            Sistem
                                                        </label>

                                                        <div className="flex justify-between gap-1 w-full items-center">
                                                            <div className="w-[93%] flex gap-2 h-full">
                                                                <InputNumber
                                                                    placeholder="tarif"
                                                                    value={
                                                                        data
                                                                            .subscription
                                                                            .price_subscription_system
                                                                    }
                                                                    onValueChange={(
                                                                        e
                                                                    ) =>
                                                                        setData(
                                                                            "subscription",
                                                                            {
                                                                                ...data.subscription,
                                                                                price_subscription_system:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            }
                                                                        )
                                                                    }
                                                                    className="dark:bg-gray-300 w-full"
                                                                    id="account_bank_name"
                                                                    aria-describedby="account_bank_name-help"
                                                                    locale="id-ID"
                                                                />
                                                            </div>
                                                            <div className="h-full flex items-center">
                                                                <Button
                                                                    className="bg-red-500 h-1 w-1 shadow-md rounded-full "
                                                                    icon={() => (
                                                                        <i
                                                                            className="pi pi-minus"
                                                                            style={{
                                                                                fontSize:
                                                                                    "0.7rem",
                                                                            }}
                                                                        ></i>
                                                                    )}
                                                                    onClick={() => {
                                                                        setInputPriceSubscriptionSystem(
                                                                            (
                                                                                prev
                                                                            ) =>
                                                                                (prev = false)
                                                                        );
                                                                        setData(
                                                                            "subscription",
                                                                            {
                                                                                ...data.subscription,
                                                                                price_subscription_system:
                                                                                    null,
                                                                            }
                                                                        );
                                                                    }}
                                                                    aria-controls="popup_menu_right"
                                                                    aria-haspopup
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="flex justify-center">
                                                    {!inputPriceTrainingOffline && (
                                                        <Button
                                                            label="Input Tarif Training Offline"
                                                            className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm"
                                                            icon="pi pi-plus-circle"
                                                            onClick={() =>
                                                                setInputPriceTrainingOffline(
                                                                    (prev) =>
                                                                        (prev = true)
                                                                )
                                                            }
                                                            aria-controls="popup_menu_right"
                                                            aria-haspopup
                                                        />
                                                    )}
                                                </div>

                                                {inputPriceTrainingOffline && (
                                                    <>
                                                        <label htmlFor="price_card">
                                                            Tarif Pelatihan
                                                            Offline
                                                        </label>

                                                        <div className="flex justify-between gap-1 w-full items-center">
                                                            <div className="w-[93%] flex gap-2 h-full">
                                                                <Dropdown
                                                                    value={
                                                                        data
                                                                            .subscription
                                                                            .price_training_offline
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setData(
                                                                            "subscription",
                                                                            {
                                                                                ...data.subscription,
                                                                                price_training_offline:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            }
                                                                        )
                                                                    }
                                                                    options={
                                                                        option_training_offline
                                                                    }
                                                                    optionLabel="price"
                                                                    optionValue="price"
                                                                    placeholder="Pilih Tarif"
                                                                    editable
                                                                    valueTemplate={
                                                                        selectedOptionTrainingTemplate
                                                                    }
                                                                    itemTemplate={
                                                                        optionTrainingTemplate
                                                                    }
                                                                    className="w-full md:w-14rem"
                                                                />
                                                            </div>
                                                            <div className="h-full flex items-center">
                                                                <Button
                                                                    className="bg-red-500 h-1 w-1 shadow-md rounded-full "
                                                                    icon={() => (
                                                                        <i
                                                                            className="pi pi-minus"
                                                                            style={{
                                                                                fontSize:
                                                                                    "0.7rem",
                                                                            }}
                                                                        ></i>
                                                                    )}
                                                                    onClick={() => {
                                                                        setInputPriceTrainingOffline(
                                                                            (
                                                                                prev
                                                                            ) =>
                                                                                (prev = false)
                                                                        );
                                                                        setData(
                                                                            "subscription",
                                                                            {
                                                                                ...data.subscription,
                                                                                price_training_offline:
                                                                                    null,
                                                                            }
                                                                        );
                                                                    }}
                                                                    aria-controls="popup_menu_right"
                                                                    aria-haspopup
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="flex justify-center">
                                                    {!inputPriceTrainingOnline && (
                                                        <Button
                                                            label="Input Tarif Training Online"
                                                            className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm"
                                                            icon="pi pi-plus-circle"
                                                            onClick={() =>
                                                                setInputPriceTrainingOnline(
                                                                    (prev) =>
                                                                        (prev = true)
                                                                )
                                                            }
                                                            aria-controls="popup_menu_right"
                                                            aria-haspopup
                                                        />
                                                    )}
                                                </div>

                                                {inputPriceTrainingOnline && (
                                                    <>
                                                        <label htmlFor="price_card">
                                                            Tarif Pelatihan
                                                            Online
                                                        </label>

                                                        <div className="flex justify-between gap-1 w-full items-center">
                                                            <div className="w-[93%] flex gap-2 h-full">
                                                                <div className="p-inputgroup flex-1 h-full">
                                                                    <InputNumber
                                                                        value={
                                                                            data
                                                                                .subscription
                                                                                .price_training_online
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setData(
                                                                                "subscription",
                                                                                {
                                                                                    ...data.subscription,
                                                                                    price_training_online:
                                                                                        e.value,
                                                                                }
                                                                            )
                                                                        }
                                                                        className={`h-full`}
                                                                        locale="id-ID"
                                                                    />

                                                                    <Button
                                                                        type="button"
                                                                        className="h-[35px]"
                                                                        icon="pi pi-info-circle"
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            infoPriceTrainingOnlineRef.current.toggle(
                                                                                e
                                                                            )
                                                                        }
                                                                    />
                                                                    <OverlayPanel
                                                                        className="shadow-md"
                                                                        ref={
                                                                            infoPriceTrainingOnlineRef
                                                                        }
                                                                    >
                                                                        <ul className="list-disc list-inside">
                                                                            <li>
                                                                                Harga
                                                                                Implementasi
                                                                                Training
                                                                                dan/atau
                                                                                sosialisasi
                                                                                secara
                                                                                Daring/Online
                                                                            </li>
                                                                            <li>
                                                                                Harga
                                                                                implementasi
                                                                                3x
                                                                                sesi
                                                                                training
                                                                                secara
                                                                                gratis.
                                                                                (Harga
                                                                                yang
                                                                                di
                                                                                imput
                                                                                adalah
                                                                                harga
                                                                                training
                                                                                tambahan)
                                                                            </li>
                                                                        </ul>
                                                                    </OverlayPanel>
                                                                </div>
                                                            </div>
                                                            <div className="h-full flex items-center">
                                                                <Button
                                                                    className="bg-red-500 h-1 w-1 shadow-md rounded-full "
                                                                    icon={() => (
                                                                        <i
                                                                            className="pi pi-minus"
                                                                            style={{
                                                                                fontSize:
                                                                                    "0.7rem",
                                                                            }}
                                                                        ></i>
                                                                    )}
                                                                    onClick={() => {
                                                                        setInputPriceTrainingOnline(
                                                                            (
                                                                                prev
                                                                            ) =>
                                                                                (prev = false)
                                                                        );
                                                                        setData(
                                                                            "subscription",
                                                                            {
                                                                                ...data.subscription,
                                                                                price_training_online:
                                                                                    null,
                                                                            }
                                                                        );
                                                                    }}
                                                                    aria-controls="popup_menu_right"
                                                                    aria-haspopup
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="flex justify-center">
                                                    {!inputFeePurchaseCazhpoin && (
                                                        <Button
                                                            label="Input Tarif Isi Kartu Via Cazhpoin"
                                                            className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm"
                                                            icon="pi pi-plus-circle"
                                                            onClick={() =>
                                                                setInputFeePurchaseCazhpoin(
                                                                    (prev) =>
                                                                        (prev = true)
                                                                )
                                                            }
                                                            aria-controls="popup_menu_right"
                                                            aria-haspopup
                                                        />
                                                    )}
                                                </div>

                                                {inputFeePurchaseCazhpoin && (
                                                    <>
                                                        <label htmlFor="price_card">
                                                            Tarif Isi Kartu Via
                                                            Cazhpoin
                                                        </label>

                                                        <div className="flex justify-between gap-1 w-full items-center">
                                                            <div className="w-[93%] flex gap-2 h-full">
                                                                <Dropdown
                                                                    value={
                                                                        data
                                                                            .subscription
                                                                            .fee_purchase_cazhpoin
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setData(
                                                                            "subscription",
                                                                            {
                                                                                ...data.subscription,
                                                                                fee_purchase_cazhpoin:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            }
                                                                        )
                                                                    }
                                                                    options={
                                                                        option_fee
                                                                    }
                                                                    optionLabel="name"
                                                                    optionValue="name"
                                                                    placeholder="Pilih Tarif"
                                                                    editable
                                                                    valueTemplate={
                                                                        selectedOptionTemplate
                                                                    }
                                                                    itemTemplate={
                                                                        optionTemplate
                                                                    }
                                                                    className="w-full md:w-14rem"
                                                                />
                                                            </div>
                                                            <div className="h-full flex items-center">
                                                                <Button
                                                                    className="bg-red-500 h-1 w-1 shadow-md rounded-full "
                                                                    icon={() => (
                                                                        <i
                                                                            className="pi pi-minus"
                                                                            style={{
                                                                                fontSize:
                                                                                    "0.7rem",
                                                                            }}
                                                                        ></i>
                                                                    )}
                                                                    onClick={() => {
                                                                        setInputFeePurchaseCazhpoin(
                                                                            (
                                                                                prev
                                                                            ) =>
                                                                                (prev = false)
                                                                        );
                                                                        setData(
                                                                            "subscription",
                                                                            {
                                                                                ...data.subscription,
                                                                                fee_purchase_cazhpoin:
                                                                                    null,
                                                                            }
                                                                        );
                                                                    }}
                                                                    aria-controls="popup_menu_right"
                                                                    aria-haspopup
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="flex justify-center">
                                                    {!inputFeeBillCazhpoin && (
                                                        <Button
                                                            label="Input Tarif Bayar Tagihan via CazhPOIN
                                                            "
                                                            className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm"
                                                            icon="pi pi-plus-circle"
                                                            onClick={() =>
                                                                setInputFeeBillCazhpoin(
                                                                    (prev) =>
                                                                        (prev = true)
                                                                )
                                                            }
                                                            aria-controls="popup_menu_right"
                                                            aria-haspopup
                                                        />
                                                    )}
                                                </div>

                                                {inputFeeBillCazhpoin && (
                                                    <>
                                                        <label htmlFor="price_card">
                                                            Tarif Bayar Tagihan
                                                            via CazhPOIN
                                                        </label>

                                                        <div className="flex justify-between gap-1 w-full items-center">
                                                            <div className="w-[93%] flex gap-2 h-full">
                                                                <Dropdown
                                                                    value={
                                                                        data
                                                                            .subscription
                                                                            .fee_bill_cazhpoin
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setData(
                                                                            "subscription",
                                                                            {
                                                                                ...data.subscription,
                                                                                fee_bill_cazhpoin:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            }
                                                                        )
                                                                    }
                                                                    options={
                                                                        option_fee
                                                                    }
                                                                    optionLabel="name"
                                                                    optionValue="name"
                                                                    placeholder="Pilih Tarif"
                                                                    editable
                                                                    valueTemplate={
                                                                        selectedOptionTemplate
                                                                    }
                                                                    itemTemplate={
                                                                        optionTemplate
                                                                    }
                                                                    className="w-full md:w-14rem"
                                                                />
                                                            </div>
                                                            <div className="h-full flex items-center">
                                                                <Button
                                                                    className="bg-red-500 h-1 w-1 shadow-md rounded-full "
                                                                    icon={() => (
                                                                        <i
                                                                            className="pi pi-minus"
                                                                            style={{
                                                                                fontSize:
                                                                                    "0.7rem",
                                                                            }}
                                                                        ></i>
                                                                    )}
                                                                    onClick={() => {
                                                                        setInputFeeBillCazhpoin(
                                                                            (
                                                                                prev
                                                                            ) =>
                                                                                (prev = false)
                                                                        );
                                                                        setData(
                                                                            "subscription",
                                                                            {
                                                                                ...data.subscription,
                                                                                fee_bill_cazhpoin:
                                                                                    null,
                                                                            }
                                                                        );
                                                                    }}
                                                                    aria-controls="popup_menu_right"
                                                                    aria-haspopup
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="flex justify-center">
                                                    {!inputFeeTopupCazhpos && (
                                                        <Button
                                                            label="Input Tarif TopUp Kartu via Cazh POS
                                                            "
                                                            className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm"
                                                            icon="pi pi-plus-circle"
                                                            onClick={() =>
                                                                setInputFeeTopupCazhpos(
                                                                    (prev) =>
                                                                        (prev = true)
                                                                )
                                                            }
                                                            aria-controls="popup_menu_right"
                                                            aria-haspopup
                                                        />
                                                    )}
                                                </div>

                                                {inputFeeTopupCazhpos && (
                                                    <>
                                                        <label htmlFor="price_card">
                                                            Tarif TopUp Kartu
                                                            via Cazh POS
                                                        </label>

                                                        <div className="flex justify-between gap-1 w-full items-center">
                                                            <div className="w-[93%] flex gap-2 h-full">
                                                                <Dropdown
                                                                    value={
                                                                        data
                                                                            .subscription
                                                                            .fee_topup_cazhpos
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setData(
                                                                            "subscription",
                                                                            {
                                                                                ...data.subscription,
                                                                                fee_topup_cazhpos:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            }
                                                                        )
                                                                    }
                                                                    options={
                                                                        option_fee
                                                                    }
                                                                    optionLabel="name"
                                                                    optionValue="name"
                                                                    placeholder="Pilih Tarif"
                                                                    editable
                                                                    valueTemplate={
                                                                        selectedOptionTemplate
                                                                    }
                                                                    itemTemplate={
                                                                        optionTemplate
                                                                    }
                                                                    className="w-full md:w-14rem"
                                                                />
                                                            </div>
                                                            <div className="h-full flex items-center">
                                                                <Button
                                                                    className="bg-red-500 h-1 w-1 shadow-md rounded-full "
                                                                    icon={() => (
                                                                        <i
                                                                            className="pi pi-minus"
                                                                            style={{
                                                                                fontSize:
                                                                                    "0.7rem",
                                                                            }}
                                                                        ></i>
                                                                    )}
                                                                    onClick={() => {
                                                                        setInputFeeTopupCazhpos(
                                                                            (
                                                                                prev
                                                                            ) =>
                                                                                (prev = false)
                                                                        );
                                                                        setData(
                                                                            "subscription",
                                                                            {
                                                                                ...data.subscription,
                                                                                fee_topup_cazhpos:
                                                                                    null,
                                                                            }
                                                                        );
                                                                    }}
                                                                    aria-controls="popup_menu_right"
                                                                    aria-haspopup
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="flex justify-center">
                                                    {!inputFeeWithdrawCazhpos && (
                                                        <Button
                                                            label="Input Penarikan Saldo Kartu via Cazh POS
                                                            "
                                                            className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm"
                                                            icon="pi pi-plus-circle"
                                                            onClick={() =>
                                                                setInputFeeWithdrawCazhpos(
                                                                    (prev) =>
                                                                        (prev = true)
                                                                )
                                                            }
                                                            aria-controls="popup_menu_right"
                                                            aria-haspopup
                                                        />
                                                    )}
                                                </div>

                                                {inputFeeWithdrawCazhpos && (
                                                    <>
                                                        <label htmlFor="price_card">
                                                            Tarif Penarikan
                                                            Saldo Kartu via Cazh
                                                            POS
                                                        </label>

                                                        <div className="flex justify-between gap-1 w-full items-center">
                                                            <div className="w-[93%] flex gap-2 h-full">
                                                                <Dropdown
                                                                    value={
                                                                        data
                                                                            .subscription
                                                                            .fee_withdraw_cazhpos
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setData(
                                                                            "subscription",
                                                                            {
                                                                                ...data.subscription,
                                                                                fee_withdraw_cazhpos:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            }
                                                                        )
                                                                    }
                                                                    options={
                                                                        option_fee
                                                                    }
                                                                    optionLabel="name"
                                                                    optionValue="name"
                                                                    placeholder="Pilih Tarif"
                                                                    editable
                                                                    valueTemplate={
                                                                        selectedOptionTemplate
                                                                    }
                                                                    itemTemplate={
                                                                        optionTemplate
                                                                    }
                                                                    className="w-full md:w-14rem"
                                                                />
                                                            </div>
                                                            <div className="h-full flex items-center">
                                                                <Button
                                                                    className="bg-red-500 h-1 w-1 shadow-md rounded-full "
                                                                    icon={() => (
                                                                        <i
                                                                            className="pi pi-minus"
                                                                            style={{
                                                                                fontSize:
                                                                                    "0.7rem",
                                                                            }}
                                                                        ></i>
                                                                    )}
                                                                    onClick={() => {
                                                                        setInputFeeWithdrawCazhpos(
                                                                            (
                                                                                prev
                                                                            ) =>
                                                                                (prev = false)
                                                                        );
                                                                        setData(
                                                                            "subscription",
                                                                            {
                                                                                ...data.subscription,
                                                                                fee_withdraw_cazhpos:
                                                                                    null,
                                                                            }
                                                                        );
                                                                    }}
                                                                    aria-controls="popup_menu_right"
                                                                    aria-haspopup
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex justify-center">
                                                    {!inputFeeBillSaldokartu && (
                                                        <Button
                                                            label="Input Pembayaran Tagihan via Saldo Kartu
                                                            "
                                                            className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm"
                                                            icon="pi pi-plus-circle"
                                                            onClick={() =>
                                                                setInputFeeBillSaldokartu(
                                                                    (prev) =>
                                                                        (prev = true)
                                                                )
                                                            }
                                                            aria-controls="popup_menu_right"
                                                            aria-haspopup
                                                        />
                                                    )}
                                                </div>

                                                {inputFeeBillSaldokartu && (
                                                    <>
                                                        <label htmlFor="price_card">
                                                            Tarif Pembayaran
                                                            Tagihan via Saldo
                                                            Kartu
                                                        </label>

                                                        <div className="flex justify-between gap-1 w-full items-center">
                                                            <div className="w-[93%] flex gap-2 h-full">
                                                                <Dropdown
                                                                    value={
                                                                        data
                                                                            .subscription
                                                                            .fee_bill_saldokartu
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setData(
                                                                            "subscription",
                                                                            {
                                                                                ...data.subscription,
                                                                                fee_bill_saldokartu:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            }
                                                                        )
                                                                    }
                                                                    options={
                                                                        option_fee
                                                                    }
                                                                    optionLabel="name"
                                                                    optionValue="name"
                                                                    placeholder="Pilih Tarif"
                                                                    editable
                                                                    valueTemplate={
                                                                        selectedOptionTemplate
                                                                    }
                                                                    itemTemplate={
                                                                        optionTemplate
                                                                    }
                                                                    className="w-full md:w-14rem"
                                                                />
                                                            </div>
                                                            <div className="h-full flex items-center">
                                                                <Button
                                                                    className="bg-red-500 h-1 w-1 shadow-md rounded-full "
                                                                    icon={() => (
                                                                        <i
                                                                            className="pi pi-minus"
                                                                            style={{
                                                                                fontSize:
                                                                                    "0.7rem",
                                                                            }}
                                                                        ></i>
                                                                    )}
                                                                    onClick={() => {
                                                                        setInputFeeBillSaldokartu(
                                                                            (
                                                                                prev
                                                                            ) =>
                                                                                (prev = false)
                                                                        );
                                                                        setData(
                                                                            "subscription",
                                                                            {
                                                                                ...data.subscription,
                                                                                fee_bill_saldokartu:
                                                                                    null,
                                                                            }
                                                                        );
                                                                    }}
                                                                    aria-controls="popup_menu_right"
                                                                    aria-haspopup
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                                <Button
                                    ref={btnSubmit}
                                    type="submit"
                                    label="Submit"
                                    disabled={processing}
                                    hidden={true}
                                    className="bg-purple-600 text-sm hidden shadow-md rounded-lg"
                                />
                            </form>
                        </Dialog>
                    </div>

                    {/* Modal edit partner */}
                    <div className="card flex justify-content-center">
                        <Dialog
                            ref={modalPartner}
                            header="Partner"
                            headerClassName="dark:glass shadow-md z-20 dark:text-white"
                            className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                            contentClassName=" dark:glass dark:text-white"
                            visible={modalEditPartnersIsVisible}
                            onHide={() => setModalEditPartnersIsVisible(false)}
                        >
                            <form
                                onSubmit={(e) => handleSubmitForm(e, "update")}
                            >
                                <div className="flex flex-col justify-around gap-4 mt-1">
                                    <div className="flex flex-col">
                                        <label htmlFor="name">Nama *</label>
                                        <InputText
                                            value={data.partner.name}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300"
                                            id="name"
                                            aria-describedby="name-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="name">
                                            Nomor Telepon *
                                        </label>
                                        <InputText
                                            keyfilter="int"
                                            value={data.partner.phone_number}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    phone_number:
                                                        e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300"
                                            id="phone_number"
                                            aria-describedby="phone_number-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="sales">Sales *</label>
                                        <Dropdown
                                            value={data.partner.sales}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    sales: e.target.value,
                                                })
                                            }
                                            options={sales}
                                            optionLabel="name"
                                            placeholder="Pilih Sales"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="account_manager">
                                            Account Manager (AM)
                                        </label>
                                        <Dropdown
                                            value={data.partner.account_manager}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    account_manager:
                                                        e.target.value,
                                                })
                                            }
                                            options={account_managers}
                                            optionLabel="name"
                                            placeholder="Pilih Account Manager (AM)"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="register_date">
                                            Tanggal Onboarding *
                                        </label>
                                        <Calendar
                                            value={
                                                data.partner.onboarding_date
                                                    ? new Date(
                                                          data.partner.onboarding_date
                                                      )
                                                    : null
                                            }
                                            style={{ height: "35px" }}
                                            onChange={(e) => {
                                                setData("partner", {
                                                    ...data.partner,
                                                    onboarding_date:
                                                        e.target.value,
                                                });
                                            }}
                                            showIcon
                                            dateFormat="dd/mm/yy"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="live_date">
                                            Tanggal Live
                                        </label>
                                        <Calendar
                                            value={
                                                data.partner.live_date
                                                    ? new Date(
                                                          data.partner.live_date
                                                      )
                                                    : null
                                            }
                                            style={{ height: "35px" }}
                                            onChange={(e) => {
                                                const onboarding_age =
                                                    Math.ceil(
                                                        (e.target.value -
                                                            data.partner
                                                                .onboarding_date) /
                                                            (1000 *
                                                                60 *
                                                                60 *
                                                                24)
                                                    );

                                                const live_age = Math.ceil(
                                                    (new Date() -
                                                        e.target.value) /
                                                        (1000 * 60 * 60 * 24)
                                                );

                                                const monitoring_date_after_3_month_live =
                                                    new Date(
                                                        e.target.value
                                                    ).setMonth(
                                                        new Date(
                                                            e.target.value
                                                        ).getMonth() + 3,
                                                        new Date(
                                                            e.target.value
                                                        ).getDate() - 1
                                                    );

                                                setData("partner", {
                                                    ...data.partner,
                                                    live_date: e.target.value,
                                                    onboarding_age:
                                                        onboarding_age,
                                                    live_age: live_age,
                                                    monitoring_date_after_3_month_live:
                                                        new Date(
                                                            monitoring_date_after_3_month_live
                                                        ),
                                                });
                                            }}
                                            showIcon
                                            dateFormat="dd/mm/yy"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="name">
                                            Umur Onboarding (hari)
                                        </label>
                                        <InputText
                                            value={data.partner.onboarding_age}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    onboarding_age:
                                                        e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300"
                                            id="onboarding_age"
                                            aria-describedby="onboarding_age-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="name">
                                            Umur Live (hari)
                                        </label>
                                        <InputText
                                            value={data.partner.live_age}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    live_age: e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300"
                                            id="live_age"
                                            aria-describedby="live_age-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="live_date">
                                            Tanggal Monitoring 3 Bulan After
                                            Live
                                        </label>
                                        <Calendar
                                            value={
                                                data.partner
                                                    .monitoring_date_after_3_month_live
                                                    ? new Date(
                                                          data.partner.monitoring_date_after_3_month_live
                                                      )
                                                    : null
                                            }
                                            style={{ height: "35px" }}
                                            onChange={(e) => {
                                                setData("partner", {
                                                    ...data.partner,
                                                    monitoring_date_after_3_month_live:
                                                        e.target.value,
                                                });
                                            }}
                                            showIcon
                                            dateFormat="yy-mm-dd"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="address">Alamat</label>
                                        <InputTextarea
                                            value={data.partner.address}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    address: e.target.value,
                                                })
                                            }
                                            rows={5}
                                            cols={30}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="status">Status *</label>
                                        <Dropdown
                                            value={data.partner.status}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    status: e.target.value,
                                                })
                                            }
                                            options={status}
                                            optionLabel="name"
                                            optionValue="name"
                                            placeholder="Pilih Status"
                                            className="w-full md:w-14rem"
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
                                filters={filters}
                                globalFilterFields={[
                                    "name",
                                    "sales.name",
                                    "account_manager.name",
                                ]}
                                emptyMessage="Partner tidak ditemukan."
                                paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                                header={header}
                                value={partners}
                                dataKey="id"
                            >
                                <Column
                                    header="No"
                                    body={(_, { rowIndex }) => rowIndex + 1}
                                    className="dark:border-none pl-6"
                                    headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                                    style={{ width: "3%" }}
                                />
                                <Column
                                    header="Nama"
                                    body={(rowData) => (
                                        <button
                                            onClick={() =>
                                                handleSelectedDetailPartner(
                                                    rowData
                                                )
                                            }
                                            className="hover:text-blue-700"
                                        >
                                            {rowData.name}
                                        </button>
                                    )}
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    align="left"
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                                <Column
                                    field="uuid"
                                    hidden
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    header="Nama"
                                    align="left"
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                                <Column
                                    field="phone_number"
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    header="No. Telepon"
                                    align="left"
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                                <Column
                                    header="Sales"
                                    body={(rowData) => rowData.sales.name}
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    align="left"
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                                <Column
                                    header="Account Manager"
                                    body={(rowData) =>
                                        rowData.account_manager.name
                                    }
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    align="left"
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                                <Column
                                    header="Tanggal onboarding"
                                    body={(rowData) =>
                                        new Date(
                                            rowData.onboarding_date
                                        ).toLocaleDateString("id")
                                    }
                                    className="dark:border-none"
                                    headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                    align="left"
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                                <Column
                                    header="Tanggal live"
                                    body={(rowData) =>
                                        new Date(
                                            rowData.live_date
                                        ).toLocaleDateString("id")
                                    }
                                    className="dark:border-none"
                                    headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                    align="left"
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                                <Column
                                    header="Tanggal Monitoring (3 bulan setelah live)"
                                    body={(rowData) =>
                                        new Date(
                                            rowData.monitoring_date_after_3_month_live
                                        ).toLocaleDateString("id")
                                    }
                                    className="dark:border-none"
                                    headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                    align="left"
                                    style={{ minWidth: "12rem" }}
                                ></Column>
                                <Column
                                    header="Umur Onboarding"
                                    body={(rowData) =>
                                        rowData.onboarding_age + " hari"
                                    }
                                    className="dark:border-none"
                                    headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                    align="left"
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                                <Column
                                    header="Umur Live"
                                    body={(rowData) =>
                                        rowData.live_age + " hari"
                                    }
                                    className="dark:border-none"
                                    headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                    align="left"
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                                <Column
                                    header="Umur Live"
                                    body={(rowData) =>
                                        rowData.live_age + " hari"
                                    }
                                    className="dark:border-none"
                                    headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                    align="left"
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                                <Column
                                    header="Status"
                                    body={(rowData) => {
                                        return (
                                            <Badge
                                                value={rowData.status}
                                                className="text-white"
                                                severity={
                                                    rowData.status == "Aktif"
                                                        ? "success"
                                                        : null ||
                                                          rowData.status ==
                                                              "CLBK"
                                                        ? "info"
                                                        : null ||
                                                          rowData.status ==
                                                              "Proses"
                                                        ? "warning"
                                                        : null ||
                                                          rowData.status ==
                                                              "Non Aktif"
                                                        ? "danger"
                                                        : null
                                                }
                                            ></Badge>
                                        );
                                    }}
                                    className="dark:border-none"
                                    headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                    align="left"
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                                <Column
                                    header="Action"
                                    body={actionBodyTemplate}
                                    style={{ minWidth: "8rem" }}
                                    className="dark:border-none"
                                    headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                ></Column>
                            </DataTable>
                        </div>
                    </div>
                </TabPanel>

                <TabPanel header="PIC">
                    {/* Modal tambah pic */}
                    <div className="card flex justify-content-center">
                        <Dialog
                            header="PIC"
                            headerClassName="dark:glass dark:text-white"
                            className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                            contentClassName="dark:glass dark:text-white"
                            visible={modalPicIsVisible}
                            onHide={() => setModalPicIsVisible(false)}
                        >
                            <form
                                onSubmit={(e) =>
                                    handleSubmitFormPIC(e, "tambah")
                                }
                            >
                                <div className="flex flex-col justify-around gap-4 mt-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="name">Nama</label>
                                        <InputText
                                            value={dataPIC.name}
                                            onChange={(e) =>
                                                setDataPIC(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            className="dark:bg-gray-300"
                                            id="name"
                                            aria-describedby="name-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="pic_partner">
                                            Partner
                                        </label>
                                        <Dropdown
                                            optionLabel="name"
                                            value={dataPIC.partner}
                                            onChange={(e) =>
                                                setDataPIC(
                                                    "partner",
                                                    e.target.value
                                                )
                                            }
                                            options={partners}
                                            placeholder="Pilih Partner"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="number">No.Hp</label>
                                        <InputText
                                            keyfilter="int"
                                            min={0}
                                            value={dataPIC.number}
                                            onChange={(e) =>
                                                setDataPIC(
                                                    "number",
                                                    e.target.value
                                                )
                                            }
                                            className="dark:bg-gray-300"
                                            id="number"
                                            aria-describedby="number-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="position">
                                            Jabatan
                                        </label>
                                        <InputText
                                            value={dataPIC.position}
                                            onChange={(e) =>
                                                setDataPIC(
                                                    "position",
                                                    e.target.value
                                                )
                                            }
                                            className="dark:bg-gray-300"
                                            id="position"
                                            aria-describedby="position-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="address">Alamat</label>
                                        <InputTextarea
                                            value={dataPIC.address}
                                            onChange={(e) =>
                                                setDataPIC(
                                                    "address",
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
                                        disabled={processingPIC}
                                        className="bg-purple-600 text-sm shadow-md rounded-lg"
                                    />
                                </div>
                            </form>
                        </Dialog>
                    </div>

                    {/* Modal edit pic */}
                    <div className="card flex justify-content-center">
                        <Dialog
                            header="Edit PIC"
                            headerClassName="dark:glass shadow-md z-20 dark:text-white"
                            className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                            contentClassName=" dark:glass dark:text-white"
                            visible={modalEditPicIsVisible}
                            onHide={() => setModalEditPicIsVisible(false)}
                        >
                            <form
                                onSubmit={(e) =>
                                    handleSubmitFormPIC(e, "update")
                                }
                            >
                                <div className="flex flex-col justify-around gap-4 mt-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="name">Nama</label>
                                        <InputText
                                            value={dataPIC.name}
                                            onChange={(e) =>
                                                setDataPIC(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            className="dark:bg-gray-300"
                                            id="name"
                                            aria-describedby="name-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="pic_partner">
                                            Partner
                                        </label>

                                        <Dropdown
                                            value={dataPIC.partner}
                                            options={partners}
                                            onChange={(e) =>
                                                setDataPIC(
                                                    "partner",
                                                    e.target.value
                                                )
                                            }
                                            optionLabel="name"
                                            placeholder="Pilih Partner"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="number">No.Hp</label>
                                        <InputText
                                            keyfilter="int"
                                            min={0}
                                            value={dataPIC.number}
                                            onChange={(e) =>
                                                setDataPIC(
                                                    "number",
                                                    e.target.value
                                                )
                                            }
                                            className="dark:bg-gray-300"
                                            id="number"
                                            aria-describedby="number-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="position">
                                            Jabatan
                                        </label>
                                        <InputText
                                            value={dataPIC.position}
                                            onChange={(e) =>
                                                setDataPIC(
                                                    "position",
                                                    e.target.value
                                                )
                                            }
                                            className="dark:bg-gray-300"
                                            id="position"
                                            aria-describedby="position-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="address">Alamat</label>
                                        <InputTextarea
                                            value={dataPIC.address}
                                            onChange={(e) =>
                                                setDataPIC(
                                                    "address",
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
                                        disabled={processingPIC}
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
                                emptyMessage="Partner tidak ditemukan."
                                paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                                header={header}
                                filters={filters}
                                globalFilterFields={["name", "partner.name"]}
                                value={pics}
                                dataKey="id"
                            >
                                <Column
                                    header="No"
                                    body={(_, { rowIndex }) => rowIndex + 1}
                                    className="dark:border-none pl-6"
                                    headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                                    style={{ width: "3%" }}
                                />
                                <Column
                                    field="name"
                                    header="PIC"
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    align="left"
                                    style={{ width: "15%" }}
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
                                    style={{ width: "15%" }}
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
                                    field="number"
                                    header="Nomor Handphone"
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    align="left"
                                    style={{ width: "15%" }}
                                ></Column>
                                <Column
                                    field="position"
                                    header="Jabatan"
                                    className="dark:border-none"
                                    headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                    align="left"
                                    style={{ width: "15%" }}
                                ></Column>
                                <Column
                                    field="address"
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    header="Alamat"
                                    align="left"
                                    style={{ width: "20%" }}
                                ></Column>
                                <Column
                                    header="Action"
                                    body={actionBodyTemplatePIC}
                                    style={{ width: "10%" }}
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                ></Column>
                            </DataTable>
                        </div>
                    </div>
                </TabPanel>

                <TabPanel header="Bank">
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
                            <form
                                onSubmit={(e) =>
                                    handleSubmitFormBank(e, "tambah")
                                }
                            >
                                <div className="flex flex-col justify-around gap-4 mt-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="partner_subcription">
                                            Partner
                                        </label>
                                        <Dropdown
                                            optionLabel="name"
                                            value={dataBank.partner}
                                            onChange={(e) =>
                                                setDataBank(
                                                    "partner",
                                                    e.target.value
                                                )
                                            }
                                            options={partners}
                                            placeholder="Pilih Partner"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="bank">Bank</label>
                                        <InputText
                                            value={dataBank.bank}
                                            onChange={(e) =>
                                                setDataBank(
                                                    "bank",
                                                    e.target.value
                                                )
                                            }
                                            className="dark:bg-gray-300"
                                            id="bank"
                                            aria-describedby="bank-help"
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
                            <form
                                onSubmit={(e) =>
                                    handleSubmitFormBank(e, "update")
                                }
                            >
                                <div className="flex flex-col justify-around gap-4 mt-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="partner_subcription">
                                            Partner
                                        </label>
                                        <Dropdown
                                            optionLabel="name"
                                            value={dataBank.partner}
                                            onChange={(e) =>
                                                setDataBank(
                                                    "partner",
                                                    e.target.value
                                                )
                                            }
                                            options={partners}
                                            placeholder="Pilih Partner"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="bank">Bank</label>
                                        <InputText
                                            value={dataBank.bank}
                                            onChange={(e) =>
                                                setDataBank(
                                                    "bank",
                                                    e.target.value
                                                )
                                            }
                                            className="dark:bg-gray-300"
                                            id="bank"
                                            aria-describedby="bank-help"
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
                                ]}
                                value={banks}
                                dataKey="id"
                            >
                                <Column
                                    header="No"
                                    body={(_, { rowIndex }) => rowIndex + 1}
                                    className="dark:border-none pl-6"
                                    headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                                    style={{ width: "3%" }}
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
                                    style={{ width: "15%" }}
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
                                    field="account_bank_name"
                                    header="Atas Nama"
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    align="left"
                                    style={{ width: "10%" }}
                                ></Column>
                                <Column
                                    field="bank"
                                    header="Bank"
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    align="left"
                                    style={{ width: "10%" }}
                                ></Column>
                                <Column
                                    field="account_bank_number"
                                    header="Nomor Rekening"
                                    className="dark:border-none"
                                    headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                    align="left"
                                    style={{ width: "15%" }}
                                ></Column>
                                <Column
                                    header="Action"
                                    body={actionBodyTemplateBank}
                                    style={{ width: "10%" }}
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                ></Column>
                            </DataTable>
                        </div>
                    </div>
                </TabPanel>

                <TabPanel header="Langganan">
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
                                    <div className="flex flex-col">
                                        <label htmlFor="nominal">
                                            Nominal Langganan *
                                        </label>
                                        <InputNumber
                                            value={dataSubscription.nominal}
                                            onValueChange={(e) => {
                                                const total_bill =
                                                    (e.target.value *
                                                        dataSubscription.ppn) /
                                                    100;
                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    nominal: e.target.value,
                                                    total_bill:
                                                        dataSubscription.ppn ===
                                                        0
                                                            ? e.target.value
                                                            : total_bill,
                                                });
                                            }}
                                            locale="id-ID"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="ppn">PPN(%)</label>
                                        <InputNumber
                                            value={dataSubscription.ppn}
                                            onValueChange={(e) => {
                                                const ppn =
                                                    (e.target.value *
                                                        dataSubscription.nominal) /
                                                    100;
                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    ppn: e.target.value,
                                                    total_bill:
                                                        dataSubscription.nominal +
                                                        ppn,
                                                });
                                            }}
                                            locale="id-ID"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="ppn">
                                            Total Tagihan(nominal + ppn)
                                        </label>
                                        <InputNumber
                                            value={dataSubscription.total_bill}
                                            onValueChange={(e) => {
                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    total_bill: e.target.value,
                                                });
                                            }}
                                            locale="id-ID"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="period">Periode*</label>
                                        <Dropdown
                                            value={dataSubscription.period}
                                            onChange={(e) => {
                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    period: e.target.value,
                                                });
                                            }}
                                            options={option_period_subscription}
                                            optionLabel="name"
                                            optionValue="name"
                                            placeholder="Langganan Per-"
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className={`w-full md:w-14rem`}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Tarif Kartu
                                        </label>

                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <InputNumber
                                                    placeholder="tarif"
                                                    value={
                                                        dataSubscription
                                                            .price_card.price
                                                    }
                                                    onValueChange={(e) =>
                                                        setDataSubscription({
                                                            ...dataSubscription,
                                                            price_card: {
                                                                ...dataSubscription.price_card,
                                                                price: e.target
                                                                    .value,
                                                            },
                                                        })
                                                    }
                                                    className="dark:bg-gray-300 w-full"
                                                    id="account_bank_name"
                                                    aria-describedby="account_bank_name-help"
                                                    locale="id-ID"
                                                />
                                                <Dropdown
                                                    value={
                                                        dataSubscription
                                                            .price_card.type
                                                    }
                                                    onChange={(e) =>
                                                        setDataSubscription({
                                                            ...dataSubscription,
                                                            price_card: {
                                                                ...dataSubscription.price_card,
                                                                type: e.target
                                                                    .value,
                                                            },
                                                        })
                                                    }
                                                    options={cardCategories}
                                                    optionLabel="name"
                                                    optionValue="name"
                                                    placeholder="kategori"
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Tarif Lanyard
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <Dropdown
                                                    value={
                                                        dataSubscription.price_lanyard
                                                    }
                                                    onChange={(e) =>
                                                        setDataSubscription({
                                                            ...dataSubscription,
                                                            price_lanyard:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={
                                                        option_price_lanyard
                                                    }
                                                    optionLabel="price"
                                                    optionValue="price"
                                                    placeholder="Pilih Tarif"
                                                    editable
                                                    valueTemplate={
                                                        selectedOptionTrainingTemplate
                                                    }
                                                    itemTemplate={
                                                        optionTrainingTemplate
                                                    }
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Tarif Langganan Sistem
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <InputNumber
                                                    placeholder="tarif"
                                                    value={
                                                        dataSubscription.price_subscription_system
                                                    }
                                                    onValueChange={(e) =>
                                                        setDataSubscription({
                                                            ...dataSubscription,
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
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Tarif Pelatihan Offline
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <Dropdown
                                                    value={
                                                        dataSubscription.price_training_offline
                                                    }
                                                    onChange={(e) =>
                                                        setDataSubscription({
                                                            ...dataSubscription,
                                                            price_training_offline:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={
                                                        option_training_offline
                                                    }
                                                    optionLabel="price"
                                                    optionValue="price"
                                                    placeholder="Pilih Tarif"
                                                    editable
                                                    valueTemplate={
                                                        selectedOptionTrainingTemplate
                                                    }
                                                    itemTemplate={
                                                        optionTrainingTemplate
                                                    }
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Tarif Pelatihan Online
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <div className="p-inputgroup flex-1 h-full">
                                                    <InputNumber
                                                        value={
                                                            dataSubscription.price_training_online
                                                        }
                                                        onChange={(e) =>
                                                            setDataSubscription(
                                                                {
                                                                    ...dataSubscription,
                                                                    price_training_online:
                                                                        e.value,
                                                                }
                                                            )
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
                                                        ref={
                                                            infoPriceTrainingOnlineRef
                                                        }
                                                    >
                                                        <ul className="list-disc list-inside">
                                                            <li>
                                                                Harga
                                                                Implementasi
                                                                Training
                                                                dan/atau
                                                                sosialisasi
                                                                secara
                                                                Daring/Online
                                                            </li>
                                                            <li>
                                                                Harga
                                                                implementasi 3x
                                                                sesi training
                                                                secara gratis.
                                                                (Harga yang di
                                                                imput adalah
                                                                harga training
                                                                tambahan)
                                                            </li>
                                                        </ul>
                                                    </OverlayPanel>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Tarif Isi Kartu Via Cazhpoin
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <Dropdown
                                                    value={
                                                        dataSubscription.fee_purchase_cazhpoin
                                                    }
                                                    onChange={(e) =>
                                                        setDataSubscription({
                                                            ...dataSubscription,
                                                            fee_purchase_cazhpoin:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={option_fee}
                                                    optionLabel="name"
                                                    optionValue="name"
                                                    placeholder="Pilih Tarif"
                                                    editable
                                                    valueTemplate={
                                                        selectedOptionTemplate
                                                    }
                                                    itemTemplate={
                                                        optionTemplate
                                                    }
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Tarif Bayar Tagihan via CazhPOIN
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <Dropdown
                                                    value={
                                                        dataSubscription.fee_bill_cazhpoin
                                                    }
                                                    onChange={(e) =>
                                                        setDataSubscription({
                                                            ...dataSubscription,
                                                            fee_bill_cazhpoin:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={option_fee}
                                                    optionLabel="name"
                                                    optionValue="name"
                                                    placeholder="Pilih Tarif"
                                                    editable
                                                    valueTemplate={
                                                        selectedOptionTemplate
                                                    }
                                                    itemTemplate={
                                                        optionTemplate
                                                    }
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Tarif TopUp Kartu via Cazh POS
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <Dropdown
                                                    value={
                                                        dataSubscription.fee_topup_cazhpos
                                                    }
                                                    onChange={(e) =>
                                                        setDataSubscription({
                                                            ...dataSubscription,
                                                            fee_topup_cazhpos:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={option_fee}
                                                    optionLabel="name"
                                                    optionValue="name"
                                                    placeholder="Pilih Tarif"
                                                    editable
                                                    valueTemplate={
                                                        selectedOptionTemplate
                                                    }
                                                    itemTemplate={
                                                        optionTemplate
                                                    }
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Tarif Penarikan Saldo Kartu via Cazh
                                            POS
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <Dropdown
                                                    value={
                                                        dataSubscription.fee_withdraw_cazhpos
                                                    }
                                                    onChange={(e) =>
                                                        setDataSubscription({
                                                            ...dataSubscription,
                                                            fee_withdraw_cazhpos:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={option_fee}
                                                    optionLabel="name"
                                                    optionValue="name"
                                                    placeholder="Pilih Tarif"
                                                    editable
                                                    valueTemplate={
                                                        selectedOptionTemplate
                                                    }
                                                    itemTemplate={
                                                        optionTemplate
                                                    }
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Tarif Pembayaran Tagihan via Saldo
                                            Kartu
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <Dropdown
                                                    value={
                                                        dataSubscription.fee_bill_saldokartu
                                                    }
                                                    onChange={(e) =>
                                                        setDataSubscription({
                                                            ...dataSubscription,
                                                            fee_bill_saldokartu:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={option_fee}
                                                    optionLabel="name"
                                                    optionValue="name"
                                                    placeholder="Pilih Tarif"
                                                    editable
                                                    valueTemplate={
                                                        selectedOptionTemplate
                                                    }
                                                    itemTemplate={
                                                        optionTemplate
                                                    }
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
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
                            onHide={() =>
                                setModalEditSubscriptionIsVisible(false)
                            }
                        >
                            <form
                                onSubmit={(e) =>
                                    handleSubmitFormSubscription(e, "update")
                                }
                            >
                                <div className="flex flex-col justify-around gap-4 mt-1">
                                    <div className="flex flex-col">
                                        <label htmlFor="nominal">
                                            Nominal Langganan *
                                        </label>
                                        <InputNumber
                                            value={dataSubscription.nominal}
                                            onValueChange={(e) => {
                                                const total_bill =
                                                    (e.target.value *
                                                        dataSubscription.ppn) /
                                                    100;
                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    nominal: e.target.value,
                                                    total_bill:
                                                        dataSubscription.ppn ===
                                                        0
                                                            ? e.target.value
                                                            : total_bill,
                                                });
                                            }}
                                            locale="id-ID"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="ppn">PPN(%)</label>
                                        <InputNumber
                                            value={dataSubscription.ppn}
                                            onValueChange={(e) => {
                                                const ppn =
                                                    (e.target.value *
                                                        dataSubscription.nominal) /
                                                    100;
                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    ppn: e.target.value,
                                                    total_bill:
                                                        dataSubscription.nominal +
                                                        ppn,
                                                });
                                            }}
                                            locale="id-ID"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="ppn">
                                            Total Tagihan(nominal + ppn)
                                        </label>
                                        <InputNumber
                                            value={dataSubscription.total_bill}
                                            onValueChange={(e) => {
                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    total_bill: e.target.value,
                                                });
                                            }}
                                            locale="id-ID"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="period">Periode*</label>
                                        <Dropdown
                                            value={dataSubscription.period}
                                            onChange={(e) => {
                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    period: e.target.value,
                                                });
                                            }}
                                            options={option_period_subscription}
                                            optionLabel="name"
                                            optionValue="name"
                                            placeholder="Langganan Per-"
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className={`w-full md:w-14rem`}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Tarif Kartu
                                        </label>

                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <InputNumber
                                                    placeholder="tarif"
                                                    value={
                                                        dataSubscription
                                                            .price_card.price
                                                    }
                                                    onValueChange={(e) =>
                                                        setDataSubscription({
                                                            ...dataSubscription,
                                                            price_card: {
                                                                ...dataSubscription.price_card,
                                                                price: e.target
                                                                    .value,
                                                            },
                                                        })
                                                    }
                                                    className="dark:bg-gray-300 w-full"
                                                    id="account_bank_name"
                                                    aria-describedby="account_bank_name-help"
                                                    locale="id-ID"
                                                />
                                                <Dropdown
                                                    value={
                                                        dataSubscription
                                                            .price_card.type
                                                    }
                                                    onChange={(e) =>
                                                        setDataSubscription({
                                                            ...dataSubscription,
                                                            price_card: {
                                                                ...dataSubscription.price_card,
                                                                type: e.target
                                                                    .value,
                                                            },
                                                        })
                                                    }
                                                    options={cardCategories}
                                                    optionLabel="name"
                                                    optionValue="name"
                                                    placeholder="kategori"
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Tarif Lanyard
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <Dropdown
                                                    value={
                                                        dataSubscription.price_lanyard
                                                    }
                                                    onChange={(e) =>
                                                        setDataSubscription({
                                                            ...dataSubscription,
                                                            price_lanyard:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={
                                                        option_price_lanyard
                                                    }
                                                    optionLabel="price"
                                                    optionValue="price"
                                                    placeholder="Pilih Tarif"
                                                    editable
                                                    valueTemplate={
                                                        selectedOptionTrainingTemplate
                                                    }
                                                    itemTemplate={
                                                        optionTrainingTemplate
                                                    }
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Tarif Langganan Sistem
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <InputNumber
                                                    placeholder="tarif"
                                                    value={
                                                        dataSubscription.price_subscription_system
                                                    }
                                                    onValueChange={(e) =>
                                                        setDataSubscription({
                                                            ...dataSubscription,
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
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Tarif Pelatihan Offline
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <Dropdown
                                                    value={
                                                        dataSubscription.price_training_offline
                                                    }
                                                    onChange={(e) =>
                                                        setDataSubscription({
                                                            ...dataSubscription,
                                                            price_training_offline:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={
                                                        option_training_offline
                                                    }
                                                    optionLabel="price"
                                                    optionValue="price"
                                                    placeholder="Pilih Tarif"
                                                    editable
                                                    valueTemplate={
                                                        selectedOptionTrainingTemplate
                                                    }
                                                    itemTemplate={
                                                        optionTrainingTemplate
                                                    }
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Tarif Pelatihan Online
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <div className="p-inputgroup flex-1 h-full">
                                                    <InputNumber
                                                        value={
                                                            dataSubscription.price_training_online
                                                        }
                                                        onChange={(e) =>
                                                            setDataSubscription(
                                                                {
                                                                    ...dataSubscription,
                                                                    price_training_online:
                                                                        e.value,
                                                                }
                                                            )
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
                                                        ref={
                                                            infoPriceTrainingOnlineRef
                                                        }
                                                    >
                                                        <ul className="list-disc list-inside">
                                                            <li>
                                                                Harga
                                                                Implementasi
                                                                Training
                                                                dan/atau
                                                                sosialisasi
                                                                secara
                                                                Daring/Online
                                                            </li>
                                                            <li>
                                                                Harga
                                                                implementasi 3x
                                                                sesi training
                                                                secara gratis.
                                                                (Harga yang di
                                                                imput adalah
                                                                harga training
                                                                tambahan)
                                                            </li>
                                                        </ul>
                                                    </OverlayPanel>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Tarif Isi Kartu Via Cazhpoin
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <Dropdown
                                                    value={
                                                        dataSubscription.fee_purchase_cazhpoin
                                                    }
                                                    onChange={(e) =>
                                                        setDataSubscription({
                                                            ...dataSubscription,
                                                            fee_purchase_cazhpoin:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={option_fee}
                                                    optionLabel="name"
                                                    optionValue="name"
                                                    placeholder="Pilih Tarif"
                                                    editable
                                                    valueTemplate={
                                                        selectedOptionTemplate
                                                    }
                                                    itemTemplate={
                                                        optionTemplate
                                                    }
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Tarif Bayar Tagihan via CazhPOIN
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <Dropdown
                                                    value={
                                                        dataSubscription.fee_bill_cazhpoin
                                                    }
                                                    onChange={(e) =>
                                                        setDataSubscription({
                                                            ...dataSubscription,
                                                            fee_bill_cazhpoin:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={option_fee}
                                                    optionLabel="name"
                                                    optionValue="name"
                                                    placeholder="Pilih Tarif"
                                                    editable
                                                    valueTemplate={
                                                        selectedOptionTemplate
                                                    }
                                                    itemTemplate={
                                                        optionTemplate
                                                    }
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Tarif TopUp Kartu via Cazh POS
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <Dropdown
                                                    value={
                                                        dataSubscription.fee_topup_cazhpos
                                                    }
                                                    onChange={(e) =>
                                                        setDataSubscription({
                                                            ...dataSubscription,
                                                            fee_topup_cazhpos:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={option_fee}
                                                    optionLabel="name"
                                                    optionValue="name"
                                                    placeholder="Pilih Tarif"
                                                    editable
                                                    valueTemplate={
                                                        selectedOptionTemplate
                                                    }
                                                    itemTemplate={
                                                        optionTemplate
                                                    }
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Tarif Penarikan Saldo Kartu via Cazh
                                            POS
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <Dropdown
                                                    value={
                                                        dataSubscription.fee_withdraw_cazhpos
                                                    }
                                                    onChange={(e) =>
                                                        setDataSubscription({
                                                            ...dataSubscription,
                                                            fee_withdraw_cazhpos:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={option_fee}
                                                    optionLabel="name"
                                                    optionValue="name"
                                                    placeholder="Pilih Tarif"
                                                    editable
                                                    valueTemplate={
                                                        selectedOptionTemplate
                                                    }
                                                    itemTemplate={
                                                        optionTemplate
                                                    }
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Tarif Pembayaran Tagihan via Saldo
                                            Kartu
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <Dropdown
                                                    value={
                                                        dataSubscription.fee_bill_saldokartu
                                                    }
                                                    onChange={(e) =>
                                                        setDataSubscription({
                                                            ...dataSubscription,
                                                            fee_bill_saldokartu:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={option_fee}
                                                    optionLabel="name"
                                                    optionValue="name"
                                                    placeholder="Pilih Tarif"
                                                    editable
                                                    valueTemplate={
                                                        selectedOptionTemplate
                                                    }
                                                    itemTemplate={
                                                        optionTemplate
                                                    }
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
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
                                header={headerSubscription}
                                filters={filters}
                                globalFilterFields={["partner.name", "period"]}
                                value={subscriptions}
                                dataKey="id"
                            >
                                <Column
                                    header="No"
                                    body={(_, { rowIndex }) => rowIndex + 1}
                                    className="dark:border-none pl-6"
                                    headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                                    style={{ width: "3%" }}
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
                                    style={{ width: "10%" }}
                                ></Column>

                                <Column
                                    header="Tarif Kartu"
                                    body={(rowData) =>
                                        JSON.parse(
                                            rowData.price_card
                                        ).price?.toLocaleString("id-ID")
                                            ? JSON.parse(
                                                  rowData.price_card
                                              ).price.toLocaleString("id-ID") +
                                              ` (${
                                                  JSON.parse(rowData.price_card)
                                                      .type
                                              })`
                                            : "Tidak diset"
                                    }
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    align="left"
                                    style={{ minWidth: "8rem" }}
                                ></Column>

                                {visibleColumnsSubscription.map((col) => (
                                    <Column
                                        key={col.field}
                                        style={{ minWidth: "10rem" }}
                                        field={col.field}
                                        header={col.header}
                                        body={(rowData) => {
                                            return rowData[
                                                col.field
                                            ]?.toLocaleString("id-ID")
                                                ? rowData[
                                                      col.field
                                                  ].toLocaleString("id-ID")
                                                : "Tidak diset";
                                        }}
                                    />
                                ))}

                                <Column
                                    header="Action"
                                    body={actionBodyTemplateSubscriptipn}
                                    style={{ minWidth: "8rem" }}
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                ></Column>
                            </DataTable>
                        </div>
                    </div>
                </TabPanel>

                <TabPanel header="Detail Partner">
                    <Dropdown
                        optionLabel="name"
                        value={selectedDetailPartner}
                        onChange={(e) =>
                            setSelectedDetailPartner(e.target.value)
                        }
                        options={partners}
                        placeholder="Pilih Partner"
                        filter
                        valueTemplate={selectedOptionTemplate}
                        itemTemplate={optionTemplate}
                        className="w-full mt-5 md:w-[40%] mx-auto flex justify-center rounded-lg shadow-md border-none"
                    />

                    {selectedDetailPartner !== "" && (
                        <Card
                            title={selectedDetailPartner.name}
                            className="mt-5 mx-auto p-3 w-[85%] rounded-lg"
                        >
                            <div className="flex gap-5 max-h-[400px]">
                                <div className="w-[40%]">
                                    <Menu
                                        model={menuDetailPartnerItems}
                                        className="w-full rounded-lg"
                                    />
                                </div>

                                <div class="w-full rounded-lg bg-gray-50/50 border overflow-y-auto max-h-full p-4">
                                    {activeMenu === "lembaga" && (
                                        <table class="w-full">
                                            <tr class="border-b">
                                                <td class="text-gray-700 text-base font-bold w-1/4">
                                                    Nama
                                                </td>
                                                <td class="text-gray-700 text-base w-[2%]">
                                                    :
                                                </td>
                                                <td class="text-gray-700 text-base w-7/12">
                                                    {selectedDetailPartner.name}
                                                </td>
                                            </tr>
                                            <tr class="border-b">
                                                <td class="text-gray-700 text-base font-bold w-1/4">
                                                    Sales
                                                </td>
                                                <td class="text-gray-700 text-base w-[2%]">
                                                    :
                                                </td>
                                                <td class="text-gray-700 text-base w-7/12">
                                                    {
                                                        selectedDetailPartner
                                                            .sales.name
                                                    }
                                                </td>
                                            </tr>
                                            <tr class="border-b">
                                                <td class="text-gray-700 text-base font-bold w-1/4">
                                                    Account Manager
                                                </td>
                                                <td class="text-gray-700 text-base w-[2%]">
                                                    :
                                                </td>
                                                <td class="text-gray-700 text-base w-7/12">
                                                    {
                                                        selectedDetailPartner
                                                            .account_manager
                                                            .name
                                                    }
                                                </td>
                                            </tr>
                                            <tr class="border-b">
                                                <td class="text-gray-700 text-base font-bold w-1/4">
                                                    Tanggal Daftar
                                                </td>
                                                <td class="text-gray-700 text-base w-[2%]">
                                                    :
                                                </td>
                                                <td class="text-gray-700 text-base w-7/12">
                                                    {new Date(
                                                        selectedDetailPartner.register_date
                                                    ).toLocaleDateString("id")}
                                                </td>
                                            </tr>
                                            <tr class="border-b">
                                                <td class="text-gray-700 text-base font-bold w-1/4">
                                                    Tanggal Live
                                                </td>
                                                <td class="text-gray-700 text-base w-[2%]">
                                                    :
                                                </td>
                                                <td class="text-gray-700 text-base w-7/12">
                                                    {new Date(
                                                        selectedDetailPartner.live_date
                                                    ).toLocaleDateString("id")}
                                                </td>
                                            </tr>
                                            <tr class="border-b">
                                                <td class="text-gray-700 text-base font-bold w-1/4">
                                                    Address
                                                </td>
                                                <td class="text-gray-700 text-base w-[2%]">
                                                    :
                                                </td>
                                                <td class="text-gray-700 text-base w-7/12">
                                                    {
                                                        selectedDetailPartner.address
                                                    }
                                                </td>
                                            </tr>
                                            <tr class="border-b">
                                                <td class="text-gray-700 text-base font-bold w-1/4">
                                                    Status
                                                </td>
                                                <td class="text-gray-700 text-base w-[2%]">
                                                    :
                                                </td>
                                                <td class="text-gray-700 text-base w-7/12">
                                                    <Badge
                                                        value={
                                                            selectedDetailPartner.status
                                                        }
                                                        className="text-white"
                                                        severity={
                                                            selectedDetailPartner.status ==
                                                            "Aktif"
                                                                ? "success"
                                                                : null ||
                                                                  selectedDetailPartner.status ==
                                                                      "CLBK"
                                                                ? "info"
                                                                : null ||
                                                                  selectedDetailPartner.status ==
                                                                      "Proses"
                                                                ? "warning"
                                                                : null ||
                                                                  selectedDetailPartner.status ==
                                                                      "Non Aktif"
                                                                ? "danger"
                                                                : null
                                                        }
                                                    ></Badge>
                                                </td>
                                            </tr>
                                        </table>
                                    )}

                                    {activeMenu === "bank" && (
                                        <table class="w-full">
                                            <tr class="border-b">
                                                <td class="text-gray-700 text-base font-bold w-1/4">
                                                    Bank
                                                </td>
                                                <td class="text-gray-700 text-base w-[2%]">
                                                    :
                                                </td>
                                                <td class="text-gray-700 text-base w-7/12">
                                                    {
                                                        selectedDetailPartner
                                                            .banks[0].bank
                                                    }
                                                </td>
                                            </tr>
                                            <tr class="border-b">
                                                <td class="text-gray-700 text-base font-bold w-1/4">
                                                    No. Rekening
                                                </td>
                                                <td class="text-gray-700 text-base w-[2%]">
                                                    :
                                                </td>
                                                <td class="text-gray-700 text-base w-7/12">
                                                    {
                                                        selectedDetailPartner
                                                            .banks[0]
                                                            .account_bank_number
                                                    }
                                                </td>
                                            </tr>
                                            <tr class="border-b">
                                                <td class="text-gray-700 text-base font-bold w-1/4">
                                                    Atas Nama
                                                </td>
                                                <td class="text-gray-700 text-base w-[2%]">
                                                    :
                                                </td>
                                                <td class="text-gray-700 text-base w-7/12">
                                                    {
                                                        selectedDetailPartner
                                                            .banks[0]
                                                            .account_bank_name
                                                    }
                                                </td>
                                            </tr>
                                        </table>
                                    )}

                                    {activeMenu === "pic" && (
                                        <table class="w-full">
                                            <tr class="border-b">
                                                <td class="text-gray-700 text-base font-bold w-1/4">
                                                    Nama
                                                </td>
                                                <td class="text-gray-700 text-base w-[2%]">
                                                    :
                                                </td>
                                                <td class="text-gray-700 text-base w-7/12">
                                                    {
                                                        selectedDetailPartner
                                                            .pics[0].name
                                                    }
                                                </td>
                                            </tr>
                                            <tr class="border-b">
                                                <td class="text-gray-700 text-base font-bold w-1/4">
                                                    Jabatan
                                                </td>
                                                <td class="text-gray-700 text-base w-[2%]">
                                                    :
                                                </td>
                                                <td class="text-gray-700 text-base w-7/12">
                                                    {
                                                        selectedDetailPartner
                                                            .pics[0].position
                                                    }
                                                </td>
                                            </tr>
                                            <tr class="border-b">
                                                <td class="text-gray-700 text-base font-bold w-1/4">
                                                    No. Telp
                                                </td>
                                                <td class="text-gray-700 text-base w-[2%]">
                                                    :
                                                </td>
                                                <td class="text-gray-700 text-base w-7/12">
                                                    {
                                                        selectedDetailPartner
                                                            .pics[0].number
                                                    }
                                                </td>
                                            </tr>
                                            <tr class="border-b">
                                                <td class="text-gray-700 text-base font-bold w-1/4">
                                                    Address
                                                </td>
                                                <td class="text-gray-700 text-base w-[2%]">
                                                    :
                                                </td>
                                                <td class="text-gray-700 text-base w-7/12">
                                                    {
                                                        selectedDetailPartner
                                                            .pics[0].address
                                                    }
                                                </td>
                                            </tr>
                                        </table>
                                    )}

                                    {activeMenu === "langganan" && (
                                        <table class="w-full">
                                            <tr class="border-b">
                                                <td class="text-gray-700 text-base font-bold w-1/4">
                                                    Nominal
                                                </td>
                                                <td class="text-gray-700 text-base w-[2%]">
                                                    :
                                                </td>
                                                <td class="text-gray-700 text-base w-7/12">
                                                    {
                                                        selectedDetailPartner
                                                            .subscription
                                                            .nominal
                                                    }
                                                </td>
                                            </tr>
                                            <tr class="border-b">
                                                <td class="text-gray-700 text-base font-bold w-1/4">
                                                    Periode
                                                </td>
                                                <td class="text-gray-700 text-base w-[2%]">
                                                    :
                                                </td>
                                                <td class="text-gray-700 text-base w-7/12">
                                                    {
                                                        selectedDetailPartner
                                                            .subscription.period
                                                    }{" "}
                                                    bulan
                                                </td>
                                            </tr>

                                            {selectedDetailPartner.subscription
                                                .price_card !== {} && (
                                                <tr class="border-b">
                                                    <td class="text-gray-700 text-base font-bold w-1/4">
                                                        Kartu{" "}
                                                        {
                                                            JSON.parse(
                                                                selectedDetailPartner
                                                                    .subscription
                                                                    .price_card
                                                            ).type
                                                        }
                                                    </td>
                                                    <td class="text-gray-700 text-base w-[2%]">
                                                        :
                                                    </td>
                                                    <td class="text-gray-700 text-base w-7/12">
                                                        {
                                                            JSON.parse(
                                                                selectedDetailPartner
                                                                    .subscription
                                                                    .price_card
                                                            ).price
                                                        }
                                                    </td>
                                                </tr>
                                            )}
                                        </table>
                                    )}
                                </div>
                            </div>
                        </Card>
                    )}
                </TabPanel>
            </TabView>
        </DashboardLayout>
    );
}
