import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import DashboardLayout from "@/Layouts/DashboardLayout";
import HeaderModule from "@/Components/HeaderModule";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { useForm } from "@inertiajs/react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Skeleton } from "primereact/skeleton";
import { InputNumber } from "primereact/inputnumber";

export default function Index({ auth }) {
    const [products, setProducts] = useState("");
    const [isLoadingData, setIsLoadingData] = useState(false);
    const dummyArray = Array.from({ length: 5 }, (v, i) => i);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [modalProductIsVisible, setModalProductIsVisible] = useState(false);
    const [modalEditProductIsVisible, setModalEditProductIsVisible] =
        useState(false);
    const toast = useRef(null);
    const modalProduct = useRef(null);
    const { roles, permissions } = auth.user;
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

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
        id: "",
        name: "",
        category: "",
        price: "",
        unit: "",
        description: "",
    });

    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const getProducts = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/products");
        let data = await response.json();

        setProducts((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([getProducts()]);
                setIsLoadingData(false);
                setPreRenderLoad((prev) => (prev = false));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    let categories = [{ name: "Produk" }, { name: "Layanan" }];
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {permissions.includes("edit produk") && (
                    <Button
                        icon="pi pi-pencil"
                        rounded
                        outlined
                        className="mr-2"
                        onClick={() => handleEditProduct(rowData)}
                    />
                )}
                {permissions.includes("hapus produk") && (
                    <Button
                        icon="pi pi-trash"
                        rounded
                        outlined
                        severity="danger"
                        onClick={() => {
                            handleDeleteProduct(rowData);
                        }}
                    />
                )}
            </React.Fragment>
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

    const handleEditProduct = (product) => {
        setData((data) => ({ ...data, uuid: product.uuid }));
        setData((data) => ({ ...data, name: product.name }));
        setData((data) => ({ ...data, category: product.category }));
        setData((data) => ({ ...data, price: product.price }));
        setData((data) => ({ ...data, unit: product.unit }));
        setData((data) => ({ ...data, description: product.description }));
        setModalEditProductIsVisible(true);
    };

    const handleDeleteProduct = (product) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroy("products/" + product.uuid, {
                    onSuccess: () => {
                        getProducts();
                        showSuccess("Hapus");
                    },
                    onError: () => {
                        showError("Hapus");
                    },
                });
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
            post("/products", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalProductIsVisible((prev) => false);
                    getProducts();
                    reset("name", "category", "price", "unit", "description");
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            put("/products/" + data.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditProductIsVisible((prev) => false);
                    getProducts();
                    reset("name", "category", "price", "unit", "description");
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
    };

    if (preRenderLoad) {
        return (
            <>
                <DashboardLayout auth={auth.user} className="">
                    <div className="card my-5">
                        <DataTable
                            value={dummyArray}
                            className="p-datatable-striped dark:bg-slate-900"
                            pt={{
                                bodyRow:
                                    "dark:bg-transparent bg-transparent dark:text-gray-300",
                                table: "dark:bg-transparent bg-white dark:text-gray-300",
                                header: "dark:bg-transparent",
                            }}
                        >
                            <Column
                                style={{ width: "25%" }}
                                body={<Skeleton />}
                                headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                            ></Column>
                            <Column
                                style={{ width: "25%" }}
                                body={<Skeleton />}
                                headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                            ></Column>
                            <Column
                                style={{ width: "25%" }}
                                body={<Skeleton />}
                                headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                            ></Column>
                            <Column
                                style={{ width: "25%" }}
                                body={<Skeleton />}
                                headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
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

            <HeaderModule title="Produk">
                {permissions.includes("tambah produk") && (
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalProductIsVisible((prev) => (prev = true));
                            reset(
                                "name",
                                "category",
                                "price",
                                "unit",
                                "description"
                            );
                        }}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                )}
            </HeaderModule>

            {/* Modal tambah produk */}
            <div className="card flex justify-content-center">
                <Dialog
                    ref={modalProduct}
                    header="Produk"
                    headerClassName="dark:glass shadow-md dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName=" dark:glass dark:text-white"
                    visible={modalProductIsVisible}
                    onHide={() => setModalProductIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitForm(e, "tambah")}>
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="name">Nama</label>
                                <InputText
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="name"
                                    aria-describedby="name-help"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="category">Kategori</label>
                                <Dropdown
                                    value={data.category}
                                    onChange={(e) =>
                                        setData("category", e.target.value)
                                    }
                                    options={categories}
                                    optionLabel="name"
                                    placeholder="Pilih Kategori"
                                    className="w-full md:w-14rem"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="price">Harga</label>
                                {/* <InputNumber id="price"  value={data.price} onValueChange={(e) => setData('price', e.target.value)} locale="id-ID" /> */}
                                <InputNumber
                                    value={data.price}
                                    onValueChange={(e) =>
                                        setData("price", e.target.value)
                                    }
                                    locale="id-ID"
                                />

                                {/* <InputText id="price" value={data.price} onChange={(e) => setData('price', e.target.value)}  aria-describedby="price-help" /> */}
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="unit">Unit</label>
                                <InputText
                                    className="dark:bg-gray-300"
                                    value={data.unit}
                                    onChange={(e) =>
                                        setData("unit", e.target.value)
                                    }
                                    id="unit"
                                    aria-describedby="unit-help"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="description">Description</label>
                                <InputTextarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    rows={5}
                                    cols={30}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center my-5">
                            <Button
                                label="Submit"
                                disabled={processing}
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>

            {/* Modal edit produk */}
            <div className="card flex justify-content-center">
                <Dialog
                    ref={modalProduct}
                    header="Produk"
                    headerClassName="dark:glass shadow-md dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName=" dark:glass dark:text-white"
                    visible={modalEditProductIsVisible}
                    onHide={() => setModalEditProductIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitForm(e, "update")}>
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="name">Nama</label>
                                <InputText
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="name"
                                    aria-describedby="name-help"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="category">Kategori</label>
                                <Dropdown
                                    optionValue="name"
                                    value={data.category}
                                    optionLabel="name"
                                    onChange={(e) =>
                                        setData("category", e.target.value)
                                    }
                                    options={categories}
                                    placeholder="Pilih Kategori"
                                    className="w-full md:w-14rem dark:bg-gray-300"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="price">Harga</label>
                                <InputNumber
                                    value={data.price}
                                    onValueChange={(e) =>
                                        setData("price", e.target.value)
                                    }
                                    locale="id-ID"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="unit">Unit</label>
                                <InputText
                                    className="dark:bg-gray-300"
                                    value={data.unit}
                                    onChange={(e) =>
                                        setData("unit", e.target.value)
                                    }
                                    id="unit"
                                    aria-describedby="unit-help"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="description">Description</label>
                                <InputTextarea
                                    className="dark:bg-gray-300"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    rows={5}
                                    cols={30}
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
                        filters={filters}
                        rows={5}
                        emptyMessage="Produk tidak ditemukan."
                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                        header={header}
                        globalFilterFields={["name", "category"]}
                        value={products}
                        dataKey="id"
                    >
                        <Column
                            header="No"
                            body={(_, { rowIndex }) => rowIndex + 1}
                            style={{ width: "5%" }}
                            className="dark:border-none pl-6"
                            headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                        />
                        <Column
                            field="uuid"
                            hidden
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Nama"
                            align="left"
                            style={{ width: "10%" }}
                        ></Column>
                        <Column
                            field="name"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Nama"
                            align="left"
                            style={{ width: "20%" }}
                        ></Column>
                        <Column
                            field="category"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Kategori"
                            align="left"
                            style={{ width: "10%" }}
                        ></Column>
                        <Column
                            field="price"
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Harga"
                            style={{ width: "10%" }}
                        ></Column>
                        <Column
                            field="unit"
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Unit"
                            style={{ width: "10%" }}
                        ></Column>
                        <Column
                            field="description"
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Deskripsi"
                            style={{ width: "40%" }}
                        ></Column>

                        <Column
                            header="Action"
                            body={actionBodyTemplate}
                            style={{ minWidth: "12rem" }}
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                        ></Column>
                    </DataTable>
                </div>
            </div>
        </DashboardLayout>
    );
}
