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
import { Dialog } from "primereact/dialog";
import { OverlayPanel } from "primereact/overlaypanel";
import { ProgressSpinner } from "primereact/progressspinner";
import { Badge } from "primereact/badge";
import { MultiSelect } from "primereact/multiselect";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Message } from "primereact/message";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Index({ auth, invoiceGeneralProps, partnersProp }) {
    const [invoiceGenerals, setInvoiceGenerals] = useState(invoiceGeneralProps);
    const [partners, setPartners] = useState(partnersProp);
    const [invoiceProducts, setInvoiceProducts] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [modalTransactionIsVisible, setModalTransactionIsVisible] =
        useState(false);
    const [modalEditTransactionIsVisible, setModalEditTransactionIsVisible] =
        useState(false);

    const op = useRef(null);
    const dummyArray = Array.from({ length: 5 }, (v, i) => i);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const toast = useRef(null);
    const { roles, permissions } = auth.user;
    const [expandedRows, setExpandedRows] = useState(null);
    useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const signatures = [
        {
            name: "Muh Arif Mahfudin",
            position: "CEO",
            image: "/assets/img/signatures/ttd.png",
        },
    ];

    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const columns = [
        { field: "code", header: "Kode", type: "regular", width: "6rem" },
        { field: "date", header: "Tanggal", type: "date", width: "6rem" },
        {
            field: "due_date",
            header: "Jatuh Tempo",
            type: "date",
            width: "8rem",
        },
        {
            field: "partner_province",
            header: "Provinsi",
            type: "location",
            width: "8rem",
        },
        {
            field: "partner_regency",
            header: "Kabupaten",
            type: "location",
            width: "8rem",
        },
        {
            field: "partner_phone_number",
            header: "No Telepon",
            type: "regular",
            width: "6rem",
        },
        {
            field: "bill_date",
            header: "Tanggal Pembayaran",
            type: "date",
            width: "12rem",
        },
        { field: "total", header: "Total", type: "price", width: "8rem" },
        {
            field: "total_all_ppn",
            header: "Pajak",
            type: "price",
            width: "8rem",
        },
        {
            field: "total_final_with_ppn",
            header: "Total + Pajak",
            type: "price",
            width: "8rem",
        },
        {
            field: "paid_off",
            header: "Uang Muka",
            type: "price",
            width: "8rem",
        },
        {
            field: "rest_of_bill",
            header: "Sisa Tagihan (include uang muka)",
            type: "price",
            width: "16rem",
        },
        {
            field: "payment_metode",
            header: "Metode Pembayaran",
            type: "regular",
            width: "12rem",
        },
        {
            field: "xendit_link",
            header: "Link Xendit",
            type: "regular",
            width: "8rem",
        },
        {
            field: "reason_late",
            header: "Alasan Terlewat",
            type: "regular",
            width: "10rem",
        },
    ];
    const [visibleColumns, setVisibleColumns] = useState([
        { field: "code", header: "Kode", type: "regular", width: "6rem" },
        { field: "date", header: "Tanggal", type: "date", width: "6rem" },
        {
            field: "due_date",
            header: "Jatuh Tempo",
            type: "date",
            width: "8rem",
        },
        {
            field: "bill_date",
            header: "Tanggal Pembayaran",
            type: "date",
            width: "12rem",
        },
        { field: "total", header: "Total", type: "price", width: "8rem" },
        {
            field: "total_all_ppn",
            header: "Pajak",
            type: "price",
            width: "8rem",
        },
        {
            field: "total_final_with_ppn",
            header: "Total + Pajak",
            type: "price",
            width: "8rem",
        },
        {
            field: "paid_off",
            header: "Uang Muka",
            type: "price",
            width: "8rem",
        },
        {
            field: "rest_of_bill",
            header: "Sisa Tagihan (include uang muka)",
            type: "price",
            width: "16rem",
        },
        {
            field: "payment_metode",
            header: "Metode Pembayaran",
            type: "regular",
            width: "12rem",
        },
        {
            field: "xendit_link",
            header: "Link Xendit",
            type: "regular",
            width: "8rem",
        },
    ]);

    const handleSelectedDetailPartner = (partner) => {
        const newUrl = `/partners?uuid=${partner.uuid}`;
        window.location = newUrl;
    };

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
        invoice_general: null,
        partner: {
            id: null,
            name: null,
        },
        signature: {
            name: null,
            image: null,
        },
        date: null,
        nominal: null,
        money: null,
        payment_for: null,
        metode: null,
    });

    // handleSetDataTransaction = (data) => {
    //     setData((prev) => ({
    //         ...prev,
    //     }));
    // };

    const getInvoiceGenerals = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/invoice_generals");
        let data = await response.json();

        setInvoiceGenerals((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([getInvoiceGenerals()]);
                setIsLoadingData(false);
                setPreRenderLoad((prev) => (prev = false));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const convertRupiah = async (nominal) => {
        const options = {
            method: "GET",
            url: `/api/convert/rupiah?nominal=${nominal}`,
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const response = await axios.request(options);
            const converted = response.data;
            setData((data) => ({
                ...data,
                nominal: nominal,
                money: converted,
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const actionTransactionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => {
                        setModalEditTransactionIsVisible(true);
                        handleEditTransaction(rowData);
                    }}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => {
                        handleDeleteTransaction(rowData);
                    }}
                />
            </React.Fragment>
        );
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() =>
                        (window.location = "/invoice_generals/" + rowData.uuid)
                    }
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => {
                        handleDeleteInvoiceGeneral(rowData);
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

    const showError = (type, message) => {
        toast.current.show({
            severity: "error",
            summary: "Error",
            detail: message ?? `${type} data gagal`,
            life: 3000,
        });
    };

    const handleEditTransaction = (transaction) => {
        setData({
            uuid: transaction.uuid,
            invoice_general_id: transaction.invoice_general_id,
            partner: {
                id: transaction.partner_id,
                name: transaction.partner_name,
            },
            date: transaction.date,
            nominal: transaction.nominal,
            money: transaction.money,
            metode: transaction.metode,
            payment_for: transaction.payment_for,
            signature: {
                name: transaction.signature_name,
                image: transaction.signature_image,
            },
        });
    };

    const handleDeleteInvoiceGeneral = (invoice_general) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroy("invoice_generals/" + invoice_general.uuid, {
                    onSuccess: () => {
                        getInvoiceGenerals();
                        showSuccess("Hapus");
                    },
                    onError: () => {
                        showError("Hapus");
                    },
                });
            },
        });
    };
    const handleDeleteTransaction = (invoice_general) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroy(
                    "invoice_generals/transaction/" + invoice_general.uuid,
                    {
                        onSuccess: () => {
                            getInvoiceGenerals();
                            showSuccess("Hapus");
                        },
                        onError: () => {
                            showError("Hapus");
                        },
                    }
                );
            },
        });
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

    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };

    const optionSignatureTemplate = (item) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <img
                    className="w-3rem shadow-2 flex-shrink-0 border-round"
                    src={item.image}
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

    const items = [
        {
            label: "Update",
            icon: "pi pi-refresh",
            command: () => {
                toast.current.show({
                    severity: "success",
                    summary: "Updated",
                    detail: "Data Updated",
                });
            },
        },
        {
            label: "Delete",
            icon: "pi pi-times",
            command: () => {
                toast.current.show({
                    severity: "warn",
                    summary: "Delete",
                    detail: "Data Deleted",
                });
            },
        },
        {
            label: "React Website",
            icon: "pi pi-external-link",
            command: () => {
                window.location.href = "https://reactjs.org/";
            },
        },
        {
            label: "Upload",
            icon: "pi pi-upload",
            command: () => {
                //router.push('/fileupload');
            },
        },
    ];

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

    const headerTransaction = (
        <div className="flex flex-row gap-2 bg-gray-50 p-2 rounded-lg align-items-center items-center justify-between justify-content-between">
            <div className="w-[15%]">
                <Button
                    label="Input Pembayaran"
                    className="bg-purple-600 w-full text-xs shadow-md rounded-lg mr-2"
                    icon={addButtonIcon}
                    onClick={() => {
                        setModalTransactionIsVisible((prev) => (prev = true));
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
            </div>
        </div>
    );

    const allowExpansion = (rowData) => {
        return rowData.transactions.length >= 0;
    };

    const onRowExpand = (event) => {
        setData((prev) => ({
            ...prev,
            invoice_general: event.data.uuid,
            partner: {
                ...prev.partner,
                name: event.data.partner_name,
                id: event.data.partner.id,
            },
            rest_bill: event.data.rest_of_bill,
        }));
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="md:px-14 py-5">
                <div className="flex">
                    <DataTable
                        headerClassName="bg-red-500"
                        value={data.transactions}
                        className=""
                        header={headerTransaction}
                        emptyMessage="Transaksi tidak ditemukan."
                    >
                        <Column
                            header="No"
                            body={(_, { rowIndex }) => rowIndex + 1}
                            style={{ width: "1rem" }}
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        />
                        <Column
                            field="date"
                            header="Tanggal"
                            style={{ minWidth: "10rem" }}
                            body={(rowData) => {
                                return new Date(
                                    rowData.date
                                ).toLocaleDateString("id");
                            }}
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        ></Column>
                        <Column
                            field="nominal"
                            header="Nominal"
                            style={{ minWidth: "8rem" }}
                            body={(rowData) => {
                                return rowData.nominal.toLocaleString("id-ID");
                            }}
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        ></Column>
                        <Column
                            field="money"
                            header="Uang Terbilang"
                            style={{ minWidth: "10rem" }}
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        ></Column>
                        <Column
                            field="metode"
                            header="Metode"
                            style={{ minWidth: "8rem" }}
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        ></Column>
                        <Column
                            field="created_by"
                            header="Diinput Oleh"
                            style={{ minWidth: "8rem" }}
                            body={(rowData) => {
                                return rowData.user.name;
                            }}
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        ></Column>
                        <Column
                            body={(rowData) => {
                                return rowData.receipt_doc == "" ? (
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
                                                "/storage/" +
                                                rowData.receipt_doc
                                            }
                                            download={`Kwitansi_${rowData.partner_name}`}
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
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Dokumen"
                            style={{ minWidth: "2rem" }}
                        ></Column>
                        <Column
                            header="Action"
                            body={actionTransactionBodyTemplate}
                            style={{ minWidth: "12rem" }}
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        ></Column>
                    </DataTable>
                </div>
            </div>
        );
    };

    const handleSubmitForm = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            post("/invoice_generals/transaction", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalTransactionIsVisible((prev) => false);

                    getInvoiceGenerals();
                    reset(
                        "date",
                        "metode",
                        "money",
                        "nominal",
                        "payment_for",
                        "signature"
                    );
                },
                onError: (errors) => {
                    showError("Tambah", errors.error);
                },
            });
        } else {
            put("/invoice_generals/transaction/" + data.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditTransactionIsVisible((prev) => false);
                    getInvoiceGenerals();
                    reset(
                        "date",
                        "metode",
                        "money",
                        "nominal",
                        "payment_for",
                        "signature"
                    );
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
    };

    return (
        <DashboardLayout auth={auth.user} className="">
            <Toast ref={toast} />
            <ConfirmDialog />

            <HeaderModule title="Invoice Umum">
                <Link
                    href="/invoice_generals/create"
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
                            table: "dark:bg-transparent bg-white dark:text-gray-300",
                            header: "",
                        }}
                        paginator
                        filters={filters}
                        rows={5}
                        emptyMessage="Invoice Umum tidak ditemukan."
                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                        header={header}
                        globalFilterFields={["partner.name", "code", "status"]}
                        value={invoiceGenerals}
                        dataKey="id"
                        expandedRows={expandedRows}
                        onRowToggle={(e) => {
                            setExpandedRows(e.data);
                        }}
                        rowExpansionTemplate={rowExpansionTemplate}
                        onRowExpand={onRowExpand}
                    >
                        <Column
                            expander={allowExpansion}
                            style={{ width: "1rem" }}
                        />

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
                        {/* <Column
                            field="code"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Kode"
                            align="left"
                            style={{ minWidth: "8rem" }}
                        ></Column> */}
                        <Column
                            header="Status"
                            body={(rowData) => {
                                return (
                                    <Badge
                                        value={rowData.status}
                                        className="text-white"
                                        severity={
                                            rowData.status == "lunas"
                                                ? "success"
                                                : null ||
                                                  rowData.status == "sebagian"
                                                ? "info"
                                                : null ||
                                                  rowData.status ==
                                                      "belum terbayar"
                                                ? "warning"
                                                : null ||
                                                  rowData.status == "telat"
                                                ? "danger"
                                                : null
                                        }
                                    ></Badge>
                                );
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{ minWidth: "8rem" }}
                        ></Column>
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
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        {visibleColumns.map((col) => (
                            <Column
                                key={col.field}
                                style={{ minWidth: col.width }}
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
                                            : "belum diisi";
                                    } else if (col.type === "price") {
                                        return rowData[col.field]
                                            ? rowData[col.field].toLocaleString(
                                                  "id"
                                              )
                                            : 0;
                                    }
                                    return rowData[col.field];
                                }}
                            />
                        ))}

                        {/* <Column
                            field="date"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Tanggal"
                            body={(rowData) => {
                                return new Date(
                                    rowData.date
                                ).toLocaleDateString("id");
                            }}
                            align="left"
                            style={{ minWidth: "5rem" }}
                        ></Column>
                        <Column
                            field="due_date"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Jatuh Tempo"
                            body={(rowData) => {
                                return new Date(
                                    rowData.due_date
                                ).toLocaleDateString("id");
                            }}
                            align="left"
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        <Column
                            field="bill_date"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Tanggal Terbayar"
                            body={(rowData) => {
                                return rowData.bill_date
                                    ? new Date(
                                          rowData.bill_date
                                      ).toLocaleDateString("id")
                                    : "belum terbayar";
                            }}
                            align="left"
                            style={{ minWidth: "10rem" }}
                        ></Column> */}

                        <Column
                            field="invoice_age"
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Umur Invoice"
                            body={(rowData) => {
                                return rowData.invoice_age + " hari";
                            }}
                            style={{ minWidth: "8rem" }}
                        ></Column>

                        <Column
                            field="products"
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Produk"
                            body={(rowData) => {
                                return (
                                    <Button
                                        label="List"
                                        className="p-0 underline bg-transparent text-blue-700 text-left"
                                        onClick={(e) => {
                                            op.current.toggle(e);
                                            setInvoiceProducts(
                                                (prev) =>
                                                    (prev = rowData.products)
                                            );
                                        }}
                                        model={items}
                                        aria-controls="popup_menu_right"
                                        aria-haspopup
                                    />
                                );
                            }}
                            style={{ minWidth: "5rem" }}
                        ></Column>

                        <Column
                            body={(rowData) => {
                                return rowData.invoice_general_doc == "" ? (
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
                                                "/storage/" +
                                                rowData.invoice_general_doc
                                            }
                                            download={`Invoice_Umum_${rowData.partner_name}`}
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
                            style={{ minWidth: "2rem" }}
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

            <OverlayPanel
                className="w-[95%] md:max-w-[50%]"
                ref={op}
                showCloseIcon
            >
                <DataTable
                    value={invoiceProducts}
                    className="my-4 overflow-x-auto w-full"
                    emptyMessage="Produk tidak ditemukan."
                >
                    <Column
                        header="No"
                        body={(_, { rowIndex }) => rowIndex + 1}
                        style={{ width: "1rem" }}
                        className="dark:border-none"
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    />
                    <Column
                        field="name"
                        header="Produk"
                        style={{ minWidth: "10rem" }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="price"
                        header="Harga"
                        style={{ minWidth: "8rem" }}
                        body={(rowData) => {
                            return rowData.price.toLocaleString("id-ID");
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="quantity"
                        header="Kuantitas"
                        style={{ minWidth: "8rem" }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="total"
                        header="Total Harga"
                        style={{ minWidth: "8rem" }}
                        body={(rowData) => {
                            return rowData.total.toLocaleString("id-ID");
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="ppn"
                        header="PPN (%)"
                        style={{ minWidth: "8rem" }}
                        body={(rowData) => {
                            return rowData.ppn + "%";
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="total_ppn"
                        header="PPN"
                        style={{ minWidth: "8rem" }}
                        body={(rowData) => {
                            return rowData.total_ppn.toLocaleString("id-ID");
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                </DataTable>
            </OverlayPanel>

            {/* Modal tambah transaksi */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Input Pembayaran"
                    headerClassName="dark:glass shadow-md dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName=" dark:glass dark:text-white"
                    visible={modalTransactionIsVisible}
                    onHide={() => setModalTransactionIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitForm(e, "tambah")}>
                        <div className="flex flex-col mt-3">
                            <div className="flex bg-purple-600 text-white text-xs p-3 rounded-lg justify-between w-full h-full">
                                <p>Sisa tagihan</p>
                                <p className="font-semibold">
                                    Rp{" "}
                                    {data.rest_bill
                                        ? data.rest_bill.toLocaleString("id-ID")
                                        : 0}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="date">Tanggal *</label>
                            <Calendar
                                value={data.date ? new Date(data.date) : null}
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setData("date", e.target.value);
                                }}
                                showIcon
                                dateFormat="dd-mm-yy"
                                className={`w-full md:w-14rem ${
                                    errors.date && "p-invalid"
                                }`}
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="money">Diterima Dari *</label>

                            <Dropdown
                                value={data.partner}
                                dataKey="id"
                                onChange={(e) => {
                                    setData("partner", {
                                        ...data.partner,
                                        id: e.target.value.id,
                                        name: e.target.value.name,
                                    });
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
                        <div className="flex flex-col justify-around mt-3">
                            <label htmlFor="nominal">Nominal *</label>
                            <InputNumber
                                value={data.nominal}
                                onValueChange={(e) => {
                                    convertRupiah(e.value);
                                }}
                                defaultValue={0}
                                className="dark:bg-gray-300"
                                id="nominal"
                                aria-describedby="nominal-help"
                                locale="id-ID"
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="money">Uang Terbilang *</label>
                            <InputText
                                value={data.money}
                                onChange={(e) =>
                                    setData("money", e.target.value)
                                }
                                className="dark:bg-gray-300"
                                id="money"
                                aria-describedby="money-help"
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="payment_for">
                                Pembayaran Untuk *
                            </label>
                            <InputText
                                value={data.payment_for}
                                onChange={(e) =>
                                    setData("payment_for", e.target.value)
                                }
                                className="dark:bg-gray-300"
                                id="payment_for"
                                aria-describedby="payment_for-help"
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="metode">Metode *</label>
                            <Dropdown
                                value={data.metode}
                                onChange={(e) =>
                                    setData("metode", e.target.value)
                                }
                                options={[
                                    { name: "Tunai" },
                                    { name: "Cazhbox" },
                                    { name: "Transfer Bank" },
                                ]}
                                optionLabel="name"
                                placeholder="Pilih Status"
                                className="w-full md:w-14rem"
                                editable
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="signature">Tanta tangan *</label>
                            <Dropdown
                                value={data.signature}
                                onChange={(e) => {
                                    setData("signature", {
                                        ...data.signature,
                                        name: e.target.value.name,
                                        position: e.target.value.position,
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
                            />
                        </div>
                        <div className="flex justify-center my-5">
                            <Button
                                label="Submit"
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>

            {/* Modal update transaksi */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Edit Input Pembayaran"
                    headerClassName="dark:glass shadow-md dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName=" dark:glass dark:text-white"
                    visible={modalEditTransactionIsVisible}
                    onHide={() => setModalEditTransactionIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitForm(e, "update")}>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="date">Tanggal *</label>
                            <Calendar
                                value={data.date ? new Date(data.date) : null}
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setData("date", e.target.value);
                                }}
                                showIcon
                                dateFormat="dd-mm-yy"
                                className={`w-full md:w-14rem ${
                                    errors.date && "p-invalid"
                                }`}
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="money">Diterima Dari *</label>

                            <Dropdown
                                value={data.partner}
                                dataKey="id"
                                onChange={(e) => {
                                    setData("partner", {
                                        ...data.partner,
                                        id: e.target.value.id,
                                        name: e.target.value.name,
                                    });
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
                        <div className="flex flex-col justify-around mt-3">
                            <label htmlFor="nominal">Nominal *</label>
                            <InputNumber
                                value={data.nominal}
                                onValueChange={(e) => {
                                    convertRupiah(e.value);
                                }}
                                defaultValue={0}
                                className="dark:bg-gray-300"
                                id="nominal"
                                aria-describedby="nominal-help"
                                locale="id-ID"
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="money">Uang Terbilang *</label>
                            <InputText
                                value={data.money}
                                onChange={(e) =>
                                    setData("money", e.target.value)
                                }
                                className="dark:bg-gray-300"
                                id="money"
                                aria-describedby="money-help"
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="payment_for">
                                Pembayaran Untuk *
                            </label>
                            <InputText
                                value={data.payment_for}
                                onChange={(e) =>
                                    setData("payment_for", e.target.value)
                                }
                                className="dark:bg-gray-300"
                                id="payment_for"
                                aria-describedby="payment_for-help"
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="metode">Metode *</label>
                            <Dropdown
                                value={data.metode}
                                onChange={(e) =>
                                    setData("metode", e.target.value)
                                }
                                options={[
                                    { name: "Tunai" },
                                    { name: "Cazhbox" },
                                    { name: "Transfer Bank" },
                                ]}
                                optionLabel="name"
                                placeholder="Pilih Status"
                                className="w-full md:w-14rem"
                                editable
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="signature">Tanta tangan *</label>
                            <Dropdown
                                value={data.signature}
                                onChange={(e) => {
                                    setData("signature", {
                                        ...data.signature,
                                        name: e.target.value.name,
                                        position: e.target.value.position,
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
                            />
                        </div>
                        <div className="flex justify-center my-5">
                            <Button
                                label="Submit"
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
