import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Column } from "primereact/column";
import { useRef } from "react";
import { FilterMatchMode } from "primereact/api";
import { Dropdown } from "primereact/dropdown";
import React from "react";
import { Toast } from "primereact/toast";
import { Badge } from "primereact/badge";
import { InputNumber } from "primereact/inputnumber";
import InputError from "@/Components/InputError";
import { SelectButton } from "primereact/selectbutton";
import HeaderDatatable from "@/Components/HeaderDatatable";
import { formatNPWP } from "../../Utils/formatNPWP";
import { getRegencys } from "@/Services/getRegency";
import { getProvince } from "@/Services/getProvince";
import { upperCaseEachWord } from "@/Utils/UppercaseEachWord";
import DialogInstitution from "@/Components/DialogInstitution";
import { BlockUI } from "primereact/blockui";
import LoadingDocument from "@/Components/LoadingDocument";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Create = ({
    usersProp,
    leadsProp,
    salesProp,
    productsProp,
    signaturesProp,
}) => {
    const [users, setUsers] = useState(usersProp);
    const [leads, setLeads] = useState(leadsProp);
    const [sales, setSales] = useState(salesProp);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [signatures, setSignatures] = useState(signaturesProp);
    const [products, setProducts] = useState(productsProp);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogProductVisible, setDialogProductVisible] = useState(false);
    const [dialogInstitutionVisible, setDialogInstitutionVisible] =
        useState(false);
    const [rowClick, setRowClick] = useState(true);
    const [selected, setselected] = useState([]);
    const toast = useRef(null);
    const partnerScrollRef = useRef(null);
    const [provinces, setProvinces] = useState([]);
    const [regencys, setRegencys] = useState([]);
    const [provinceName, setProvinceName] = useState(null);
    const [theme, setTheme] = useState(localStorage.theme);
    const [blocked, setBlocked] = useState(false);
    const userLoggin = usePage().props.auth.user;

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

    const animatePartnerNameRef = useRef(null);
    const animatePartnerPicRef = useRef(null);
    const animatePartnerProvinceRef = useRef(null);
    const animatePartnerRegencyRef = useRef(null);
    const animateSalesNameRef = useRef(null);
    const animateSalesWaRef = useRef(null);
    const animateSalesEmailRef = useRef(null);
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
        uuid: "",
        code: `${Math.floor(
            Math.random() * 1000
        )}/CAZH-SPH/X/${new Date().getFullYear()}`,
        products: [],
        partner: {
            id: null,
            name: null,
            province: null,
            regency: null,
            pic: null,
        },
        sales: {
            id: null,
            name: null,
            email: null,
            address: null,
            wa: null,
        },
        created_by: null,
        signature: {
            name: "Muh Arif Mahmudin",
            position: "CEO",
            image: "/assets/img/signatures/ttd.png",
        },
    });

    useEffect(() => {
        const fetch = async () => {
            let response = await getProvince();
            setProvinces((prev) => (prev = response));
        };

        fetch();
    }, []);

    useEffect(() => {
        if (processing) {
            setBlocked(true);
        } else {
            setBlocked(false);
        }
    }, [processing]);

    useEffect(() => {
        const fetch = async () => {
            if (provinceName) {
                let response = await getRegencys(provinceName);
                setRegencys((prev) => (prev = response));
            }
        };
        fetch();
    }, [provinceName]);

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

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
        const filtered = selected.filter((product) => {
            return !data.products.includes(product);
        });

        const mapped = filtered.map((product) => {
            return { ...product, qty: 1, total: 1 * product.price };
        });

        const updatedProducts = [...data.products, ...mapped];
        setData("products", updatedProducts);
        setDialogProductVisible(false);
        setselected((prev) => (prev = []));
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

    const headerProduct = () => {
        return (
            <HeaderDatatable
                filters={filters}
                setFilters={setFilters}
            ></HeaderDatatable>
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

    const handleInputChange = (index, field, value) => {
        const updatedProducts = [...data.products];

        updatedProducts[index][field] = value;

        if (field == "price" || field == "qty") {
            let totalUpdated =
                updatedProducts[index]["price"] * updatedProducts[index]["qty"];
            updatedProducts[index]["total"] = totalUpdated;
        }

        setData("products", updatedProducts);
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();

        post("/sph", {
            onSuccess: () => {
                showSuccess("Tambah");
                router.get("/sph");
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
            <BlockUI blocked={blocked} template={LoadingDocument}>
                <div className="h-screen max-h-screen overflow-y-hidden">
                    <div className="flex flex-col h-screen max-h-screen overflow-hidden md:flex-row z-40 relative gap-5">
                        <div className="md:w-[35%] overflow-y-auto h-screen max-h-screen p-5">
                            <Card>
                                <div className="flex justify-between items-center mb-4">
                                    <h1 className="font-bold text-2xl">
                                        Surat Penawaran Harga
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
                                        label="Tambah Produk"
                                        icon="pi pi-external-link"
                                        onClick={() => setDialogVisible(true)}
                                    />
                                    <InputError
                                        message={errors["products"]}
                                        className="mt-2"
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

                                    {/* <div className="flex flex-col mt-3">
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
                                    </div> */}

                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="lembaga">
                                            Lembaga *
                                        </label>
                                        <Dropdown
                                            value={data.partner}
                                            dataKey="id"
                                            onChange={(e) => {
                                                setData((data) => ({
                                                    ...data,
                                                    partner: {
                                                        ...data.partner,
                                                        uuid: e.target.value
                                                            .uuid,
                                                        id: e.target.value.id,
                                                        name: e.target.value
                                                            .name,
                                                        npwp: e.target.value
                                                            .npwp,
                                                        pic:
                                                            e.target.value
                                                                ?.pic ?? "",
                                                    },
                                                    sales: {
                                                        name: e.target.value
                                                            .sales.name,
                                                        email: e.target.value
                                                            .sales.email,
                                                        wa:
                                                            e.target.value.sales
                                                                .wa ?? "",
                                                    },
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
                                            options={leads}
                                            optionLabel="name"
                                            placeholder="Pilih Lembaga"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                        <InputError
                                            message={errors["partner.name"]}
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
                                        <InputError
                                            message={errors["partner.pic"]}
                                            className="mt-2"
                                        />
                                    </div>
                                    {/* <div className="flex flex-col mt-3">
                                    <label htmlFor="lembaga">Lembaga *</label>
                                    <div className="p-inputgroup flex-1">
                                        <InputText
                                            value={data.partner.name}
                                            placeholder="Lembaga"
                                            onChange={(e) => {
                                                if (
                                                    typeof e.target.value ==
                                                    "object"
                                                ) {
                                                    setData((prev) => ({
                                                        ...prev,
                                                        partner: {
                                                            ...prev.partner,
                                                            name: e.target.value
                                                                .name,
                                                            id: e.target.value
                                                                .id,
                                                        },
                                                    }));
                                                } else {
                                                    setData((prev) => ({
                                                        ...prev,
                                                        partner: {
                                                            ...prev.partner,
                                                            name: e.target
                                                                .value,
                                                            id: null,
                                                        },
                                                    }));
                                                }
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
                                            className="w-[90%]"
                                        />
                                        <Dropdown
                                            value={data.partner}
                                            dataKey="name"
                                            onChange={(e) => {
                                                setData("partner", {
                                                    ...data.partner,
                                                    id: e.target.value.id,
                                                    name: e.target.value.name,
                                                    province:
                                                        e.target.value.province,
                                                    regency:
                                                        e.target.value.regency,
                                                    pic: e.target.value.pics[0]
                                                        .name,
                                                });
                                                setProvinceName(
                                                    (prev) =>
                                                        (prev = JSON.parse(
                                                            e.target.value
                                                                .province
                                                        ).code)
                                                );
                                            }}
                                            options={partners}
                                            filter
                                            placeholder={false}
                                            showClear={false}
                                            optionLabel="name"
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-[10%] dropdown-group border-l-0"
                                        />
                                    </div>
                                    <InputError
                                        message={errors["partner.name"]}
                                        className="mt-2"
                                    />
                                </div> */}

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
                                                            e.target.value.name)
                                                );
                                                setData("partner", {
                                                    ...data.partner,
                                                    province: JSON.stringify(
                                                        e.target.value
                                                    ),
                                                    regency: null,
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
                                            onBlur={() => {
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
                                            onBlur={() => {
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
                                        <label htmlFor="sales">Sales *</label>
                                        <Dropdown
                                            value={data.sales}
                                            onChange={(e) => {
                                                setData("sales", {
                                                    ...data.sales,
                                                    name: e.target.value.name,
                                                    wa: e.target.value.number,
                                                    email: e.target.value.email,
                                                });
                                            }}
                                            dataKey="name"
                                            options={sales}
                                            optionLabel="name"
                                            placeholder="Pilih Sales"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateSalesNameRef
                                                );
                                            }}
                                            onShow={() => {
                                                triggerInputFocus(
                                                    animateSalesNameRef
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateSalesNameRef
                                                );
                                            }}
                                        />
                                        <InputError
                                            message={errors["sales.name"]}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="sales-whatsapp">
                                            Whatsapp Sales *
                                        </label>
                                        <InputText
                                            value={data.sales.wa}
                                            onChange={(e) => {
                                                setData("sales", {
                                                    ...data.sales,
                                                    wa: e.target.value,
                                                });
                                            }}
                                            keyfilter="int"
                                            className="dark:bg-gray-300"
                                            id="sales-whatsapp"
                                            aria-describedby="sales-whatsapp-help"
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateSalesWaRef
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateSalesWaRef
                                                );
                                            }}
                                        />
                                        <InputError
                                            message={errors["sales.wa"]}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="sales-email">
                                            Email Sales *
                                        </label>
                                        <InputText
                                            value={data.sales.email}
                                            onChange={(e) =>
                                                setData("sales", {
                                                    ...data.sales,
                                                    email: e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300"
                                            id="sales-email"
                                            aria-describedby="sales-email-help"
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateSalesEmailRef
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateSalesEmailRef
                                                );
                                            }}
                                        />
                                        <InputError
                                            message={errors["sales.email"]}
                                            className="mt-2"
                                        />
                                    </div>
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
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateSignatureNameRef
                                                );
                                            }}
                                            onShow={() => {
                                                triggerInputFocus(
                                                    animateSignatureNameRef
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateSignatureNameRef
                                                );
                                            }}
                                        />
                                        <InputError
                                            message={errors["signature.image"]}
                                            className="mt-2"
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
                                    label="Pilih Produk"
                                    icon="pi pi-external-link"
                                    onClick={() =>
                                        setDialogProductVisible(true)
                                    }
                                    className="text-xs md:text-base"
                                />
                                <Button
                                    label="Tambah Produk"
                                    icon="pi pi-plus"
                                    className="text-xs md:text-base"
                                    onClick={() => {
                                        let inputNew = {
                                            name: "",
                                            price: "",
                                            qty: "",
                                            detail: null,
                                            total: "",
                                        };

                                        let updatedProducts = [
                                            ...data.products,
                                            inputNew,
                                        ];

                                        setData("products", updatedProducts);
                                    }}
                                />
                            </div>

                            {data.products?.map((product, index) => {
                                const no = index + 1;
                                return (
                                    <div
                                        className="flex gap-5 mt-2 items-center"
                                        key={product + index}
                                    >
                                        <div>
                                            <Badge
                                                value={no}
                                                size="large"
                                            ></Badge>
                                        </div>

                                        <div className="flex flex-col">
                                            <label htmlFor="partner_address">
                                                Produk/Layanan *
                                            </label>
                                            <InputText
                                                value={product.name}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        "name",
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
                                                    Harga *
                                                </label>
                                                <InputNumber
                                                    value={product.price}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            "price",
                                                            e.value
                                                        )
                                                    }
                                                    className="dark:bg-gray-300"
                                                    id="partner_address"
                                                    aria-describedby="partner_address-help"
                                                    locale="id-ID"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <div className="flex flex-col">
                                                <label htmlFor="partner_address">
                                                    Kuantitas *
                                                </label>
                                                <InputNumber
                                                    value={product.qty}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            "qty",
                                                            e.value
                                                        )
                                                    }
                                                    className="dark:bg-gray-300"
                                                    id="partner_address"
                                                    aria-describedby="partner_address-help"
                                                    keyfilter="int"
                                                    locale="id-ID"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <div className="flex flex-col">
                                                <label htmlFor="partner_address">
                                                    Rincian *
                                                </label>
                                                <InputText
                                                    value={product.detail}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            "detail",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="dark:bg-gray-300"
                                                    id="partner_address"
                                                    aria-describedby="partner_address-help"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <div className="flex flex-col">
                                                <label htmlFor="partner_address">
                                                    Jumlah *
                                                </label>
                                                <InputNumber
                                                    value={product.total}
                                                    className="dark:bg-gray-300"
                                                    id="partner_address"
                                                    aria-describedby="partner_address-help"
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
                                                    const updatedProducts = [
                                                        ...data.products,
                                                    ];

                                                    updatedProducts.splice(
                                                        index,
                                                        1
                                                    );

                                                    setData((prevData) => ({
                                                        ...prevData,
                                                        products:
                                                            updatedProducts,
                                                    }));
                                                }}
                                                aria-controls="popup_menu_right"
                                                aria-haspopup
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            <Dialog
                                header="Produk"
                                visible={dialogProductVisible}
                                style={{ width: "75vw" }}
                                maximizable
                                modal
                                contentStyle={{ height: "550px" }}
                                onHide={() => setDialogProductVisible(false)}
                                footer={() => dialogFooterTemplate("product")}
                            >
                                <DataTable
                                    value={products}
                                    paginator
                                    filters={filters}
                                    rows={10}
                                    header={headerProduct}
                                    scrollable
                                    scrollHeight="flex"
                                    tableStyle={{ minWidth: "50rem" }}
                                    selectionMode={rowClick ? null : "checkbox"}
                                    rowsPerPageOptions={[10, 25, 50, 100]}
                                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                    currentPageReportTemplate="{first} - {last} dari {totalRecords}"
                                    selection={selected}
                                    onSelectionChange={(e) =>
                                        setselected(e.value)
                                    }
                                    dataKey="id"
                                >
                                    <Column
                                        selectionMode="multiple"
                                        headerStyle={{ width: "3rem" }}
                                    ></Column>
                                    <Column field="name" header="Nama"></Column>
                                    <Column
                                        field="description"
                                        header="Deskripsi"
                                    ></Column>
                                    <Column
                                        field="category"
                                        header="Kategori"
                                    ></Column>
                                    <Column
                                        field="price"
                                        header="Harga"
                                    ></Column>
                                </DataTable>
                            </Dialog>
                        </Dialog>
                        {/* 
                        <DialogInstitution
                            dialogInstitutionVisible={dialogInstitutionVisible}
                            setDialogInstitutionVisible={
                                setDialogInstitutionVisible
                            }
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
                        /> */}

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
                                        <p>
                                            Kec. Sumbang, Kab. Banyumas,Jawa
                                            Tengah 53183
                                        </p>

                                        <p>
                                            hello@cards.co.id |
                                            https://cards.co.id
                                        </p>
                                    </div>
                                </div>
                            </header>

                            <div className="text-center mt-5">
                                <h1 className="font-bold underline mx-auto">
                                    SURAT PENAWARAN HARGA
                                </h1>
                                <p className="">
                                    Nomor : <b>{data.code}</b>
                                </p>
                            </div>

                            <div className="mt-5" ref={partnerScrollRef}>
                                <h1>Kepada Yth.</h1>
                                <h1
                                    className="font-bold"
                                    ref={animatePartnerPicRef}
                                >
                                    {data.partner.pic ?? "{{pic}}"}
                                </h1>
                                <h1
                                    className="font-bold"
                                    ref={animatePartnerNameRef}
                                >
                                    {data.partner.name ?? "{{partner}}"}
                                </h1>
                                <h1>
                                    di{" "}
                                    <span ref={animatePartnerRegencyRef}>
                                        {data.partner.regency
                                            ? upperCaseEachWord(
                                                  JSON.parse(
                                                      data.partner.regency
                                                  ).name
                                              )
                                            : "{{alamat}}"}
                                    </span>
                                    {", "}
                                    <span ref={animatePartnerProvinceRef}>
                                        {data.partner.province
                                            ? upperCaseEachWord(
                                                  JSON.parse(
                                                      data.partner.province
                                                  ).name
                                              )
                                            : "{{alamat}}"}
                                    </span>
                                </h1>
                            </div>

                            <div className="mt-5">
                                <h1>Dengan Hormat</h1>
                            </div>

                            <div className="mt-5">
                                <h1>
                                    Menindaklanjuti komunikasi yang telah
                                    dilakukan oleh tim marketing kami{" "}
                                    {data.sales.name ?? "{{sales}}"} dengan
                                    perwakilan dari{" "}
                                    {data.partner.name ?? "{{partner}}"}, dengan
                                    ini kami sampaikan penawaran sebagai
                                    berikut:
                                </h1>
                            </div>

                            <div className="w-full mt-5">
                                <table className="w-full">
                                    <thead className="bg-blue-100 dark:text-black text-left">
                                        <th className="pl-2">No</th>
                                        <th className="py-2">Produk/Layanan</th>
                                        <th className="py-2">Rincian</th>
                                        <th className="py-2 text-center">
                                            Jumlah
                                        </th>
                                    </thead>
                                    <tbody>
                                        {data.products?.length == 0 && (
                                            <tr className="text-center">
                                                <td colSpan={4}>
                                                    Produk belum ditambah
                                                </td>
                                            </tr>
                                        )}
                                        {data.products?.map((data, i) => {
                                            return (
                                                <tr key={data.name + i}>
                                                    <td className="pl-2">
                                                        {++i}
                                                    </td>
                                                    <td>{data.name}</td>
                                                    <td>{data.detail}</td>
                                                    <td className="text-right px-4">
                                                        Rp
                                                        {data.total
                                                            ? data.total.toLocaleString(
                                                                  "id"
                                                              )
                                                            : 0}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div class="mt-6">
                                <div class="text-sm text-left w-full">
                                    *) Harga yang tertera belum termasuk PPN
                                    sebesar 11%.
                                </div>
                            </div>

                            <div className="mt-5">
                                <h1>
                                    Untuk konfirmasi persetujuan silakan hubungi
                                    :
                                </h1>
                                <h1>
                                    <b ref={animateSalesNameRef}>
                                        {data.sales.name ?? "{{sales}}"}
                                    </b>{" "}
                                    via WA :{" "}
                                    <b ref={animateSalesWaRef}>
                                        {data.sales.wa ?? "{{wa_sales}}"}
                                    </b>
                                    , email :{" "}
                                    <b ref={animateSalesEmailRef}>
                                        {data.sales.email ?? "{{email_sales}}"}
                                    </b>
                                </h1>
                            </div>

                            <div className="mt-5">
                                <h1>
                                    Demikian surat penawaran harga ini kami
                                    sampaikan dengan sesungguhnya. Atas
                                    perhatian dan kerja sama yang baik, kami
                                    sampaikan terima kasih.
                                </h1>
                            </div>

                            <div
                                className="flex flex-col mt-5 justify-start w-[30%]"
                                ref={animateSignatureNameRef}
                            >
                                <p>
                                    Purwokerto,{" "}
                                    {new Date().toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                                <div className="h-[100px] w-[170px] self-start py-2">
                                    <img
                                        src={data.signature.image}
                                        alt=""
                                        className="object-fill  w-full h-full"
                                    />
                                </div>
                                <p>{data.signature.name}</p>
                                <p>{data.signature.position}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </BlockUI>
        </>
    );
};

export default Create;
