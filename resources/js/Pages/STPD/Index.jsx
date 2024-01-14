import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import DashboardLayout from "@/Layouts/DashboardLayout";
import HeaderModule from "@/Components/HeaderModule";
import { InputText } from "primereact/inputtext";
import { useForm, usePage } from "@inertiajs/react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Skeleton } from "primereact/skeleton";
import { Link } from "@inertiajs/react";
import { FilterMatchMode } from "primereact/api";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Index({ auth, spdsDefault }) {
    const [spds, setSpds] = useState(spdsDefault);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const dummyArray = Array.from({ length: 5 }, (v, i) => i);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const toast = useRef(null);
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
        uuid: "",
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

    const getSpds = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/stpd");
        let data = await response.json();

        setSpds((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([getSpds()]);
                setIsLoadingData(false);
                setPreRenderLoad((prev) => (prev = false));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => (window.location = "/stpd/" + rowData.uuid)}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => {
                        handleDeleteProduct(rowData);
                    }}
                />
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

    const handleDeleteProduct = (stpd) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroy("stpd/" + stpd.uuid, {
                    onSuccess: () => {
                        getSpds();
                        showSuccess("Hapus");
                    },
                    onError: () => {
                        showError("Hapus");
                    },
                });
            },
        });
    };

    const header = (
        <div className=" flex flex-row justify-left gap-2 align-items-center items-end">
            <div className="w-[30%]">
                <span className="p-input-icon-left">
                    <i className="pi pi-search dark:text-white" />
                    <InputText
                        className="dark:bg-transparent dark:placeholder-white"
                        type="search"
                        onInput={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search..."
                    />
                </span>
            </div>
        </div>
    );

    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };

    if (preRenderLoad) {
        return (
            <>
                <DashboardLayout auth={auth.user} className="">
                    <div className="card my-5">
                        <DataTable
                            value={dummyArray}
                            className="p-datatable-striped"
                        >
                            <Column
                                style={{ width: "25%" }}
                                body={<Skeleton />}
                            ></Column>
                            <Column
                                style={{ width: "25%" }}
                                body={<Skeleton />}
                            ></Column>
                            <Column
                                style={{ width: "25%" }}
                                body={<Skeleton />}
                            ></Column>
                            <Column
                                style={{ width: "25%" }}
                                body={<Skeleton />}
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

            <HeaderModule title="Surat Perjalanan Dinas">
                <Link
                    href="/stpd/create"
                    className="bg-purple-600 block text-white py-2 px-3 font-semibold text-sm shadow-md rounded-lg mr-2"
                >
                    <i
                        className="pi pi-plus"
                        style={{ fontSize: "0.7rem", paddingRight: "5px" }}
                    ></i>
                    Tambah
                </Link>
            </HeaderModule>

            <div className="flex mx-auto flex-col justify-center mt-5 gap-5">
                <div className="card p-fluid w-full h-full flex justify-center rounded-lg">
                    <DataTable
                        loading={isLoadingData}
                        className="w-full h-auto rounded-lg dark:glass border-none text-center shadow-md"
                        pt={{
                            bodyRow:
                                "dark:bg-transparent bg-transparent dark:text-gray-300",
                            table: "dark:bg-transparent bg-white rounded-lg dark:text-gray-300",
                            header: "",
                        }}
                        paginator
                        filters={filters}
                        rows={5}
                        emptyMessage="Surat Perjalanan dinas tidak ditemukan."
                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                        header={header}
                        value={spds}
                        globalFilterFields={["institution", "code"]}
                        dataKey="id"
                    >
                        <Column
                            header="No"
                            body={(_, { rowIndex }) => rowIndex + 1}
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
                            style={{ width: "20%" }}
                        ></Column>
                        <Column
                            field="institution"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Lembaga"
                            align="left"
                            style={{ width: "20%" }}
                        ></Column>
                        <Column
                            field="code"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Kode"
                            align="left"
                            style={{ width: "20%" }}
                        ></Column>
                        <Column
                            field="location"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Alamat"
                            align="left"
                            style={{ width: "20%" }}
                        ></Column>
                        <Column
                            body={(rowData) => {
                                return new Date(
                                    rowData.departure_date
                                ).toLocaleDateString("id");
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Tanggal Berangkat"
                            style={{ width: "10%" }}
                        ></Column>
                        <Column
                            body={(rowData) => {
                                return new Date(
                                    rowData.return_date
                                ).toLocaleDateString("id");
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Tanggal Kembali"
                            style={{ width: "10%" }}
                        ></Column>
                        <Column
                            field="accommodation"
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Akomodasi"
                            style={{ width: "20%" }}
                        ></Column>
                        <Column
                            body={(rowData) => {
                                return (
                                    <a
                                        href={BASE_URL + "/" + rowData.stpd_doc}
                                        download={`Surat_Tugas_Perjalanan_Dinas_${rowData.institution}`}
                                        class="p-button font-bold text-center rounded-full block pi pi-file-pdf"
                                    ></a>
                                );
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Dokumen"
                            style={{ width: "5%" }}
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
