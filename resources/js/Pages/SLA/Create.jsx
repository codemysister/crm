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

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Create = ({ usersProp, partnersProp, rolesProp, productsProp }) => {
    const [users, setUsers] = useState(usersProp);
    const [roles, setRoles] = useState(rolesProp);
    const [partners, setPartners] = useState(partnersProp);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const toast = useRef(null);

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
        uuid: "",
        code: `${Math.floor(
            Math.random() * 1000
        )}/CAZH-SLA/X/${new Date().getFullYear()}`,
        activities: [
            {
                activity: "tes",
                cazh_pic: "admin",
                duration: "1 hari",
                estimation_date: new Date(),
                realization: null,
            },
        ],
        partner: {},
        partner_name: null,
        partner_address: null,
        partner_phone_number: null,
        partner_pic: null,
        partner_pic_email: null,
        partner_pic_number: null,
        referral: false,
        referral_name: null,
        signature_name: null,
        signature_image: null,
    });

    const animatePartnerRef = useRef();
    const animatePartnerNameRef = useRef();
    const animatePartnerAddressRef = useRef();
    const animatePartnerPhoneNumberRef = useRef();
    const animatePartnerPicRef = useRef();
    const animatePartnerPicEmailRef = useRef();
    const animatePartnerPicNumberRef = useRef();
    const animateReferralRef = useRef();
    const animateReferralNameRef = useRef();
    const animateSignatureNameRef = useRef();
    const animateSignatureImageRef = useRef();

    const signatures = [
        {
            name: "Muh Arif Mahfudin",
            position: "CEO",
            image: "/assets/img/signatures/ttd.png",
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

    document.querySelector("body").classList.add("overflow-hidden");

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

    const onDoneSelect = () => {
        const updatedProducts = [...data.products, ...selectedProducts];
        setData("products", updatedProducts);
        setDialogProductVisible(false);
        setSelectedProducts((prev) => (prev = []));
    };

    const selectedOptionTemplate = (option, props) => {
        console.log(option);
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

    const showError = (type) => {
        toast.current.show({
            severity: "error",
            summary: "Error",
            detail: `${type} data gagal`,
            life: 3000,
        });
    };

    const onRowSelect = (event) => {
        const selectedProduct = {
            ...event.data,
            total: event.data.price,
            qty: 1,
        };
        const currentProducts = data.products;
        const updatedProducts = [...currentProducts, selectedProduct];
        setData("products", updatedProducts);
    };

    const onRowUnselect = (event) => {
        toast.current.show({
            severity: "warn",
            summary: "Product Unselected",
            detail: `Name: ${event.data.name}`,
            life: 3000,
        });
    };

    const handleInputChange = (index, field, value) => {
        const updatedActivity = [...data.activities];

        updatedActivity[index][field] = value;

        setData("activities", updatedActivity);
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();

        post("/sla", {
            onSuccess: () => {
                showSuccess("Tambah");
                window.location = BASE_URL + "/sla";
                // reset("name", "category", "price", "unit", "description");
            },

            onError: () => {
                showError("Tambah");
            },
        });
    };

    return (
        <>
            <Head title="Surat Penawaran Harga"></Head>
            <Toast ref={toast} />
            <div className="h-screen max-h-screen overflow-y-hidden">
                <div className="flex flex-col h-screen max-h-screen overflow-hidden md:flex-row z-40 relative gap-5">
                    <div className="md:w-[40%] overflow-y-auto h-screen max-h-screen p-5">
                        <Card>
                            <div className="flex justify-between items-center mb-4">
                                <h1 className="font-bold text-2xl">
                                    Service Level Agreement
                                </h1>
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
                                <Button
                                    label="Tambah Aktivitas"
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
                                    <label htmlFor="lembaga">Lembaga *</label>
                                    {/* <Dropdown
                                        value={data.partner_name}
                                        onChange={(e) => {
                                            setData({
                                                ...data,
                                                partner_id: e.target.value.id,
                                                partner_name:
                                                    e.target.value.name,
                                                partner_address:
                                                    e.target.value.address,
                                                partner_phone_number:
                                                    e.target.value.phone_number,
                                                partner_pic:
                                                    e.target.value.pics[0].name,
                                                partner_pic_email:
                                                    e.target.value.pics[0]
                                                        .email,
                                                partner_pic_number:
                                                    e.target.value.pics[0]
                                                        .number,
                                            });
                                        }}
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
                                        options={partners}
                                        optionLabel="name"
                                        placeholder="Pilih Lembaga"
                                        filter
                                        valueTemplate={selectedOptionTemplate}
                                        itemTemplate={optionTemplate}
                                        className="w-full md:w-14rem"
                                    /> */}
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
                                                    partner_phone_number:
                                                        e.target.value
                                                            .phone_number,
                                                    partner_pic:
                                                        e.target.value.pics[0]
                                                            .name,
                                                    partner_pic_email:
                                                        e.target.value.pics[0]
                                                            .email,
                                                    partner_pic_number:
                                                        e.target.value.pics[0]
                                                            .number,
                                                });
                                            } else {
                                                setData({
                                                    ...data,

                                                    partner_name:
                                                        e.target.value,
                                                });
                                            }
                                        }}
                                        editable
                                        options={partners}
                                        optionLabel="name"
                                        placeholder="Pilih Lembaga"
                                        filter
                                        valueTemplate={selectedOptionTemplate}
                                        itemTemplate={optionTemplate}
                                        className={`w-full md:w-14rem ${
                                            errors.partner_name && "p-invalid"
                                        }`}
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
                                        onBlur={() => {
                                            stopAnimateInputFocus(
                                                animatePartnerNameRef
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
                                        onFocus={() => {
                                            triggerInputFocus(
                                                animatePartnerAddressRef
                                            );
                                        }}
                                        onBlur={() => {
                                            stopAnimateInputFocus(
                                                animatePartnerAddressRef
                                            );
                                        }}
                                        className="dark:bg-gray-300"
                                        id="partner_address"
                                        aria-describedby="partner_address-help"
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="partner_address">
                                        Nomor Telepon Lembaga *
                                    </label>
                                    <InputText
                                        value={data.partner_phone_number}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                partner_phone_number:
                                                    e.target.value,
                                            })
                                        }
                                        onFocus={() => {
                                            triggerInputFocus(
                                                animatePartnerPhoneNumberRef
                                            );
                                        }}
                                        onBlur={() => {
                                            stopAnimateInputFocus(
                                                animatePartnerPhoneNumberRef
                                            );
                                        }}
                                        className="dark:bg-gray-300"
                                        id="partner_phone_number"
                                        aria-describedby="partner_phone_number-help"
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="partner_pic">
                                        Penanggungjawab *
                                    </label>
                                    <InputText
                                        value={data.partner_pic}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                partner_pic: e.target.value,
                                            })
                                        }
                                        onFocus={() => {
                                            triggerInputFocus(
                                                animatePartnerPicRef
                                            );
                                        }}
                                        onBlur={() => {
                                            stopAnimateInputFocus(
                                                animatePartnerPicRef
                                            );
                                        }}
                                        className="dark:bg-gray-300"
                                        id="partner_pic"
                                        aria-describedby="partner_pic-help"
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="partner_pic_email">
                                        Email Penanggungjawab *
                                    </label>
                                    <InputText
                                        value={data.partner_pic_email}
                                        onChange={(e) => {
                                            setData({
                                                ...data,
                                                partner_pic_email:
                                                    e.target.value,
                                            });
                                        }}
                                        onFocus={() => {
                                            triggerInputFocus(
                                                animatePartnerPicEmailRef
                                            );
                                        }}
                                        onBlur={() => {
                                            stopAnimateInputFocus(
                                                animatePartnerPicEmailRef
                                            );
                                        }}
                                        className="dark:bg-gray-300"
                                        id="partner_pic_email"
                                        aria-describedby="partner_pic_email-help"
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="partner_pic_number">
                                        Nomor HP Penanggungjawab *
                                    </label>
                                    <InputText
                                        value={data.partner_pic_number}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                partner_pic_number:
                                                    e.target.value,
                                            })
                                        }
                                        onFocus={() => {
                                            triggerInputFocus(
                                                animatePartnerPicNumberRef
                                            );
                                        }}
                                        onBlur={() => {
                                            stopAnimateInputFocus(
                                                animatePartnerPicNumberRef
                                            );
                                        }}
                                        className="dark:bg-gray-300"
                                        id="partner_pic_number"
                                        aria-describedby="partner_pic_number-help"
                                    />
                                </div>
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
                                                signature_image:
                                                    e.target.value.image,
                                            });
                                        }}
                                        onFocus={() => {
                                            triggerInputFocus(
                                                animateSignatureNameRef
                                            );
                                        }}
                                        onBlur={() => {
                                            stopAnimateInputFocus(
                                                animateSignatureNameRef
                                            );
                                        }}
                                        options={signatures}
                                        optionLabel="name"
                                        placeholder="Pilih Tanda Tangan"
                                        filter
                                        valueTemplate={selectedOptionTemplate}
                                        itemTemplate={optionSignatureTemplate}
                                        className="w-full md:w-14rem"
                                        editable
                                    />
                                </div>

                                <div className="flex flex-col mt-3">
                                    <label htmlFor="referral">Referral</label>
                                    <div className="flex items-center gap-2 my-2">
                                        <Checkbox
                                            onChange={(e) =>
                                                setData("referral", e.checked)
                                            }
                                            checked={data.referral}
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateReferralRef
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateReferralRef
                                                );
                                            }}
                                        ></Checkbox>
                                        <p className="text-xs">
                                            melibatkan referral
                                        </p>
                                    </div>
                                </div>

                                {data.referral && (
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="referral_name">
                                            Atas Nama
                                        </label>

                                        <InputText
                                            value={data.referral_name}
                                            onChange={(e) =>
                                                setData(
                                                    "referral_name",
                                                    e.target.value
                                                )
                                            }
                                            className={`dark:bg-gray-300 ${
                                                errors.referral_name &&
                                                "p-invalid"
                                            }`}
                                            id="referral_name"
                                            aria-describedby="referral_name-help"
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateReferralNameRef
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateReferralNameRef
                                                );
                                            }}
                                        />
                                    </div>
                                )}

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
                                label="Tambah Inputan"
                                icon="pi pi-plus"
                                onClick={() => {
                                    let inputNew = {
                                        activity: null,
                                        cazh_pic: null,
                                        duration: null,
                                        estimation_date: null,
                                        realization: null,
                                    };

                                    let updatedActivities = [
                                        ...data.activities,
                                        inputNew,
                                    ];

                                    setData("activities", updatedActivities);
                                }}
                            />
                        </div>

                        {data.activities?.map((activity, index) => {
                            const no = index + 1;
                            return (
                                <div
                                    className="flex gap-5 mt-2 items-center justify-center"
                                    key={activity + index}
                                >
                                    <div>
                                        <Badge value={no} size="large"></Badge>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="partner_address">
                                            Tahapan *
                                        </label>
                                        <InputText
                                            value={activity.activity}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    index,
                                                    "activity",
                                                    e.target.value
                                                )
                                            }
                                            className="dark:bg-gray-300"
                                            id="partner_address"
                                            aria-describedby="partner_address-help"
                                        />
                                    </div>

                                    <div className="flex">
                                        <div className="flex flex-col">
                                            <label htmlFor="partner_address">
                                                cazh_pic *
                                            </label>
                                            <Dropdown
                                                value={activity.cazh_pic}
                                                onChange={(e) => {
                                                    handleInputChange(
                                                        index,
                                                        "cazh_pic",
                                                        e.target.value
                                                    );
                                                }}
                                                options={roles}
                                                optionLabel="name"
                                                optionValue="name"
                                                placeholder="Pilih Penanggungjawab"
                                                filter
                                                valueTemplate={
                                                    selectedOptionTemplate
                                                }
                                                itemTemplate={optionTemplate}
                                                className="w-full md:w-14rem"
                                                editable
                                            />
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="flex flex-col">
                                            <label htmlFor="duration">
                                                Estimasi Waktu *
                                            </label>
                                            <InputText
                                                value={activity.duration}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        "duration",
                                                        e.target.value
                                                    )
                                                }
                                                className="dark:bg-gray-300"
                                                id="duration"
                                                aria-describedby="duration-help"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="flex flex-col">
                                            <label htmlFor="estimation_date">
                                                Tanggal *
                                            </label>
                                            <Calendar
                                                value={
                                                    activity.estimation_date
                                                        ? new Date(
                                                              activity.estimation_date
                                                          )
                                                        : null
                                                }
                                                style={{ height: "35px" }}
                                                onChange={(e) => {
                                                    const formattedDate =
                                                        new Date(e.target.value)
                                                            .toISOString()
                                                            .split("T")[0];
                                                    handleInputChange(
                                                        index,
                                                        "estimation_date",
                                                        e.target.value
                                                    );
                                                }}
                                                showIcon
                                            />{" "}
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="flex flex-col">
                                            <label htmlFor="partner_address">
                                                Realisasi
                                            </label>
                                            <InputText
                                                value={activity.realization}
                                                className="dark:bg-gray-300"
                                                id="partner_address"
                                                aria-describedby="partner_address-help"
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
                                                const updatedActivities = [
                                                    ...data.activities,
                                                ];

                                                updatedActivities.splice(
                                                    index,
                                                    1
                                                );

                                                setData((prevData) => ({
                                                    ...prevData,
                                                    activities:
                                                        updatedActivities,
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

                    <div className="md:w-[60%] h-screen max-h-screen overflow-y-auto p-5">
                        <header>
                            <div className="flex justify-start items-center">
                                <div className="w-[10%]">
                                    <img
                                        src="/assets/img/cazh.png"
                                        alt=""
                                        className="float-left w-full h-full"
                                    />
                                </div>
                                <div className="w-full text-center ">
                                    <h2 className="font-bold">
                                        PT CAZH TEKNOLOGI INOVASI
                                    </h2>
                                    <h2 className="font-bold">
                                        TIME LINE PROSES IMPLEMENTASI LAYANAN
                                        CAZH CARDS
                                    </h2>
                                </div>
                                <div className="w-[10%]"></div>
                            </div>
                        </header>

                        <hr className="h-[2px] my-2 bg-slate-400" />

                        <div className="w-full mt-5">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="text-sm w-1/4">
                                            Nama Lembaga
                                        </td>
                                        <td className="text-sm w-[1%]">:</td>
                                        <td className="text-sm w-7/12">
                                            <span ref={animatePartnerNameRef}>
                                                {data.partner_name ?? (
                                                    <b>{"{{nama_lembaga}}"}</b>
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-sm w-1/4">
                                            Alamat Lembaga
                                        </td>
                                        <td className="text-sm w-[1%]">:</td>
                                        <td className="text-sm w-7/12">
                                            <span
                                                ref={animatePartnerAddressRef}
                                            >
                                                {data.partner_address ?? (
                                                    <b>
                                                        {"{{alamat_lembaga}}"}
                                                    </b>
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-sm w-1/4">
                                            Nomor Telepon Lembaga
                                        </td>
                                        <td className="text-sm w-[1%]">:</td>
                                        <td className="text-sm w-7/12">
                                            <span
                                                ref={
                                                    animatePartnerPhoneNumberRef
                                                }
                                            >
                                                {data.partner_phone_number ?? (
                                                    <b>
                                                        {"{{nomor_hp_lembaga}}"}
                                                    </b>
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-sm w-1/4">
                                            Penanggungjawab
                                        </td>
                                        <td className="text-sm w-[1%]">:</td>
                                        <td className="text-sm w-7/12">
                                            <span ref={animatePartnerPicRef}>
                                                {data.partner_pic ?? (
                                                    <b>{"{{pic_lembaga}}"}</b>
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-sm w-1/4">
                                            Email Penanggungjawab
                                        </td>
                                        <td className="text-sm w-[1%]">:</td>
                                        <td className="text-sm w-7/12">
                                            <span
                                                ref={animatePartnerPicEmailRef}
                                            >
                                                {data.partner_pic_email ?? (
                                                    <b>{"{{pic_email}}"}</b>
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-sm w-1/4">
                                            Nomor HP Penanggungjawab
                                        </td>
                                        <td className="text-sm w-[1%]">:</td>
                                        <td className="text-sm w-7/12">
                                            <span
                                                ref={animatePartnerPicNumberRef}
                                            >
                                                {data.partner_pic_number ?? (
                                                    <b>{"{{nomor_hp_pic}}"}</b>
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="w-full text-sm mt-5">
                            <table
                                className="w-full border  border-collapse "
                                border={1}
                            >
                                <thead className="text-left">
                                    <th className="border p-2 text-center">
                                        No
                                    </th>
                                    <th className="border p-2 text-center">
                                        Tahapan
                                    </th>
                                    <th className="border p-2 text-center">
                                        Penanggungjawab
                                    </th>
                                    <th className="border p-2 text-center">
                                        Estimasi Waktu
                                    </th>
                                    <th className="border p-2 text-center">
                                        Tanggal
                                    </th>
                                    <th className="border p-2 text-center">
                                        Realisasi
                                    </th>
                                </thead>
                                <tbody>
                                    {data.activities?.length == 0 && (
                                        <tr className="text-center">
                                            <td colSpan={6} className="border">
                                                Aktivitas belum ditambah
                                            </td>
                                        </tr>
                                    )}
                                    {data.activities?.map((data, i) => {
                                        return (
                                            <tr key={data.activity + i}>
                                                <td className=" border text-center">
                                                    {++i}
                                                </td>
                                                <td className="border p-1">
                                                    {data.activity}
                                                </td>
                                                <td className="border p-1">
                                                    {data.cazh_pic}
                                                </td>
                                                <td className="border p-1">
                                                    {data.duration}
                                                </td>
                                                <td className="border p-1">
                                                    {data.estimation_date !==
                                                    null
                                                        ? new Date(
                                                              data.estimation_date
                                                          ).toLocaleDateString(
                                                              "en-GB",
                                                              {
                                                                  day: "numeric",
                                                                  month: "short",
                                                                  year: "numeric",
                                                              }
                                                          )
                                                        : ""}
                                                </td>
                                                <td className="border p-1">
                                                    {data.realization}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {/* 
                        <div className="flex flex-col text-sm mt-5 justify-start w-[30%]">
                            <p>Purwokerto, {new Date().getFullYear()}</p>
                            <img src={BASE_URL + data.signature_image} alt="" />
                            <p>{data.signature_name}</p>
                        </div> */}

                        <div className="flex text-sm flex-row mt-5 justify-between">
                            <div
                                className="w-[30%]"
                                ref={animateSignatureNameRef}
                            >
                                <p>Pihak Pertama</p>
                                <img
                                    src={BASE_URL + data.signature_image}
                                    alt=""
                                    className="min-h-20"
                                />
                                <p>
                                    <b>
                                        {data.signature_name ??
                                            "{{nama_pihak_pertama}}"}
                                    </b>
                                </p>
                                {/* <p>{data.signature_position}</p> */}
                            </div>
                            <div className="w-[30%]">
                                <p>Pihak Kedua</p>
                                <div className="min-h-20"></div>
                                <p>
                                    <b>
                                        {data.partner_pic ??
                                            "{{nama_pihak_kedua}}"}
                                    </b>
                                </p>
                            </div>
                            {data.referral && (
                                <div
                                    className="w-[30%]"
                                    ref={animateReferralRef}
                                >
                                    <p>Pihak Ketiga</p>
                                    <div className="min-h-20"></div>
                                    <p>
                                        <b ref={animateReferralNameRef}>
                                            {data.referral_name ??
                                                "{{nama_referral}}"}
                                        </b>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white h-screen z-10 w-full absolute top-0 left-0"></div>
            </div>
        </>
    );
};

export default Create;
