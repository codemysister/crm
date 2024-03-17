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
import { ProgressSpinner } from "primereact/progressspinner";
import { TieredMenu } from "primereact/tieredmenu";
import { OverlayPanel } from "primereact/overlaypanel";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Index({ auth }) {
    const [mous, setMous] = useState();
    const [pathMou, setPathMou] = useState({
        partner_name: null,
        code: null,
        word: null,
        pdf: null,
    });
    const [isLoadingData, setIsLoadingData] = useState(false);
    const dummyArray = Array.from({ length: 5 }, (v, i) => i);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const op = useRef(null);
    const toast = useRef(null);
    const { roles, permissions } = auth.user;
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const columns = [
        { field: "code", header: "Kode", width: "8rem", type: "regular" },
        { field: "day", header: "Hari", width: "6rem", type: "regular" },
        { field: "date", header: "Tanggal", width: "8rem", type: "date" },
        { field: "partner_pic", header: "PIC", width: "8rem", type: "regular" },
        {
            field: "partner_pic_position",
            header: "Jabatan PIC",
            width: "8rem",
            type: "regular",
        },
        {
            field: "partner_province",
            header: "Provinsi",
            width: "8rem",
            type: "location",
        },
        {
            field: "partner_regency",
            header: "Kabupaten",
            width: "8rem",
            type: "location",
        },
        {
            field: "url_subdomain",
            header: "Url Subdomain",
            width: "10rem",
            type: "regular",
        },
        {
            field: "price_card",
            header: "Harga Kartu",
            width: "8rem",
            type: "price",
        },
        {
            field: "price_lanyard",
            header: "Harga Lanyard",
            width: "8rem",
            type: "price",
        },
        {
            field: "price_subscription_system",
            header: "Harga Langganan Sistem",
            width: "12rem",
            type: "price",
        },
        {
            field: "period_subscription",
            header: "Langganan Per-",
            width: "8rem",
            type: "regular",
        },
        {
            field: "price_training_offline",
            header: "Harga Training Offline",
            width: "12rem",
            type: "price",
        },
        {
            field: "price_training_online",
            header: "Harga Training Online",
            width: "12rem",
            type: "price",
        },
        {
            field: "fee_purchase_cazhpoin",
            header: "Isi Kartu via CazhPOIN",
            width: "12rem",
            type: "price",
        },
        {
            field: "fee_bill_cazhpoin",
            header: "Bayar Tagihan via CazhPOIN",
            width: "12rem",
            type: "price",
        },
        {
            field: "fee_topup_cazhpos",
            header: "Topup Kartu via CazhPos",
            width: "12rem",
            type: "price",
        },
        {
            field: "fee_withdraw_cazhpos",
            header: "Withdraw Kartu via Cazh POS",
            width: "12rem",
            type: "price",
        },
        {
            field: "fee_bill_saldokartu",
            header: "Bayar Tagihan via Saldo Kartu",
            width: "12rem",
            type: "price",
        },
        {
            field: "bank",
            header: "Bank",
            width: "6rem",
            type: "regular",
        },
        {
            field: "account_bank_number",
            header: "Nomor Rekening",
            width: "10rem",
            type: "regular",
        },
        {
            field: "expired_date",
            header: "Tanggal Kadaluarsa",
            width: "10rem",
            type: "regular",
        },
        {
            field: "profit_sharing",
            header: "Bagi Hasil",
            width: "6rem",
            type: "boolean",
        },
    ];
    const [visibleColumns, setVisibleColumns] = useState([
        { field: "code", header: "Kode", width: "8rem", type: "regular" },
        { field: "date", header: "Tanggal", width: "8rem", type: "date" },
        { field: "partner_pic", header: "PIC", width: "8rem", type: "regular" },
        {
            field: "partner_pic_position",
            header: "Jabatan PIC",
            width: "8rem",
            type: "regular",
        },
        {
            field: "partner_province",
            header: "Provinsi",
            width: "8rem",
            type: "location",
        },
        {
            field: "partner_regency",
            header: "Kabupaten",
            width: "8rem",
            type: "location",
        },
        {
            field: "url_subdomain",
            header: "Url Subdomain",
            width: "10rem",
            type: "regular",
        },
        {
            field: "bank",
            header: "Bank",
            width: "6rem",
            type: "regular",
        },
        {
            field: "account_bank_number",
            header: "Nomor Rekening",
            width: "10rem",
            type: "regular",
        },
        {
            field: "expired_date",
            header: "Tanggal Kadaluarsa",
            width: "10rem",
            type: "regular",
        },
        {
            field: "profit_sharing",
            header: "Bagi Hasil",
            width: "7rem",
            type: "boolean",
        },
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
                {permissions.includes("edit mou") && (
                    <Button
                        icon="pi pi-pencil"
                        rounded
                        outlined
                        className="mr-2"
                        onClick={() =>
                            (window.location = "/mou/" + rowData.uuid)
                        }
                    />
                )}
                {permissions.includes("hapus mou") && (
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

    const handleSelectedDetailPartner = (partner) => {
        const newUrl = `/partners?uuid=${partner.uuid}`;
        window.location = newUrl;
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

            <HeaderModule title="Mou">
                {permissions.includes("tambah mou") && (
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
                )}
            </HeaderModule>

            <div className="flex mx-auto flex-col justify-center mt-5 gap-5">
                <div className="card p-fluid w-full h-full flex justify-center rounded-lg">
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
                        globalFilterFields={[
                            "partner.name",
                            "date",
                            "partner_province",
                            "partner_regency",
                            "code",
                            "url_subdomain",
                            "partner_pic",
                        ]}
                        dataKey="id"
                    >
                        <Column
                            header="No"
                            body={(_, { rowIndex }) => rowIndex + 1}
                            className="dark:border-none pl-6"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                            headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                        />

                        <Column
                            field="partner_name"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Lembaga"
                            body={(rowData) => (
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
                            )}
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>

                        {visibleColumns.map((col) => (
                            <Column
                                key={col.field}
                                style={{
                                    width: "max-content",
                                    whiteSpace: "nowrap",
                                }}
                                headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                                field={col.field}
                                header={col.header}
                                body={(rowData) => {
                                    if (col.type === "location") {
                                        return JSON.parse(rowData[col.field])
                                            .name;
                                    } else if (col.type === "date") {
                                        return rowData[col.field]
                                            ? new Date(
                                                  rowData[col.field]
                                              ).toLocaleDateString("id")
                                            : "-";
                                    } else if (col.type === "price") {
                                        return rowData[col.field]
                                            ? rowData[col.field].toLocaleString(
                                                  "id"
                                              )
                                            : 0;
                                    } else if (col.type === "boolean") {
                                        return rowData[col.field]
                                            ? "Ya"
                                            : "Tidak";
                                    }
                                    return rowData[col.field];
                                }}
                            />
                        ))}
                        <Column
                            body={(rowData) => {
                                return rowData.mou_doc_word === "" ? (
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
                                    <>
                                        <Button
                                            icon="pi pi-download                                            "
                                            className="rounded-lg bg-transparent text-black text-xs"
                                            onClick={(e) => {
                                                setPathMou({
                                                    ...pathMou,
                                                    partner_name:
                                                        rowData.partner_name,
                                                    code: rowData.code,
                                                    word: rowData.mou_doc_word,
                                                    pdf: rowData.mou_doc,
                                                });
                                                op.current.toggle(e);
                                            }}
                                        />
                                        {/* <OverlayPanel
                                            ref={op}
                                            className="shadow-md"
                                        >
                                            <div className="flex flex-col text-left">
                                                <span>
                                                    <a
                                                        href={
                                                            "/storage/" +
                                                            mou_doc_word
                                                        }
                                                        download={`MOU_${partner_name}`}
                                                        class="font-bold flex items-center gap-1 w-full h-full text-center rounded-full "
                                                    >
                                                        <i
                                                            className="pi pi-file-word"
                                                            style={{
                                                                fontSize:
                                                                    "1rem",
                                                            }}
                                                        ></i>
                                                        word
                                                    </a>
                                                </span>
                                                <hr className="my-1" />
                                                <span>
                                                    <a
                                                        href={"/" + mou_doc}
                                                        download={`MOU_${partner_name}`}
                                                        class="font-bold flex gap-1 items-center w-full h-full text-center rounded-full "
                                                    >
                                                        <i
                                                            className="pi pi-file-pdf"
                                                            style={{
                                                                fontSize:
                                                                    "1rem",
                                                            }}
                                                        ></i>
                                                        pdf
                                                    </a>
                                                </span>
                                            </div>
                                        </OverlayPanel> */}
                                    </>
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
                    </DataTable>

                    <OverlayPanel ref={op} className="shadow-md">
                        <div className="flex flex-col text-left">
                            <span>
                                <a
                                    href={"/storage/" + pathMou.word}
                                    download={`${pathMou.code}_${pathMou.partner_name}`}
                                    class="font-bold flex items-center gap-1 w-full h-full text-center rounded-full "
                                >
                                    <i
                                        className="pi pi-file-word"
                                        style={{
                                            fontSize: "1rem",
                                        }}
                                    ></i>
                                    word
                                </a>
                            </span>
                            <hr className="my-1" />
                            <span>
                                <a
                                    href={"/" + pathMou.pdf}
                                    download={`${pathMou.code}_${pathMou.partner_name}`}
                                    class="font-bold flex gap-1 items-center w-full h-full text-center rounded-full "
                                >
                                    <i
                                        className="pi pi-file-pdf"
                                        style={{
                                            fontSize: "1rem",
                                        }}
                                    ></i>
                                    pdf
                                </a>
                            </span>
                        </div>
                    </OverlayPanel>
                </div>
            </div>
        </DashboardLayout>
    );
}
