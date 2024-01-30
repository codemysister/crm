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
import { MultiSelect } from "primereact/multiselect";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Index({ auth }) {
    const [mous, setMous] = useState();
    const [isLoadingData, setIsLoadingData] = useState(false);
    const dummyArray = Array.from({ length: 5 }, (v, i) => i);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const toast = useRef(null);
    const { roles, permissions } = auth.user;
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const columns = [
        { field: "partner_name", header: "Partner" },
        { field: "code", header: "Kode" },
        { field: "partner_pic", header: "PIC" },
        { field: "partner_pic_position", header: "Jabatan PIC" },
        { field: "partner_address", header: "Lokasi" },
        { field: "url_subdomain", header: "Url Subdomain" },
        { field: "price_card", header: "Harga Kartu" },
        { field: "price_lanyard", header: "Harga Lanyard" },
        {
            field: "price_subscription_system",
            header: "Harga Langganan Sistem",
        },
        { field: "period_subscription", header: "Langganan Per-" },
        { field: "price_training_offline", header: "Harga Training Offline" },
        { field: "price_training_online", header: "Harga Training Online" },
        { field: "fee_purchase_cazhpoin", header: "Isi Kartu via CazhPOIN" },
        { field: "fee_bill_cazhpoin", header: "Bayar Tagihan via CazhPOIN" },
        { field: "fee_topup_cazhpos", header: "Topup Kartu via CazhPos" },
        {
            field: "fee_withdraw_cazhpos",
            header: "Withdraw Kartu via Cazh POS",
        },
        {
            field: "fee_bill_saldokartu",
            header: "Bayar Tagihan via Saldo Kartu",
        },
        {
            field: "bank",
            header: "Bank",
        },
        {
            field: "account_bank_number",
            header: "Nomor Rekening",
        },
        {
            field: "expired_date",
            header: "Tanggal Kadaluarsa",
        },
        {
            field: "profit_sharing",
            header: "Bagi Hasil",
        },
    ];
    const [visibleColumns, setVisibleColumns] = useState([
        { field: "partner_name", header: "Partner" },
        { field: "code", header: "Kode" },
        { field: "partner_pic", header: "PIC" },
        { field: "partner_pic_position", header: "Jabatan PIC" },
        { field: "partner_address", header: "Lokasi" },
        { field: "url_subdomain", header: "Url Subdomain" },
    ]);

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

    const getMous = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/mou");
        let data = await response.json();

        setMous((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([getMous()]);
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
                    onClick={() => (window.location = "/mou/" + rowData.uuid)}
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

    const handleDeleteProduct = (mou) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroy("mou/" + mou.uuid, {
                    onSuccess: () => {
                        getMous();
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

    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };

    const onColumnToggle = (event) => {
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter((col) =>
            selectedColumns.some((sCol) => sCol.field === col.field)
        );

        setVisibleColumns(orderedSelectedColumns);
    };

    const header = (
        <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex w-full sm:w-[30%] flex-row justify-left gap-2 align-items-center items-end">
                <div className="w-full">
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
            <MultiSelect
                value={visibleColumns}
                options={columns}
                optionLabel="header"
                onChange={onColumnToggle}
                className="w-full sm:w-[30%] p-0"
                display="chip"
            />
        </div>
    );

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

            <HeaderModule title="Mou">
                <Link
                    href="/mou/create"
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
                    {/* <DataTable
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
                        emptyMessage="Surat penawaran harga tidak ditemukan."
                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                        header={renderHeader}
                        value={mous}
                        globalFilterFields={["partner", "sales"]}
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
                        ></Column>
                        <Column
                            field="partner_name"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Lembaga"
                            align="left"
                            style={{ minWidth: "10rem" }}
                        ></Column>
                        <Column
                            field="code"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Kode"
                            align="left"
                        ></Column>
                        <Column
                            field="partner_pic"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="PIC"
                            align="left"
                            style={{ minWidth: "10rem" }}
                        ></Column>
                        <Column
                            field="partner_pic_position"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Jabatan PIC"
                            align="left"
                            style={{ minWidth: "10rem" }}
                        ></Column>
                        <Column
                            field="partner_address"
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Alamat"
                            style={{ minWidth: "10rem" }}
                        ></Column>
                        <Column
                            field="url_subdomain"
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="URL subdomain"
                            style={{ minWidth: "12rem" }}
                        ></Column>

                        <Column
                            body={(rowData) => {
                                return rowData.spd_doc == "" ? (
                                    "dokumen sedang dibuat"
                                ) : (
                                    <a
                                        href={BASE_URL + "/" + rowData.sph_doc}
                                        download={`Surat_Tugas_Perjalanan_Dinas_${rowData.partner_name}`}
                                        class="p-button font-bold text-center rounded-full block pi pi-file-pdf"
                                    ></a>
                                );
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Dokumen"
                        ></Column>
                        <Column
                            field="created_by"
                            body={(rowData) => {
                                return rowData.user.name;
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Dibuat Oleh"
                            style={{ minWidth: "10rem" }}
                        ></Column>
                        <Column
                            header="Action"
                            body={actionBodyTemplate}
                            style={{ minWidth: "12rem" }}
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                        ></Column>
                    </DataTable> */}

                    <DataTable
                        value={mous}
                        header={header}
                        tableStyle={{ minWidth: "50rem" }}
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
                        emptyMessage="MOU tidak ditemukan."
                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                        globalFilterFields={["partner", "sales"]}
                        dataKey="id"
                    >
                        <Column
                            header="No"
                            body={(_, { rowIndex }) => rowIndex + 1}
                            className="dark:border-none pl-6"
                            headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                        />
                        {visibleColumns.map((col) => (
                            <Column
                                key={col.field}
                                style={{ minWidth: "10rem" }}
                                field={col.field}
                                header={col.header}
                                body={(rowData) => {
                                    if (col.field === "expired_date") {
                                        return new Date(
                                            rowData.expired_date
                                        ).toLocaleDateString("id");
                                    } else if (col.field === "profit_sharing") {
                                        return rowData.profit_sharing === 0
                                            ? "Tidak"
                                            : "Ya";
                                    } else if (col.field === "register_date") {
                                        return new Date(
                                            rowData.register_date
                                        ).toLocaleDateString("id");
                                    } else {
                                        return rowData[col.field];
                                    }
                                }}
                            />
                        ))}
                        <Column
                            body={(rowData) => {
                                return rowData.spd_doc == "" ? (
                                    "dokumen sedang dibuat"
                                ) : (
                                    <a
                                        href={BASE_URL + "/" + rowData.sph_doc}
                                        download={`Surat_Tugas_Perjalanan_Dinas_${rowData.partner_name}`}
                                        class="p-button font-bold text-center rounded-full block pi pi-file-pdf"
                                    ></a>
                                );
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Dokumen"
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
