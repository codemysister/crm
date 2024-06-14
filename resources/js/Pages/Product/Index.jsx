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
import {
    ConfirmDialog,
    ConfirmDialog as ConfirmDialog2,
    confirmDialog,
    confirmDialog as confirmDialog2,
} from "primereact/confirmdialog";
import { InputNumber } from "primereact/inputnumber";
import getViewportSize from "@/Utils/getViewportSize";
import HeaderDatatable from "@/Components/HeaderDatatable";
import SkeletonDatatable from "@/Components/SkeletonDatatable";
import { OverlayPanel } from "primereact/overlaypanel";
import { TabPanel, TabView } from "primereact/tabview";
import { formateDate } from "@/Utils/formatDate";
import LogComponent from "@/Components/LogComponent";
import ArsipComponent from "@/Components/ArsipComponent";
import InputError from "@/Components/InputError";

export default function Index({ auth, usersProp }) {
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const [products, setProducts] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [users, setUsers] = useState(usersProp);
    const [selectedData, setSelectedStatus] = useState(null);
    const [confirmIsVisible, setConfirmIsVisible] = useState(false);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [modalProductIsVisible, setModalProductIsVisible] = useState(false);
    const [modalEditProductIsVisible, setModalEditProductIsVisible] =
        useState(false);
    const toast = useRef(null);
    const action = useRef(null);
    const viewportSize = getViewportSize();
    const isMobile = viewportSize.width < 992;
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
        patch,
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

    useEffect(() => {
        if (activeIndexTab == 0) {
            fetchData(getProducts);
        }
    }, [activeIndexTab]);

    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const fetchData = async (fnc) => {
        try {
            await Promise.all([fnc()]);
            setIsLoadingData(false);
            setPreRenderLoad((prev) => (prev = false));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
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
                <i
                    className="pi pi-ellipsis-h pointer cursor-pointer"
                    onClick={(event) => {
                        setSelectedStatus(rowData);
                        action.current.toggle(event);
                    }}
                ></i>
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

    const handleEdit = (product) => {
        setData((data) => ({ ...data, uuid: product.uuid }));
        setData((data) => ({ ...data, name: product.name }));
        setData((data) => ({ ...data, category: product.category }));
        setData((data) => ({ ...data, price: product.price }));
        setData((data) => ({ ...data, unit: product.unit }));
        setData((data) => ({ ...data, description: product.description }));
        setModalEditProductIsVisible(true);
    };

    const handleDelete = () => {
        destroy("products/" + selectedData.uuid, {
            onSuccess: () => {
                getProducts();
                showSuccess("Hapus");
            },
            onError: () => {
                showError("Hapus");
            },
        });
    };

    const confirmDelete = () => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: () => {
                setConfirmIsVisible(true);
            },
        });
    };

    const renderHeader = () => {
        return (
            <HeaderDatatable
                filters={filters}
                setFilters={setFilters}
            ></HeaderDatatable>
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
            patch("/products/" + data.uuid, {
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

    const columns = [
        {
            field: "name",
            header: "Nama",
            frozen: !isMobile,
            style: !isMobile
                ? {
                      width: "max-content",
                      whiteSpace: "nowrap",
                  }
                : null,
        },
        {
            field: "category",
            header: "Kategori",
            frozen: !isMobile,
            style: !isMobile
                ? {
                      width: "max-content",
                      whiteSpace: "nowrap",
                  }
                : null,
        },
        {
            field: "price",
            header: "Harga",
            frozen: !isMobile,
            style: !isMobile
                ? {
                      width: "max-content",
                      whiteSpace: "nowrap",
                  }
                : null,
            body: (rowData) => {
                return rowData.price.toLocaleString("id-ID");
            },
        },
        {
            field: "unit",
            header: "Unit",
            frozen: !isMobile,
            style: !isMobile
                ? {
                      width: "max-content",
                      whiteSpace: "nowrap",
                  }
                : null,
        },
        {
            field: "description",
            header: "Deskripsi",
            frozen: !isMobile,
            style: !isMobile
                ? {
                      width: "max-content",
                      whiteSpace: "nowrap",
                  }
                : null,
        },
    ];

    const objectKeyToIndo = (key) => {
        let keyIndo;
        if (key == "name") {
            keyIndo = "Nama";
        } else if (key == "category") {
            keyIndo = "Kategori";
        } else if (key == "price") {
            keyIndo = "Harga";
        } else if (key == "unit") {
            keyIndo = "Unit";
        } else if (key == "price") {
            keyIndo = "Harga";
        } else if (key == "description") {
            keyIndo = "Deskripsi";
        }

        return keyIndo;
    };

    const globalFilterFields = ["name", "category"];

    if (preRenderLoad) {
        return <SkeletonDatatable auth={auth} />;
    }

    return (
        <DashboardLayout auth={auth.user} className="">
            <Toast ref={toast} />
            {/* Tombol Aksi */}
            <OverlayPanel
                className=" shadow-md p-1 dark:bg-slate-900 dark:text-gray-300"
                ref={action}
            >
                <div className="flex flex-col flex-wrap w-full">
                    <Button
                        icon="pi pi-pencil"
                        label="edit"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            handleEdit(selectedData);
                        }}
                    />
                    <Button
                        icon="pi pi-trash"
                        label="hapus"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            confirmDelete();
                        }}
                    />
                </div>
            </OverlayPanel>

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

            <TabView
                activeIndex={activeIndexTab}
                onTabChange={(e) => {
                    setActiveIndexTab(e.index);
                }}
                className="mt-2"
            >
                <TabPanel header="Semua Produk">
                    {activeIndexTab == 0 && (
                        <>
                            <ConfirmDialog />
                            <ConfirmDialog2
                                group="declarative"
                                visible={confirmIsVisible}
                                onHide={() => setConfirmIsVisible(false)}
                                message="Konfirmasi kembali jika anda yakin!"
                                header="Konfirmasi kembali"
                                icon="pi pi-info-circle"
                                accept={handleDelete}
                            />

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
                                        rowsPerPageOptions={[5, 10, 25, 50]}
                                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                        currentPageReportTemplate="{first} - {last} dari {totalRecords}"
                                        filters={filters}
                                        rows={10}
                                        emptyMessage="Produk tidak ditemukan."
                                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                                        header={header}
                                        globalFilterFields={globalFilterFields}
                                        value={products}
                                        dataKey="id"
                                    >
                                        <Column
                                            header="Aksi"
                                            body={actionBodyTemplate}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                            frozen
                                            align="center"
                                            className="dark:border-none bg-white"
                                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                        ></Column>
                                        {columns.map((col) => {
                                            return (
                                                <Column
                                                    field={col.field}
                                                    header={col.header}
                                                    body={col.body}
                                                    style={col.style}
                                                    frozen={col.frozen}
                                                    align="left"
                                                    className="dark:border-none bg-white"
                                                    headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                                ></Column>
                                            );
                                        })}
                                        <Column
                                            field="created_at"
                                            className="dark:border-none bg-white lg:whitespace-nowrap lg:w-max"
                                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                            header="Tanggal Input"
                                            align="left"
                                            body={(rowData) => {
                                                return formateDate(
                                                    rowData.created_at
                                                );
                                            }}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>
                                        <Column
                                            field="created_by"
                                            className="dark:border-none bg-white lg:whitespace-nowrap lg:w-max"
                                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                            header="Diinput Oleh"
                                            align="left"
                                            body={(rowData) => {
                                                return rowData.created_by.name;
                                            }}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>
                                    </DataTable>
                                </div>
                            </div>
                        </>
                    )}
                </TabPanel>

                <TabPanel header="Log">
                    {activeIndexTab == 1 && (
                        <LogComponent
                            auth={auth}
                            fetchUrl={"/api/products/logs"}
                            filterUrl={"/products/logs/filter"}
                            deleteUrl={"/products/logs"}
                            objectKeyToIndo={objectKeyToIndo}
                            users={users}
                            showSuccess={showSuccess}
                            showError={showError}
                        />
                    )}
                </TabPanel>

                <TabPanel header="Arsip">
                    {activeIndexTab == 2 && (
                        <ArsipComponent
                            auth={auth}
                            users={users}
                            fetchUrl={"/api/products/arsip"}
                            forceDeleteUrl={"/products/{id}/force"}
                            restoreUrl={"/products/{id}/restore"}
                            filterUrl={"/products/arsip/filter"}
                            noFilter={true}
                            columns={columns}
                            showSuccess={showSuccess}
                            showError={showError}
                            globalFilterFields={globalFilterFields}
                        />
                    )}
                </TabPanel>
            </TabView>

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
                                <label htmlFor="name">Nama *</label>
                                <InputText
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="name"
                                    aria-describedby="name-help"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="category">Kategori *</label>
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
                                <InputError
                                    message={errors.category}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="price">Harga *</label>
                                {/* <InputNumber id="price"  value={data.price} onValueChange={(e) => setData('price', e.target.value)} locale="id-ID" /> */}
                                <InputNumber
                                    value={data.price}
                                    onValueChange={(e) =>
                                        setData("price", e.target.value)
                                    }
                                    locale="id-ID"
                                />
                                <InputError
                                    message={errors.price}
                                    className="mt-2"
                                />

                                {/* <InputText id="price" value={data.price} onChange={(e) => setData('price', e.target.value)}  aria-describedby="price-help" /> */}
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="unit">Unit *</label>
                                <InputText
                                    className="dark:bg-gray-300"
                                    value={data.unit}
                                    onChange={(e) =>
                                        setData("unit", e.target.value)
                                    }
                                    id="unit"
                                    aria-describedby="unit-help"
                                />
                                <InputError
                                    message={errors.unit}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="description">Deskripsi *</label>
                                <InputTextarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    rows={5}
                                    cols={30}
                                />
                                <InputError
                                    message={errors.description}
                                    className="mt-2"
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
                                <label htmlFor="name">Nama *</label>
                                <InputText
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="name"
                                    aria-describedby="name-help"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="category">Kategori *</label>
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
                                <InputError
                                    message={errors.category}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="price">Harga *</label>
                                <InputNumber
                                    value={data.price}
                                    onValueChange={(e) =>
                                        setData("price", e.target.value)
                                    }
                                    locale="id-ID"
                                />
                                <InputError
                                    message={errors.price}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="unit">Unit *</label>
                                <InputText
                                    className="dark:bg-gray-300"
                                    value={data.unit}
                                    onChange={(e) =>
                                        setData("unit", e.target.value)
                                    }
                                    id="unit"
                                    aria-describedby="unit-help"
                                />
                                <InputError
                                    message={errors.unit}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="description">Deskripsi *</label>
                                <InputTextarea
                                    className="dark:bg-gray-300"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    rows={5}
                                    cols={30}
                                />
                                <InputError
                                    message={errors.description}
                                    className="mt-2"
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
        </DashboardLayout>
    );
}
