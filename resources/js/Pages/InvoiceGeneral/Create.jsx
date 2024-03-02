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
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Create = ({
    usersProp,
    partnersProp,
    salesProp,
    productsProp,
    signaturesProp,
}) => {
    const [users, setUsers] = useState(usersProp);
    const [partners, setPartners] = useState(partnersProp);
    const [sales, setSales] = useState(salesProp);
    const [signatures, setSignatures] = useState(signaturesProp);
    const [products, setProducts] = useState(productsProp);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogProductVisible, setDialogProductVisible] = useState(false);
    const [rowClick, setRowClick] = useState(true);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const toast = useRef(null);
    const partnerScrollRef = useRef(null);
    const [provinces, setProvinces] = useState([]);
    const [regencys, setRegencys] = useState([]);
    const [codeProvince, setcodeProvince] = useState(null);

    const animatePartnerNameRef = useRef(null);
    const animatePartnerNumberRef = useRef(null);
    const animateDateRef = useRef(null);
    const animateDueDateRef = useRef(null);
    const animatePaymentMetodeRef = useRef(null);
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
        uuid: "",
        code: `#INV/121/XI/${new Date().getFullYear()}`,
        products: [],
        total: 0,
        total_all_ppn: 0,
        total_all_ppn: 0,
        partner: {
            id: null,
            name: null,
            province: null,
            regency: null,
            number: null,
            pic: null,
        },
        date: null,
        due_date: null,
        paid_off: 0,
        rest_of_bill: 0,
        payment_metode: null,
        xendit_link: "https://checkout.xendit.co/web/",
        created_by: null,
        signature: {
            name: null,
            position: null,
            image: null,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            await getProvince();
        };

        fetchData();
        handleTotalInvoice();
    }, []);

    useEffect(() => {
        if (codeProvince) {
            getRegencys(codeProvince);
        }
    }, [codeProvince]);

    useEffect(() => {
        handleTotalInvoice();
    }, [data.paid_off]);

    const formatDateSignature = () => {
        let today = new Date();

        const monthNames = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
        ];

        let day = today.getDate();
        let monthIndex = today.getMonth();
        let year = today.getFullYear();

        let monthName = monthNames[monthIndex];

        let formattedDate = day + " " + monthName + " " + year;

        return formattedDate;
    };

    const formatDate = (date) => {
        if (!date) {
            return null;
        }
        const tanggal = new Date(date);

        const tahun = tanggal.getFullYear();
        const bulan = String(tanggal.getMonth() + 1).padStart(2, "0");
        const hari = String(tanggal.getDate()).padStart(2, "0");

        const hasilFormat = `${hari}-${bulan}-${tahun}`;

        return hasilFormat;
    };

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
                onClick={() => {
                    if (type !== "product") {
                        setDialogVisible(false);
                        handleTotalInvoice();
                    } else {
                        onDoneSelect();
                    }
                }}
            />
        );
    };

    const onDoneSelect = () => {
        let products = selectedProducts.map((product) => {
            let selectedProduct = {
                ...product,
                ppn: 0,
                quantity: 1,
                total: product.price * 1,
                total_ppn: 0,
            };
            return selectedProduct;
        });
        const updatedProducts = [...data.products, ...products];
        setData("products", updatedProducts);
        setDialogProductVisible(false);
        setSelectedProducts((prev) => (prev = []));
    };

    const triggerInputFocus = (ref) => {
        if (ref.current) {
            ref.current.classList.add("twinkle");
            ref.current.focus();

            ref.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
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
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <img
                    className="w-3rem shadow-2 flex-shrink-0 border-round"
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

        if (
            field == "price" ||
            field == "quantity" ||
            field == "ppn" ||
            field == "total"
        ) {
            let totalUpdated =
                updatedProducts[index]["price"] *
                updatedProducts[index]["quantity"];
            updatedProducts[index]["total"] = totalUpdated;
            updatedProducts[index]["total_ppn"] =
                (updatedProducts[index]["total"] *
                    updatedProducts[index]["ppn"]) /
                100;
        }

        setData("products", updatedProducts);
    };

    const handleTotalInvoice = () => {
        let totalInvoice = 0;
        let totalPPN = 0;
        data.products.map((product) => {
            totalInvoice += product.total;
            totalPPN += product.total_ppn;
        });
        setData((data) => ({
            ...data,
            total: totalInvoice,
            total_all_ppn: totalPPN,
            rest_of_bill: totalInvoice + totalPPN - data.paid_off,
        }));
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();

        post("/invoice_generals", {
            onSuccess: () => {
                showSuccess("Tambah");
                window.location = BASE_URL + "/invoice_generals";
                // reset("name", "category", "price", "unit", "description");
            },

            onError: () => {
                showError("Tambah");
            },
        });
    };

    return (
        <>
            <Head title="Invoice Umum"></Head>
            <Toast ref={toast} />
            <div className="h-screen max-h-screen overflow-y-hidden">
                <div className="flex flex-col h-screen max-h-screen overflow-hidden md:flex-row z-40 relative gap-5">
                    <div className="md:w-[30%] overflow-y-auto h-screen max-h-screen p-5">
                        <Card>
                            <div className="flex justify-between items-center mb-4">
                                <h1 className="font-bold text-2xl">
                                    Invoice Umum
                                </h1>
                                <Link href="/invoice_generals">
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
                                    <Dropdown
                                        value={data.partner}
                                        dataKey="id"
                                        onChange={(e) => {
                                            setData("partner", {
                                                ...data.partner,
                                                id: e.target.value.id,
                                                name: e.target.value.name,
                                                province:
                                                    e.target.value.province,
                                                regency: e.target.value.regency,
                                                number: e.target.value
                                                    .phone_number,
                                                pic: e.target.value.pics[0]
                                                    .name,
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
                                    <label htmlFor="number">
                                        Nomor Telepon *
                                    </label>
                                    <InputText
                                        value={data.partner.number}
                                        onChange={(e) =>
                                            setData("partner", {
                                                ...data.partner,
                                                number: e.target.value,
                                            })
                                        }
                                        className="dark:bg-gray-300"
                                        id="number"
                                        aria-describedby="number-help"
                                        onFocus={() => {
                                            triggerInputFocus(
                                                animatePartnerNumberRef
                                            );
                                        }}
                                        onBlur={() => {
                                            stopAnimateInputFocus(
                                                animatePartnerNumberRef
                                            );
                                        }}
                                        keyfilter="int"
                                    />
                                </div>

                                <div className="flex flex-col mt-3">
                                    <label htmlFor="province">Provinsi *</label>

                                    <Dropdown
                                        dataKey="name"
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
                                        dataKey="name"
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
                                        valueTemplate={selectedOptionTemplate}
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
                                            triggerInputFocus(animateDateRef);
                                        }}
                                        onShow={() => {
                                            triggerInputFocus(animateDateRef);
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
                                            setData("due_date", e.target.value);
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
                                        // onBlur={() => {
                                        //     let rest_of_bill =
                                        //         data.rest_of_bill -
                                        //         data.paid_off;
                                        //     setData((data) => ({
                                        //         ...data,
                                        //         rest_of_bill: rest_of_bill,
                                        //     }));
                                        // }}
                                        defaultValue={0}
                                        className="dark:bg-gray-300"
                                        id="partner_address"
                                        aria-describedby="partner_address-help"
                                        locale="id-ID"
                                    />
                                </div>

                                {/* <div className="flex flex-col mt-3">
                                    <label htmlFor="rest_of_bill">
                                        Sisa Tagihan *
                                    </label>
                                    <InputNumber
                                        value={data.rest_of_bill}
                                        onChange={(e) =>
                                            setData("rest_of_bill", e.value)
                                        }
                                        defaultValue={0}
                                        className="dark:bg-gray-300"
                                        id="partner_address"
                                        aria-describedby="partner_address-help"
                                        locale="id-ID"
                                    />
                                </div> */}

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
                                        onShow={() => {
                                            triggerInputFocus(
                                                animatePaymentMetodeRef
                                            );
                                        }}
                                        onHide={() => {
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
                                        valueTemplate={selectedOptionTemplate}
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

                                <div className="flex flex-col mt-3">
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
                        onHide={() => {
                            setDialogVisible(false);
                            handleTotalInvoice();
                        }}
                        footer={dialogFooterTemplate}
                    >
                        <div className="flex my-5 gap-3">
                            <Button
                                label="Pilih Produk"
                                icon="pi pi-external-link"
                                className="text-xs md:text-base"
                                onClick={() => setDialogProductVisible(true)}
                            />
                            <Button
                                label="Tambah Produk"
                                icon="pi pi-plus"
                                className="text-xs md:text-base"
                                onClick={() => {
                                    let inputNew = {
                                        name: "",
                                        price: 0,
                                        quantity: 1,
                                        description: null,
                                        total: 0,
                                        ppn: 0,
                                        total_ppn: 0,
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
                                    className="flex  w-full max-h-full gap-5 mt-2 items-center"
                                    key={product + index}
                                >
                                    <div>
                                        <Badge value={no} size="large"></Badge>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="partner_address">
                                            Produk *
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

                                    <div className="flex flex-col">
                                        <label htmlFor="partner_address">
                                            Deskripsi *
                                        </label>
                                        <InputText
                                            value={product.description}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    index,
                                                    "description",
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
                                                Harga Satuan *
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
                                                defaultValue={0}
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
                                                value={product.quantity}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        "quantity",
                                                        e.value
                                                    )
                                                }
                                                defaultValue={1}
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
                                                Jumlah Harga *
                                            </label>
                                            <InputNumber
                                                value={product.total}
                                                onChange={(e) => {
                                                    handleInputChange(
                                                        index,
                                                        "total",
                                                        e.value
                                                    );
                                                }}
                                                defaultValue={0}
                                                className="dark:bg-gray-300"
                                                id="partner_address"
                                                aria-describedby="partner_address-help"
                                                locale="id-ID"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="flex flex-col">
                                            <label htmlFor="partner_address">
                                                Pajak (%) *
                                            </label>
                                            <InputNumber
                                                onChange={(e) => {
                                                    handleInputChange(
                                                        index,
                                                        "ppn",
                                                        e.value
                                                    );
                                                }}
                                                defaultValue={0}
                                                value={product.ppn}
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
                                                Pajak *
                                            </label>
                                            <InputNumber
                                                onChange={(e) => {
                                                    handleInputChange(
                                                        index,
                                                        "total_ppn",
                                                        e.value
                                                    );
                                                }}
                                                value={product.total_ppn}
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
                                                    products: updatedProducts,
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
                            onHide={() => {
                                setDialogProductVisible(false);
                            }}
                            footer={() => dialogFooterTemplate("product")}
                        >
                            <DataTable
                                value={products}
                                paginator
                                filters={filters}
                                rows={5}
                                header={header}
                                scrollable
                                scrollHeight="flex"
                                tableStyle={{ minWidth: "50rem" }}
                                selectionMode={rowClick ? null : "checkbox"}
                                // onSelectionChange={(e) => {
                                //     setData("products", e.value);
                                // }}
                                selection={selectedProducts}
                                onSelectionChange={(e) => {
                                    setSelectedProducts(e.value);
                                }}
                                dataKey="id"
                            >
                                <Column
                                    selectionMode="multiple"
                                    headerStyle={{ width: "3rem" }}
                                ></Column>
                                <Column
                                    field="name"
                                    header="Name"
                                    style={{ minWidth: "5rem" }}
                                ></Column>
                                <Column
                                    field="category"
                                    header="Kategori"
                                    style={{ minWidth: "5rem" }}
                                ></Column>
                                <Column
                                    field="price"
                                    header="Harga"
                                    style={{ minWidth: "5rem" }}
                                ></Column>
                                <Column
                                    field="description"
                                    header="Deskripsi"
                                    style={{ minWidth: "5rem" }}
                                ></Column>
                            </DataTable>
                        </Dialog>
                    </Dialog>

                    <div className="md:w-[70%] hidden md:block text-sm h-screen max-h-screen overflow-y-auto p-5">
                        <header>
                            <div className="flex justify-between items-center">
                                <div className="w-full flex flex-col text-xs text-purple-700">
                                    <img
                                        src="/assets/img/cazh.png"
                                        alt=""
                                        className="float-left w-[40%] h-[40%]"
                                    />

                                    <p className="mt-3">
                                        PT CAZH TEKNOLOGI INOVASI
                                    </p>
                                    <div className="leading-2 mt-2 w-[80%]">
                                        Bonavida Park D1, Jl. Raya
                                        Karanggintung, Sumbang Banyumas, Jawa
                                        Tengah, 53183 | hello@cazh.id
                                    </div>
                                </div>
                                <div className="w-full text-right text-xs">
                                    <h1 className="font-bold text-3xl text-purple-800">
                                        INVOICE
                                    </h1>

                                    <p className="mt-4">{data.code}</p>
                                    <p ref={animateDateRef}>
                                        Tanggal{" "}
                                        {formatDate(data.date) ??
                                            "{{Tanggal Invoice}}"}
                                    </p>
                                    <p ref={animateDueDateRef}>
                                        Jatuh Tempo{" "}
                                        {formatDate(data.due_date) ??
                                            "{{Jatuh Tempo}}"}
                                    </p>
                                </div>
                            </div>
                        </header>

                        <div className="mt-5" ref={partnerScrollRef}>
                            <h1>Ditagihkan Kepada:</h1>
                            <h1
                                className="font-bold mt-3"
                                ref={animatePartnerNameRef}
                            >
                                {data.partner.name ?? "{{partner}}"}
                            </h1>

                            <h1 className="mt-2">
                                di{" "}
                                <span ref={animatePartnerRegencyRef}>
                                    {data.partner.regency
                                        ? JSON.parse(data.partner.regency).name
                                        : "{{kabupaten}}"}
                                </span>
                                {", "}
                                <span ref={animatePartnerProvinceRef}>
                                    {data.partner.province
                                        ? JSON.parse(data.partner.province).name
                                        : "{{provinsi}}"}
                                </span>
                            </h1>
                            <h1 ref={animatePartnerNumberRef}>
                                {data.partner.number ?? "{{nomor hp partner}}"}
                            </h1>
                        </div>

                        <div className="w-full mt-5">
                            <table className="w-full border">
                                <thead className="bg-purple-800 text-white text-center border">
                                    <th className="p-1 border ">Produk</th>
                                    <th className="p-1 border">Deskripsi</th>
                                    <th className="p-1 border">Kuantitas</th>
                                    <th className="p-1 border">Harga Satuan</th>
                                    <th className="p-1 border">Jumlah Harga</th>
                                    <th className="p-1 border">Pajak</th>
                                </thead>
                                <tbody>
                                    {data.products?.length == 0 && (
                                        <tr className="text-center border">
                                            <td colSpan={6}>
                                                Produk belum ditambah
                                            </td>
                                        </tr>
                                    )}
                                    {data.products?.map((data, i) => {
                                        return (
                                            <tr
                                                key={data.name + i}
                                                className="border p-1"
                                            >
                                                <td className="border p-1">
                                                    {data.name}
                                                </td>
                                                <td className="border p-1">
                                                    {data.description}
                                                </td>
                                                <td className="border p-1 text-center">
                                                    {data.quantity}
                                                </td>
                                                <td className="border p-1 text-right">
                                                    Rp
                                                    {data.price
                                                        ? data.price.toLocaleString(
                                                              "id-ID"
                                                          )
                                                        : 0}
                                                </td>
                                                <td className="border p-1 text-right">
                                                    Rp
                                                    {data.total
                                                        ? data.total.toLocaleString(
                                                              "id-ID"
                                                          )
                                                        : 0}
                                                </td>
                                                <td className="border p-1 text-right">
                                                    Rp
                                                    {data.total_ppn
                                                        ? data.total_ppn.toLocaleString(
                                                              "id-ID"
                                                          )
                                                        : 0}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-5">
                            <div className="w-full flex justify-end">
                                <div className="w-[35%]">
                                    <div className="flex gap-1">
                                        <p className="w-[50%] text-right">
                                            Total Harga
                                        </p>
                                        <p className="text-right w-full">
                                            Rp
                                            {data.total.toLocaleString(
                                                "id-ID"
                                            ) ?? 0}
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        <p className="w-[50%] text-right">
                                            Pajak
                                        </p>
                                        <p className="text-right w-full">
                                            Rp
                                            {data.total_all_ppn.toLocaleString(
                                                "id-ID"
                                            ) ?? 0}
                                        </p>
                                    </div>
                                    <div className="flex gap-1 mt-5">
                                        <p className="w-[50%] text-right">
                                            Terbayar
                                        </p>
                                        <div className="w-full">
                                            <p className="text-right w-full">
                                                Rp
                                                {data.paid_off
                                                    ? data.paid_off.toLocaleString(
                                                          "id-ID"
                                                      )
                                                    : 0}
                                            </p>
                                            <hr className="h-[2px] bg-gray-500" />
                                        </div>
                                    </div>
                                    <div className="flex gap-1 font-bold mt-5">
                                        <p className="w-[50%] text-right">
                                            Sisa Tagihan
                                        </p>
                                        <p className="text-right w-full">
                                            Rp
                                            {data.rest_of_bill.toLocaleString(
                                                "id-ID"
                                            ) ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {data.total_all_ppn == 0 && (
                            <div className="mt-16 w-full">
                                <h1 className="font-bold underline">Catatan</h1>
                                <p className="w-1/2">
                                    Pajak akan ditanggung dan dibayarkan oleh
                                    lembaga secara mandiri.
                                </p>
                            </div>
                        )}

                        <div
                            ref={animatePaymentMetodeRef}
                            className="flex w-full mt-10 justify-between items-center"
                        >
                            <div className="w-[50%] leading-6">
                                {data.payment_metode === "payment link" && (
                                    <div>
                                        <h1 className="font-bold underline">
                                            Payment Link:
                                        </h1>
                                        <p>
                                            Pembayaran online* via link berikut:
                                        </p>
                                        <p>
                                            <a
                                                className="text-blue-500"
                                                href={data.xendit_link}
                                            >
                                                {data.xendit_link ?? "{{link}}"}
                                            </a>
                                        </p>
                                        <p className="text-xs mt-1">
                                            *melalui m-Banking, ATM, QRIS,
                                            Minimarket dll.
                                        </p>
                                    </div>
                                )}
                                {data.payment_metode === "cazhbox" && (
                                    <div>
                                        <h1 className="font-bold underline">
                                            Payment:
                                        </h1>
                                        <p>
                                            Pembayaran akan dilakukan dengan
                                            mengurangi <b>CazhBOX</b> lembaga
                                            Anda.
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div
                                className="flex flex-col text-center justify-start w-[30%]"
                                ref={animateSignatureNameRef}
                            >
                                <p>{formatDateSignature()}</p>
                                <img
                                    src={
                                        BASE_URL +
                                        "/storage/" +
                                        data.signature.image
                                    }
                                    alt=""
                                />
                                <p>{data.signature.name}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white h-screen z-10 w-full absolute top-0 left-0"></div>
            </div>
        </>
    );
};

export default Create;
