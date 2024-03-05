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
import {
    FilePond as FilePond1,
    FilePond as FilePond2,
    registerPlugin,
} from "react-filepond";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
registerPlugin(FilePondPluginFileValidateSize);

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Create = ({ usersProp, partnersProp, signaturesProp, referralsProp }) => {
    const [users, setUsers] = useState([
        ...usersProp,
        { name: "Account Executive" },
        { name: "Account Manager", name: "Graphics Designer" },
        { name: "Account Manager" },
    ]);
    const [partners, setPartners] = useState(partnersProp);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const toast = useRef(null);
    const [provinces, setProvinces] = useState([]);
    const [regencys, setRegencys] = useState([]);
    const [codeProvince, setcodeProvince] = useState(null);
    const [signatures, setSignatures] = useState(signaturesProp);
    const [referrals, setReferrals] = useState(referralsProp);

    const animatePartnerProvinceRef = useRef(null);
    const animatePartnerRegencyRef = useRef(null);
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

    useEffect(() => {
        const fetchData = async () => {
            await getProvince();
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (codeProvince) {
            getRegencys(codeProvince);
        }
    }, [codeProvince]);

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
                activity: "Pembuatan WA Group Sales-Partner",
                cazh_pic: { name: "Account Executive" },
                duration: "1 hari",
                estimation_date: new Date().toISOString().split("T")[0],
                realization_date: null,
                link_drive_proof: null,
            },
            {
                activity: "Perjanjian Kerja Sama",
                cazh_pic: { name: "Account Executive" },
                duration: "1 - 3 hari",
                estimation_date: new Date(
                    new Date().setDate(new Date().getDate() + 1)
                )
                    .toISOString()
                    .split("T")[0],
                realization_date: null,
                link_drive_proof: null,
            },
            {
                activity: "Pengumpulan Data (data siswa, foto siswa)",
                cazh_pic: { name: "Account Executive" },
                duration: "1 - 3 hari",
                estimation_date: new Date(
                    new Date().setDate(new Date().getDate() + 1)
                )
                    .toISOString()
                    .split("T")[0],
                realization_date: null,
                link_drive_proof: null,
            },
            {
                activity: "Pembuatan dan Pengiriman Invoice",
                cazh_pic: { name: "Account Executive" },
                duration: "1 - 5 hari",
                estimation_date: new Date(
                    new Date().setDate(new Date().getDate() + 1)
                )
                    .toISOString()
                    .split("T")[0],
                realization_date: null,
                link_drive_proof: null,
            },
            {
                activity: "Pembayaran invoice",
                cazh_pic: { name: "Account Executive" },
                duration: "1 - 5 hari",
                estimation_date: new Date(
                    new Date().setDate(new Date().getDate() + 2)
                )
                    .toISOString()
                    .split("T")[0],
                realization_date: null,
                link_drive_proof: null,
            },
            {
                activity: "Pendaftaran Partner",
                cazh_pic: { name: "Account Executive" },
                duration: "1 hari",
                estimation_date: new Date(
                    new Date().setDate(new Date().getDate() + 1)
                )
                    .toISOString()
                    .split("T")[0],
                realization_date: null,
                link_drive_proof: null,
            },
            {
                activity: "Persiapan Sistem",
                cazh_pic: { name: "Account Manager" },
                duration: "1 hari",
                estimation_date: new Date(
                    new Date().setDate(new Date().getDate() + 1)
                )
                    .toISOString()
                    .split("T")[0],
                realization_date: null,
                link_drive_proof: null,
            },
            {
                activity: "Introduction Meeting AM",
                cazh_pic: { name: "Account Executive" },
                duration: "1 hari",
                estimation_date: new Date(
                    new Date().setDate(new Date().getDate() + 1)
                )
                    .toISOString()
                    .split("T")[0],
                realization_date: null,
                link_drive_proof: null,
            },
            {
                activity: "Desain Kartu (versi digital dan cetak)",
                cazh_pic: { name: "Graphics Designer" },
                duration: "3 hari sejak pendaftaran",
                estimation_date: new Date(
                    new Date().setDate(new Date().getDate() + 4)
                )
                    .toISOString()
                    .split("T")[0],
                realization_date: null,
                link_drive_proof: null,
            },
            {
                activity: "Cetak Kartu (jika dicetak)",
                cazh_pic: { name: "Graphics Designer" },
                duration: "4 hari desain approve",
                estimation_date: new Date(
                    new Date().setDate(new Date().getDate() + 8)
                )
                    .toISOString()
                    .split("T")[0],
                realization_date: null,
                link_drive_proof: null,
            },
            {
                activity: "Pengiriman kartu dan device (bila ada)",
                cazh_pic: { name: "Graphics Designer" },
                duration: "7 hari sejak cetak kartu selesai",
                estimation_date: new Date(
                    new Date().setDate(new Date().getDate() + 15)
                )
                    .toISOString()
                    .split("T")[0],
                realization_date: null,
                link_drive_proof: null,
            },
            {
                activity: "Training Cazh School App (Staf Admin/Keu)",
                cazh_pic: { name: "Account Manager" },
                duration: "7 hari sejak cetak kartu sampai",
                estimation_date: new Date(
                    new Date().setDate(new Date().getDate() + 22)
                )
                    .toISOString()
                    .split("T")[0],
                realization_date: null,
                link_drive_proof: null,
            },
            {
                activity: "Training CARDS Kartu Digital (Staf Admin/Keu)",
                cazh_pic: { name: "Account Manager" },
                duration: "7 hari sejak cetak kartu sampai",
                estimation_date: new Date(
                    new Date().setDate(new Date().getDate() + 22)
                )
                    .toISOString()
                    .split("T")[0],
                realization_date: null,
                link_drive_proof: null,
            },
            {
                activity: "Training CazhPOS dan CPA (Kasir/Manager)",
                cazh_pic: { name: "Account Manager" },
                duration: "10 hari sejak kartu sampai",
                estimation_date: new Date(
                    new Date().setDate(new Date().getDate() + 25)
                )
                    .toISOString()
                    .split("T")[0],
                realization_date: null,
                link_drive_proof: null,
            },
            {
                activity: "Sosialisasi User (Orang Tua/Wali) - optional*",
                cazh_pic: { name: "Account Manager" },
                duration: "14 hari sejak kartu sampai",
                estimation_date: new Date(
                    new Date().setDate(new Date().getDate() + 29)
                )
                    .toISOString()
                    .split("T")[0],
                realization_date: null,
                link_drive_proof: null,
            },
            {
                activity: "Live - Partner Mandiri dan Mulai Transaksi",
                cazh_pic: { name: "Account Manager" },
                duration: "15 hari sejak sosialisasi user",
                estimation_date: new Date(
                    new Date().setDate(new Date().getDate() + 44)
                )
                    .toISOString()
                    .split("T")[0],
                realization_date: null,
                link_drive_proof: null,
            },
        ],
        partner: {
            id: null,
            name: null,
            phone_number: null,
            pic: null,
            pic_position: null,
            pic_number: null,
            pic_email: null,
            pic_signature: null,
        },
        logo: null,
        referral: false,
        referral_signature: { name: null, image: null, institution: null },
        referral_logo: null,
        signature: {
            name: null,
            image: null,
        },
    });

    useEffect(() => {
        setTimeout(() => {
            setData("logo", "/assets/img/logo/sla_logo.png");
        }, 1000);
    }, []);

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
            ? `/api/wilayah/kabupaten?provinsi=${code}`
            : `/api/wilayah/kabupaten`;
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
        if (option) {
            const name = option.name ?? option.user.name;
            return (
                <div className="flex align-items-center">
                    <div>{name}</div>
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
        const path = item.image ?? item.signature;
        const name = item.name ?? item.user.name;
        const position = item.position ?? item.institution;

        return (
            <div className="flex flex-wrap p-2 align-items-center items-center gap-3">
                <img
                    className="w-[6rem] shadow-2 flex-shrink-0 border-round"
                    src={"/storage/" + path}
                    alt={name}
                />
                <div className="flex-1 flex flex-col gap-2 xl:mr-8">
                    <span className="font-bold">{name}</span>
                    <div className="flex align-items-center gap-2">
                        <span>{position}</span>
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
            <Head title="Service Level Agreement"></Head>
            <Toast ref={toast} />
            <div className="h-screen max-h-screen overflow-y-hidden">
                <div className="flex flex-col h-screen max-h-screen overflow-hidden md:flex-row z-40 relative gap-5">
                    <div className="md:w-[35%] overflow-y-auto h-screen max-h-screen p-5">
                        <Card>
                            <div className="flex justify-between items-center mb-4">
                                <h1 className="font-bold text-2xl">
                                    Service Level Agreement
                                </h1>
                                <Link href="/sla">
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
                                    <label htmlFor="logo">Logo</label>

                                    <div className="App">
                                        {data.logo !== null &&
                                        typeof data.logo == "string" ? (
                                            <>
                                                <FilePond1
                                                    files={data.logo}
                                                    onaddfile={(
                                                        error,
                                                        fileItems
                                                    ) => {
                                                        if (!error) {
                                                            setData(
                                                                "logo",
                                                                fileItems.file
                                                            );
                                                        }
                                                    }}
                                                    onremovefile={() => {
                                                        setData("logo", null);
                                                    }}
                                                    maxFileSize="2mb"
                                                    labelMaxFileSizeExceeded="File terlalu besar"
                                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <FilePond1
                                                    onaddfile={(
                                                        error,
                                                        fileItems
                                                    ) => {
                                                        if (!error) {
                                                            setData(
                                                                "logo",
                                                                fileItems.file
                                                            );
                                                        }
                                                    }}
                                                    onremovefile={() => {
                                                        setData("logo", null);
                                                    }}
                                                    maxFileSize="2mb"
                                                    labelMaxFileSizeExceeded="File terlalu besar"
                                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col mt-3">
                                    <label htmlFor="lembaga">Lembaga *</label>

                                    <Dropdown
                                        value={data.partner}
                                        dataKey="id"
                                        onChange={(e) => {
                                            setData("partner", {
                                                ...data.partner,
                                                id: e.target.value.id,
                                                name: e.target.value.name,
                                                phone_number:
                                                    e.target.value.phone_number,
                                                province:
                                                    e.target.value.province,
                                                regency: e.target.value.regency,
                                                pic: e.target.value.pics[0]
                                                    .name,
                                                pic_position:
                                                    e.target.value.pics[0]
                                                        .position,
                                                pic_email:
                                                    e.target.value.pics[0]
                                                        .email,
                                                pic_number:
                                                    e.target.value.pics[0]
                                                        .number,
                                                pic_number:
                                                    e.target.value.pics[0]
                                                        .number,
                                            });
                                            setcodeProvince(
                                                (prev) =>
                                                    (prev = JSON.parse(
                                                        e.target.value.province
                                                    ).code)
                                            );
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
                                        valueTemplate={selectedOptionTemplate}
                                        itemTemplate={optionTemplate}
                                        className="w-full md:w-14rem"
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="province">Provinsi *</label>

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
                                                    (prev = e.target.value.code)
                                            );
                                            setData("partner", {
                                                ...data.partner,
                                                province: JSON.stringify(
                                                    e.target.value
                                                ),
                                            });
                                        }}
                                        dataKey="name"
                                        options={provinces}
                                        optionLabel="name"
                                        placeholder="Pilih Provinsi"
                                        filter
                                        valueTemplate={selectedOptionTemplate}
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
                                </div>

                                <div className="flex flex-col mt-3">
                                    <label htmlFor="regency">Kabupaten *</label>
                                    <Dropdown
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
                                        dataKey="name"
                                        options={regencys}
                                        optionLabel="name"
                                        placeholder="Pilih Kabupaten"
                                        filter
                                        valueTemplate={selectedOptionTemplate}
                                        itemTemplate={optionTemplate}
                                        className="w-full md:w-14rem"
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="partner_address">
                                        Nomor Telepon Lembaga *
                                    </label>
                                    <InputText
                                        value={data.partner.phone_number}
                                        onChange={(e) =>
                                            setData("partner", {
                                                ...data.partner,
                                                phone_number: e.target.value,
                                            })
                                        }
                                        keyfilter="int"
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
                                        value={data.partner.pic}
                                        onChange={(e) =>
                                            setData("partner", {
                                                ...data.partner,
                                                pic: e.target.value,
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
                                        value={data.partner.pic_email}
                                        onChange={(e) => {
                                            setData("partner", {
                                                ...data.partner,
                                                pic_email: e.target.value,
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
                                        value={data.partner.pic_number}
                                        onChange={(e) =>
                                            setData("partner", {
                                                ...data.partner,
                                                pic_number: e.target.value,
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
                                        keyfilter="int"
                                        className="dark:bg-gray-300"
                                        id="partner_pic_number"
                                        aria-describedby="partner_pic_number-help"
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="signature">
                                        Tanda Tangan Pihak Pertama*
                                    </label>
                                    <Dropdown
                                        value={data.signature}
                                        onChange={(e) => {
                                            setData("signature", {
                                                ...data.signature,
                                                name: e.target.value.name,
                                                image: e.target.value.image,
                                            });
                                        }}
                                        dataKey="name"
                                        options={signatures}
                                        optionLabel="name"
                                        placeholder="Pilih Tanda Tangan"
                                        filter
                                        valueTemplate={selectedOptionTemplate}
                                        itemTemplate={optionSignatureTemplate}
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
                                </div>

                                <div className="flex flex-col mt-3">
                                    <label htmlFor="signature">
                                        Tanda Tangan PIC
                                    </label>

                                    <div className="App">
                                        {data.partner.pic_signature !== null &&
                                        typeof data.partner.pic_signature ==
                                            "string" ? (
                                            <>
                                                <FilePond2
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
                                                            setData("partner", {
                                                                ...data.partner,
                                                                pic_signature:
                                                                    fileItems.file,
                                                            });
                                                        }
                                                    }}
                                                    onremovefile={() => {
                                                        setData("partner", {
                                                            ...data.partner,
                                                            pic_signature: null,
                                                        });
                                                    }}
                                                    maxFileSize="2mb"
                                                    labelMaxFileSizeExceeded="File terlalu besar"
                                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <FilePond2
                                                    onaddfile={(
                                                        error,
                                                        fileItems
                                                    ) => {
                                                        if (!error) {
                                                            setData("partner", {
                                                                ...data.partner,
                                                                pic_signature:
                                                                    fileItems.file,
                                                            });
                                                        }
                                                    }}
                                                    onremovefile={() => {
                                                        setData("partner", {
                                                            ...data.partner,
                                                            pic_signature: null,
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

                                <div className="flex flex-col mt-3">
                                    <label htmlFor="referral">Referral</label>
                                    <div className="flex items-center gap-2 my-2">
                                        <Checkbox
                                            onChange={(e) => {
                                                if (e.checked) {
                                                    setData(
                                                        "referral",
                                                        e.checked
                                                    );
                                                } else {
                                                    setData((data) => ({
                                                        ...data,
                                                        referral: e.checked,
                                                        referral_name: null,
                                                        referral_signature:
                                                            null,
                                                    }));
                                                }
                                            }}
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
                                    <>
                                        <div className="flex flex-col mt-3">
                                            <label htmlFor="signature">
                                                Pilih Referral
                                            </label>
                                            <Dropdown
                                                value={data.referral_signature}
                                                onChange={(e) => {
                                                    setData({
                                                        ...data,
                                                        referral_signature: {
                                                            name: e.target.value
                                                                .user.name,
                                                            image: e.target
                                                                .value
                                                                .signature,
                                                            institution:
                                                                e.target.value
                                                                    .institution,
                                                        },
                                                        referral_logo:
                                                            e.target.value.logo,
                                                    });
                                                }}
                                                dataKey="institution"
                                                options={referrals}
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
                                                    errors.referral_signature &&
                                                    "p-invalid"
                                                }`}
                                                onFocus={() => {
                                                    triggerInputFocus(
                                                        animateReferralRef
                                                    );
                                                }}
                                                onShow={() => {
                                                    triggerInputFocus(
                                                        animateReferralRef
                                                    );
                                                }}
                                                onHide={() => {
                                                    stopAnimateInputFocus(
                                                        animateReferralRef
                                                    );
                                                }}
                                                showOnFocus
                                            />
                                        </div>
                                    </>
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

                    <div className="md:w-[65%] hidden md:block text-xs h-screen max-h-screen overflow-y-auto p-5">
                        <header>
                            <div className="flex justify-start items-center">
                                <div className="w-[10%]">
                                    {data.logo && (
                                        <img
                                            src={
                                                typeof data.logo == "object"
                                                    ? URL.createObjectURL(
                                                          data.logo
                                                      )
                                                    : data.logo
                                            }
                                            alt=""
                                            className="float-left w-full h-full"
                                        />
                                    )}
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
                                <div className="w-[10%]">
                                    {data.referral_logo && (
                                        <img
                                            src={
                                                "/storage/" + data.referral_logo
                                            }
                                            alt=""
                                            className="float-left w-full h-full"
                                        />
                                    )}
                                </div>
                            </div>
                        </header>

                        <hr className="h-[2px] my-2 bg-slate-400" />

                        <div className="w-full mt-5">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="text-xs w-1/5">
                                            Nama Lembaga
                                        </td>
                                        <td className="text-xs w-[1%]">:</td>
                                        <td className="text-xs w-7/12">
                                            <span ref={animatePartnerNameRef}>
                                                {data.partner.name ??
                                                    "{{nama_lembaga}}"}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-xs w-1/5">
                                            Alamat Lembaga
                                        </td>
                                        <td className="text-xs w-[1%]">:</td>
                                        <td className="text-xs w-7/12">
                                            <span
                                                ref={animatePartnerRegencyRef}
                                            >
                                                {data.partner.regency
                                                    ? JSON.parse(
                                                          data.partner.regency
                                                      ).name
                                                    : "{{kabupaten}}"}
                                            </span>
                                            ,{" "}
                                            <span
                                                ref={animatePartnerProvinceRef}
                                            >
                                                {data.partner.province
                                                    ? JSON.parse(
                                                          data.partner.province
                                                      ).name
                                                    : "{{provinsi}}"}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-xs w-1/5">
                                            Nomor Telepon Lembaga
                                        </td>
                                        <td className="text-xs w-[1%]">:</td>
                                        <td className="text-xs w-7/12">
                                            <span
                                                ref={
                                                    animatePartnerPhoneNumberRef
                                                }
                                            >
                                                {data.partner.phone_number ??
                                                    "{{nomor_hp_lembaga}}"}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-xs w-1/5">
                                            Penanggungjawab
                                        </td>
                                        <td className="text-xs w-[1%]">:</td>
                                        <td className="text-xs w-7/12">
                                            <span ref={animatePartnerPicRef}>
                                                {data.partner.pic ??
                                                    "{{pic_lembaga}}"}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-xs w-1/5">
                                            Email Penanggungjawab
                                        </td>
                                        <td className="text-xs w-[1%]">:</td>
                                        <td className="text-xs w-7/12">
                                            <span
                                                ref={animatePartnerPicEmailRef}
                                            >
                                                {data.partner.pic_email ??
                                                    "{{pic_email}}"}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-xs w-1/5">
                                            Nomor HP Penanggungjawab
                                        </td>
                                        <td className="text-xs w-[1%]">:</td>
                                        <td className="text-xs w-7/12">
                                            <span
                                                ref={animatePartnerPicNumberRef}
                                            >
                                                {data.partner.pic_number ??
                                                    "{{nomor_hp_pic}}"}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="w-full text-xs mt-5">
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
                                                <td className="border text-center p-1">
                                                    <i>{data.cazh_pic.name}</i>
                                                </td>
                                                <td className="border text-center p-1">
                                                    {data.duration}
                                                </td>
                                                <td className="border text-right p-1">
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
                                                <td className="border text-right p-1">
                                                    {data.realization_date !==
                                                    null
                                                        ? new Date(
                                                              data.realization_date
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
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {/* 
                        <div className="flex flex-col text-xs mt-5 justify-start w-[30%]">
                            <p>Purwokerto, {new Date().getFullYear()}</p>
                            <img src={BASE_URL + data.signature_image} alt="" />
                            <p>{data.signature_name}</p>
                        </div> */}

                        <div className="flex text-xs flex-row mt-5 justify-between">
                            <div
                                className="w-[30%]"
                                ref={animateSignatureNameRef}
                            >
                                <p>Pihak Pertama</p>
                                <img
                                    src={
                                        BASE_URL +
                                        "/storage/" +
                                        data.signature.image
                                    }
                                    alt=""
                                    className="min-h-20 max-h-20"
                                />
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
                                {data.partner.pic_signature ? (
                                    <img
                                        src={URL.createObjectURL(
                                            data.partner.pic_signature
                                        )}
                                        className="min-h-20 max-h-20"
                                    />
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
                            {data.referral && (
                                <div
                                    className="w-[30%]"
                                    ref={animateReferralRef}
                                >
                                    <p>Pihak Ketiga</p>
                                    {data.referral_signature.image ? (
                                        <img
                                            src={
                                                BASE_URL +
                                                "/storage" +
                                                data.referral_signature.image
                                            }
                                            className="min-h-20 max-h-20"
                                        />
                                    ) : (
                                        <div className="min-h-20"></div>
                                    )}
                                    <p>
                                        <b ref={animateReferralNameRef}>
                                            {data.referral_signature.name ??
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
