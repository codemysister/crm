import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { Column } from "primereact/column";
import { useRef } from "react";
import { FilterMatchMode } from "primereact/api";
import { Dropdown } from "primereact/dropdown";
import React from "react";
import { Toast } from "primereact/toast";
import { Badge } from "primereact/badge";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import "./Create.css";
import { InputNumber } from "primereact/inputnumber";
import { OverlayPanel } from "primereact/overlaypanel";
import { Message } from "primereact/message";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
import DialogInstitution from "@/Components/DialogInstitution";
import { getProvince } from "@/Services/getProvince";
import { getRegencys } from "@/Services/getRegency";
import InputError from "@/Components/InputError";
import { BlockUI } from "primereact/blockui";
import LoadingDocument from "@/Components/LoadingDocument";
registerPlugin(FilePondPluginFileValidateSize);

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Edit = ({ usersProp, partnersProp, mou, signaturesProp }) => {
    const [users, setUsers] = useState(usersProp);
    const [partners, setPartners] = useState(partnersProp);
    const [provinces, setProvinces] = useState([]);
    const [regencys, setRegencys] = useState([]);
    const [isSignatureBlob, setIsSignatureBlob] = useState(false);
    const [signatures, setSignatures] = useState(signaturesProp);
    const [theme, setTheme] = useState(localStorage.theme);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [regencyName, setRegencyName] = useState(null);
    const [leads, setLeads] = useState(null);
    const [dialogInstitutionVisible, setDialogInstitutionVisible] =
        useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [provinceName, setProvinceName] = useState(null);
    const [blocked, setBlocked] = useState(false);

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    useEffect(() => {
        theme
            ? (localStorage.theme = "dark")
            : localStorage.removeItem("theme");

        if (
            localStorage.theme === "dark" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    const toast = useRef(null);
    const infoPriceTrainingOfflineRef = useRef(null);
    const infoPriceTrainingOnlineRef = useRef(null);
    const animateDay = useRef(null);
    const animateDate = useRef(null);
    const animatePartnerNameRef = useRef(null);
    const animatePartnerPIC = useRef(null);
    const animatePartnerPICPosition = useRef(null);
    const animateUrlSubdomain = useRef(null);
    const animatePriceCard = useRef(null);
    const animatePriceLanyard = useRef(null);
    const animateNominalSubscription = useRef(null);
    const animatePeriodSubscription = useRef(null);
    const animatePriceTrainingOffline = useRef(null);
    const animatePriceTrainingOnline = useRef(null);
    const animateFeePurchaseCazhpoin = useRef(null);
    const animateFeeBillCazhpoin = useRef(null);
    const animateFeeTopupCazhpos = useRef(null);
    const animateFeeWithdrawCazhpos = useRef(null);
    const animateFeeBillSaldokartu = useRef(null);
    const animateBank = useRef(null);
    const animateAccountBankNumber = useRef(null);
    const animateAccountBankName = useRef(null);
    const animateExpiredDate = useRef(null);
    const animateProfitSharing = useRef(null);
    const animateProfitSharingDetail = useRef(null);
    const animateReferral = useRef(null);
    const animateSignatureName = useRef(null);
    const animatePartnerProvinceRef = useRef(null);
    const animatePartnerRegencyRef = useRef(null);

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
        uuid: mou.uuid,
        code: mou.code,
        day: mou.day,
        date: mou.date,
        partner: {
            id: mou.partner_id,
            uuid: mou.partner == undefined ? mou.lead.uuid : mou.partner.uuid,
            name: mou.partner_name,
            pic: mou.partner_pic,
            pic_position: mou.partner_pic_position,
            province: mou.partner_province,
            regency: mou.partner_regency,
            bank: mou.bank,
            account_bank_number: mou.account_bank_number,
            account_bank_name: mou.account_bank_name,
            type: mou.partner == undefined ? "lead" : "partner",
        },
        pic_signature: mou.partner_pic_signature,
        url_subdomain: mou.url_subdomain,
        price_card: mou.price_card,
        price_lanyard: mou.price_lanyard,
        price_subscription_system: mou.price_subscription_system,
        period_subscription: mou.period_subscription,
        price_training_offline: mou.price_training_offline,
        price_training_online: mou.price_training_online,
        fee_qris: mou.fee_qris,
        fee_purchase_cazhpoin: mou.fee_purchase_cazhpoin,
        fee_bill_cazhpoin: mou.fee_bill_cazhpoin,
        fee_topup_cazhpos: mou.fee_topup_cazhpos,
        fee_withdraw_cazhpos: mou.fee_withdraw_cazhpos,
        fee_bill_saldokartu: mou.fee_bill_saldokartu,

        expired_date: mou.expired_date,
        profit_sharing: Boolean(mou.profit_sharing),
        profit_sharing_detail: mou.profit_sharing_detail,
        // referral: Boolean(mou.referral),
        // referral_name: mou.referral_name,
        // referral_signature: mou.referral_signature,
        signature: {
            name: mou.signature_name,
            position: mou.signature_position,
            image: mou.signature_image,
        },
        mou_doc: mou.mou_doc,
    });

    useEffect(() => {
        if (processing) {
            setBlocked(true);
        } else {
            setBlocked(false);
        }
    }, [processing]);

    useEffect(() => {
        if (typeof data.partner.pic_signature == "object") {
            setIsSignatureBlob(true);
        }
    }, [data.partner.pic_signature]);

    useEffect(() => {
        const fetch = async () => {
            let province = await getProvince();
            setProvinces((prev) => (prev = province));
        };
        setProvinceName(JSON.parse(data.partner.province).name);
        fetch();
    }, []);

    useEffect(() => {
        const fetch = async () => {
            if (provinceName) {
                let response = await getRegencys(provinceName);
                setRegencys((prev) => (prev = response));
            }
            if (regencyName && provinceName) {
                let response = await getSubdistricts(regencyName);
                setSubdistricts((prev) => (prev = response));
            }
        };

        fetch();
    }, [provinceName, regencyName]);

    useEffect(() => {
        if (provinceName) {
            getRegencys(provinceName);
        }
    }, [provinceName]);

    const option_price_training_offline = [
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

    document.querySelector("body").classList.add("overflow-hidden");

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

    const optionSignatureTemplate = (item) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center items-center gap-3">
                <img
                    className="w-[6rem] shadow-2 flex-shrink-0 border-round"
                    src={item.image}
                    alt={item.name}
                />
                <div className="flex-1 flex flex-col gap-2 xl:mr-8">
                    <span className="font-bold">{item.name}</span>
                    <div className="flex align-items-center gap-2">
                        <span>{item.position}</span>
                    </div>
                </div>
                {/* <span className="font-bold text-900">${item.price}</span> */}
            </div>
        );
    };

    const option_fee = [{ name: 1000 }, { name: 2000 }, { name: 2500 }];

    const option_training_offline = [
        { name: "Jawa", price: 15000000 },
        { name: "Kalimantan", price: 25000000 },
        { name: "Sulawesi", price: 27000000 },
        { name: "Sumatra", price: 23000000 },
        { name: "Bali", price: 26000000 },
        { name: "Jabodetabek", price: 15000000 },
    ];

    const option_period_subscription = [
        { name: "kartu/bulan" },
        { name: "kartu/tahun" },
        { name: "lembaga/bulan" },
        { name: "lembaga/tahun" },
    ];

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

    const triggerInputFocus = (ref) => {
        if (ref.current) {
            ref.current.classList.add("twinkle");
            ref.current.focus();

            ref.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
        return null;
    };

    const stopAnimateInputFocus = (ref) => {
        ref.current.classList.remove("twinkle");

        return null;
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();

        post("/mou/" + data.uuid, {
            onSuccess: () => {
                showSuccess("Tambah");
                router.get("/mou");
                // reset("name", "category", "price", "unit", "description");
            },

            onError: () => {
                showError("Tambah");
            },
        });
    };

    return (
        <>
            <Head title="Mou"></Head>
            <Toast ref={toast} />
            <BlockUI blocked={blocked} template={LoadingDocument}>
                <div className="h-screen max-h-screen overflow-y-hidden">
                    <div className="flex flex-col h-screen max-h-screen overflow-hidden md:flex-row z-40 relative gap-5">
                        <div className="md:w-[35%] overflow-y-auto h-screen max-h-screen p-5">
                            <Card>
                                <div className="flex justify-between items-center mb-4">
                                    <h1 className="font-bold text-2xl">Mou</h1>
                                    <Link href="/mou">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokWidth="1.5"
                                            stroke="currentColor"
                                            class="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                                            />
                                        </svg>
                                    </Link>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex flex-col mt-3">
                                        <InputText
                                            value={data.code}
                                            onChange={(e) =>
                                                setData("code", e.target.value)
                                            }
                                            className="dark:bg-gray-300"
                                            id="code"
                                            aria-describedby="code-help"
                                            hidden
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="date">
                                            Tanggal Kesepakatan *
                                        </label>

                                        <Calendar
                                            value={
                                                data.date
                                                    ? new Date(data.date)
                                                    : null
                                            }
                                            style={{ height: "35px" }}
                                            onChange={(e) => {
                                                const dayIndex =
                                                    e.target.value.getDay();

                                                const daysOfWeek = [
                                                    "Minggu",
                                                    "Senin",
                                                    "Selasa",
                                                    "Rabu",
                                                    "Kamis",
                                                    "Jumat",
                                                    "Sabtu",
                                                ];

                                                const dayName =
                                                    daysOfWeek[dayIndex];

                                                setData({
                                                    ...data,
                                                    date: e.target.value,
                                                    day: dayName,
                                                });
                                            }}
                                            onFocus={() => {
                                                triggerInputFocus(animateDate);
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateDate
                                                );
                                            }}
                                            showIcon
                                            dateFormat="dd/mm/yy"
                                            className={`w-full md:w-14rem`}
                                        />
                                        <InputError
                                            message={errors["date"]}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="partner_pic">
                                            PIC *
                                        </label>
                                        <InputText
                                            value={data.partner.pic}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    pic: e.target.value,
                                                })
                                            }
                                            className={`dark:bg-gray-300 `}
                                            id="partner_pic"
                                            aria-describedby="partner_pic-help"
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animatePartnerPIC
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animatePartnerPIC
                                                );
                                            }}
                                        />
                                        <InputError
                                            message={errors["partner.pic"]}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="partner_pic">
                                            Jabatan PIC *
                                        </label>
                                        <InputText
                                            value={
                                                data.partner.pic_position ?? ""
                                            }
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    pic_position:
                                                        e.target.value,
                                                })
                                            }
                                            className={`dark:bg-gray-300`}
                                            id="partner_pic"
                                            aria-describedby="partner_pic-help"
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animatePartnerPICPosition
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animatePartnerPICPosition
                                                );
                                            }}
                                        />
                                        <InputError
                                            message={
                                                errors["partner.pic_position"]
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="lembaga">
                                            Lembaga *
                                        </label>
                                        <InputText
                                            value={data.partner.name}
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animatePartnerNameRef
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animatePartnerNameRef
                                                );
                                            }}
                                            onClick={() => {
                                                setDialogInstitutionVisible(
                                                    true
                                                );
                                            }}
                                            placeholder="Pilih lembaga"
                                            className="dark:bg-gray-300 cursor-pointer"
                                            id="partner"
                                            aria-describedby="partner-help"
                                        />
                                        <InputError
                                            message={errors["partner.name"]}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
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
                                                setProvinceName(
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
                                            dataKey="code"
                                            options={provinces}
                                            optionLabel="name"
                                            placeholder="Pilih Provinsi"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animatePartnerProvinceRef
                                                );
                                            }}
                                            onShow={() => {
                                                triggerInputFocus(
                                                    animatePartnerProvinceRef
                                                );
                                            }}
                                            onHide={() => {
                                                stopAnimateInputFocus(
                                                    animatePartnerProvinceRef
                                                );
                                            }}
                                        />
                                        <InputError
                                            message={errors["partner.province"]}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="regency">
                                            Kabupaten *
                                        </label>
                                        <Dropdown
                                            dataKey="code"
                                            value={
                                                data.partner.regency
                                                    ? JSON.parse(
                                                          data.partner.regency
                                                      )
                                                    : null
                                            }
                                            onChange={(e) => {
                                                setData("partner", {
                                                    ...data.partner,
                                                    regency: JSON.stringify(
                                                        e.target.value
                                                    ),
                                                });
                                            }}
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animatePartnerRegencyRef
                                                );
                                            }}
                                            onShow={() => {
                                                triggerInputFocus(
                                                    animatePartnerRegencyRef
                                                );
                                            }}
                                            onHide={() => {
                                                stopAnimateInputFocus(
                                                    animatePartnerRegencyRef
                                                );
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
                                        <InputError
                                            message={errors["partner.regency"]}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="url_subdomain">
                                            URL Subdomain *
                                        </label>
                                        <InputText
                                            value={data.url_subdomain ?? ""}
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    url_subdomain:
                                                        e.target.value,
                                                })
                                            }
                                            className={`dark:bg-gray-300`}
                                            id="url_subdomain"
                                            aria-describedby="url_subdomain-help"
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateUrlSubdomain
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateUrlSubdomain
                                                );
                                            }}
                                        />
                                        <InputError
                                            message={errors["url_subdomain"]}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="price_card">
                                            Harga Kartu *
                                        </label>

                                        <InputNumber
                                            value={data.price_card}
                                            onChange={(e) =>
                                                setData("price_card", e.value)
                                            }
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animatePriceCard
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animatePriceCard
                                                );
                                            }}
                                            locale="id-ID"
                                        />
                                        <InputError
                                            message={errors["price_card"]}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="price_lanyard">
                                            Harga Lanyard *
                                        </label>

                                        <div className="p-inputgroup flex-1">
                                            <InputNumber
                                                locale="id-ID"
                                                value={data.price_lanyard}
                                                onChange={(e) =>
                                                    setData(
                                                        "price_lanyard",
                                                        e.value
                                                    )
                                                }
                                                onFocus={() => {
                                                    triggerInputFocus(
                                                        animatePriceLanyard
                                                    );
                                                }}
                                                onBlur={() => {
                                                    stopAnimateInputFocus(
                                                        animatePriceLanyard
                                                    );
                                                }}
                                                className={`w-[90%]`}
                                            />
                                            <Dropdown
                                                value={data.price_lanyard}
                                                onChange={(e) =>
                                                    setData(
                                                        "price_lanyard",
                                                        Number(e.target.value)
                                                    )
                                                }
                                                options={option_price_lanyard}
                                                optionLabel="price"
                                                optionValue="price"
                                                placeholder="Pilih Harga"
                                                editable
                                                valueTemplate={
                                                    selectedOptionTrainingTemplate
                                                }
                                                itemTemplate={
                                                    optionTrainingTemplate
                                                }
                                                onFocus={() => {
                                                    triggerInputFocus(
                                                        animatePriceLanyard
                                                    );
                                                }}
                                                onBlur={() => {
                                                    stopAnimateInputFocus(
                                                        animatePriceLanyard
                                                    );
                                                }}
                                                className="w-[10%] border-l-0 dropdown-group"
                                            />
                                        </div>
                                        <InputError
                                            message={errors["price_lanyard"]}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="price_subscription_system">
                                            Harga Langganan Sistem *
                                        </label>

                                        <InputNumber
                                            locale="id-ID"
                                            value={
                                                data.price_subscription_system
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "price_subscription_system",
                                                    e.value
                                                )
                                            }
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateNominalSubscription
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateNominalSubscription
                                                );
                                            }}
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    "price_subscription_system"
                                                ]
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="period_subscription">
                                            Langganan Per-*
                                        </label>
                                        <div className="p-inputgroup flex-1">
                                            <InputText
                                                value={data.period_subscription}
                                                onChange={(e) =>
                                                    setData({
                                                        ...data,
                                                        period_subscription:
                                                            e.target.value,
                                                    })
                                                }
                                                className={`dark:bg-gray-300 w-[90%]`}
                                                id="period_subscription"
                                                aria-describedby="period_subscription-help"
                                                onFocus={() => {
                                                    triggerInputFocus(
                                                        animatePeriodSubscription
                                                    );
                                                }}
                                                onBlur={() => {
                                                    stopAnimateInputFocus(
                                                        animatePeriodSubscription
                                                    );
                                                }}
                                            />

                                            <Dropdown
                                                value={data.period_subscription}
                                                onChange={(e) => {
                                                    setData(
                                                        "period_subscription",
                                                        e.target.value
                                                    );
                                                }}
                                                options={
                                                    option_period_subscription
                                                }
                                                optionLabel="name"
                                                optionValue="name"
                                                valueTemplate={
                                                    selectedOptionTemplate
                                                }
                                                itemTemplate={optionTemplate}
                                                className={`dropdown-group border-l-0 w-[10%]`}
                                                onFocus={() => {
                                                    triggerInputFocus(
                                                        animatePeriodSubscription
                                                    );
                                                }}
                                                onBlur={() => {
                                                    stopAnimateInputFocus(
                                                        animatePeriodSubscription
                                                    );
                                                }}
                                            />
                                        </div>
                                        <InputError
                                            message={
                                                errors["period_subscription"]
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="period_subscription">
                                            Harga Training Lokasi*
                                        </label>

                                        <div className="p-inputgroup flex-1 h-full">
                                            <InputNumber
                                                value={
                                                    data.price_training_offline
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "price_training_offline",
                                                        e.value
                                                    )
                                                }
                                                onFocus={() => {
                                                    triggerInputFocus(
                                                        animatePriceTrainingOffline
                                                    );
                                                }}
                                                onBlur={() => {
                                                    stopAnimateInputFocus(
                                                        animatePriceTrainingOffline
                                                    );
                                                }}
                                                className={`h-full w-[90%]`}
                                                locale="id-ID"
                                            />

                                            <Dropdown
                                                value={
                                                    data.price_training_offline
                                                }
                                                onChange={(e) => {
                                                    setData(
                                                        "price_training_offline",
                                                        Number(e.target.value)
                                                    );
                                                }}
                                                options={
                                                    option_price_training_offline
                                                }
                                                optionLabel="name"
                                                optionValue="price"
                                                className={`dropdown-group border-l-0 w-[10%]`}
                                                onFocus={() => {
                                                    triggerInputFocus(
                                                        animatePriceTrainingOffline
                                                    );
                                                }}
                                                onBlur={() => {
                                                    stopAnimateInputFocus(
                                                        animatePriceTrainingOffline
                                                    );
                                                }}
                                                valueTemplate={
                                                    selectedOptionTrainingTemplate
                                                }
                                                itemTemplate={
                                                    optionTrainingTemplate
                                                }
                                            />
                                        </div>
                                        <InputError
                                            message={
                                                errors["price_training_offline"]
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="price_training_online">
                                            Harga Training Online*
                                        </label>
                                        <div className="p-inputgroup flex-1 h-full">
                                            <InputNumber
                                                locale="id-ID"
                                                value={
                                                    data.price_training_online
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "price_training_online",
                                                        e.value
                                                    )
                                                }
                                                className={`h-full `}
                                                onFocus={() => {
                                                    triggerInputFocus(
                                                        animatePriceTrainingOnline
                                                    );
                                                }}
                                                onBlur={() => {
                                                    stopAnimateInputFocus(
                                                        animatePriceTrainingOnline
                                                    );
                                                }}
                                            />
                                            <Button
                                                className="h-[35px]"
                                                icon="pi pi-info-circle"
                                                onClick={(e) =>
                                                    infoPriceTrainingOnlineRef.current.toggle(
                                                        e
                                                    )
                                                }
                                            />
                                        </div>
                                        <InputError
                                            message={
                                                errors["price_training_online"]
                                            }
                                            className="mt-2"
                                        />
                                        <OverlayPanel
                                            className="shadow-md"
                                            ref={infoPriceTrainingOnlineRef}
                                        >
                                            <ul className="list-disc list-inside">
                                                <li>
                                                    Harga Implementasi Training
                                                    dan/atau sosialisasi secara
                                                    Daring/Online
                                                </li>
                                                <li>
                                                    Harga implementasi 3x sesi
                                                    training secara gratis.
                                                    (Harga yang di imput adalah
                                                    harga training tambahan)
                                                </li>
                                            </ul>
                                        </OverlayPanel>
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="fee_purchase_cazhpoin">
                                            Harga QRIS*
                                        </label>

                                        <InputText
                                            value={data.fee_qris}
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    fee_qris: e.target.value,
                                                })
                                            }
                                            className={`dark:bg-gray-300 w-full`}
                                            id="fee_qris"
                                            aria-describedby="fee_qris-help"
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateFeeQRIS
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateFeeQRIS
                                                );
                                            }}
                                        />
                                        <InputError
                                            message={errors["fee_qris"]}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="fee_purchase_cazhpoin">
                                            Harga isi kartu via CazhPOIN*
                                        </label>

                                        <InputNumber
                                            locale="id-ID"
                                            value={data.fee_purchase_cazhpoin}
                                            onChange={(e) =>
                                                setData(
                                                    "fee_purchase_cazhpoin",
                                                    e.value
                                                )
                                            }
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateFeePurchaseCazhpoin
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateFeePurchaseCazhpoin
                                                );
                                            }}
                                        />
                                        <InputError
                                            message={
                                                errors["fee_purchase_cazhpoin"]
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="fee_bill_cazhpoin">
                                            Harga bayar tagihan via CazhPOIN*
                                        </label>

                                        <InputNumber
                                            locale="id-ID"
                                            value={data.fee_bill_cazhpoin}
                                            onChange={(e) =>
                                                setData(
                                                    "fee_bill_cazhpoin",
                                                    e.value
                                                )
                                            }
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateFeeBillCazhpoin
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateFeeBillCazhpoin
                                                );
                                            }}
                                        />

                                        <InputError
                                            message={
                                                errors["fee_bill_cazhpoin"]
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="fee_topup_cazhpos">
                                            Harga topup kartu via Cazhpos*
                                        </label>

                                        <InputNumber
                                            locale="id-ID"
                                            value={data.fee_topup_cazhpos}
                                            onChange={(e) =>
                                                setData(
                                                    "fee_topup_cazhpos",
                                                    e.value
                                                )
                                            }
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateFeeTopupCazhpos
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateFeeTopupCazhpos
                                                );
                                            }}
                                        />

                                        <InputError
                                            message={
                                                errors["fee_topup_cazhpos"]
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="fee_withdraw_cazhpos">
                                            Harga penarikan saldo kartu via
                                            CazhPOIN*
                                        </label>

                                        <InputNumber
                                            locale="id-ID"
                                            value={data.fee_withdraw_cazhpos}
                                            onChange={(e) =>
                                                setData(
                                                    "fee_withdraw_cazhpos",
                                                    e.value
                                                )
                                            }
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateFeeWithdrawCazhpos
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateFeeWithdrawCazhpos
                                                );
                                            }}
                                        />

                                        <InputError
                                            message={
                                                errors["fee_withdraw_cazhpos"]
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="fee_bill_saldokartu">
                                            Harga bayar tagihan via Saldo Kartu*
                                        </label>

                                        <InputNumber
                                            locale="id-ID"
                                            value={data.fee_bill_saldokartu}
                                            onChange={(e) =>
                                                setData(
                                                    "fee_bill_saldokartu",
                                                    e.value
                                                )
                                            }
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateFeeBillSaldokartu
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateFeeBillSaldokartu
                                                );
                                            }}
                                        />

                                        <InputError
                                            message={
                                                errors["fee_bill_saldokartu"]
                                            }
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="bank">Bank*</label>
                                        <Dropdown
                                            value={data.partner.bank}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    bank: e.value,
                                                })
                                            }
                                            options={[
                                                { name: "BSI" },
                                                { name: "BRI" },
                                                { name: "BNI" },
                                                { name: "Mandiri" },
                                                { name: "BCA" },
                                            ]}
                                            optionLabel="name"
                                            optionValue="name"
                                            editable
                                            placeholder="Pilih Bank"
                                            className={`w-full md:w-14rem `}
                                            onFocus={() => {
                                                triggerInputFocus(animateBank);
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateBank
                                                );
                                            }}
                                        />
                                        <InputError
                                            message={errors["partner.bank"]}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="account_bank_number">
                                            Nomor Rekening*
                                        </label>
                                        <InputText
                                            value={
                                                data.partner
                                                    .account_bank_number ?? ""
                                            }
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    account_bank_number:
                                                        e.target.value,
                                                })
                                            }
                                            className={`dark:bg-gray-300 
                                        }`}
                                            id="account_bank_number"
                                            aria-describedby="account_bank_number-help"
                                            keyfilter="int"
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateAccountBankNumber
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateAccountBankNumber
                                                );
                                            }}
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    "partner.account_bank_number"
                                                ]
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="account_bank_name">
                                            Atas Nama*
                                        </label>
                                        <InputText
                                            value={
                                                data.partner
                                                    .account_bank_name ?? ""
                                            }
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    account_bank_name:
                                                        e.target.value,
                                                })
                                            }
                                            className={`dark:bg-gray-300 ${
                                                errors.account_bank_name &&
                                                "p-invalid"
                                            }`}
                                            id="account_bank_name"
                                            aria-describedby="account_bank_name-help"
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateAccountBankName
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateAccountBankName
                                                );
                                            }}
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    "partner.account_bank_name"
                                                ]
                                            }
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="expired_date">
                                            Tanggal Kadaluwarsa *
                                        </label>
                                        <Calendar
                                            value={
                                                data.expired_date
                                                    ? new Date(
                                                          data.expired_date
                                                      )
                                                    : null
                                            }
                                            style={{ height: "35px" }}
                                            onChange={(e) => {
                                                const formattedDate = new Date(
                                                    e.target.value
                                                )
                                                    .toISOString()
                                                    .split("T")[0];
                                                setData(
                                                    "expired_date",
                                                    e.target.value
                                                );
                                            }}
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateExpiredDate
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateExpiredDate
                                                );
                                            }}
                                            showIcon
                                            dateFormat="dd/mm/yy"
                                        />
                                        <InputError
                                            message={errors["expired_date"]}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="profit_sharing">
                                            Bagi hasil
                                        </label>
                                        <div className="flex items-center gap-2 my-2">
                                            <Checkbox
                                                onChange={(e) =>
                                                    setData(
                                                        "profit_sharing",
                                                        e.checked
                                                    )
                                                }
                                                checked={data.profit_sharing}
                                                onFocus={() => {
                                                    triggerInputFocus(
                                                        animateProfitSharing
                                                    );
                                                }}
                                                onBlur={() => {
                                                    stopAnimateInputFocus(
                                                        animateProfitSharing
                                                    );
                                                }}
                                            ></Checkbox>
                                            <p className="text-xs">
                                                melakukan bagi hasil
                                            </p>
                                        </div>
                                    </div>

                                    {data.profit_sharing && (
                                        <div className="flex flex-col mt-3">
                                            <label htmlFor="profit_sharing_detail">
                                                Ketentuan Bagi hasil
                                            </label>

                                            <InputTextarea
                                                value={
                                                    data.profit_sharing_detail
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "profit_sharing_detail",
                                                        e.target.value
                                                    )
                                                }
                                                rows={5}
                                                cols={30}
                                                onFocus={() => {
                                                    triggerInputFocus(
                                                        animateProfitSharingDetail
                                                    );
                                                }}
                                                onBlur={() => {
                                                    stopAnimateInputFocus(
                                                        animateProfitSharingDetail
                                                    );
                                                }}
                                            />
                                        </div>
                                    )}

                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="signature">
                                            Tanda Tangan *
                                        </label>

                                        <Dropdown
                                            value={data.signature}
                                            onChange={(e) => {
                                                setData({
                                                    ...data,
                                                    signature: {
                                                        name: e.target.value
                                                            .name,
                                                        position:
                                                            e.target.value
                                                                .position,
                                                        image: e.target.value
                                                            .image,
                                                    },
                                                });
                                            }}
                                            dataKey="name"
                                            options={signatures}
                                            optionLabel="name"
                                            placeholder="Pilih Tanda Tangan"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={
                                                optionSignatureTemplate
                                            }
                                            className={`w-full md:w-14rem ${
                                                errors.signature_name &&
                                                "p-invalid"
                                            }`}
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateSignatureName
                                                );
                                            }}
                                            onShow={() => {
                                                triggerInputFocus(
                                                    animateSignatureName
                                                );
                                            }}
                                            onHide={() => {
                                                stopAnimateInputFocus(
                                                    animateSignatureName
                                                );
                                            }}
                                            showOnFocus
                                        />
                                        <InputError
                                            message={errors["signature.image"]}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="signature">
                                            Tanda Tangan PIC
                                        </label>

                                        <div className="App">
                                            {data.partner.pic_signature !==
                                                null &&
                                            typeof data.partner.pic_signature ==
                                                "string" ? (
                                                <>
                                                    <FilePond
                                                        files={
                                                            "/storage/" +
                                                            data.partner
                                                                .pic_signature
                                                        }
                                                        onaddfile={(
                                                            error,
                                                            fileItems
                                                        ) => {
                                                            if (!error) {
                                                                setData(
                                                                    "partner",
                                                                    {
                                                                        ...data.partner,
                                                                        pic_signature:
                                                                            fileItems.file,
                                                                    }
                                                                );
                                                            }
                                                        }}
                                                        onremovefile={() => {
                                                            setData("partner", {
                                                                ...data.partner,
                                                                pic_signature:
                                                                    null,
                                                            });
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
                                                                    "partner",
                                                                    {
                                                                        ...data.partner,
                                                                        pic_signature:
                                                                            fileItems.file,
                                                                    }
                                                                );
                                                            }
                                                        }}
                                                        onremovefile={() => {
                                                            setData("partner", {
                                                                ...data.partner,
                                                                pic_signature:
                                                                    null,
                                                            });
                                                        }}
                                                        maxFileSize="2mb"
                                                        labelMaxFileSizeExceeded="File terlalu besar"
                                                        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-flex-col mt-3">
                                        <form onSubmit={handleSubmitForm}>
                                            <Button className="mx-auto justify-center block">
                                                Submit
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div className="md:w-[65%] hidden md:block h-screen max-h-screen text-sm overflow-y-auto p-5">
                            <header>
                                <div className="flex justify-center leading-6 text-center flex-col">
                                    <h1 className="font-bold">
                                        PERJANJIAN KERJA SAMA
                                    </h1>
                                    <h1 className="font-bold">
                                        KEMITRAAN PT CAZH TEKNOLOGI INOVASI
                                    </h1>
                                    <h1 className="font-bold">
                                        DENGAN{" "}
                                        {data.partner.name ?? "{{partner}}"}
                                    </h1>
                                </div>
                            </header>
                            <hr className="h-[2px] my-2 bg-slate-400" />

                            <div className="text-center leading-6 mt-5">
                                <h1 className="font-bold underline mx-auto">
                                    BERITA ACARA KEMITRAAN
                                </h1>
                                <p className="font-bold">Nomor : {data.code}</p>
                            </div>

                            <div className="mt-5">
                                <p>
                                    Pada hari ini{" "}
                                    <span ref={animateDay}>
                                        {data.day ?? "{{Hari}}"}
                                    </span>
                                    , Tanggal{" "}
                                    <span ref={animateDate}>
                                        {new Date(data.date).toLocaleDateString(
                                            "id-ID",
                                            {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            }
                                        ) ?? "{{Tanggal}}"}
                                    </span>{" "}
                                    telah disepakati kerja sama antara:
                                </p>
                            </div>

                            <div className="mt-5 px-8">
                                <table
                                    className="border-collapse border-spacing-5 w-full"
                                    style={{
                                        borderCollapse: "separate",
                                        borderSpacing: "0 15px",
                                    }}
                                >
                                    <tbody className="">
                                        <tr>
                                            <td className="align-text-top w-[3%]">
                                                1.
                                            </td>
                                            <td>
                                                <table className="w-full">
                                                    <tr>
                                                        <td className="w-[15%]">
                                                            Nama
                                                        </td>
                                                        <td>
                                                            :{" "}
                                                            <b>
                                                                MUH ARIF
                                                                MAHFUDIN
                                                            </b>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="w-[15%]">
                                                            Jabatan
                                                        </td>
                                                        <td>
                                                            :{" "}
                                                            <b>
                                                                Direktur Utama
                                                            </b>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="w-[15%]">
                                                            Lembaga
                                                        </td>
                                                        <td>
                                                            :{" "}
                                                            <b>
                                                                PT CAZH
                                                                TEKNOLOGI
                                                                INOVASI
                                                            </b>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="w-[15%]">
                                                            Lokasi
                                                        </td>
                                                        <td>
                                                            :{" "}
                                                            <b>
                                                                Kab. Banyumas,
                                                                Jawa Tengah
                                                            </b>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={2}>
                                                            Selanjutnya disebut
                                                            sebagai “Pihak
                                                            Pertama”.
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="align-text-top w-[3%]">
                                                2.
                                            </td>
                                            <td>
                                                <table className="w-full">
                                                    <tr>
                                                        <td className="w-[15%]">
                                                            Nama
                                                        </td>
                                                        <td>
                                                            :{" "}
                                                            <b
                                                                ref={
                                                                    animatePartnerPIC
                                                                }
                                                            >
                                                                {data.partner
                                                                    .pic ??
                                                                    "{nama_pic}"}
                                                            </b>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="w-[15%]">
                                                            Jabatan
                                                        </td>
                                                        <td>
                                                            :{" "}
                                                            <b
                                                                ref={
                                                                    animatePartnerPICPosition
                                                                }
                                                            >
                                                                {data.partner
                                                                    .pic_position ??
                                                                    "{jabatan_pic}"}
                                                            </b>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="w-[15%]">
                                                            Lembaga
                                                        </td>
                                                        <td>
                                                            :{" "}
                                                            <b
                                                                ref={
                                                                    animatePartnerNameRef
                                                                }
                                                            >
                                                                {data.partner
                                                                    .name ??
                                                                    "{lembaga}"}
                                                            </b>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="w-[15%]">
                                                            Lokasi
                                                        </td>
                                                        <td>
                                                            :{" "}
                                                            <b>
                                                                <span
                                                                    ref={
                                                                        animatePartnerRegencyRef
                                                                    }
                                                                >
                                                                    {data
                                                                        .partner
                                                                        .regency
                                                                        ? JSON.parse(
                                                                              data
                                                                                  .partner
                                                                                  .regency
                                                                          ).name
                                                                        : "{{kabupaten}}"}
                                                                </span>
                                                                {", "}
                                                                <span
                                                                    ref={
                                                                        animatePartnerProvinceRef
                                                                    }
                                                                >
                                                                    {data
                                                                        .partner
                                                                        .province
                                                                        ? JSON.parse(
                                                                              data
                                                                                  .partner
                                                                                  .province
                                                                          ).name
                                                                        : "{{provinsi}}"}
                                                                </span>
                                                            </b>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={2}>
                                                            Selanjutnya disebut
                                                            sebagai “Pihak
                                                            Pertama”.
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="align-text-top w-[3%]"></td>
                                            <td>
                                                <p>
                                                    Pihak Pertama dan Pihak
                                                    Kedua secara bersama-sama
                                                    disebut “Para Pihak”.
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-5">
                                <p>
                                    Para Pihak menyepakati kerjasama dengan
                                    ketentuan sebagai berikut:
                                </p>
                                <div className="pl-8">
                                    <table
                                        className="border-collapse border-spacing-5 w-full"
                                        style={{
                                            borderCollapse: "separate",
                                            borderSpacing: "0 15px",
                                        }}
                                    >
                                        <tbody className="">
                                            <tr>
                                                <td className="font-bold align-text-top w-[3%]">
                                                    1.
                                                </td>
                                                <td>
                                                    <p className="font-bold">
                                                        Produk
                                                    </p>
                                                    <p>
                                                        Pihak Pertama memberikan
                                                        hak kepada Pihak Kedua
                                                        untuk menggunakan
                                                        perangkat lunak sebagai
                                                        berikut:
                                                    </p>
                                                    <div className="px-6">
                                                        <table>
                                                            <tbody className="text-justify">
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        a.
                                                                    </td>
                                                                    <td>
                                                                        Aplikasi
                                                                        Web
                                                                        Dashboard
                                                                        Sistem
                                                                        Manajemen
                                                                        Lembaga,
                                                                        yang
                                                                        dapat
                                                                        diakses
                                                                        dengan
                                                                        alamat
                                                                        URL{" "}
                                                                        <b
                                                                            ref={
                                                                                animateUrlSubdomain
                                                                            }
                                                                        >
                                                                            {data.url_subdomain ??
                                                                                "{url_subdomain}"}
                                                                        </b>{" "}
                                                                        menggunakan
                                                                        peramban
                                                                        web
                                                                        <i>
                                                                            (
                                                                            web
                                                                            browser
                                                                            )
                                                                        </i>{" "}
                                                                        apa pun
                                                                        yang
                                                                        terhubung
                                                                        dengan
                                                                        jaringan
                                                                        internet.
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        b.
                                                                    </td>
                                                                    <td>
                                                                        Aplikasi
                                                                        <i>
                                                                            <i>
                                                                                mobile
                                                                            </i>
                                                                        </i>{" "}
                                                                        Kartu
                                                                        Digital
                                                                        bernama
                                                                        <b>
                                                                            “CARDS
                                                                            Kartu
                                                                            Digital”
                                                                        </b>
                                                                        yang
                                                                        dapat
                                                                        diunduh
                                                                        untuk
                                                                        pengguna
                                                                        sistem
                                                                        operasi
                                                                        Android
                                                                        maupun
                                                                        iOS.
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        c.
                                                                    </td>
                                                                    <td>
                                                                        Aplikasi
                                                                        <i>
                                                                            <i>
                                                                                mobile
                                                                            </i>
                                                                        </i>{" "}
                                                                        Kasir
                                                                        Digital
                                                                        bernama
                                                                        <b>
                                                                            “CAZH
                                                                            POS”
                                                                        </b>
                                                                        dan/atau
                                                                        “CAZH
                                                                        POS
                                                                        Lite”
                                                                        yang
                                                                        dapat
                                                                        diunduh
                                                                        untuk
                                                                        pengguna
                                                                        sistem
                                                                        operasi
                                                                        Android.
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold align-text-top w-[3%]">
                                                    2.
                                                </td>
                                                <td>
                                                    <p className="font-bold">
                                                        Definisi
                                                    </p>
                                                    <p>
                                                        Pihak Pertama
                                                        menggunakan beberapa
                                                        istilah untuk diketahui
                                                        dan disepakati dengan
                                                        Pihak Kedua dengan
                                                        ketentuan sebagai
                                                        berikut:
                                                    </p>
                                                    <div className="pl-6">
                                                        <table>
                                                            <tbody className="text-justify">
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        a.
                                                                    </td>
                                                                    <td>
                                                                        CazhBox
                                                                        adalah
                                                                        saldo
                                                                        milik
                                                                        Pihak
                                                                        Kedua
                                                                        pada
                                                                        aplikasi
                                                                        Web
                                                                        Dashboard
                                                                        dan
                                                                        aplikasi
                                                                        <i>
                                                                            mobile
                                                                        </i>{" "}
                                                                        Kasir
                                                                        Digital
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        b.
                                                                    </td>
                                                                    <td>
                                                                        CazhPOIN
                                                                        adalah
                                                                        saldo
                                                                        milik
                                                                        user
                                                                        aplikasi
                                                                        <i>
                                                                            mobile
                                                                        </i>{" "}
                                                                        Kartu
                                                                        Digital
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        c.
                                                                    </td>
                                                                    <td>
                                                                        <i>
                                                                            Top-up
                                                                        </i>{" "}
                                                                        adalah
                                                                        proses
                                                                        pengisian
                                                                        saldo
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        d.
                                                                    </td>
                                                                    <td>
                                                                        <i>
                                                                            Withdraw
                                                                        </i>{" "}
                                                                        adalah
                                                                        proses
                                                                        penarikan
                                                                        saldo
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        e.
                                                                    </td>
                                                                    <td>
                                                                        <i>
                                                                            Virtual
                                                                            Account
                                                                        </i>{" "}
                                                                        adalah
                                                                        metode
                                                                        pembayaran
                                                                        melalui
                                                                        fasilitas
                                                                        bank
                                                                        yang
                                                                        dapat
                                                                        dilakukan
                                                                        dari
                                                                        ATM,{" "}
                                                                        <i>
                                                                            Internet
                                                                            banking
                                                                        </i>{" "}
                                                                        maupun{" "}
                                                                        <i>
                                                                            m-banking
                                                                        </i>
                                                                        .
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        f.
                                                                    </td>
                                                                    <td>
                                                                        QRIS
                                                                        adalah
                                                                        metode
                                                                        pembayaran
                                                                        menggunakan
                                                                        standar
                                                                        QR yang
                                                                        diatur
                                                                        oleh
                                                                        Bank
                                                                        Indonesia,
                                                                        baik
                                                                        melalui
                                                                        aplikasi{" "}
                                                                        <i>
                                                                            e-wallet
                                                                        </i>{" "}
                                                                        maupun{" "}
                                                                        <i>
                                                                            m-banking
                                                                        </i>
                                                                        .
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold align-text-top w-[3%]">
                                                    3.
                                                </td>
                                                <td>
                                                    <p className="font-bold">
                                                        Harga Layanan
                                                    </p>
                                                    <p className="text-justify">
                                                        Pihak Pertama memiliki
                                                        hak untuk menerima
                                                        pembayaran dari Pihak
                                                        Kedua untuk layanan yang
                                                        dikenakan PPN 11% sesuai
                                                        dengan peraturan
                                                        perpajakan yang berlaku.
                                                        Hak ini diberikan dengan
                                                        ketentuan sebagai
                                                        berikut:
                                                    </p>
                                                    <div className="pl-6">
                                                        <table
                                                            className="w-full"
                                                            style={{
                                                                borderCollapse:
                                                                    "separate",
                                                                borderSpacing:
                                                                    "0 15px",
                                                            }}
                                                        >
                                                            <tbody>
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        a.
                                                                    </td>
                                                                    <td className="w-full">
                                                                        <p>
                                                                            Harga
                                                                            produk
                                                                            kartu
                                                                        </p>
                                                                        <table
                                                                            className="w-full"
                                                                            border={
                                                                                1
                                                                            }
                                                                        >
                                                                            <thead className="bg-[#efefef] font-bold">
                                                                                <th className="w-[5%] border border-[#d1d5db] p-[5px]">
                                                                                    No
                                                                                </th>
                                                                                <th className="w-[50%] border border-[#d1d5db] p-[5px]">
                                                                                    Produk
                                                                                </th>
                                                                                <th className="border border-[#d1d5db] p-[5px]">
                                                                                    Harga
                                                                                </th>
                                                                            </thead>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td className="text-center border border-[#d1d5db] p-[5px]">
                                                                                        1
                                                                                    </td>
                                                                                    <td className="w-[50%] border border-[#d1d5db] p-[5px]">
                                                                                        Kartu
                                                                                        Tercetak
                                                                                    </td>
                                                                                    <td className="border border-[#d1d5db] p-[5px]">
                                                                                        <span
                                                                                            ref={
                                                                                                animatePriceCard
                                                                                            }
                                                                                        >
                                                                                            Rp
                                                                                            {data.price_card?.toLocaleString(
                                                                                                "id-ID"
                                                                                            ) ??
                                                                                                "{harga kartu}"}
                                                                                            /kartu
                                                                                        </span>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="text-center border border-[#d1d5db] p-[5px]">
                                                                                        2
                                                                                    </td>
                                                                                    <td className="w-[50%] border border-[#d1d5db] p-[5px]">
                                                                                        Lanyard
                                                                                        (Tali
                                                                                        gantungan
                                                                                        kartu)
                                                                                    </td>
                                                                                    <td className="border border-[#d1d5db] p-[5px]">
                                                                                        <span
                                                                                            ref={
                                                                                                animatePriceLanyard
                                                                                            }
                                                                                        >
                                                                                            Rp
                                                                                            {data.price_lanyard?.toLocaleString(
                                                                                                "id-ID"
                                                                                            ) ??
                                                                                                "{Harga Cetak Lanyard}"}
                                                                                            /lanyard
                                                                                        </span>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        b.
                                                                    </td>
                                                                    <td className="w-full">
                                                                        <p>
                                                                            Harga
                                                                            langganan
                                                                            sistem
                                                                        </p>
                                                                        <table
                                                                            className="w-full"
                                                                            border={
                                                                                1
                                                                            }
                                                                        >
                                                                            <thead className="bg-[#efefef] font-bold">
                                                                                <th className="w-[5%] border border-[#d1d5db] p-[5px]">
                                                                                    No
                                                                                </th>
                                                                                <th className="w-[50%] border border-[#d1d5db] p-[5px]">
                                                                                    Layanan
                                                                                </th>
                                                                                <th className="border border-[#d1d5db] p-[5px]">
                                                                                    Harga
                                                                                </th>
                                                                            </thead>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td className="text-center border border-[#d1d5db] p-[5px]">
                                                                                        1
                                                                                    </td>
                                                                                    <td className="w-[50%] border border-[#d1d5db] p-[5px]">
                                                                                        Langganan
                                                                                        sistem
                                                                                    </td>
                                                                                    <td className="border border-[#d1d5db] p-[5px]">
                                                                                        <span
                                                                                            ref={
                                                                                                animateNominalSubscription
                                                                                            }
                                                                                        >
                                                                                            Rp
                                                                                            {data.price_subscription_system?.toLocaleString(
                                                                                                "id-ID"
                                                                                            ) ??
                                                                                                "{Harga Langganan}"}{" "}
                                                                                        </span>
                                                                                        <span
                                                                                            ref={
                                                                                                animatePeriodSubscription
                                                                                            }
                                                                                        >
                                                                                            per-
                                                                                            {data.period_subscription ??
                                                                                                "{Langganan Per-}"}
                                                                                        </span>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        c.
                                                                    </td>
                                                                    <td className="w-full">
                                                                        <p>
                                                                            Harga
                                                                            implementasi
                                                                        </p>
                                                                        <p className="text-justify">
                                                                            Pihak
                                                                            Kedua
                                                                            berhak
                                                                            atas
                                                                            layanan
                                                                            gratis
                                                                            terkait
                                                                            pelatihan
                                                                            dan/atau
                                                                            sosialisasi
                                                                            secara
                                                                            daring
                                                                            sebanyak
                                                                            3
                                                                            kali
                                                                            sesi.
                                                                            Di
                                                                            luar
                                                                            dari
                                                                            ketiga
                                                                            sesi
                                                                            tersebut,
                                                                            Pihak
                                                                            Kedua
                                                                            akan
                                                                            dikenakan
                                                                            biaya
                                                                            layanan
                                                                            untuk
                                                                            setiap
                                                                            pertemuan.
                                                                        </p>
                                                                        <table
                                                                            className="w-full"
                                                                            border={
                                                                                1
                                                                            }
                                                                        >
                                                                            <thead className="bg-[#efefef] font-bold">
                                                                                <th className="w-[5%] border border-[#d1d5db] p-[5px]">
                                                                                    No
                                                                                </th>
                                                                                <th className="w-[50%] border border-[#d1d5db] p-[5px]">
                                                                                    Layanan
                                                                                </th>
                                                                                <th className="border border-[#d1d5db] p-[5px]">
                                                                                    Harga
                                                                                </th>
                                                                            </thead>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td className="text-center border border-[#d1d5db] p-[5px]">
                                                                                        1
                                                                                    </td>
                                                                                    <td className="w-[50%] border border-[#d1d5db] p-[5px]">
                                                                                        Training
                                                                                        dan/atau
                                                                                        sosialisasi
                                                                                        di
                                                                                        lokasi
                                                                                    </td>

                                                                                    <td className="border border-[#d1d5db] p-[5px]">
                                                                                        <span
                                                                                            ref={
                                                                                                animatePriceTrainingOffline
                                                                                            }
                                                                                        >
                                                                                            Rp
                                                                                            {data.price_training_offline?.toLocaleString(
                                                                                                "id-ID"
                                                                                            ) ??
                                                                                                "{Training Offline}"}{" "}
                                                                                            sekali
                                                                                            bayar
                                                                                        </span>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="text-center border border-[#d1d5db] p-[5px]">
                                                                                        2
                                                                                    </td>
                                                                                    <td className="w-[50%] border border-[#d1d5db] p-[5px]">
                                                                                        Training
                                                                                        dan/atau
                                                                                        sosialisasi
                                                                                        secara
                                                                                        daring.
                                                                                    </td>
                                                                                    <td className="border border-[#d1d5db] p-[5px]">
                                                                                        <span
                                                                                            ref={
                                                                                                animatePriceTrainingOnline
                                                                                            }
                                                                                        >
                                                                                            Rp
                                                                                            {data.price_training_online?.toLocaleString(
                                                                                                "id-ID"
                                                                                            ) ??
                                                                                                "{Training Online}"}
                                                                                        </span>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold align-text-top w-[3%]">
                                                    4.
                                                </td>
                                                <td>
                                                    <p className="font-bold">
                                                        Pembayaran
                                                    </p>
                                                    <p className="text-justify">
                                                        Pihak Pertama berhak
                                                        mengirimkan tagihan
                                                        berupa invoice digital
                                                        maupun tercetak untuk
                                                        dibayar oleh Pihak Kedua
                                                        dengan ketentuan sebagai
                                                        berikut:
                                                    </p>
                                                    <div className="pl-6">
                                                        <table>
                                                            <tbody className="text-justify">
                                                                <tr>
                                                                    <td className="align-text-top w-[4%]">
                                                                        a.
                                                                    </td>
                                                                    <td>
                                                                        Pembayaran
                                                                        melalui
                                                                        tautan
                                                                        (link)
                                                                        atau
                                                                        cara
                                                                        lain
                                                                        yang
                                                                        ditentukan
                                                                        Pihak
                                                                        Pertama;
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="align-text-top w-[4%]">
                                                                        b.
                                                                    </td>
                                                                    <td>
                                                                        Sebelum
                                                                        batas
                                                                        waktu
                                                                        pembayaran
                                                                        yang
                                                                        ditentukan
                                                                        pada
                                                                        invoice.
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold align-text-top w-[3%]">
                                                    5.
                                                </td>
                                                <td>
                                                    <p className="font-bold">
                                                        Harga Transaksi
                                                    </p>
                                                    <p className="text-justify">
                                                        Pihak Pertama berhak
                                                        menerima pembayaran dari
                                                        penggunaan aplikasi
                                                        untuk layanan yang
                                                        diberikan dengan
                                                        ketentuan sebagai
                                                        berikut:
                                                    </p>
                                                    <div className="pl-6">
                                                        <table
                                                            className="w-full"
                                                            style={{
                                                                borderCollapse:
                                                                    "separate",
                                                                borderSpacing:
                                                                    "0 15px",
                                                            }}
                                                        >
                                                            <tbody>
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        a.
                                                                    </td>
                                                                    <td className="w-full">
                                                                        <p>
                                                                            Aplikasi
                                                                            Kartu
                                                                            Digital
                                                                        </p>
                                                                        <table
                                                                            className="w-full"
                                                                            border={
                                                                                1
                                                                            }
                                                                        >
                                                                            <thead className="bg-[#efefef] font-bold">
                                                                                <th className="w-[5%] border border-[#d1d5db] p-[5px]">
                                                                                    No
                                                                                </th>
                                                                                <th className="w-[35%] border border-[#d1d5db] p-[5px]">
                                                                                    Produk
                                                                                </th>
                                                                                <th className="w-[35%] border border-[#d1d5db] p-[5px]">
                                                                                    Metode
                                                                                    Pembayaran
                                                                                </th>
                                                                                <th className="border border-[#d1d5db] p-[5px]">
                                                                                    Harga
                                                                                </th>
                                                                            </thead>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td className="text-center align-text-top border border-[#d1d5db] p-[5px]">
                                                                                        1
                                                                                    </td>
                                                                                    <td className="w-[35%] align-text-top border border-[#d1d5db] p-[5px]">
                                                                                        Beli
                                                                                        CazhPOIN
                                                                                        nominal
                                                                                        10.000-249.999
                                                                                    </td>
                                                                                    <td className="w-[35%] border border-[#d1d5db] p-[5px]">
                                                                                        <ul className="list-disc list-inside">
                                                                                            <li>
                                                                                                Virtual
                                                                                                Account
                                                                                                Bank
                                                                                            </li>
                                                                                            <li>
                                                                                                Minimarket
                                                                                            </li>
                                                                                            <li>
                                                                                                QRIS
                                                                                            </li>
                                                                                        </ul>
                                                                                    </td>
                                                                                    <td className="border border-[#d1d5db] p-[5px]">
                                                                                        <ul>
                                                                                            <li>
                                                                                                Rp5.000
                                                                                            </li>
                                                                                            <li>
                                                                                                Rp5.000
                                                                                            </li>
                                                                                            <li>
                                                                                                1%
                                                                                                dari
                                                                                                nominal
                                                                                            </li>
                                                                                        </ul>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="text-center align-text-top border border-[#d1d5db] p-[5px]">
                                                                                        2
                                                                                    </td>
                                                                                    <td className="w-[30%] align-text-top border border-[#d1d5db] p-[5px]">
                                                                                        Beli
                                                                                        CazhPOIN
                                                                                        nominal
                                                                                        250.000
                                                                                        dan/atau
                                                                                        lebih
                                                                                    </td>
                                                                                    <td className="border border-[#d1d5db] p-[5px]">
                                                                                        <ul className="list-disc list-inside">
                                                                                            <li>
                                                                                                Virtual
                                                                                                Account
                                                                                                Bank
                                                                                            </li>
                                                                                            <li>
                                                                                                Minimarket
                                                                                            </li>
                                                                                            <li>
                                                                                                QRIS
                                                                                            </li>
                                                                                        </ul>
                                                                                    </td>
                                                                                    <td className="border border-[#d1d5db] p-[5px]">
                                                                                        <ul>
                                                                                            <li>
                                                                                                Gratis
                                                                                            </li>
                                                                                            <li>
                                                                                                Gratis
                                                                                            </li>
                                                                                            <li>
                                                                                                1%
                                                                                                dari
                                                                                                nominal
                                                                                            </li>
                                                                                        </ul>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="text-center align-text-top border border-[#d1d5db] p-[5px]">
                                                                                        3
                                                                                    </td>
                                                                                    <td className="w-[30%] align-text-top border border-[#d1d5db] p-[5px]">
                                                                                        Isi
                                                                                        Kartu
                                                                                    </td>
                                                                                    <td className="border border-[#d1d5db] p-[5px]">
                                                                                        <ul className="list-disc list-inside">
                                                                                            <li>
                                                                                                Virtual
                                                                                                Account
                                                                                                Bank
                                                                                            </li>
                                                                                            <li>
                                                                                                Minimarket
                                                                                            </li>
                                                                                            <li>
                                                                                                QRIS
                                                                                            </li>
                                                                                            <li>
                                                                                                Dana
                                                                                            </li>
                                                                                            <li>
                                                                                                CazhPOIN
                                                                                            </li>
                                                                                        </ul>
                                                                                    </td>
                                                                                    <td className="border border-[#d1d5db] p-[5px] align-text-top">
                                                                                        <ul>
                                                                                            <li>
                                                                                                Rp7.500
                                                                                            </li>
                                                                                            <li>
                                                                                                Rp7.500
                                                                                            </li>
                                                                                            <li>
                                                                                                1%
                                                                                                dari
                                                                                                nominal
                                                                                            </li>
                                                                                            <li>
                                                                                                2%
                                                                                                dari
                                                                                                nominal
                                                                                            </li>
                                                                                            <li>
                                                                                                <span
                                                                                                    ref={
                                                                                                        animateFeePurchaseCazhpoin
                                                                                                    }
                                                                                                >
                                                                                                    Rp
                                                                                                    {data.fee_purchase_cazhpoin?.toLocaleString(
                                                                                                        "id-ID"
                                                                                                    ) ??
                                                                                                        "{Isi Kartu via CazhPOIN}"}{" "}
                                                                                                </span>
                                                                                            </li>
                                                                                        </ul>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="text-center align-text-top border border-[#d1d5db] p-[5px]">
                                                                                        4
                                                                                    </td>
                                                                                    <td className="w-[30%] align-text-top border border-[#d1d5db] p-[5px]">
                                                                                        Pembayaran
                                                                                        Tagihan
                                                                                    </td>
                                                                                    <td className="border border-[#d1d5db] p-[5px]">
                                                                                        <ul className="list-disc list-inside">
                                                                                            <li>
                                                                                                Virtual
                                                                                                Account
                                                                                                Bank
                                                                                            </li>
                                                                                            <li>
                                                                                                Minimarket
                                                                                            </li>
                                                                                            <li>
                                                                                                QRIS
                                                                                            </li>

                                                                                            <li>
                                                                                                CazhPOIN
                                                                                            </li>
                                                                                        </ul>
                                                                                    </td>
                                                                                    <td className="border border-[#d1d5db] p-[5px]">
                                                                                        <ul>
                                                                                            <li>
                                                                                                Rp7.500
                                                                                            </li>
                                                                                            <li>
                                                                                                Rp7.500
                                                                                            </li>
                                                                                            <li>
                                                                                                1%
                                                                                                dari
                                                                                                nominal
                                                                                            </li>
                                                                                            <li>
                                                                                                <span
                                                                                                    ref={
                                                                                                        animateFeeBillCazhpoin
                                                                                                    }
                                                                                                >
                                                                                                    Rp
                                                                                                    {data.fee_bill_cazhpoin?.toLocaleString(
                                                                                                        "id-ID"
                                                                                                    ) ??
                                                                                                        "{Bayar Tagihan via CazhPOIN}"}{" "}
                                                                                                </span>
                                                                                            </li>
                                                                                        </ul>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        b.
                                                                    </td>
                                                                    <td className="w-full">
                                                                        <p>
                                                                            Aplikasi
                                                                            Kasir
                                                                            Digital
                                                                        </p>
                                                                        <table
                                                                            className="w-full"
                                                                            border={
                                                                                1
                                                                            }
                                                                        >
                                                                            <thead className="bg-[#efefef] font-bold">
                                                                                <th className="w-[5%] border border-[#d1d5db] p-[5px]">
                                                                                    No
                                                                                </th>
                                                                                <th className="w-[50%] border border-[#d1d5db] p-[5px]">
                                                                                    Transaksi
                                                                                </th>
                                                                                <th className="border border-[#d1d5db] p-[5px]">
                                                                                    Harga
                                                                                    per-transaksi
                                                                                </th>
                                                                            </thead>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td className="text-center border border-[#d1d5db] p-[5px]">
                                                                                        1
                                                                                    </td>
                                                                                    <td className="w-[50%] border border-[#d1d5db] p-[5px]">
                                                                                        Top-up
                                                                                        kartu
                                                                                    </td>
                                                                                    <td className="border border-[#d1d5db] p-[5px]">
                                                                                        <span
                                                                                            ref={
                                                                                                animateFeeTopupCazhpos
                                                                                            }
                                                                                        >
                                                                                            Rp
                                                                                            {data.fee_topup_cazhpos?.toLocaleString(
                                                                                                "id-ID"
                                                                                            ) ??
                                                                                                "{TopUp Kartu via Cazh POS}"}{" "}
                                                                                        </span>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="text-center border border-[#d1d5db] p-[5px]">
                                                                                        2
                                                                                    </td>
                                                                                    <td className="w-[50%] border border-[#d1d5db] p-[5px]">
                                                                                        Withdraw
                                                                                        kartu
                                                                                    </td>
                                                                                    <td className="border border-[#d1d5db] p-[5px]">
                                                                                        <span
                                                                                            ref={
                                                                                                animateFeeWithdrawCazhpos
                                                                                            }
                                                                                        >
                                                                                            Rp
                                                                                            {data.fee_withdraw_cazhpos?.toLocaleString(
                                                                                                "id-ID"
                                                                                            ) ??
                                                                                                "{Withdraw Kartu via Cazh POS}"}{" "}
                                                                                        </span>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="text-center border border-[#d1d5db] p-[5px]">
                                                                                        3
                                                                                    </td>
                                                                                    <td className="w-[50%] border border-[#d1d5db] p-[5px]">
                                                                                        Transaksi
                                                                                        pembelian
                                                                                        produk
                                                                                    </td>
                                                                                    <td className="border border-[#d1d5db] p-[5px]">
                                                                                        Rp0
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="text-center border border-[#d1d5db] p-[5px]">
                                                                                        4
                                                                                    </td>
                                                                                    <td className="w-[50%] border border-[#d1d5db] p-[5px]">
                                                                                        Penarikan
                                                                                        CazhBox
                                                                                        dari
                                                                                        Aplikasi
                                                                                        Kasir
                                                                                    </td>
                                                                                    <td className="border border-[#d1d5db] p-[5px]">
                                                                                        Rp7.500/transaksi
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        c.
                                                                    </td>
                                                                    <td className="w-full">
                                                                        <p>
                                                                            Aplikasi
                                                                            Web
                                                                            Dashboard
                                                                            Sistem
                                                                            Manajemen
                                                                            Lembaga
                                                                        </p>
                                                                        <table
                                                                            className="w-full"
                                                                            border={
                                                                                1
                                                                            }
                                                                        >
                                                                            <thead className="bg-[#efefef] font-bold">
                                                                                <th className="w-[5%] border border-[#d1d5db] p-[5px]">
                                                                                    No
                                                                                </th>
                                                                                <th className="w-[30%] border border-[#d1d5db] p-[5px]">
                                                                                    Transaksi
                                                                                </th>
                                                                                <th className="w-[30%] border border-[#d1d5db] p-[5px]">
                                                                                    Jenis
                                                                                    Transaksi
                                                                                </th>
                                                                                <th className="w-[30%] border border-[#d1d5db] p-[5px]">
                                                                                    Harga
                                                                                    per-transaksi
                                                                                </th>
                                                                            </thead>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td className="text-center align-text-top border border-[#d1d5db] p-[5px]">
                                                                                        1
                                                                                    </td>
                                                                                    <td className="w-[35%] align-text-top border border-[#d1d5db] p-[5px]">
                                                                                        Top-up
                                                                                        saldo
                                                                                        kartu
                                                                                    </td>
                                                                                    <td className="w-[35%] border border-[#d1d5db] p-[5px] align-text-top">
                                                                                        <ul className="list-disc list-inside">
                                                                                            <li>
                                                                                                Pengisian
                                                                                                Tunai
                                                                                            </li>
                                                                                        </ul>
                                                                                    </td>
                                                                                    <td className="border border-[#d1d5db] p-[5px]">
                                                                                        <ul>
                                                                                            <li>
                                                                                                Rp1.000
                                                                                            </li>
                                                                                        </ul>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="text-center align-text-top border border-[#d1d5db] p-[5px]">
                                                                                        2
                                                                                    </td>
                                                                                    <td className="w-[30%] align-text-top border border-[#d1d5db] p-[5px]">
                                                                                        Pembayaran
                                                                                        tagihan
                                                                                    </td>
                                                                                    <td className="border border-[#d1d5db] p-[5px] align-text-top">
                                                                                        <ul className="list-disc list-inside">
                                                                                            <li>
                                                                                                Tunai
                                                                                            </li>
                                                                                            <li>
                                                                                                Saldo
                                                                                                Kartu
                                                                                            </li>
                                                                                            <li>
                                                                                                Cetak{" "}
                                                                                                <i>
                                                                                                    invoice
                                                                                                </i>{" "}
                                                                                                untuk
                                                                                                dibayar
                                                                                                via
                                                                                                bank
                                                                                                atau
                                                                                                minimarket
                                                                                            </li>
                                                                                        </ul>
                                                                                    </td>
                                                                                    <td className="align-text-top border border-[#d1d5db] p-[5px]">
                                                                                        <ul>
                                                                                            <li>
                                                                                                Rp0
                                                                                            </li>
                                                                                            <li>
                                                                                                <span
                                                                                                    ref={
                                                                                                        animateFeeBillSaldokartu
                                                                                                    }
                                                                                                >
                                                                                                    Rp
                                                                                                    {data.fee_bill_saldokartu?.toLocaleString(
                                                                                                        "id-ID"
                                                                                                    ) ??
                                                                                                        "{Bayar Tagihan via Saldo Kartu}"}{" "}
                                                                                                </span>
                                                                                            </li>
                                                                                            <li>
                                                                                                Rp7.500/transaksi
                                                                                            </li>
                                                                                        </ul>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="text-center align-text-top border border-[#d1d5db] p-[5px]">
                                                                                        3
                                                                                    </td>

                                                                                    <td
                                                                                        className="border border-[#d1d5db] p-[5px]"
                                                                                        colSpan={
                                                                                            2
                                                                                        }
                                                                                    >
                                                                                        Penarikan
                                                                                        CazhBox
                                                                                        dari
                                                                                        Dashboard
                                                                                    </td>
                                                                                    <td className="border border-[#d1d5db] p-[5px]">
                                                                                        Rp7.500/transaksi
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold align-text-top w-[3%]">
                                                    6.
                                                </td>
                                                <td>
                                                    <p className="font-bold">
                                                        CazhBox
                                                    </p>
                                                    <div className="pl-6">
                                                        <table>
                                                            <tbody className="text-justify">
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        a.
                                                                    </td>
                                                                    <td>
                                                                        Pihak
                                                                        Kedua
                                                                        menyetujui
                                                                        penampungan
                                                                        sementara
                                                                        semua
                                                                        hasil
                                                                        transaksi
                                                                        non-tunai
                                                                        yang
                                                                        ditentukan
                                                                        Pihak
                                                                        Pertama
                                                                        dengan
                                                                        nama
                                                                        CazhBox;
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        b.
                                                                    </td>
                                                                    <td>
                                                                        Pencairan
                                                                        saldo
                                                                        CazhBox
                                                                        dapat
                                                                        dilakukan
                                                                        oleh
                                                                        Pihak
                                                                        Kedua
                                                                        kapan
                                                                        saja
                                                                        dengan
                                                                        nominal
                                                                        minimal
                                                                        10.000
                                                                        tanpa
                                                                        batasan
                                                                        jumlah
                                                                        maksimal
                                                                        pencairan;
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        c.
                                                                    </td>
                                                                    <td>
                                                                        Pihak
                                                                        Kedua
                                                                        harus
                                                                        mengkonfirmasi
                                                                        setiap
                                                                        pencairan
                                                                        saldo
                                                                        CazhBox;
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        d.
                                                                    </td>
                                                                    <td>
                                                                        Rekening
                                                                        bank
                                                                        milik
                                                                        Pihak
                                                                        Kedua
                                                                        adalah
                                                                        sebagai
                                                                        berikut:
                                                                        <table className="w-full">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td className="w-[20%]">
                                                                                        Nama
                                                                                        Bank
                                                                                    </td>
                                                                                    <td>
                                                                                        :{" "}
                                                                                        <b
                                                                                            ref={
                                                                                                animateBank
                                                                                            }
                                                                                        >
                                                                                            {data
                                                                                                .partner
                                                                                                .bank ??
                                                                                                "{Bank}"}
                                                                                        </b>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="w-[20%]">
                                                                                        Nomor
                                                                                        Rekening
                                                                                    </td>
                                                                                    <td>
                                                                                        :{" "}
                                                                                        <b
                                                                                            ref={
                                                                                                animateAccountBankNumber
                                                                                            }
                                                                                        >
                                                                                            {data
                                                                                                .partner
                                                                                                .account_bank_number ??
                                                                                                "{No Rekening}"}
                                                                                        </b>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="w-[20%]">
                                                                                        Atas
                                                                                        Nama
                                                                                    </td>
                                                                                    <td>
                                                                                        :{" "}
                                                                                        <b
                                                                                            ref={
                                                                                                animateAccountBankName
                                                                                            }
                                                                                        >
                                                                                            {data
                                                                                                .partner
                                                                                                .account_bank_name ??
                                                                                                "{Atas Nama}"}
                                                                                        </b>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        e.
                                                                    </td>
                                                                    <td>
                                                                        Pihak
                                                                        Kedua
                                                                        dapat
                                                                        mengajukan
                                                                        perubahan
                                                                        nomor
                                                                        rekening
                                                                        bank
                                                                        kapan
                                                                        saja
                                                                        kepada
                                                                        Pihak
                                                                        Pertama
                                                                        dengan
                                                                        prioritas
                                                                        rekening
                                                                        bank
                                                                        atas
                                                                        nama
                                                                        lembaga;
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold align-text-top w-[3%]">
                                                    7.
                                                </td>
                                                <td>
                                                    <p className="font-bold">
                                                        Bagi Hasil
                                                    </p>
                                                    <div className="pl-6">
                                                        <table>
                                                            <tbody className="text-justify">
                                                                <tr>
                                                                    <td className="align-text-top w-[5%]">
                                                                        a.
                                                                    </td>
                                                                    <td>
                                                                        Pihak
                                                                        Kedua{" "}
                                                                        <b
                                                                            ref={
                                                                                animateProfitSharing
                                                                            }
                                                                        >
                                                                            {data.profit_sharing ==
                                                                            true
                                                                                ? "melakukan"
                                                                                : "tidak melakukan" ??
                                                                                  "{{Bagi Hasil}}"}
                                                                        </b>{" "}
                                                                        bagi
                                                                        hasil.{" "}
                                                                        {data.profit_sharing ==
                                                                            true &&
                                                                            (data.profit_sharing_detail ?? (
                                                                                <b
                                                                                    ref={
                                                                                        animateProfitSharingDetail
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        "{{Ketentuan Bagi Hasil}}"
                                                                                    }
                                                                                </b>
                                                                            ))}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold align-text-top w-[3%]">
                                                    8.
                                                </td>
                                                <td>
                                                    <p className="font-bold">
                                                        Masa Berlaku dan
                                                        Ketentuan Lain
                                                    </p>
                                                    <div className="pl-6">
                                                        <table>
                                                            <tbody className="text-justify">
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        a.
                                                                    </td>
                                                                    <td>
                                                                        Perjanjian
                                                                        ini
                                                                        mulai
                                                                        berlaku
                                                                        pada
                                                                        tanggal
                                                                        ditandatanganinya
                                                                        oleh
                                                                        Para
                                                                        Pihak,
                                                                        sampai
                                                                        dengan{" "}
                                                                        <b
                                                                            ref={
                                                                                animateExpiredDate
                                                                            }
                                                                        >
                                                                            {new Date(
                                                                                data.expired_date
                                                                            ).toLocaleDateString(
                                                                                "id-ID",
                                                                                {
                                                                                    day: "numeric",
                                                                                    month: "long",
                                                                                    year: "numeric",
                                                                                }
                                                                            ) ??
                                                                                "{Tanggal Expired}"}
                                                                        </b>
                                                                        ;
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        b.
                                                                    </td>
                                                                    <td>
                                                                        Dalam
                                                                        hal
                                                                        terjadi
                                                                        penghentian
                                                                        Perjanjian
                                                                        Kerja
                                                                        Sama
                                                                        oleh
                                                                        Pihak
                                                                        Kedua
                                                                        sebelum
                                                                        tanggal
                                                                        perjanjian
                                                                        ini
                                                                        berakhir,
                                                                        Pihak
                                                                        Kedua
                                                                        tetap
                                                                        berkewajiban
                                                                        membayar
                                                                        biaya
                                                                        langganan
                                                                        sesuai
                                                                        periode
                                                                        kerja
                                                                        sama
                                                                        yang
                                                                        disepakati
                                                                        pada
                                                                        huruf
                                                                        (a);
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        c.
                                                                    </td>
                                                                    <td>
                                                                        Dalam
                                                                        hal
                                                                        terdapat
                                                                        perubahan,
                                                                        Para
                                                                        Pihak
                                                                        berhak
                                                                        mengajukan
                                                                        perubahan
                                                                        dan
                                                                        menyepakatinya
                                                                        dalam
                                                                        Perjanjian
                                                                        Kerjasama
                                                                        baru;
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="align-text-top w-[3%]">
                                                                        d.
                                                                    </td>
                                                                    <td>
                                                                        Hal-hal
                                                                        lain
                                                                        yang
                                                                        belum
                                                                        tercantum
                                                                        di dalam
                                                                        Berita
                                                                        Acara
                                                                        Kesepakatan
                                                                        ini
                                                                        disampaikan
                                                                        dalam
                                                                        addendum
                                                                        terpisah
                                                                        kemudian
                                                                        hari.
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="px-8 flex flex-row mt-5 justify-between">
                                    <div
                                        className="w-[30%]"
                                        ref={animateSignatureName}
                                    >
                                        <p>Pihak Pertama</p>
                                        <div className="h-[100px] w-[170px] py-2">
                                            <img
                                                src={
                                                    "/storage/" +
                                                    data.signature.image
                                                }
                                                alt=""
                                                className="w-full h-full object-fill"
                                            />
                                        </div>
                                        <p>
                                            <b>
                                                {data.signature.name ??
                                                    "{{nama_pihak_pertama}}"}
                                            </b>
                                        </p>
                                        {/* <p>{data.signature_position}</p> */}
                                    </div>
                                    <div className="w-[30%]">
                                        <p>Pihak Kedua</p>
                                        {data.pic_signature &&
                                        isSignatureBlob ? (
                                            <div className="h-[100px] w-[170px] py-2">
                                                <img
                                                    src={
                                                        typeof data.pic_signature ===
                                                        "string"
                                                            ? data.pic_signature
                                                            : URL.createObjectURL(
                                                                  data.pic_signature
                                                              )
                                                    }
                                                    className="w-full h-full object-fill"
                                                />
                                            </div>
                                        ) : (
                                            <div className="min-h-20"></div>
                                        )}
                                        <p>
                                            <b>
                                                {data.partner.pic ??
                                                    "{{nama_pihak_kedua}}"}
                                            </b>
                                        </p>
                                    </div>
                                </div>
                                {/* <div
                                className="px-8 flex flex-row mt-5 justify-center"
                                ref={animateReferral}
                            >
                                {data.referral && (
                                    <div className="w-[30%]">
                                        <p>Pihak Ketiga</p>
                                        {data.referral_signature ? (
                                            <img
                                                src={
                                                    typeof data.referral_signature ===
                                                    "string"
                                                        ? data.referral_signature
                                                        : URL.createObjectURL(
                                                              data.referral_signature
                                                          )
                                                }
                                                className="min-h-20 max-h-20"
                                            />
                                        ) : (
                                            <div className="min-h-20"></div>
                                        )}
                                        <p>
                                            <b>
                                                {data.referral_name ??
                                                    "{{nama_referral}}"}
                                            </b>
                                        </p>
                                    </div>
                                )}
                            </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </BlockUI>
            <DialogInstitution
                dialogInstitutionVisible={dialogInstitutionVisible}
                setDialogInstitutionVisible={setDialogInstitutionVisible}
                filters={filters}
                setFilters={setFilters}
                isLoadingData={isLoadingData}
                setIsLoadingData={setIsLoadingData}
                leads={leads}
                setLeads={setLeads}
                partners={partners}
                setPartners={setPartners}
                data={data}
                setData={setData}
                reset={reset}
                setProvinceName={setProvinceName}
            />
        </>
    );
};

export default Edit;
