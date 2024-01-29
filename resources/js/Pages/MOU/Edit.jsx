import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Head, Link, useForm } from "@inertiajs/react";
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
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Edit = ({ usersProp, partnersProp, mou }) => {
    const [users, setUsers] = useState(usersProp);
    const [partners, setPartners] = useState(partnersProp);

    const toast = useRef(null);
    const partnerScrollRef = useRef(null);
    const info = useRef(null);
    const infoPriceTrainingRef = useRef(null);
    const infoPriceTrainingOnlineRef = useRef(null);
    const infoPriceLanyardRef = useRef(null);
    const animateDay = useRef(null);
    const animateDate = useRef(null);
    const animatePartnerId = useRef(null);
    const animatePartnerName = useRef(null);
    const animatePartnerPIC = useRef(null);
    const animatePartnerPICPosition = useRef(null);
    const animatePartnerAddress = useRef(null);
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
    const animateSalesName = useRef(null);
    const animateSalesWa = useRef(null);
    const animateSalesAddress = useRef(null);
    const animateCreatedBy = useRef(null);
    const animateSignatureName = useRef(null);
    const animateSignaturePosition = useRef(null);
    const animateSignatureImage = useRef(null);
    const animateRegisterDate = useRef(null);

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
        date: new Date(mou.date),
        partner_name: mou.partner_name,
        partner_pic: mou.partner_pic,
        partner_pic_position: mou.partner_pic_position,
        partner_address: mou.partner_address,
        url_subdomain: mou.url_subdomain,
        price_card: mou.price_card,
        price_lanyard: mou.price_lanyard,
        nominal_subscription: mou.nominal_subscription,
        period_subscription: mou.period_subscription,
        price_training_offline: mou.price_training_offline,
        price_training_online: mou.price_training_online,
        fee_purchase_cazhpoin: mou.fee_purchase_cazhpoin,
        fee_bill_cazhpoin: mou.fee_bill_cazhpoin,
        fee_topup_cazhpos: mou.fee_topup_cazhpos,
        fee_withdraw_cazhpos: mou.fee_withdraw_cazhpos,
        fee_bill_saldokartu: mou.fee_bill_saldokartu,
        bank: mou.bank,
        account_bank_number: mou.account_bank_number,
        account_bank_name: mou.account_bank_name,
        expired_date: new Date(mou.expired_date),
        profit_sharing: Boolean(mou.profit_sharing),
        profit_sharing_detail: mou.profit_sharing_detail,
        signature_name: mou.signature_name,
        signature_position: mou.signature_position,
        signature_image: mou.signature_image,
        mou_doc: "mou_path",
    });

    const option_period_subscription = [
        { name: "kartu/bulan" },
        { name: "kartu/tahun" },
        { name: "lembaga/bulan" },
        { name: "lembaga/tahun" },
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
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <img
                    className="w-3rem shadow-2 flex-shrink-0 border-round"
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
            setTimeout(() => {
                ref.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 200);
        }
        return null;
    };

    const stopAnimateInputFocus = (ref) => {
        ref.current.classList.remove("twinkle");

        return null;
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();

        post("/mou", {
            onSuccess: () => {
                showSuccess("Tambah");
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
            <div className="h-screen max-h-screen overflow-y-hidden">
                <div className="flex flex-col h-screen max-h-screen overflow-hidden md:flex-row z-40 relative gap-5">
                    <div className="md:w-[40%] overflow-y-auto h-screen max-h-screen p-5">
                        <Card>
                            <div className="flex justify-between items-center mb-4">
                                <h1 className="font-bold text-2xl">Mou</h1>
                                <Link href="/sph">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        class="w-6 h-6"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
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
                                        Hari Kesepakatan *
                                    </label>
                                    <div className="card flex justify-content-center">
                                        <Dropdown
                                            value={data.day}
                                            onChange={(e) =>
                                                // if(e.target.value === 'object')
                                                setData("day", e.value)
                                            }
                                            options={[
                                                { name: "Senin" },
                                                { name: "Selasa" },
                                                { name: "Rabu" },
                                                { name: "Kamis" },
                                                { name: "Jum'at" },
                                                { name: "Sabtu" },
                                                { name: "Minggu" },
                                            ]}
                                            optionLabel="name"
                                            optionValue="name"
                                            placeholder="Pilih Hari"
                                            filter
                                            editable
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            onFocus={() => {
                                                triggerInputFocus(animateDay);
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateDay
                                                );
                                            }}
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>
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
                                            const formattedDate = new Date(
                                                e.target.value
                                            )
                                                .toISOString()
                                                .split("T")[0];
                                            setData("date", e.target.value);
                                        }}
                                        onFocus={() => {
                                            triggerInputFocus(animateDate);
                                        }}
                                        onBlur={() => {
                                            stopAnimateInputFocus(animateDate);
                                        }}
                                        showIcon
                                        dateFormat="yy-mm-dd"
                                    />
                                </div>

                                <div className="flex flex-col mt-3">
                                    <label htmlFor="lembaga">Lembaga *</label>
                                    <Dropdown
                                        value={data.partner_name}
                                        onChange={(e) => {
                                            if (
                                                typeof e.target.value ===
                                                "object"
                                            ) {
                                                setData({
                                                    ...data,
                                                    partner_id:
                                                        e.target.value.id,
                                                    partner_name:
                                                        e.target.value.name,
                                                    partner_address:
                                                        e.target.value.address,
                                                    partner_pic:
                                                        e.target.value.pics[0]
                                                            .name,
                                                    partner_pic_position:
                                                        e.target.value.pics[0]
                                                            .position,
                                                });
                                            } else {
                                                setData({
                                                    ...data,

                                                    partner_name:
                                                        e.target.value,
                                                });
                                            }
                                        }}
                                        options={partners}
                                        optionLabel="name"
                                        placeholder="Pilih Lembaga"
                                        filter
                                        valueTemplate={selectedOptionTemplate}
                                        itemTemplate={optionTemplate}
                                        className="w-full md:w-14rem"
                                        editable
                                        onFocus={() => {
                                            triggerInputFocus(
                                                animatePartnerName
                                            );
                                        }}
                                        onBlur={() => {
                                            stopAnimateInputFocus(
                                                animatePartnerName
                                            );
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="partner_address">
                                        Lokasi *
                                    </label>
                                    <InputText
                                        value={data.partner_address}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                partner_address: e.target.value,
                                            })
                                        }
                                        className="dark:bg-gray-300"
                                        id="partner_address"
                                        aria-describedby="partner_address-help"
                                        onFocus={() => {
                                            triggerInputFocus(
                                                animatePartnerAddress
                                            );
                                        }}
                                        onBlur={() => {
                                            stopAnimateInputFocus(
                                                animatePartnerAddress
                                            );
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="partner_pic">PIC *</label>
                                    <InputText
                                        value={data.partner_pic}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                partner_pic: e.target.value,
                                            })
                                        }
                                        className="dark:bg-gray-300"
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
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="partner_pic">
                                        Jabatan PIC *
                                    </label>
                                    <InputText
                                        value={data.partner_pic_position}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                partner_pic_position:
                                                    e.target.value,
                                            })
                                        }
                                        className="dark:bg-gray-300"
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
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="url_subdomain">
                                        URL Subdomain *
                                    </label>
                                    <InputText
                                        value={data.url_subdomain}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                url_subdomain: e.target.value,
                                            })
                                        }
                                        className="dark:bg-gray-300"
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
                                            triggerInputFocus(animatePriceCard);
                                        }}
                                        onBlur={() => {
                                            stopAnimateInputFocus(
                                                animatePriceCard
                                            );
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="price_lanyard">
                                        Harga Lanyard *
                                    </label>

                                    <div className="p-inputgroup flex-1 h-full">
                                        <InputNumber
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
                                        />
                                        <Button
                                            className="h-[35px]"
                                            icon="pi pi-info-circle"
                                            onClick={(e) =>
                                                infoPriceLanyardRef.current.toggle(
                                                    e
                                                )
                                            }
                                        />
                                    </div>
                                    <OverlayPanel
                                        className="shadow-md"
                                        ref={infoPriceLanyardRef}
                                    >
                                        <ul className="list-disc list-inside">
                                            <li>10.000/pcs (lanyard polos)</li>
                                            <li>
                                                12.000/pcs (lanyard sablon 1
                                                warna)
                                            </li>
                                            <li>
                                                20.000/pcs (lanyard printing 2
                                                sisi)
                                            </li>
                                        </ul>
                                    </OverlayPanel>
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="nominal_subscription">
                                        Harga Langganan Sistem *
                                    </label>

                                    <InputNumber
                                        value={data.nominal_subscription}
                                        onChange={(e) =>
                                            setData(
                                                "nominal_subscription",
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
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="period_subscription">
                                        Langganan Per-*
                                    </label>
                                    <Dropdown
                                        value={data.period_subscription}
                                        onChange={(e) => {
                                            setData(
                                                "period_subscription",
                                                e.target.value.name
                                            );
                                        }}
                                        options={option_period_subscription}
                                        optionLabel="name"
                                        placeholder="Langganan Per-"
                                        filter
                                        valueTemplate={selectedOptionTemplate}
                                        itemTemplate={optionTemplate}
                                        className="w-full md:w-14rem"
                                        editable
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
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="period_subscription">
                                        Training Lokasi*
                                    </label>
                                    {/* <Dropdown
                                        value={data.price_training_offline}
                                        onChange={(e) => {
                                            setData(
                                                "price_training_offline",
                                                e.target.value
                                            );
                                        }}
                                        options={prices_training_offline}
                                        optionLabel="price"
                                        placeholder="Harga training"
                                        filter
                                        valueTemplate={
                                            selectedPriceOptionTemplate
                                        }
                                        itemTemplate={priceOptionTemplate}
                                        className="w-full md:w-14rem"
                                        editable
                                    /> */}
                                    <div className="p-inputgroup flex-1 h-full">
                                        <InputNumber
                                            value={data.price_training_offline}
                                            onChange={(e) =>
                                                setData(
                                                    "price_training_offline",
                                                    e.value
                                                )
                                            }
                                            className="h-full"
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
                                        />
                                        <Button
                                            className="h-[35px]"
                                            icon="pi pi-info-circle"
                                            onClick={(e) =>
                                                infoPriceTrainingRef.current.toggle(
                                                    e
                                                )
                                            }
                                        />
                                    </div>

                                    <OverlayPanel
                                        className="shadow-md"
                                        ref={infoPriceTrainingRef}
                                    >
                                        <ul className="list-disc list-inside">
                                            <li>Jawa: 15jt</li>
                                            <li>Kalimantan: 25jt</li>
                                            <li>Sulawesi: 27jt</li>
                                            <li>Sumatra: 23jt</li>
                                            <li>Bali: 26jt</li>
                                            <li>Jabodetabek: 15jt</li>
                                        </ul>
                                    </OverlayPanel>
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="price_training_online">
                                        Training Online*
                                    </label>
                                    <div className="p-inputgroup flex-1 h-full">
                                        <InputNumber
                                            value={data.price_training_online}
                                            onChange={(e) =>
                                                setData(
                                                    "price_training_online",
                                                    e.value
                                                )
                                            }
                                            className="h-full"
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
                                                training secara gratis. (Harga
                                                yang di imput adalah harga
                                                training tambahan)
                                            </li>
                                        </ul>
                                    </OverlayPanel>
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="fee_purchase_cazhpoin">
                                        Fee isi kartu via CazhPOIN*
                                    </label>
                                    <InputNumber
                                        value={data.fee_purchase_cazhpoin}
                                        onChange={(e) =>
                                            setData(
                                                "fee_purchase_cazhpoin",
                                                e.value
                                            )
                                        }
                                        className="h-full"
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
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="fee_bill_cazhpoin">
                                        Fee bayar tagihan via CazhPOIN*
                                    </label>
                                    <InputNumber
                                        value={data.fee_bill_cazhpoin}
                                        onChange={(e) =>
                                            setData(
                                                "fee_bill_cazhpoin",
                                                e.value
                                            )
                                        }
                                        className="h-full"
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
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="fee_topup_cazhpos">
                                        Fee topup kartu via CazhPOIN*
                                    </label>
                                    <InputNumber
                                        value={data.fee_topup_cazhpos}
                                        onChange={(e) =>
                                            setData(
                                                "fee_topup_cazhpos",
                                                e.value
                                            )
                                        }
                                        className="h-full"
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
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="fee_withdraw_cazhpos">
                                        Fee penarikan saldo kartu via CazhPOIN*
                                    </label>
                                    <InputNumber
                                        value={data.fee_withdraw_cazhpos}
                                        onChange={(e) =>
                                            setData(
                                                "fee_withdraw_cazhpos",
                                                e.value
                                            )
                                        }
                                        className="h-full"
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
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="fee_bill_saldokartu">
                                        Fee bayar tagihan via Saldo Kartu*
                                    </label>
                                    <InputNumber
                                        value={data.fee_bill_saldokartu}
                                        onChange={(e) =>
                                            setData(
                                                "fee_bill_saldokartu",
                                                e.value
                                            )
                                        }
                                        className="h-full"
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
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="fee_withdraw_cazhpos">
                                        Bank*
                                    </label>
                                    <Dropdown
                                        value={data.bank}
                                        onChange={(e) =>
                                            setData("bank", e.value)
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
                                        className="w-full md:w-14rem"
                                        onFocus={() => {
                                            triggerInputFocus(animateBank);
                                        }}
                                        onBlur={() => {
                                            stopAnimateInputFocus(animateBank);
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="account_bank_number">
                                        Nomor Rekening*
                                    </label>
                                    <InputText
                                        value={data.account_bank_number}
                                        onChange={(e) =>
                                            setData(
                                                "account_bank_number",
                                                e.target.value
                                            )
                                        }
                                        className="dark:bg-gray-300"
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
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="account_bank_name">
                                        Atas Nama*
                                    </label>
                                    <InputText
                                        value={data.account_bank_name}
                                        onChange={(e) =>
                                            setData(
                                                "account_bank_name",
                                                e.target.value
                                            )
                                        }
                                        className="dark:bg-gray-300"
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
                                </div>

                                <div className="flex flex-col mt-3">
                                    <label htmlFor="expired_date">
                                        Tanggal Kadaluwarsa *
                                    </label>
                                    <Calendar
                                        value={
                                            data.expired_date
                                                ? new Date(data.expired_date)
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
                                        dateFormat="yy-mm-dd"
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="profit_sharing">
                                        Bagi hasil*
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
                                            Ketentuan Bagi hasil*
                                        </label>

                                        <InputTextarea
                                            value={data.profit_sharing_detail}
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
                                        value={data.signature_name}
                                        onChange={(e) => {
                                            setData({
                                                ...data,
                                                signature_name:
                                                    e.target.value.name,
                                                signature_position:
                                                    e.target.value.position,
                                                signature_image:
                                                    e.target.value.image,
                                            });
                                        }}
                                        options={signatures}
                                        optionLabel="name"
                                        placeholder="Pilih Tanda Tangan"
                                        filter
                                        valueTemplate={selectedOptionTemplate}
                                        itemTemplate={optionSignatureTemplate}
                                        className="w-full md:w-14rem"
                                        editable
                                        onFocus={() => {
                                            triggerInputFocus(
                                                animateSignatureName
                                            );
                                        }}
                                        onBlur={() => {
                                            stopAnimateInputFocus(
                                                animateSignatureName
                                            );
                                        }}
                                    />
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

                    <div className="md:w-[60%] h-screen max-h-screen text-sm overflow-y-auto p-5">
                        <header>
                            <div className="flex justify-center leading-6 text-center flex-col">
                                <h1 className="font-bold">
                                    PERJANJIAN KERJA SAMA
                                </h1>
                                <h1 className="font-bold">
                                    KEMITRAAN PT CAZH TEKNOLOGI INOVASI
                                </h1>
                                <h1 className="font-bold">
                                    DENGAN {data.partner_name ?? "{{partner}}"}
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
                                                        <b>MUH ARIF MAHFUDIN</b>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="w-[15%]">
                                                        Jabatan
                                                    </td>
                                                    <td>
                                                        : <b>Direktur Utama</b>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="w-[15%]">
                                                        Lembaga
                                                    </td>
                                                    <td>
                                                        :{" "}
                                                        <b>
                                                            PT CAZH TEKNOLOGI
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
                                                            Kab. Banyumas, Jawa
                                                            Tengah
                                                        </b>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={2}>
                                                        Selanjutnya disebut
                                                        sebagai “Pihak Pertama”.
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
                                                            {data.partner_pic ??
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
                                                            {data.partner_pic_position ??
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
                                                                animatePartnerName
                                                            }
                                                        >
                                                            {data.partner_name ??
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
                                                        <b
                                                            ref={
                                                                animatePartnerAddress
                                                            }
                                                        >
                                                            {data.partner_address ??
                                                                "{lokasi}"}
                                                        </b>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={2}>
                                                        Selanjutnya disebut
                                                        sebagai “Pihak Pertama”.
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="align-text-top w-[3%]"></td>
                                        <td>
                                            <p>
                                                Pihak Pertama dan Pihak Kedua
                                                secara bersama-sama disebut
                                                “Para Pihak”.
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
                                                    Pihak Pertama memberikan hak
                                                    kepada Pihak Kedua untuk
                                                    menggunakan perangkat lunak
                                                    sebagai berikut:
                                                </p>
                                                <div className="px-6">
                                                    <table>
                                                        <tbody className="text-justify">
                                                            <tr>
                                                                <td className="align-text-top w-[3%]">
                                                                    a.
                                                                </td>
                                                                <td>
                                                                    Aplikasi Web
                                                                    Dashboard
                                                                    Sistem
                                                                    Manajemen
                                                                    Lembaga,
                                                                    yang dapat
                                                                    diakses
                                                                    dengan
                                                                    alamat URL{" "}
                                                                    <b
                                                                        ref={
                                                                            animateUrlSubdomain
                                                                        }
                                                                    >
                                                                        {data.url_subdomain ??
                                                                            "{url_subdomain}"}
                                                                    </b>{" "}
                                                                    menggunakan
                                                                    peramban web
                                                                    <i>
                                                                        ( web
                                                                        browser
                                                                        )
                                                                    </i>{" "}
                                                                    apa pun yang
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
                                                                    yang dapat
                                                                    diunduh
                                                                    untuk
                                                                    pengguna
                                                                    sistem
                                                                    operasi
                                                                    Android
                                                                    maupun iOS.
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
                                                                    “CAZH POS
                                                                    Lite” yang
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
                                                    Pihak Pertama menggunakan
                                                    beberapa istilah untuk
                                                    diketahui dan disepakati
                                                    dengan Pihak Kedua dengan
                                                    ketentuan sebagai berikut:
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
                                                                    adalah saldo
                                                                    milik Pihak
                                                                    Kedua pada
                                                                    aplikasi Web
                                                                    Dashboard
                                                                    dan aplikasi
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
                                                                    adalah saldo
                                                                    milik user
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
                                                                    bank yang
                                                                    dapat
                                                                    dilakukan
                                                                    dari ATM,{" "}
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
                                                                    QRIS adalah
                                                                    metode
                                                                    pembayaran
                                                                    menggunakan
                                                                    standar QR
                                                                    yang diatur
                                                                    oleh Bank
                                                                    Indonesia,
                                                                    baik melalui
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
                                                    Pihak Pertama memiliki hak
                                                    untuk menerima pembayaran
                                                    dari Pihak Kedua untuk
                                                    layanan yang dikenakan PPN
                                                    11% sesuai dengan peraturan
                                                    perpajakan yang berlaku. Hak
                                                    ini diberikan dengan
                                                    ketentuan sebagai berikut:
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
                                                                                        {data.nominal_subscription?.toLocaleString(
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
                                                                        3 kali
                                                                        sesi. Di
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
                                                    mengirimkan tagihan berupa
                                                    invoice digital maupun
                                                    tercetak untuk dibayar oleh
                                                    Pihak Kedua dengan ketentuan
                                                    sebagai berikut:
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
                                                                    (link) atau
                                                                    cara lain
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
                                                                    batas waktu
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
                                                    penggunaan aplikasi untuk
                                                    layanan yang diberikan
                                                    dengan ketentuan sebagai
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
                                                                    Pihak Kedua
                                                                    menyetujui
                                                                    penampungan
                                                                    sementara
                                                                    semua hasil
                                                                    transaksi
                                                                    non-tunai
                                                                    yang
                                                                    ditentukan
                                                                    Pihak
                                                                    Pertama
                                                                    dengan nama
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
                                                                    oleh Pihak
                                                                    Kedua kapan
                                                                    saja dengan
                                                                    nominal
                                                                    minimal
                                                                    10.000 tanpa
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
                                                                    Pihak Kedua
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
                                                                    bank milik
                                                                    Pihak Kedua
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
                                                                                        {data.bank ??
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
                                                                                        {data.account_bank_number ??
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
                                                                                        {data.account_bank_name ??
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
                                                                    Pihak Kedua
                                                                    dapat
                                                                    mengajukan
                                                                    perubahan
                                                                    nomor
                                                                    rekening
                                                                    bank kapan
                                                                    saja kepada
                                                                    Pihak
                                                                    Pertama
                                                                    dengan
                                                                    prioritas
                                                                    rekening
                                                                    bank atas
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
                                            <td
                                                className="font-bold align-text-top w-[3%]"
                                                ref={animateProfitSharing}
                                            >
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
                                                                <td className="align-text-top w-[4%]">
                                                                    a.
                                                                </td>
                                                                <td>
                                                                    Pihak Kedua
                                                                    harus
                                                                    mengkonfirmasi
                                                                    setiap
                                                                    pencairan
                                                                    saldo
                                                                    CazhBox;
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
                                                    Masa Berlaku dan Ketentuan
                                                    Lain
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
                                                                    ini mulai
                                                                    berlaku pada
                                                                    tanggal
                                                                    ditandatanganinya
                                                                    oleh Para
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
                                                                    Dalam hal
                                                                    terjadi
                                                                    penghentian
                                                                    Perjanjian
                                                                    Kerja Sama
                                                                    oleh Pihak
                                                                    Kedua
                                                                    sebelum
                                                                    tanggal
                                                                    perjanjian
                                                                    ini
                                                                    berakhir,
                                                                    Pihak Kedua
                                                                    tetap
                                                                    berkewajiban
                                                                    membayar
                                                                    biaya
                                                                    langganan
                                                                    sesuai
                                                                    periode
                                                                    kerja sama
                                                                    yang
                                                                    disepakati
                                                                    pada huruf
                                                                    (a);
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="align-text-top w-[3%]">
                                                                    c.
                                                                </td>
                                                                <td>
                                                                    Dalam hal
                                                                    terdapat
                                                                    perubahan,
                                                                    Para Pihak
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
                                                                    Hal-hal lain
                                                                    yang belum
                                                                    tercantum di
                                                                    dalam Berita
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
                                    <p>
                                        Purwokerto, {new Date().getFullYear()}
                                    </p>
                                    <img
                                        src={BASE_URL + data.signature_image}
                                        alt=""
                                    />
                                    <p>{data.signature_name}</p>
                                    <p>{data.signature_position}</p>
                                </div>
                                <div className="w-[30%]">
                                    <p>Pihak Kedua</p>

                                    <p>{data.partner_pic}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white h-screen z-10 w-full absolute top-0 left-0"></div>
            </div>
        </>
    );
};

export default Edit;
