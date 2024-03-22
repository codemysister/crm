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
import { Message } from "primereact/message";
import { Badge } from "primereact/badge";
import HeaderModule from "@/Components/HeaderModule";
import { Menu } from "primereact/menu";
import { OverlayPanel } from "primereact/overlaypanel";
import Arsip from "./Arsip";
import Log from "./Log";

export default function Index({ auth }) {
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const [statuses, setStatuses] = useState(null);
    const [confirmIsVisible, setConfirmIsVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const toast = useRef(null);
    const action = useRef(null);
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
        patch,
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

    useEffect(() => {
        if (activeIndexTab == 0) {
            fetchData(getStatuses);
        }
    }, [activeIndexTab]);

    const getStatuses = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/status");
        let data = await response.json();

        setStatuses((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            setPreRenderLoad((prev) => (prev = false));
            await getLog();
        };

        fetchData();
    }, []);

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

    let categories = [{ name: "lead" }, { name: "partner" }];

    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };

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

    const handleDeleteStatus = () => {
        destroy("status/" + selectedStatus.uuid, {
            onSuccess: () => {
                getStatuses();
                showSuccess("Hapus");
                reset();
            },
            onError: () => {
                showError("Hapus");
            },
        });
    };

    const confirmDeleteStatus = () => {
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

    const headerStatus = () => {
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
                    setActiveIndexTab((prev) => (prev = 0));
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            patch("/status/" + data.uuid, {
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
            {/* Tombol Aksi */}
            <OverlayPanel
                className=" shadow-md p-1 dark:bg-slate-900 dark:text-gray-300"
                ref={action}
            >
                <div className="flex flex-col flex-wrap w-full">
                    <Button
                        icon="pi pi-trash"
                        label="hapus"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            confirmDeleteStatus();
                        }}
                    />
                    <Button
                        icon="pi pi-pencil"
                        label="edit"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            handleEditStatus(selectedStatus);
                        }}
                    />
                </div>
            </OverlayPanel>

            <HeaderModule title="Status">
                {/* {permissions.includes("tambah produk") && ( */}
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
                {/* )} */}
            </HeaderModule>

            <Toast ref={toast} />

            <TabView
                activeIndex={activeIndexTab}
                onTabChange={(e) => {
                    setActiveIndexTab(e.index);
                }}
                className="mt-2"
            >
                <TabPanel header="Status">
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
                                accept={handleDeleteStatus}
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
                                        emptyMessage="Status tidak ditemukan."
                                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                                        header={headerStatus}
                                        globalFilterFields={[
                                            "name",
                                            "category",
                                        ]}
                                        value={statuses}
                                        dataKey="id"
                                    >
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
                                                        className={`h-full w-10 rounded-md `}
                                                        style={{
                                                            backgroundColor: `#${rowData.color}`,
                                                            height: "22.5px",
                                                        }}
                                                    ></div>
                                                );
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
                        <Log
                            auth={auth}
                            showSuccess={showSuccess}
                            showError={showError}
                        />
                    )}
                </TabPanel>

                <TabPanel header="Arsip">
                    {activeIndexTab == 2 && (
                        <Arsip
                            auth={auth}
                            showSuccess={showSuccess}
                            showError={showError}
                        />
                    )}
                </TabPanel>
            </TabView>

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
                                    onChange={(e) => setData("color", e.value)}
                                    className="w-full md:w-14rem dark:bg-gray-300"
                                    placeholder="warna..."
                                />

                                <ColorPicker
                                    format="hex"
                                    value={data.color}
                                    onChange={(e) => setData("color", e.value)}
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
                                    onChange={(e) => setData("color", e.value)}
                                    className="w-full md:w-14rem dark:bg-gray-300"
                                    placeholder="warna..."
                                />

                                <ColorPicker
                                    format="hex"
                                    value={data.color}
                                    onChange={(e) => setData("color", e.value)}
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
        </DashboardLayout>
    );
}
