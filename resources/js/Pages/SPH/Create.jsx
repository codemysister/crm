import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "jspdf-autotable";
import { Dialog } from "primereact/dialog";
import { Head, useForm } from "@inertiajs/react";
import { Calendar } from "primereact/calendar";
import { useRef } from "react";
import { FilterMatchMode } from "primereact/api";
import { Dropdown } from "primereact/dropdown";
import React from "react";
import { Toast } from "primereact/toast";
import { Badge } from "primereact/badge";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Create = ({
    usersDefault,
    partnersDefault,
    salesDefault,
    productsDefault,
}) => {
    const [users, setUsers] = useState(usersDefault);
    const [partners, setPartners] = useState(partnersDefault);
    const [sales, setSales] = useState(salesDefault);
    const [products, setProducts] = useState(productsDefault);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogProductVisible, setDialogProductVisible] = useState(false);
    const [rowClick, setRowClick] = useState(true);
    const toast = useRef(null);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const signatures = [
        {
            name: "Muh Arif Mahfudin",
            position: "CEO",
            signature: "/assets/img/signatures/ttd.png",
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
        )}/CAZH-SPJ/X/${new Date().getFullYear()}`,
        products: [],
        partner: {
            id: "",
            name: "",
            pic: "",
            address: "",
        },
        sales: {
            name: "",
            wa: "",
            address: "",
        },
        created_by: "",
        signature: {
            name: "",
            position: "",
            signature: "",
        },
    });

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

    const ubahFormatTanggal = (tanggal) => {
        if (!tanggal) {
            return "N/A";
        }
        let tanggalAngka = tanggal.getDate();
        let bulanAngka = tanggal.getMonth() + 1;
        let tahunAngka = tanggal.getFullYear();

        let bulanFormat = bulanAngka < 10 ? "0" + bulanAngka : bulanAngka;
        let tahunFormat = tahunAngka;

        let formatTanggal =
            tanggalAngka + "/" + bulanFormat + "/" + tahunFormat;

        return formatTanggal;
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
                    src={item.signature}
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
                window.location = BASE_URL + "/sph";
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
                        <Card title="Surat Penawaran Harga">
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
                                        value={data.partner.name}
                                        onChange={(e) => {
                                            setData({
                                                ...data,
                                                partner: {
                                                    ...data.partner,
                                                    id: e.target.value.id,
                                                    name: e.target.value.name,
                                                    address:
                                                        e.target.value.address,
                                                    pic: e.target.value.pics[0]
                                                        .name,
                                                },
                                            });
                                        }}
                                        options={partners}
                                        optionLabel="name"
                                        placeholder="Pilih Lembaga"
                                        filter
                                        valueTemplate={selectedOptionTemplate}
                                        itemTemplate={optionTemplate}
                                        className="w-full md:w-14rem"
                                        editable
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="partner_address">
                                        Lokasi *
                                    </label>
                                    <InputText
                                        value={data.partner.address}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                partner: {
                                                    ...data.partner,
                                                    address: e.target.value,
                                                },
                                            })
                                        }
                                        className="dark:bg-gray-300"
                                        id="partner_address"
                                        aria-describedby="partner_address-help"
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="partner_pic">PIC *</label>
                                    <InputText
                                        value={data.partner.pic}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                partner: {
                                                    ...data.partner,
                                                    pic: e.target.value,
                                                },
                                            })
                                        }
                                        className="dark:bg-gray-300"
                                        id="partner_pic"
                                        aria-describedby="partner_pic-help"
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="sales">Sales *</label>
                                    <Dropdown
                                        value={data.sales.name}
                                        onChange={(e) => {
                                            setData({
                                                ...data,
                                                sales: {
                                                    ...data.sales,
                                                    name: e.target.value.name,
                                                    email: e.target.value.email,
                                                },
                                            });
                                        }}
                                        options={sales}
                                        optionLabel="name"
                                        placeholder="Pilih Sales"
                                        filter
                                        valueTemplate={selectedOptionTemplate}
                                        itemTemplate={optionTemplate}
                                        className="w-full md:w-14rem"
                                        editable
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="sales-whatsapp">
                                        Whatsapp Sales *
                                    </label>
                                    <InputText
                                        value={data.sales.wa}
                                        onChange={(e) => {
                                            setData({
                                                ...data,
                                                sales: {
                                                    ...data.sales,
                                                    wa: e.target.value,
                                                },
                                            });
                                        }}
                                        className="dark:bg-gray-300"
                                        id="sales-whatsapp"
                                        aria-describedby="sales-whatsapp-help"
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="sales-email">
                                        Email Sales *
                                    </label>
                                    <InputText
                                        value={data.sales.email}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                sales: {
                                                    ...data.sales,
                                                    email: e.target.value,
                                                },
                                            })
                                        }
                                        className="dark:bg-gray-300"
                                        id="sales-email"
                                        aria-describedby="sales-email-help"
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="signature">
                                        Tanda Tangan *
                                    </label>
                                    <Dropdown
                                        value={data.signature}
                                        onChange={(e) => {
                                            setData({
                                                ...data,
                                                signature: e.target.value,
                                            });
                                        }}
                                        options={signatures}
                                        optionLabel="name"
                                        placeholder="Pilih Tanda Tangan"
                                        filter
                                        valueTemplate={selectedOptionTemplate}
                                        itemTemplate={optionSignatureTemplate}
                                        className="w-full md:w-14rem"
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
                        onHide={() => setDialogVisible(false)}
                        footer={dialogFooterTemplate}
                    >
                        <div className="flex my-5 gap-3">
                            <Button
                                label="Tambah produk dari stock"
                                icon="pi pi-external-link"
                                onClick={() => setDialogProductVisible(true)}
                            />
                            <Button
                                label="Tambah Inputan Produk"
                                icon="pi pi-plus"
                                onClick={() => {
                                    let inputNew = {
                                        name: "",
                                        price: "",
                                        qty: "",
                                        detail: "",
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
                                    className="flex gap-5 items-center justify-center"
                                    key={product + index}
                                >
                                    <div>
                                        <Badge value={no} size="large"></Badge>
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
                                            <InputText
                                                value={product.price}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        "price",
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
                                                Kuantitas *
                                            </label>
                                            <InputText
                                                value={product.qty}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        "qty",
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
                                            <InputText
                                                value={product.total}
                                                className="dark:bg-gray-300"
                                                id="partner_address"
                                                aria-describedby="partner_address-help"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex">
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
                            onHide={() => setDialogProductVisible(false)}
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
                                onSelectionChange={(e) =>
                                    setSelectedProducts(e.value)
                                }
                                dataKey="id"
                            >
                                <Column
                                    selectionMode="multiple"
                                    headerStyle={{ width: "3rem" }}
                                ></Column>
                                <Column field="name" header="Name"></Column>
                                <Column
                                    field="category"
                                    header="Kategori"
                                ></Column>
                                <Column field="price" header="Harga"></Column>
                            </DataTable>
                        </Dialog>
                    </Dialog>

                    <div className="md:w-[60%] h-screen max-h-screen overflow-y-auto p-5">
                        <header>
                            <div className="flex justify-between items-center">
                                <div className="w-full">
                                    <img
                                        src="/assets/img/cazh.png"
                                        alt=""
                                        className="float-left w-1/2 h-1/2"
                                    />
                                </div>
                                <div className="w-full text-right">
                                    <h2 className="font-bold text-sm">
                                        PT CAZH TEKNOLOGI INOVASI
                                    </h2>
                                    <p className="text-xs ">
                                        Bonavida Park D1, Jl. Raya Karanggintung
                                    </p>
                                    <p className="text-xs">
                                        Kec. Sumbang, Kab. Banyumas,
                                    </p>
                                    <p className="text-xs">Jawa Tengah 53183</p>
                                    <p className="text-xs">hello@cazh.id</p>
                                </div>
                            </div>
                        </header>

                        <div className="text-center mt-5">
                            <h1 className="font-bold underline mx-auto">
                                SURAT PENAWARAN HARGA
                            </h1>
                            <p className="">Nomor : {data.code}</p>
                        </div>

                        <div className="mt-5">
                            <h1>Kepada Yth.</h1>
                            <h1 className="font-bold">{data.partner.pic}</h1>
                            <h1 className="font-bold">{data.partner.name}</h1>
                            <h1>di {data.partner.address}</h1>
                        </div>

                        <div className="mt-5">
                            <h1>Dengan Hormat</h1>
                        </div>

                        <div className="mt-5">
                            <h1>
                                Menindaklanjuti komunikasi yang telah dilakukan
                                oleh tim marketing kami {data.sales.name} dengan
                                perwakilan dari {data.partner.name}, dengan ini
                                kami sampaikan penawaran sebagai berikut:
                            </h1>
                        </div>

                        <div className="w-full mt-5">
                            <table className="w-full">
                                <thead className="bg-blue-100 text-left">
                                    <th className="pl-2">No</th>
                                    <th>Produk/Layanan</th>
                                    <th>Rincian</th>
                                    <th>Jumlah</th>
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
                                                <td className="pl-2">{++i}</td>
                                                <td>{data.name}</td>
                                                <td>{data.detail}</td>
                                                <td>{data.total}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-5">
                            <h1>
                                Untuk konfirmasi persetujuan silakan hubungi :
                            </h1>
                            <h1>
                                <b>{data.sales.name}</b> via WA :{" "}
                                <b>{data.sales.wa}</b>, email :{" "}
                                <b>{data.sales.email}</b>
                            </h1>
                        </div>

                        <div className="mt-5">
                            <h1>
                                Demikian surat penawaran harga ini kami
                                sampaikan dengan sesungguhnya. Atas perhatian
                                dan kerja sama yang baik, kami sampaikan terima
                                kasih.
                            </h1>
                        </div>

                        <div className="flex flex-col mt-5 justify-start w-[30%]">
                            <p>Purwokerto, {new Date().getFullYear()}</p>
                            <img
                                src={BASE_URL + data.signature.signature}
                                alt=""
                            />
                            <p>{data.signature.name}</p>
                            <p>{data.signature.position}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white h-screen z-10 w-full absolute top-0 left-0"></div>
            </div>
        </>
    );
};

export default Create;
