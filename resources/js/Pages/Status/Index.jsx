import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import DashboardLayout from "@/Layouts/DashboardLayout";
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
import { TabPanel, TabView } from "primereact/tabview";
import SkeletonDatatable from "@/Components/SkeletonDatatable";
import HeaderDatatable from "@/Components/HeaderDatatable";
import Modal from "@/Components/Modal";
import { ColorPicker } from "primereact/colorpicker";
import { Toast } from "primereact/toast";
import { RadioButton } from "primereact/radiobutton";
import InputError from "@/Components/InputError";

export default function Index({ auth }) {
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const [statuses, setStatuses] = useState(null);
    const [deleteMode, setDeleteMode] = useState("soft");
    const [arsip, setArsip] = useState(null);
    const [confirmIsVisible, setConfirmIsVisible] = useState();
    const [isLoadingData, setIsLoadingData] = useState(false);
    const toast = useRef(null);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [modalStatusIsVisible, setModalStatusIsVisible] = useState(false);
    const [modalEditStatusIsVisible, setModalEditStatusIsVisible] =
        useState(false);
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
        clearErrors,
    } = useForm({
        id: "",
        uuid: "",
        name: "",
        category: "",
        color: "",
    });

    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const getStatuses = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/status");
        let data = await response.json();

        setStatuses((prev) => data);

        setIsLoadingData(false);
    };

    const getArsip = async () => {
        setIsLoadingData(true);
        let response = await fetch("/api/status/arsip");
        let data = await response.json();

        setArsip((prev) => data);

        setIsLoadingData(false);
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

    useEffect(() => {
        fetchData(getStatuses);
    }, []);

    useEffect(() => {
        if (activeIndexTab == 0) {
            fetchData(getStatuses);
        } else if (activeIndexTab == 2) {
            fetchData(getArsip);
        }
    }, [activeIndexTab]);

    let categories = [{ name: "lead" }, { name: "partner" }];
    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };
    const actionBodyTemplate = (rowData, type = null) => {
        return (
            <React.Fragment>
                {type == "arsip"
                    ? permissions.includes("hapus produk") && (
                          <>
                              <Button
                                  icon="pi pi-replay"
                                  rounded
                                  outlined
                                  severity="success"
                                  className="mr-2"
                                  onClick={() => {
                                      handleRestoreStatus(rowData);
                                  }}
                              />
                              <Button
                                  icon="pi pi-trash"
                                  rounded
                                  outlined
                                  severity="danger"
                                  onClick={() => {
                                      handleDeleteStatus(rowData, "force");
                                  }}
                              />
                          </>
                      )
                    : permissions.includes("edit produk") && (
                          <>
                              <Button
                                  icon="pi pi-pencil"
                                  rounded
                                  outlined
                                  className="mr-2"
                                  onClick={() => handleEditStatus(rowData)}
                              />
                              <Button
                                  icon="pi pi-trash"
                                  rounded
                                  outlined
                                  severity="danger"
                                  onClick={() => {
                                      handleDeleteStatus(rowData, "soft");
                                  }}
                              />
                          </>
                      )}
            </React.Fragment>
        );
    };

    const handleEditStatus = (status) => {
        setData({
            ...data,
            uuid: status.uuid,
            name: status.name,
            category: status.category,
            color: status.color,
        });
        clearErrors();
        setModalEditStatusIsVisible(true);
    };

    const handleRestoreStatus = (status) => {
        confirmDialog({
            message: "Apakah Anda yakin mengembalikan data ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                put("status/" + status.uuid + "/restore", {
                    onSuccess: () => {
                        getArsip();
                        showSuccess("Hapus");
                    },
                    onError: () => {
                        showError("Hapus");
                    },
                });
            },
        });
    };

    const accept = () => {
        if (deleteMode == "force") {
            destroy("status/" + data.uuid + "/force", {
                onSuccess: () => {
                    getArsip();
                    showSuccess("Hapus");
                    reset();
                },
                onError: () => {
                    showError("Hapus");
                },
            });
        } else {
            destroy("status/" + data.uuid, {
                onSuccess: () => {
                    getStatuses();
                    showSuccess("Hapus");
                    reset();
                },
                onError: () => {
                    showError("Hapus");
                },
            });
        }
    };
    const handleDeleteStatus = (status, type = null) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: () => {
                setDeleteMode(type);
                setData("uuid", status.uuid);
                setConfirmIsVisible(true);
            },
        });
    };

    const headerStatus = () => {
        return (
            <HeaderDatatable
                globalFilterValue={globalFilterValue}
                onGlobalFilterChange={onGlobalFilterChange}
            >
                <Button
                    label="Tambah"
                    className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                    icon={addButtonIcon}
                    onClick={() => {
                        setModalStatusIsVisible((prev) => (prev = true));
                        reset();
                        clearErrors();
                    }}
                    aria-controls="popup_menu_right"
                    aria-haspopup
                />
            </HeaderDatatable>
        );
    };
    const headerArsip = () => {
        return (
            <HeaderDatatable
                globalFilterValue={globalFilterValue}
                onGlobalFilterChange={onGlobalFilterChange}
            ></HeaderDatatable>
        );
    };

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

    const handleSubmitForm = (e, type) => {
        e.preventDefault();
        if (type === "tambah") {
            post("/status", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalStatusIsVisible((prev) => false);
                    getStatuses();
                    reset();
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            put("/status/" + data.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditStatusIsVisible((prev) => false);
                    getStatuses();
                    reset();
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
    };

    if (preRenderLoad) {
        return <SkeletonDatatable auth={auth} />;
    }

    return (
        <DashboardLayout auth={auth.user} className="">
            <ConfirmDialog />
            <ConfirmDialog2
                group="declarative"
                visible={confirmIsVisible}
                onHide={() => setConfirmIsVisible(false)}
                message="Konfirmasi kembali jika anda yakin!"
                header="Konfirmasi kembali"
                icon="pi pi-info-circle"
                accept={accept}
            />
            <Toast ref={toast} />
            <TabView
                activeIndex={activeIndexTab}
                onTabChange={(e) => {
                    setActiveIndexTab(e.index);
                }}
            >
                <TabPanel header="Status">
                    {/* Modal tambah status */}
                    <Modal
                        header="Status"
                        modalVisible={modalStatusIsVisible}
                        setModalVisible={setModalStatusIsVisible}
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
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="category">Kategori</label>
                                    <Dropdown
                                        key="name"
                                        editable
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
                                    <label htmlFor="color">Warna</label>
                                    <div className="flex gap-1">
                                        <InputText
                                            value={data.color}
                                            onChange={(e) =>
                                                setData("color", e.value)
                                            }
                                            className="w-full md:w-14rem dark:bg-gray-300"
                                            placeholder="warna..."
                                        />

                                        <ColorPicker
                                            format="hex"
                                            value={data.color}
                                            onChange={(e) =>
                                                setData("color", e.value)
                                            }
                                        />
                                    </div>
                                    <InputError
                                        message={errors.color}
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
                    </Modal>

                    {/* Modal edit status */}
                    <Modal
                        header="Status"
                        modalVisible={modalEditStatusIsVisible}
                        setModalVisible={setModalEditStatusIsVisible}
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
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="category">Kategori</label>
                                    <Dropdown
                                        key="name"
                                        editable
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
                                    <label htmlFor="color">Warna</label>
                                    <div className="flex gap-1">
                                        <InputText
                                            value={data.color}
                                            onChange={(e) =>
                                                setData("color", e.value)
                                            }
                                            className="w-full md:w-14rem dark:bg-gray-300"
                                            placeholder="warna..."
                                        />

                                        <ColorPicker
                                            format="hex"
                                            value={data.color}
                                            onChange={(e) =>
                                                setData("color", e.value)
                                            }
                                        />
                                    </div>
                                    <InputError message={errors.color} />
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
                    </Modal>

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
                                emptyMessage="Status tidak ditemukan."
                                paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                                header={headerStatus}
                                globalFilterFields={["name", "category"]}
                                value={statuses}
                                dataKey="id"
                            >
                                <Column
                                    field="uuid"
                                    hidden
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    header="Nama"
                                    align="left"
                                    style={{
                                        width: "max-content",
                                        whiteSpace: "nowrap",
                                    }}
                                ></Column>
                                <Column
                                    field="name"
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    header="Nama"
                                    align="left"
                                    style={{
                                        width: "max-content",
                                        whiteSpace: "nowrap",
                                    }}
                                ></Column>
                                <Column
                                    field="category"
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    header="Kategori"
                                    align="left"
                                    style={{
                                        width: "max-content",
                                        whiteSpace: "nowrap",
                                    }}
                                ></Column>
                                <Column
                                    field="color"
                                    className="dark:border-none"
                                    headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                    align="left"
                                    header="Warna"
                                    body={(rowData) => {
                                        return (
                                            <div
                                                className={`h-5 p-4 w-10 rounded-md `}
                                                style={{
                                                    backgroundColor: `#${rowData.color}`,
                                                }}
                                            ></div>
                                        );
                                    }}
                                    style={{
                                        width: "max-content",
                                        whiteSpace: "nowrap",
                                    }}
                                ></Column>

                                <Column
                                    header="Aksi"
                                    body={actionBodyTemplate}
                                    style={{
                                        width: "max-content",
                                        whiteSpace: "nowrap",
                                    }}
                                    className="dark:border-none"
                                    headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                ></Column>
                            </DataTable>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="Log">
                    <p className="m-0">
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium, totam rem
                        aperiam, eaque ipsa quae ab illo inventore veritatis et
                        quasi architecto beatae vitae dicta sunt explicabo. Nemo
                        enim ipsam voluptatem quia voluptas sit aspernatur aut
                        odit aut fugit, sed quia consequuntur magni dolores eos
                        qui ratione voluptatem sequi nesciunt. Consectetur,
                        adipisci velit, sed quia non numquam eius modi.
                    </p>
                </TabPanel>
                <TabPanel header="Arsip">
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
                                emptyMessage="Status tidak ditemukan."
                                paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                                header={headerArsip}
                                globalFilterFields={["name", "category"]}
                                value={arsip}
                                dataKey="id"
                            >
                                <Column
                                    field="uuid"
                                    hidden
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    header="Nama"
                                    align="left"
                                    style={{
                                        width: "max-content",
                                        whiteSpace: "nowrap",
                                    }}
                                ></Column>
                                <Column
                                    field="name"
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    header="Nama"
                                    align="left"
                                    style={{
                                        width: "max-content",
                                        whiteSpace: "nowrap",
                                    }}
                                ></Column>
                                <Column
                                    field="category"
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                    header="Kategori"
                                    align="left"
                                    style={{
                                        width: "max-content",
                                        whiteSpace: "nowrap",
                                    }}
                                ></Column>
                                <Column
                                    field="color"
                                    className="dark:border-none"
                                    headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                    align="left"
                                    header="Warna"
                                    body={(rowData) => {
                                        return (
                                            <div
                                                className={`h-5 p-4 w-10 rounded-md `}
                                                style={{
                                                    backgroundColor: `#${rowData.color}`,
                                                }}
                                            ></div>
                                        );
                                    }}
                                    style={{
                                        width: "max-content",
                                        whiteSpace: "nowrap",
                                    }}
                                ></Column>

                                <Column
                                    header="Aksi"
                                    body={(rowData) =>
                                        actionBodyTemplate(rowData, "arsip")
                                    }
                                    style={{
                                        width: "max-content",
                                        whiteSpace: "nowrap",
                                    }}
                                    className="dark:border-none"
                                    headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                ></Column>
                            </DataTable>
                        </div>
                    </div>
                </TabPanel>
            </TabView>

            {/* <HeaderModule title="Produk">
                {permissions.includes("tambah produk") && (
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalStatusIsVisible((prev) => (prev = true));
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
            </HeaderModule> */}
        </DashboardLayout>
    );
}
