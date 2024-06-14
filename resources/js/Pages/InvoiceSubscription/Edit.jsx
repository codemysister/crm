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
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { upperCaseEachWord } from "@/Utils/UppercaseEachWord";
import LoadingDocument from "@/Components/LoadingDocument";
import { BlockUI } from "primereact/blockui";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Edit = ({
    usersProp,
    partnersProp,
    salesProp,
    invoiceSubscriptionProp,
    signaturesProp,
}) => {
    const [users, setUsers] = useState(usersProp);
    const [partners, setPartners] = useState(partnersProp);
    const [signatures, setSignatures] = useState(signaturesProp);
    const [bills, setBills] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [blocked, setBlocked] = useState(false);

    const [theme, setTheme] = useState(localStorage.theme);
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

    const animatePartnerNameRef = useRef(null);
    const animatePaidOffRef = useRef(null);
    const animateDateRef = useRef(null);
    const animateDueDateRef = useRef(null);
    const animatePaymentMetodeRef = useRef(null);
    const animateXenditLinkRef = useRef(null);
    const animatePartnerProvinceRef = useRef(null);
    const animatePartnerRegencyRef = useRef(null);
    const animateSignatureNameRef = useRef(null);

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
        uuid: invoiceSubscriptionProp.uuid,
        code: invoiceSubscriptionProp.code,
        bills: invoiceSubscriptionProp.bills,
        date: invoiceSubscriptionProp.date,
        due_date: invoiceSubscriptionProp.due_date,
        partner: {
            id: invoiceSubscriptionProp.partner_id,
            name: invoiceSubscriptionProp.partner_name,
            province: invoiceSubscriptionProp.partner_province,
            regency: invoiceSubscriptionProp.partner_regency,
        },
        total_nominal: invoiceSubscriptionProp.total_nominal,
        total_ppn: invoiceSubscriptionProp.total_ppn,
        total_bill: invoiceSubscriptionProp.total_bill,
        rest_of_bill: invoiceSubscriptionProp.rest_of_bill,
        rest_of_bill_lock: invoiceSubscriptionProp.rest_of_bill_lock,
        paid_off: invoiceSubscriptionProp.paid_off,
        payment_metode: invoiceSubscriptionProp.payment_metode,
        xendit_link: invoiceSubscriptionProp.xendit_link,
        created_by: null,
        signature: {
            name: invoiceSubscriptionProp.signature_name,
            position: invoiceSubscriptionProp.signature_position,
            image: invoiceSubscriptionProp.signature_image,
        },
    });

    useEffect(() => {
        calculateTotal();
    }, [data.partner, dialogVisible, data.paid_off]);

    useEffect(() => {
        if (processing) {
            setBlocked(true);
        } else {
            setBlocked(false);
        }
    }, [processing]);

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

    document.querySelector("body").classList.add("overflow-hidden");

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);

        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const dialogFooterTemplate = (type) => {
        return (
            <Button
                label="OK"
                icon="pi pi-check"
                onClick={() =>
                    type != "product" ? setDialogVisible(false) : onDoneSelect()
                }
            />
        );
    };

    const calculateTotal = () => {
        const subTotal = data.bills.reduce(
            (accumulator, bill) => accumulator + bill.total_bill,
            0
        );

        const totalPPN = data.bills.reduce(
            (accumulator, bill) => accumulator + bill.total_ppn,
            0
        );

        setData((prev) => ({
            ...prev,
            total_ppn: totalPPN,
            total_nominal: subTotal,
            total_bill: subTotal - prev.paid_off,
        }));
    };

    function isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    const triggerInputFocus = (ref) => {
        if (ref.current) {
            ref.current.classList.add("twinkle");
            ref.current.focus();
        }
        return null;
    };

    const stopAnimateInputFocus = (ref) => {
        ref.current.classList.remove("twinkle");

        return null;
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

    const optionSignatureTemplate = (item) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center items-center gap-3">
                <img
                    className="w-[6rem] shadow-2 flex-shrink-0 border-round"
                    src={"/storage/" + item.image}
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

    const header = (
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

    // fungsi toast
    const showSuccess = (type) => {
        toast.current.show({
            severity: "success",
            summary: "Success",
            detail: `${type} data berhasil`,
            life: 3000,
        });
    };

    const showError = (message) => {
        toast.current.show({
            severity: "error",
            summary: "Error",
            detail: message,
            life: 3000,
        });
    };

    const handleInputChange = (index, field, value) => {
        const updatedbills = [...data.bills];

        updatedbills[index][field] = value;

        if (field == "nominal" || field == "ppn") {
            let totalPPN = (updatedbills[index]["total_ppn"] =
                (updatedbills[index]["nominal"] * updatedbills[index]["ppn"]) /
                100);
            let totalUpdated = updatedbills[index]["nominal"] + totalPPN;
            updatedbills[index]["total_bill"] = totalUpdated;
        }

        setData("bills", updatedbills);
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();

        put("/invoice_subscriptions/" + data.uuid, {
            onSuccess: () => {
                showSuccess("Tambah");
                router.get("/invoice_subscriptions");
            },

            onError: (data) => {
                showError(data.error);
            },
        });
    };

    return (
        <>
            <Head title="Invoice Langganan"></Head>
            <Toast ref={toast} />
            <BlockUI blocked={blocked} template={LoadingDocument}>
                <div className="h-screen max-h-screen overflow-y-hidden">
                    <div className="flex flex-col h-screen max-h-screen overflow-hidden md:flex-row z-40 relative gap-5">
                        <div className="md:w-[35%] overflow-y-auto h-screen max-h-screen p-5">
                            <Card>
                                <div className="flex justify-between items-center mb-4">
                                    <h1 className="font-bold text-2xl">
                                        Invoice Langganan
                                    </h1>
                                    <Link href="/invoice_subscriptions">
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
                                    <Button
                                        label="Tambah Tagihan"
                                        icon="pi pi-external-link"
                                        onClick={() => setDialogVisible(true)}
                                    />

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
                                        <label htmlFor="lembaga">
                                            Lembaga *
                                        </label>
                                        <Dropdown
                                            value={data.partner}
                                            dataKey="id"
                                            onChange={(e) => {
                                                let oldBills =
                                                    data.bills.filter(
                                                        (data) => {
                                                            return !(
                                                                "id" in data
                                                            );
                                                        }
                                                    );

                                                let newBills =
                                                    e.target.value.subscription;

                                                let bills = [...oldBills];
                                                if (newBills) {
                                                    bills = [
                                                        newBills,
                                                        ...oldBills,
                                                    ];
                                                }
                                                setData((data) => ({
                                                    ...data,
                                                    partner: {
                                                        ...data.partner,
                                                        id: e.target.value.id,
                                                        name: e.target.value
                                                            .name,
                                                        province:
                                                            e.target.value
                                                                .province,
                                                        regency:
                                                            e.target.value
                                                                .regency,
                                                    },
                                                    bills: bills,
                                                }));
                                            }}
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animatePartnerNameRef
                                                );
                                            }}
                                            onShow={() => {
                                                triggerInputFocus(
                                                    animatePartnerNameRef
                                                );
                                            }}
                                            onHide={() => {
                                                stopAnimateInputFocus(
                                                    animatePartnerNameRef
                                                );
                                            }}
                                            options={partners}
                                            optionLabel="name"
                                            placeholder="Pilih Lembaga"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>

                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="date">Tanggal *</label>
                                        <Calendar
                                            value={
                                                data.date
                                                    ? new Date(data.date)
                                                    : null
                                            }
                                            style={{ height: "35px" }}
                                            onChange={(e) => {
                                                setData("date", e.target.value);
                                            }}
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateDateRef
                                                );
                                            }}
                                            onShow={() => {
                                                triggerInputFocus(
                                                    animateDateRef
                                                );
                                            }}
                                            onHide={() => {
                                                stopAnimateInputFocus(
                                                    animateDateRef
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateDateRef
                                                );
                                            }}
                                            showIcon
                                            dateFormat="dd-mm-yy"
                                            className={`w-full md:w-14rem ${
                                                errors.due_date && "p-invalid"
                                            }`}
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="due_date">
                                            Jatuh Tempo *
                                        </label>
                                        <Calendar
                                            value={
                                                data.due_date
                                                    ? new Date(data.due_date)
                                                    : null
                                            }
                                            style={{ height: "35px" }}
                                            onChange={(e) => {
                                                setData(
                                                    "due_date",
                                                    e.target.value
                                                );
                                            }}
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateDueDateRef
                                                );
                                            }}
                                            onShow={() => {
                                                triggerInputFocus(
                                                    animateDueDateRef
                                                );
                                            }}
                                            onHide={() => {
                                                stopAnimateInputFocus(
                                                    animateDueDateRef
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateDueDateRef
                                                );
                                            }}
                                            showIcon
                                            dateFormat="dd-mm-yy"
                                            className={`w-full md:w-14rem ${
                                                errors.due_date && "p-invalid"
                                            }`}
                                        />
                                    </div>

                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="paid_off">
                                            Terbayarkan *
                                        </label>
                                        <InputNumber
                                            value={data.paid_off}
                                            onChange={(e) => {
                                                setData((data) => ({
                                                    ...data,
                                                    paid_off: e.value,
                                                }));
                                            }}
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animatePaidOffRef
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animatePaidOffRef
                                                );
                                            }}
                                            defaultValue={0}
                                            className="dark:bg-gray-300"
                                            id="partner_address"
                                            aria-describedby="partner_address-help"
                                            locale="id-ID"
                                        />
                                    </div>

                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="payment_metode">
                                            Metode Pembayaran *
                                        </label>
                                        <Dropdown
                                            value={data.payment_metode}
                                            onChange={(e) => {
                                                setData(
                                                    "payment_metode",
                                                    e.target.value
                                                );
                                            }}
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animatePaymentMetodeRef
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animatePaymentMetodeRef
                                                );
                                            }}
                                            options={[
                                                { name: "cazhbox" },
                                                { name: "payment link" },
                                            ]}
                                            optionLabel="name"
                                            optionValue="name"
                                            placeholder="Pilih Metode Pembayaran"
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                            editable
                                        />
                                    </div>

                                    {data.payment_metode === "payment link" && (
                                        <div className="flex flex-col mt-3">
                                            <label htmlFor="partner_address">
                                                Link Xendit *
                                            </label>
                                            <InputText
                                                value={data.xendit_link}
                                                onChange={(e) =>
                                                    setData(
                                                        "xendit_link",
                                                        e.target.value
                                                    )
                                                }
                                                className="dark:bg-gray-300"
                                                id="partner_address"
                                                aria-describedby="partner_address-help"
                                            />
                                        </div>
                                    )}

                                    {/* <div className="flex flex-col mt-3">
                                        <label htmlFor="signature">
                                            Tanda Tangan *
                                        </label>
                                        <Dropdown
                                            value={data.signature}
                                            onChange={(e) => {
                                                setData("signature", {
                                                    ...data.signature,
                                                    name: e.target.value.name,
                                                    position:
                                                        e.target.value.position,
                                                    image: e.target.value.image,
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
                                            className="w-full md:w-14rem"
                                            onShow={() => {
                                                triggerInputFocus(
                                                    animateSignatureNameRef
                                                );
                                            }}
                                            onHide={() => {
                                                stopAnimateInputFocus(
                                                    animateSignatureNameRef
                                                );
                                            }}
                                        />
                                    </div> */}

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

                        <Dialog
                            header="Input Produk"
                            visible={dialogVisible}
                            style={{ width: "85vw" }}
                            maximizable
                            modal
                            contentStyle={{ height: "550px" }}
                            onHide={() => setDialogVisible(false)}
                            footer={dialogFooterTemplate}
                        >
                            <div className="flex my-5 gap-3">
                                <Button
                                    label="Tambah Inputan Tagihan"
                                    icon="pi pi-plus"
                                    onClick={() => {
                                        let inputNew = {
                                            bill: null,
                                            nominal: 0,
                                            ppn: 0,
                                            total_ppn: 0,
                                            total_bill: 0,
                                        };

                                        let updatedbills = [
                                            ...data.bills,
                                            inputNew,
                                        ];

                                        setBills((prev) => (prev = inputNew));
                                        setData("bills", updatedbills);
                                    }}
                                />
                            </div>

                            {data.bills?.map((bill, index) => {
                                const no = index + 1;
                                return (
                                    <div
                                        className="flex gap-5 mt-2 items-center"
                                        key={bill + index}
                                    >
                                        <div>
                                            <Badge
                                                value={no}
                                                size="large"
                                            ></Badge>
                                        </div>

                                        <div className="flex flex-col">
                                            <label htmlFor="partner_address">
                                                Tagihan *
                                            </label>
                                            <InputText
                                                value={bill.bill}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        "bill",
                                                        e.target.value
                                                    )
                                                }
                                                className="dark:bg-gray-300"
                                                id="bill"
                                                aria-describedby="bill-help"
                                            />
                                        </div>

                                        <div className="flex">
                                            <div className="flex flex-col">
                                                <label htmlFor="nominal">
                                                    Nominal *
                                                </label>
                                                <InputNumber
                                                    value={bill.nominal}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            "nominal",
                                                            e.value
                                                        )
                                                    }
                                                    className="dark:bg-gray-300"
                                                    id="nominal"
                                                    aria-describedby="nominal-help"
                                                    locale="id-ID"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <div className="flex flex-col">
                                                <label htmlFor="partner_address">
                                                    Pajak (%)
                                                </label>
                                                <InputNumber
                                                    value={bill.ppn}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            "ppn",
                                                            e.value
                                                        )
                                                    }
                                                    className="dark:bg-gray-300"
                                                    id="ppn"
                                                    aria-describedby="ppn-help"
                                                    keyfilter="int"
                                                    locale="id-ID"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <div className="flex flex-col">
                                                <label htmlFor="total_bill">
                                                    Total PPN *
                                                </label>
                                                <InputNumber
                                                    value={bill.total_ppn}
                                                    className="dark:bg-gray-300"
                                                    id="total_bill"
                                                    aria-describedby="total_bill-help"
                                                    locale="id-ID"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="flex flex-col">
                                                <label htmlFor="total_bill">
                                                    Jumlah *
                                                </label>
                                                <InputNumber
                                                    value={bill.total_bill}
                                                    className="dark:bg-gray-300"
                                                    id="total_bill"
                                                    aria-describedby="total_bill-help"
                                                    locale="id-ID"
                                                    disabled
                                                />
                                            </div>
                                        </div>

                                        <div className="flex self-center pt-4 ">
                                            <Button
                                                className="bg-red-500 h-1 w-1 shadow-md rounded-full "
                                                icon={() => (
                                                    <i
                                                        className="pi pi-minus"
                                                        style={{
                                                            fontSize: "0.7rem",
                                                        }}
                                                    ></i>
                                                )}
                                                onClick={() => {
                                                    const updatedbills = [
                                                        ...data.bills,
                                                    ];

                                                    updatedbills.splice(
                                                        index,
                                                        1
                                                    );

                                                    setData((prevData) => ({
                                                        ...prevData,
                                                        bills: updatedbills,
                                                    }));
                                                }}
                                                aria-controls="popup_menu_right"
                                                aria-haspopup
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </Dialog>

                        <div className="md:w-[65%] hidden md:block text-sm h-screen max-h-screen overflow-y-auto p-5">
                            <header>
                                <div className="flex justify-between items-center">
                                    <div className="w-full">
                                        <img
                                            src="/assets/img/cazh.png"
                                            alt=""
                                            className="float-left w-1/3 h-1/3"
                                        />
                                    </div>
                                    <div className="w-full text-right text-xs">
                                        <h2 className="font-bold">
                                            PT CAZH TEKNOLOGI INOVASI
                                        </h2>
                                        <p>
                                            Bonavida Park D1, Jl. Raya
                                            Karanggintung
                                        </p>
                                        <p>Kec. Sumbang, Kab. Banyumas,</p>
                                        <p>Jawa Tengah 53183</p>
                                        <p>hello@cazh.id</p>
                                    </div>
                                </div>
                            </header>

                            <hr
                                className="my-[1rem] h-[1px]"
                                style={{
                                    backgroundColor: "#718096",
                                    border: "none",
                                }}
                            />

                            <div class="flex flex-col justify-center mt-10 text-center">
                                <div
                                    class="font-bold text-purple-800"
                                    style={{ fontSize: "18pt" }}
                                >
                                    INVOICE LANGGANAN
                                </div>
                            </div>

                            <div class="flex justify-between items-center mt-10">
                                <div className="w-[60%]">
                                    <p class="underline">Ditagihkan Kepada:</p>
                                    <p
                                        ref={animatePartnerNameRef}
                                        class="font-bold"
                                    >
                                        {data.partner.name ?? "{{lembaga}}"}
                                    </p>
                                    <p class="font-bold">
                                        <span ref={animatePartnerRegencyRef}>
                                            {data.partner.regency
                                                ? upperCaseEachWord(
                                                      JSON.parse(
                                                          data.partner.regency
                                                      ).name
                                                  )
                                                : "{{kabupaten}}"}
                                        </span>
                                        ,{" "}
                                        <span ref={animatePartnerProvinceRef}>
                                            {data.partner.province
                                                ? upperCaseEachWord(
                                                      JSON.parse(
                                                          data.partner.province
                                                      ).name
                                                  )
                                                : "{{provinsi}}"}
                                        </span>{" "}
                                    </p>
                                </div>
                                <div className="w-[40%]">
                                    <div class="flex flex-row">
                                        <p className="w-[40%]">Nomor</p>
                                        <p className="w-[3%]">:</p>
                                        <p class="font-bold">2024/I/INV/0001</p>
                                    </div>
                                    <div class="flex flex-row">
                                        <p className="w-[40%]">Tanggal</p>
                                        <p className="w-[3%]">:</p>
                                        <p ref={animateDateRef}>
                                            {data.date
                                                ? formatDate(data.date)
                                                : "{{Tanggal}}"}
                                        </p>
                                    </div>
                                    <div class="flex flex-row">
                                        <p className="w-[40%]">Jatuh Tempo</p>
                                        <p className="w-[3%]">:</p>
                                        <p ref={animateDueDateRef}>
                                            {data.due_date
                                                ? formatDate(data.due_date)
                                                : "{{Jatuh Tempo}}"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full mt-10">
                                <table
                                    style={{
                                        borderCollapse: "collapse",
                                        width: "100%",
                                    }}
                                >
                                    <thead
                                        style={{
                                            padding: "10px 10px",
                                        }}
                                        className="bg-[#D9D2E9] dark:bg-[#D1D5DB] dark:text-gray-600"
                                    >
                                        <tr>
                                            <th
                                                style={{
                                                    width: "5%",
                                                    border: "1px solid #ded8ee",
                                                    padding: "8px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                No.
                                            </th>
                                            <th
                                                style={{
                                                    width: "35%",
                                                    border: "1px solid #ded8ee",
                                                    padding: "8px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Tagihan
                                            </th>
                                            <th
                                                style={{
                                                    width: "20%",
                                                    border: "1px solid #ded8ee",
                                                    padding: "8px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Harga
                                            </th>
                                            <th
                                                style={{
                                                    width: "20%",
                                                    border: "1px solid #ded8ee",
                                                    padding: "8px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Pajak
                                            </th>
                                            <th
                                                style={{
                                                    width: "20%",
                                                    border: "1px solid #ded8ee",
                                                    padding: "8px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Jumlah
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.bills?.map((bill, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td
                                                        style={{
                                                            width: "5%",
                                                            textAlign: "center",
                                                            border: "1px solid #ded8ee",
                                                            padding: "8px",
                                                        }}
                                                    >
                                                        {key + 1}
                                                    </td>
                                                    <td
                                                        style={{
                                                            width: "35%",
                                                            border: "1px solid #ded8ee",
                                                            padding: "8px",
                                                        }}
                                                    >
                                                        {bill.bill}
                                                    </td>
                                                    <td
                                                        style={{
                                                            width: "20%",
                                                            border: "1px solid #ded8ee",
                                                            padding: "8px",
                                                        }}
                                                    >
                                                        Rp
                                                        {bill.nominal
                                                            ? bill.nominal.toLocaleString(
                                                                  "id"
                                                              )
                                                            : 0}
                                                    </td>
                                                    <td
                                                        style={{
                                                            width: "20%",
                                                            border: "1px solid #ded8ee",
                                                            padding: "8px",
                                                        }}
                                                    >
                                                        Rp
                                                        {bill.total_ppn
                                                            ? bill.total_ppn.toLocaleString(
                                                                  "id"
                                                              )
                                                            : 0}
                                                    </td>
                                                    <td
                                                        style={{
                                                            width: "20%",
                                                            border: "1px solid #ded8ee",
                                                            padding: "8px",
                                                        }}
                                                    >
                                                        Rp
                                                        {bill.total_bill
                                                            ? bill.total_bill.toLocaleString(
                                                                  "id"
                                                              )
                                                            : 0}
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                        <tr>
                                            <td
                                                colSpan="4"
                                                style={{
                                                    textAlign: "right",
                                                    padding: "8px",
                                                }}
                                            >
                                                Sub Total
                                            </td>
                                            <td
                                                style={{
                                                    width: "35%",
                                                    border: "1px solid #ded8ee",
                                                    padding: "8px",
                                                }}
                                            >
                                                Rp
                                                {data.total_nominal
                                                    ? data.total_nominal.toLocaleString(
                                                          "id"
                                                      )
                                                    : 0}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                colSpan="4"
                                                style={{
                                                    textAlign: "right",
                                                    padding: "8px",
                                                }}
                                            >
                                                Diskon/Uang Muka
                                            </td>
                                            <td
                                                style={{
                                                    width: "35%",
                                                    border: "1px solid #ded8ee",
                                                    padding: "8px",
                                                }}
                                            >
                                                <span ref={animatePaidOffRef}>
                                                    Rp
                                                    {data.paid_off
                                                        ? Number(
                                                              data.paid_off
                                                          ).toLocaleString("id")
                                                        : 0}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                colSpan="4"
                                                style={{
                                                    textAlign: "right",
                                                    padding: "8px",
                                                }}
                                            >
                                                Total Tagihan
                                            </td>
                                            <td
                                                className="font-bold"
                                                style={{
                                                    width: "35%",
                                                    border: "1px solid #ded8ee",
                                                    padding: "8px",
                                                }}
                                            >
                                                Rp
                                                {data.total_bill
                                                    ? Number(
                                                          data.total_bill
                                                      ).toLocaleString("id")
                                                    : 0}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-row mt-10 justify-between items-center">
                                <div
                                    style={{ width: "50%" }}
                                    ref={animatePaymentMetodeRef}
                                >
                                    {data.payment_metode === "payment link" && (
                                        <>
                                            <p className="font-bold underline">
                                                Payment Link
                                            </p>
                                            <p>
                                                Silakan klik link pembayaran
                                                berikut:
                                            </p>
                                            <p ref={animateXenditLinkRef}>
                                                <Link
                                                    className="text-blue-600"
                                                    href={
                                                        isValidURL(
                                                            data.xendit_link
                                                        )
                                                            ? data.xendit_link
                                                            : null
                                                    }
                                                >
                                                    {data.xendit_link
                                                        ? data.xendit_link
                                                        : "{{link_xendit}}"}
                                                </Link>
                                            </p>
                                        </>
                                    )}
                                    {data.payment_metode === "cazhbox" && (
                                        <>
                                            <p className="font-bold underline">
                                                Payment
                                            </p>
                                            <p>
                                                Pembayaran akan dilakukan dengan
                                            </p>
                                            <p>
                                                mengurangi <b>CazhBOX</b>{" "}
                                                lembaga Anda
                                            </p>
                                        </>
                                    )}
                                </div>
                                <div
                                    style={{ width: "30%" }}
                                    ref={animateSignatureNameRef}
                                >
                                    <p>Hormat Kami,</p>
                                    {data.signature.image ? (
                                        <div className="h-[100px] w-[170px] self-center py-2">
                                            <img
                                                src={`${data.signature.image}`}
                                                alt=""
                                                className="min-h-20 w-full h-full object-fill"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            style={{ minHeight: "100px" }}
                                        ></div>
                                    )}
                                    <p className="font-bold">
                                        {data.signature.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BlockUI>
        </>
    );
};

export default Edit;
