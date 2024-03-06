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
import { ProgressSpinner } from "primereact/progressspinner";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Index({ auth, memosDefault }) {
    const [memos, setMemos] = useState(memosDefault);
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

    const getMemos = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/memo");
        let data = await response.json();

        setMemos((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([getMemos()]);
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
                {permissions.includes("edit memo") && (
                    <Button
                        icon="pi pi-pencil"
                        rounded
                        outlined
                        className="mr-2"
                        onClick={() =>
                            (window.location = "/memo/" + rowData.uuid)
                        }
                    />
                )}
                {permissions.includes("hapus memo") && (
                    <Button
                        icon="pi pi-trash"
                        rounded
                        outlined
                        severity="danger"
                        onClick={() => {
                            handleDeleteMemo(rowData);
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

    const handleDeleteMemo = (memo) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroy("memo/" + memo.uuid, {
                    onSuccess: () => {
                        getMemos();
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

    const handleSelectedDetailPartner = (partner) => {
        const newUrl = `/partners?uuid=${partner.uuid}`;
        window.location = newUrl;
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

            <HeaderModule title="Memo Deviasi Harga">
                {permissions.includes("tambah memo") && (
                    <Link
                        href="/memo/create"
                        className="bg-purple-600 block text-white py-2 px-3 font-semibold text-sm shadow-md rounded-lg mr-2"
                    >
                        <i
                            className="pi pi-plus"
                            style={{ fontSize: "0.7rem", paddingRight: "5px" }}
                        ></i>
                        Tambah
                    </Link>
                )}
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
                        emptyMessage="Memo deviasi harga tidak ditemukan."
                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                        header={header}
                        value={memos}
                        globalFilterFields={["partner_name", "code", "date"]}
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
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            field="partner_name"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Lembaga"
                            body={(rowData) => {
                                {
                                    return rowData.partner_id == null ? (
                                        rowData.partner_name
                                    ) : (
                                        <button
                                            onClick={() =>
                                                handleSelectedDetailPartner(
                                                    rowData.partner
                                                )
                                            }
                                            className="hover:text-blue-700"
                                        >
                                            {rowData.partner.name}
                                        </button>
                                    );
                                }
                            }}
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            field="code"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Kode"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>

                        <Column
                            body={(rowData) => {
                                return new Date(
                                    rowData.date
                                ).toLocaleDateString("id");
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Tanggal"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>

                        <Column
                            field="price_card"
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Harga Kartu"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>

                        <Column
                            field="price_e_card"
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Harga E-Card"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>

                        <Column
                            field="price_subscription"
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Biaya Langganan"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>

                        <Column
                            field="consideration"
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Pertimbangan"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            body={(rowData) => {
                                return rowData.memo_doc == null ? (
                                    <ProgressSpinner
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                        }}
                                        strokeWidth="8"
                                        fill="var(--surface-ground)"
                                        animationDuration=".5s"
                                    />
                                ) : (
                                    <div className="flex w-full h-full items-center justify-center">
                                        <a
                                            href={
                                                BASE_URL +
                                                "/" +
                                                rowData.memo_doc
                                            }
                                            download={`${rowData.code}_${rowData.partner_name}`}
                                            class="font-bold  w-full h-full text-center rounded-full "
                                        >
                                            <i
                                                className="pi pi-file-pdf"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    fontSize: "1.5rem",
                                                }}
                                            ></i>
                                        </a>
                                    </div>
                                );
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Dokumen"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        {permissions.includes("hapus memo") &&
                            permissions.includes("edit memo") && (
                                <Column
                                    header="Action"
                                    body={actionBodyTemplate}
                                    style={{
                                        width: "max-content",
                                        whiteSpace: "nowrap",
                                    }}
                                    className="dark:border-none"
                                    headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                ></Column>
                            )}
                    </DataTable>
                </div>
            </div>
        </DashboardLayout>
    );
}
