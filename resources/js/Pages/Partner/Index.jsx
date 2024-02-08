import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import DashboardLayout from "@/Layouts/DashboardLayout";
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
import { TabPanel, TabView } from "primereact/tabview";
import { Skeleton } from "primereact/skeleton";
import { FilterMatchMode } from "primereact/api";
import { OverlayPanel } from "primereact/overlaypanel";
import { FileUpload } from "primereact/fileupload";
import Pic from "./Pic.jsx";
import DetailPartner from "./DetailPartner/DetailPartner.jsx";
import Bank from "./Bank.jsx";
import Account from "./Account.jsx";
import Subscription from "./Subscription.jsx";

export default function Index({ auth, partner }) {
    const [partners, setPartners] = useState("");
    const [sales, setSales] = useState("");
    const [account_managers, setAccountManagers] = useState("");
    const [provinces, setProvinces] = useState([]);
    const [regencys, setRegencys] = useState([]);
    const [subdistricts, setSubdistricts] = useState([]);
    const [codeProvince, setcodeProvince] = useState(null);
    const [codeRegency, setcodeRegency] = useState(null);
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [modalPartnersIsVisible, setModalPartnersIsVisible] = useState(false);
    const [modalEditPartnersIsVisible, setModalEditPartnersIsVisible] =
        useState(false);
    const toast = useRef(null);
    const btnSubmit = useRef(null);
    const modalPartner = useRef(null);
    const scrollForm = useRef(null);
    const infoPriceTrainingOnlineRef = useRef(null);
    const { roles, permissions } = auth.user;
    const [activeIndex, setActiveIndex] = useState(0);
    const dummyArray = Array.from({ length: 5 }, (v, i) => i);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [selectedDetailPartner, setSelectedDetailPartner] = useState(partner);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);

    useEffect(() => {
        if (selectedDetailPartner) {
            setActiveIndexTab(5);
        }
    }, []);

    useEffect(() => {
        if (scrollForm.current) {
            setTimeout(() => {
                scrollForm.current.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                });
            }, 200);
        }
    }, [activeIndex]);

    useEffect(() => {
        const fetchData = async () => {
            await getPartners();
            await getProvince();
            setPreRenderLoad((prev) => (prev = false));
        };

        fetchData();
    }, [activeIndexTab]);

    useEffect(() => {
        if (codeProvince) {
            getRegencys(codeProvince);
        }
        if (codeRegency && codeProvince) {
            getSubdistricts(codeProvince, codeRegency);
        }
    }, [codeProvince, codeRegency]);

    const getProvince = async () => {
        const options = {
            method: "GET",
            url: `/api/wilayah/provinsi/`,
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const response = await axios.request(options);
            const dataArray = Object.entries(response.data).map(
                ([key, value]) => ({
                    code: key,
                    name: value
                        .toLowerCase()
                        .split(" ")
                        .map(
                            (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" "),
                })
            );
            setProvinces((prev) => (prev = dataArray));
        } catch (error) {
            console.log(error);
        }
    };

    const getRegencys = async (code) => {
        let url = code
            ? `api/wilayah/kabupaten?provinsi=${code}`
            : `api/wilayah/kabupaten`;
        const options = {
            method: "GET",
            url: url,
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const response = await axios.request(options);
            const dataArray = Object.entries(response.data).map(
                ([key, value]) => ({
                    code: key,
                    name: value
                        .toLowerCase()
                        .split(" ")
                        .map(
                            (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" "),
                })
            );
            setRegencys((prev) => (prev = dataArray));
        } catch (error) {
            console.log(error);
        }
    };

    const getSubdistricts = async (codeProv, codeRege) => {
        let url =
            codeProv !== null && codeRege !== null
                ? `api/wilayah/kecamatan?provinsi=${codeProv}&kabupaten=${codeRege}`
                : `api/wilayah/kecamatan`;
        const options = {
            method: "GET",
            url: url,
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const response = await axios.request(options);
            const dataArray = Object.entries(response.data).map(
                ([key, value]) => ({
                    code: key,
                    name: value
                        .toLowerCase()
                        .split(" ")
                        .map(
                            (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" "),
                })
            );
            setSubdistricts((prev) => (prev = dataArray));
        } catch (error) {
            console.log(error);
        }
    };

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
            account_manager: {
                name: null,
                id: null,
            },
            name: "",
            logo: null,
            phone_number: "",
            province: null,
            regency: null,
            subdistrict: null,
            address: null,
            onboarding_date: new Date(),
            onboarding_age: null,
            live_date: null,
            live_age: null,
            monitoring_date_after_3_month_live: null,
            status: "",
        },
        pic: {
            name: "",
            number: "",
            position: "",
            email: "",
        },
        account_setting: {
            subdomain: "",
            email_super_admin: "",
            cas_link_partner: "https://cas.cazh.id/partner/",
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

    const status = [
        { name: "Proses" },
        { name: "Aktif" },
        { name: "CLBK" },
        { name: "Non Aktif" },
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

    let cardCategories = [{ name: "digital" }, { name: "cetak" }];

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
            label: "Tarif",
        },
    ];

    const option_period_subscription = [
        { name: "kartu/bulan" },
        { name: "kartu/tahun" },
        { name: "lembaga/bulan" },
        { name: "lembaga/tahun" },
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
                province: partner.province,
                regency: partner.regency,
                subdistrict: partner.subdistrict,
                address: partner.address,
                status: partner.status,
            },
        }));
        setcodeRegency(JSON.parse(partner.regency).code);
        setcodeProvince(JSON.parse(partner.province).code);
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

    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-row justify-between gap-2 align-items-center items-end">
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
                            setModalAccountIsVisible((prev) => (prev = true));
                            resetAccount();
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
                            resetSubscription();
                        }}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                )}

                {activeIndexTab == 5 && (
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
                <div>
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalPartnersIsVisible((prev) => (prev = true));
                            reset("partner");
                            setActiveIndex((prev) => (prev = 0));
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

    const header = renderHeader();

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
                    onClick={() => {
                        setActiveIndex((prev) => prev + 1);
                    }}
                    className="bg-purple-600 text-sm shadow-md rounded-lg"
                />
            </div>
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
                    reset(
                        "partner",
                        "pic",
                        "subscription",
                        "account_setting",
                        "bank"
                    );
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

    const handleSelectedDetailPartner = (partner) => {
        setSelectedDetailPartner(partner);
        setActiveIndexTab((prev) => (prev = 5));
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

    return (
        <DashboardLayout auth={auth.user} className="">
            <Toast ref={toast} />
            <ConfirmDialog />

            <TabView
                className="mt-3"
                activeIndex={activeIndexTab}
                onTabChange={(e) => {
                    setActiveIndexTab(e.index);
                }}
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
                                                    Logo
                                                </label>
                                                <FileUpload
                                                    mode="basic"
                                                    className="flex w-full p-1"
                                                    onSelect={(rowData) => {
                                                        setData("partner", {
                                                            ...data.partner,
                                                            logo: rowData,
                                                        });
                                                    }}
                                                    accept="image/*"
                                                    maxFileSize={1000000}
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
                                                <label htmlFor="province">
                                                    Provinsi *
                                                </label>
                                                <Dropdown
                                                    value={
                                                        data.partner.province
                                                            ? JSON.parse(
                                                                  data.partner
                                                                      .province
                                                              )
                                                            : null
                                                    }
                                                    onChange={(e) => {
                                                        setcodeProvince(
                                                            (prev) =>
                                                                (prev =
                                                                    e.target
                                                                        .value
                                                                        .code)
                                                        );
                                                        setData("partner", {
                                                            ...data.partner,
                                                            province:
                                                                JSON.stringify(
                                                                    e.target
                                                                        .value
                                                                ),
                                                        });
                                                    }}
                                                    options={provinces}
                                                    optionLabel="name"
                                                    placeholder="Pilih Provinsi"
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
                                                <label htmlFor="regency">
                                                    Kabupaten *
                                                </label>
                                                <Dropdown
                                                    value={
                                                        data.partner.regency
                                                            ? JSON.parse(
                                                                  data.partner
                                                                      .regency
                                                              )
                                                            : null
                                                    }
                                                    onChange={(e) => {
                                                        setcodeRegency(
                                                            (prev) =>
                                                                (prev =
                                                                    e.target
                                                                        .value
                                                                        .code)
                                                        );
                                                        setData("partner", {
                                                            ...data.partner,
                                                            regency:
                                                                JSON.stringify(
                                                                    e.target
                                                                        .value
                                                                ),
                                                        });
                                                    }}
                                                    options={regencys}
                                                    optionLabel="name"
                                                    placeholder="Pilih Kabupaten"
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
                                                <label htmlFor="subdistrict">
                                                    Kecamatan
                                                </label>
                                                <Dropdown
                                                    value={
                                                        data.partner.subdistrict
                                                            ? JSON.parse(
                                                                  data.partner
                                                                      .subdistrict
                                                              )
                                                            : null
                                                    }
                                                    onChange={(e) =>
                                                        setData("partner", {
                                                            ...data.partner,
                                                            subdistrict:
                                                                JSON.stringify(
                                                                    e.target
                                                                        .value
                                                                ),
                                                        })
                                                    }
                                                    options={subdistricts}
                                                    optionLabel="name"
                                                    placeholder="Pilih Kecamatan"
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
                                                    dateFormat="dd/mm/yy"
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
                                            <div
                                                ref={scrollForm}
                                                className="flex flex-col"
                                            >
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

                                            <div className="flex flex-col">
                                                <label htmlFor="number">
                                                    Email *
                                                </label>
                                                <InputText
                                                    value={data.pic.email}
                                                    onChange={(e) =>
                                                        setData("pic", {
                                                            ...data.pic,
                                                            email: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="dark:bg-gray-300"
                                                    id="email"
                                                    aria-describedby="email-help"
                                                />
                                            </div>
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
                                                    *
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
                                                <label htmlFor="price_card">
                                                    Tarif Kartu
                                                </label>

                                                <div className="flex justify-between gap-1 w-full items-center">
                                                    <div className="w-full flex gap-2 h-full">
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
                                                            onChange={(e) =>
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
                                                                data
                                                                    .subscription
                                                                    .price_lanyard
                                                            }
                                                            onChange={(e) =>
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
                                                                data
                                                                    .subscription
                                                                    .price_training_offline
                                                            }
                                                            onChange={(e) =>
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
                                                                    data
                                                                        .subscription
                                                                        .price_training_online
                                                                }
                                                                onChange={(e) =>
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
                                                                        implementasi
                                                                        3x sesi
                                                                        training
                                                                        secara
                                                                        gratis.
                                                                        (Harga
                                                                        yang di
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
                                                                data
                                                                    .subscription
                                                                    .fee_purchase_cazhpoin
                                                            }
                                                            onChange={(e) =>
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
                                                    Tarif Bayar Tagihan via
                                                    CazhPOIN
                                                </label>

                                                <div className="flex justify-between gap-1 w-full items-center">
                                                    <div className="w-full flex gap-2 h-full">
                                                        <Dropdown
                                                            value={
                                                                data
                                                                    .subscription
                                                                    .fee_bill_cazhpoin
                                                            }
                                                            onChange={(e) =>
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
                                                    Tarif TopUp Kartu via Cazh
                                                    POS
                                                </label>

                                                <div className="flex justify-between gap-1 w-full items-center">
                                                    <div className="w-full flex gap-2 h-full">
                                                        <Dropdown
                                                            value={
                                                                data
                                                                    .subscription
                                                                    .fee_topup_cazhpos
                                                            }
                                                            onChange={(e) =>
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
                                                    Tarif Penarikan Saldo Kartu
                                                    via Cazh POS
                                                </label>

                                                <div className="flex justify-between gap-1 w-full items-center">
                                                    <div className="w-full flex gap-2 h-full">
                                                        <Dropdown
                                                            value={
                                                                data
                                                                    .subscription
                                                                    .fee_withdraw_cazhpos
                                                            }
                                                            onChange={(e) =>
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
                                                    Tarif Pembayaran Tagihan via
                                                    Saldo Kartu
                                                </label>

                                                <div className="flex justify-between gap-1 w-full items-center">
                                                    <div className="w-full flex gap-2 h-full">
                                                        <Dropdown
                                                            value={
                                                                data
                                                                    .subscription
                                                                    .fee_bill_saldokartu
                                                            }
                                                            onChange={(e) =>
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
                                        <label htmlFor="province">
                                            Provinsi *
                                        </label>
                                        <Dropdown
                                            value={
                                                data.partner.province
                                                    ? JSON.parse(
                                                          data.partner.province
                                                      )
                                                    : null
                                            }
                                            onChange={(e) => {
                                                setcodeProvince(
                                                    (prev) =>
                                                        (prev =
                                                            e.target.value.code)
                                                );
                                                setData("partner", {
                                                    ...data.partner,
                                                    province: JSON.stringify(
                                                        e.target.value
                                                    ),
                                                });
                                            }}
                                            options={provinces}
                                            optionLabel="name"
                                            placeholder="Pilih Provinsi"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="regency">
                                            Kabupaten *
                                        </label>
                                        <Dropdown
                                            value={
                                                data.partner.regency
                                                    ? JSON.parse(
                                                          data.partner.regency
                                                      )
                                                    : null
                                            }
                                            onChange={(e) => {
                                                setcodeRegency(
                                                    (prev) =>
                                                        (prev =
                                                            e.target.value.code)
                                                );
                                                setData("partner", {
                                                    ...data.partner,
                                                    regency: JSON.stringify(
                                                        e.target.value
                                                    ),
                                                });
                                            }}
                                            options={regencys}
                                            optionLabel="name"
                                            placeholder="Pilih Kabupaten"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="subdistrict">
                                            Kecamatan
                                        </label>
                                        <Dropdown
                                            value={
                                                data.partner.subdistrict
                                                    ? JSON.parse(
                                                          data.partner
                                                              .subdistrict
                                                      )
                                                    : null
                                            }
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    subdistrict: JSON.stringify(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            options={subdistricts}
                                            optionLabel="name"
                                            placeholder="Pilih Kecamatan"
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
                                            className="hover:text-blue-700 text-left"
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
                                        rowData.account_manager !== null
                                            ? rowData.account_manager.name
                                            : "belum diisi"
                                    }
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    align="left"
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                                <Column
                                    field="province"
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    header="Provinsi"
                                    body={(rowData) => {
                                        return JSON.parse(rowData.province)
                                            .name;
                                    }}
                                    align="left"
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                                <Column
                                    field="regency"
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    header="Kabupaten"
                                    body={(rowData) => {
                                        return JSON.parse(rowData.regency).name;
                                    }}
                                    align="left"
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                                <Column
                                    field="subdistrict"
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    header="Kecamatan"
                                    body={(rowData) => {
                                        return JSON.parse(rowData.subdistrict)
                                            .name;
                                    }}
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
                                        rowData.live_date !== null
                                            ? new Date(
                                                  rowData.live_date
                                              ).toLocaleDateString("id")
                                            : "belum diisi"
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
                                        rowData.onboarding_age !== null
                                            ? rowData.onboarding_age + " hari"
                                            : "belum diisi"
                                    }
                                    className="dark:border-none"
                                    headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                    align="left"
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                                <Column
                                    header="Umur Live"
                                    body={(rowData) =>
                                        rowData.live_age !== null
                                            ? rowData.live_age + " hari"
                                            : "belum diisi"
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
                    <Pic
                        partners={partners}
                        showSuccess={showSuccess}
                        showError={showError}
                        handleSelectedDetailPartner={
                            handleSelectedDetailPartner
                        }
                    />
                </TabPanel>

                <TabPanel header="Bank">
                    <Bank
                        partners={partners}
                        showSuccess={showSuccess}
                        showError={showError}
                        handleSelectedDetailPartner={
                            handleSelectedDetailPartner
                        }
                    />
                </TabPanel>

                <TabPanel header="Akun">
                    <Account
                        partners={partners}
                        showSuccess={showSuccess}
                        showError={showError}
                        handleSelectedDetailPartner={
                            handleSelectedDetailPartner
                        }
                    />
                </TabPanel>

                <TabPanel header="Langganan">
                    <Subscription
                        partners={partners}
                        showSuccess={showSuccess}
                        showError={showError}
                        handleSelectedDetailPartner={
                            handleSelectedDetailPartner
                        }
                    />
                </TabPanel>

                <TabPanel header="Detail Partner">
                    <DetailPartner
                        partners={partners}
                        detailPartner={selectedDetailPartner}
                        sales={sales}
                        account_managers={account_managers}
                        status={status}
                        provinces={provinces}
                        regencys={regencys}
                        getProvince={getProvince}
                        getRegencys={getRegencys}
                        getSubdistricts={getSubdistricts}
                        subdistricts={subdistricts}
                        codeProvince={codeProvince}
                        codeRegency={codeRegency}
                        setcodeProvince={setcodeProvince}
                        setcodeRegency={setcodeRegency}
                        showSuccess={showSuccess}
                        showError={showError}
                    />
                </TabPanel>
            </TabView>
        </DashboardLayout>
    );
}
