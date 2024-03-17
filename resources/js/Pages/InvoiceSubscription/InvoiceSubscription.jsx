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
import axios from "axios";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
registerPlugin(FilePondPluginFileValidateSize);

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function InvoiceSubscription({
    auth,
    partnersProp,
    signaturesProp,
}) {
    const [invoiceSubscriptions, setInvoiceSubscriptions] = useState([]);
    const [partners, setPartners] = useState(partnersProp);
    const [signatures, setSignatures] = useState(signaturesProp);
    const [selectedPartners, setSelectedPartners] = useState(partnersProp);
    const [invoiceBills, setInvoiceBills] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [selectedInvoices, setSelectedInvoices] = useState([]);
    const [rowClick, setRowClick] = useState(true);

    const [modalTransactionIsVisible, setModalTransactionIsVisible] =
        useState(false);
    const [modalEditTransactionIsVisible, setModalEditTransactionIsVisible] =
        useState(false);
    const [modalBundleIsVisible, setModalBundleIsVisible] = useState(false);
    const op = useRef(null);
    const add = useRef(null);
    const dummyArray = Array.from({ length: 5 }, (v, i) => i);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const toast = useRef(null);
    const { roles, permissions } = auth.user;
    const [expandedRows, setExpandedRows] = useState(null);
    useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [filtersPartner, setFiltersPartner] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [globalFilterPartnerValue, setGlobalFilterPartnerValue] =
        useState("");
    const onGlobalFilterPartnerChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filtersPartner };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterPartnerValue(value);
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
        partner: { excell: null },
        date: null,
        due_date: null,
        period_subscription: null,
        partners: partnersProp,
        selectedPartners: null,
        signature: {
            name: null,
            image: null,
        },
        excel: null,
    });

    const {
        data: dataTransaction,
        setData: setDataTransaction,
        post: postTransaction,
        put: putTransaction,
        delete: destroyTransaction,
        reset: resetTransaction,
        processing: processingTransaction,
        errors: errorsTransaction,
    } = useForm({
        id: "",
        invoice_subscription: null,
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
        rest_bill: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            await getInvoiceSubscriptions();

            setPreRenderLoad((prev) => (prev = false));
        };

        fetchData();
    }, []);

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
        {
            field: "total_nominal",
            header: "Sub Total (include pajak)",
            type: "price",
            width: "12rem",
        },
        // {
        //     field: "total_ppn",
        //     header: "Pajak",
        //     type: "price",
        //     width: "8rem",
        // },
        {
            field: "paid_off",
            header: "Uang Muka",
            type: "price",
            width: "8rem",
        },
        {
            field: "total_bill",
            header: "Total Tagihan",
            type: "price",
            width: "8rem",
        },
        {
            field: "rest_of_bill",
            header: "Sisa Tagihan (include uang muka)",
            type: "price",
            width: "8rem",
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
        {
            field: "total_nominal",
            header: "Sub Total (include pajak)",
            type: "price",
            width: "12rem",
        },
        // {
        //     field: "total_ppn",
        //     header: "Pajak",
        //     type: "price",
        //     width: "8rem",
        // },
        {
            field: "paid_off",
            header: "Uang Muka",
            type: "price",
            width: "8rem",
        },
        {
            field: "total_bill",
            header: "Total Tagihan",
            type: "price",
            width: "8rem",
        },
        {
            field: "rest_of_bill",
            header: "Sisa Tagihan",
            type: "price",
            width: "8rem",
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
            width: "15rem",
        },
    ]);

    const handleSelectedDetailPartner = (partner) => {
        const newUrl = `/partners?uuid=${partner.uuid}`;
        window.location = newUrl;
    };

    // handleSetDataTransaction = (data) => {
    //     setData((prev) => ({
    //         ...prev,
    //     }));
    // };

    const getInvoiceSubscriptions = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/invoice_subscriptions");
        let data = await response.json();

        setInvoiceSubscriptions((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([getInvoiceSubscriptions()]);
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
            setDataTransaction((data) => ({
                ...dataTransaction,
                nominal: nominal,
                money: converted,
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {permissions.includes("edit invoice langganan") && (
                    <Button
                        icon="pi pi-pencil"
                        rounded
                        outlined
                        className="mr-2"
                        onClick={() => {
                            window.location =
                                "/invoice_langganan/" + rowData.uuid;
                        }}
                    />
                )}
                {permissions.includes("hapus invoice langganan") && (
                    <Button
                        icon="pi pi-trash"
                        rounded
                        outlined
                        severity="danger"
                        onClick={() => {
                            handleDeleteInvoiceSubscription(rowData);
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

    const showError = (message) => {
        toast.current.show({
            severity: "error",
            summary: "Error",
            detail: message,
            life: 3000,
        });
    };

    const handleEditTransaction = (transaction) => {
        setDataTransaction({
            ...dataTransaction,
            uuid: transaction.uuid,
            invoice_subscription: transaction.invoice_id,
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

    const handleDeleteInvoiceSubscription = (invoice_subscription) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroy("invoice_subscriptions/" + invoice_subscription.uuid, {
                    onSuccess: () => {
                        getInvoiceSubscriptions();
                        showSuccess("Hapus");
                    },
                    onError: () => {
                        showError("Hapus");
                    },
                });
            },
        });
    };
    const handleDeleteTransaction = (invoice_subscription) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                axios
                    .delete(
                        "invoice_subscriptions/transaction/" +
                            invoice_subscription.uuid,

                        {
                            headers: {
                                "X-CSRF-TOKEN": document.head.querySelector(
                                    'meta[name="csrf-token"]'
                                ).content,
                            },
                        }
                    )
                    .then((response) => {
                        // setDataTransaction("rest_bill", response.data.rest_of_bill);
                        if (response.data.error) {
                            showError(response.data.error);
                        } else {
                            showSuccess("Tambah");
                            setModalTransactionIsVisible((prev) => false);

                            getInvoiceSubscriptions();
                            resetTransaction(
                                "nominal",
                                "date",
                                "money",
                                "payment_for",
                                "metode",
                                "signature"
                            );
                            setDataTransaction((prev) => ({
                                ...prev,
                                rest_bill: response.data.rest_of_bill,
                            }));
                        }
                    });
                // destroy(
                //     "invoice_subscriptions/transaction/" +
                //         invoice_subscription.uuid,
                //     {
                //         onSuccess: () => {
                //             getInvoiceSubscriptions();
                //             showSuccess("Hapus");
                //         },
                //         onError: () => {
                //             showError("Hapus");
                //         },
                //     }
                // );
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

    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };

    const header = (
        <div className="flex flex-col md:flex-row justify-between items-center">
            <Button
                label="Download ZIP"
                className="rounded-lg shadow-md w-[15%] text-center bg-purple-600 text-sm"
                onClick={(e) => {
                    zipAll();
                }}
                disabled={selectedInvoices.length < 2}
            />
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

    const optionSignatureTemplate = (item) => {
        return (
            <div className="flex flex-row max-w-full p-2 align-items-center items-center gap-3">
                <div className=" w-1/2">
                    <img
                        className="w-full h-full shadow-2 flex-shrink-0 border-round"
                        src={"/storage/" + item.image}
                        alt={item.name}
                    />
                </div>
                <div className="flex w-1/2 flex-col items-center">
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

    const renderHeaderPartner = () => {
        return (
            <div className="flex w-full flex-row justify-between gap-2 align-items-center items-end">
                <div className="w-full">
                    <span className="p-input-icon-left w-full">
                        <i className="pi pi-search dark:text-white" />
                        <InputText
                            className="dark:bg-transparent w-full dark:placeholder-white"
                            value={globalFilterPartnerValue}
                            onChange={onGlobalFilterPartnerChange}
                            placeholder="Cari lembaga.."
                        />
                    </span>
                </div>
            </div>
        );
    };

    const headerPartner = renderHeaderPartner();

    const headerTransaction = (
        <div className="flex flex-row gap-2 bg-gray-50 dark:bg-transparent p-2 rounded-lg align-items-center items-center justify-between justify-content-between">
            <div className="w-[15%]">
                {permissions.includes("tambah transaksi") && (
                    <Button
                        label="Input Pembayaran"
                        className="bg-purple-600 w-full text-xs shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalTransactionIsVisible(
                                (prev) => (prev = true)
                            );
                            // resetTransaction("nominal");
                        }}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                )}
            </div>
        </div>
    );

    const allowExpansion = (rowData) => {
        return rowData.bills.length >= 0;
    };

    const onRowExpand = (event) => {
        resetTransaction(
            "nominal",
            "date",
            "money",
            "payment_for",
            "metode",
            "signature"
        );

        setDataTransaction((prev) => ({
            ...prev,
            invoice_subscription: event.data.uuid,
            partner: {
                ...prev.partner,
                name: event.data.partner_name,
                id: event.data.partner.id,
            },
            rest_bill: event.data.rest_of_bill,
        }));
    };

    const actionTransactionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {permissions.includes("edit transaksi") && (
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
                )}
                {permissions.includes("hapus transaksi") && (
                    <Button
                        icon="pi pi-trash"
                        rounded
                        outlined
                        severity="danger"
                        onClick={() => {
                            handleDeleteTransaction(rowData);
                        }}
                    />
                )}
            </React.Fragment>
        );
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="md:px-14 pb-2">
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
            // postTransaction("/invoice_subscriptions/transaction", {
            //     onSuccess: () => {
            //         showSuccess("Tambah");
            //         setModalTransactionIsVisible((prev) => false);

            //         getInvoiceSubscriptions();
            //         resetTransaction("nominal");
            //     },
            //     onError: (errors) => {
            //         showError("Tambah", errors.error);
            //     },
            // });
            axios
                .post(
                    "/invoice_subscriptions/transaction",
                    {
                        dataTransaction,
                    },
                    {
                        headers: {
                            "X-CSRF-TOKEN": document.head.querySelector(
                                'meta[name="csrf-token"]'
                            ).content,
                        },
                    }
                )
                .then((response) => {
                    // setDataTransaction("rest_bill", response.data.rest_of_bill);
                    if (response.data.error) {
                        showError(response.data.error);
                    } else {
                        showSuccess("Tambah");
                        setModalTransactionIsVisible((prev) => false);

                        getInvoiceSubscriptions();
                        resetTransaction(
                            "nominal",
                            "date",
                            "money",
                            "payment_for",
                            "metode",
                            "signature"
                        );
                        setDataTransaction((prev) => ({
                            ...prev,
                            rest_bill: response.data.rest_of_bill,
                        }));
                    }
                });
        } else {
            axios
                .put(
                    "/invoice_subscriptions/transaction/" +
                        dataTransaction.uuid,
                    {
                        dataTransaction,
                    },
                    {
                        headers: {
                            "X-CSRF-TOKEN": document.head.querySelector(
                                'meta[name="csrf-token"]'
                            ).content,
                        },
                    }
                )
                .then((response) => {
                    // setDataTransaction("rest_bill", response.data.rest_of_bill);
                    if (response.data.error) {
                        showError(response.data.error);
                    } else {
                        showSuccess("Update");
                        setModalEditTransactionIsVisible(
                            (prev) => (prev = false)
                        );

                        getInvoiceSubscriptions();
                        resetTransaction(
                            "nominal",
                            "date",
                            "money",
                            "payment_for",
                            "metode",
                            "signature"
                        );
                        setDataTransaction((prev) => ({
                            ...prev,
                            rest_bill: response.data.rest_of_bill,
                        }));
                    }
                });
            // putTransaction(
            //     "/invoice_subscriptions/transaction/" + dataTransaction.uuid,
            //     {
            //         onSuccess: (data) => {
            //             showSuccess("Update");
            //             setModalEditTransactionIsVisible((prev) => false);
            //             getInvoiceSubscriptions();
            //             reset(
            //                 "date",
            //                 "metode",
            //                 "money",
            //                 "nominal",
            //                 "payment_for",
            //                 "signature"
            //             );
            //             // console.log(data.props.rest_of_bill);
            //             // const rest_bill = data.props.rest_of_bill;
            //             // setDataTransaction((prev)=>({
            //             //     ...prev,
            //             //     rest_bill: rest_bill
            //             // }))
            //         },
            //         onError: () => {
            //             showError("Update");
            //         },
            //     }
            // );
        }
    };

    const clear = () => {
        toast.current.clear();
    };

    const showDocumentLoading = () => {
        toast.current.show({
            severity: "info",
            summary: "Sedang membuat dokumen",
            sticky: true,
            closable: false,
            content: (props) => (
                <div className="flex flex-row items-center gap-5">
                    <i
                        className="pi pi-spin pi-spinner"
                        style={{ fontSize: "1rem" }}
                    ></i>

                    <div className="font-base text-900">
                        {props.message.summary}
                    </div>
                </div>
            ),
        });
    };

    const zipAll = async (uuid) => {
        // let response = await fetch(``, {
        //     method: "POST",
        //     body: {
        //         values: selectedInvoices,
        //     },
        // });
        axios
            .post(
                "/invoice_subscriptions/zip",
                {
                    selectedInvoices,
                },
                {
                    headers: {
                        "X-CSRF-TOKEN": document.head.querySelector(
                            'meta[name="csrf-token"]'
                        ).content,
                    },
                }
            )
            .then((response) => {
                const zipBlob = response.data.zip_blob;

                const dataURI = `data:application/zip;base64,${zipBlob}`;

                const downloadLink = document.createElement("a");
                downloadLink.href = dataURI;
                downloadLink.download = "invoice_langganan.zip";
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            });
    };

    const handleSubmitFormMassal = (e, type) => {
        e.preventDefault();

        // showDocumentLoading();
        setModalBundleIsVisible((prev) => false);
        if (type === "tambah") {
            post("/invoice_subscriptions/batch", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    getInvoiceSubscriptions();
                    reset();
                    clear();
                },
                onError: () => {
                    showError("Tambah");
                    clear();
                },
            });
        } else {
            post(`activity/${data.uuid}`, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditActivityIsVisible((prev) => false);
                    getSlas();
                    reset();
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

            <HeaderModule title="Invoice Langganan">
                <Button
                    label="Tambah"
                    className="bg-purple-600 w-[10%] text-sm shadow-md rounded-lg mr-2"
                    icon={addButtonIcon}
                    onClick={(e) => add.current.toggle(e)}
                />
                <OverlayPanel ref={add} className="shadow-md p-0">
                    <div className="flex flex-col text-left">
                        <span>
                            <Button
                                label="Massal"
                                className="p-0 bg-transparent font-semibold text-sm text-gray-600"
                                onClick={() => {
                                    setModalBundleIsVisible(
                                        (prev) => (prev = true)
                                    );
                                    reset();
                                }}
                                aria-controls="popup_menu_right"
                                aria-haspopup
                            />
                        </span>
                        <hr className="my-1" />
                        <span>
                            <Link
                                href="/invoice_subscriptions/create"
                                className="bg-transparent text-center font-semibold p-0 block text-gray-600 text-sm "
                            >
                                Satuan
                            </Link>
                        </span>
                    </div>
                </OverlayPanel>
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
                        emptyMessage="Invoice langganan tidak ditemukan."
                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                        header={header}
                        value={invoiceSubscriptions}
                        dataKey="id"
                        selection={selectedInvoices}
                        onSelectionChange={(e) => setSelectedInvoices(e.value)}
                        expandedRows={expandedRows}
                        onRowToggle={(e) => {
                            setExpandedRows(e.data);
                        }}
                        globalFilterFields={[
                            "partner.name",
                            "date",
                            "code",
                            "status",
                            "period",
                        ]}
                        globalFilterMatchMode="contains"
                        rowExpansionTemplate={rowExpansionTemplate}
                        onRowExpand={onRowExpand}
                    >
                        <Column
                            expander={allowExpansion}
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        />

                        <Column
                            selectionMode="multiple"
                            exportable={false}
                        ></Column>

                        <Column
                            header="No"
                            body={(_, { rowIndex }) => rowIndex + 1}
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
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

                        <Column
                            field="period"
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Periode"
                            hidden
                            style={{ minWidth: "10rem" }}
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
                                            : "-";
                                    } else if (col.type === "price") {
                                        return rowData[col.field]
                                            ? Number(
                                                  rowData[col.field]
                                              ).toLocaleString("id")
                                            : 0;
                                    }
                                    return rowData[col.field];
                                }}
                            />
                        ))}

                        <Column
                            field="invoice_age"
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Umur Invoice"
                            body={(rowData) => {
                                return rowData.invoice_age + " hari";
                            }}
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>

                        <Column
                            field="products"
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="List Tagihan"
                            body={(rowData) => {
                                return (
                                    <Button
                                        label="List"
                                        className="p-0 underline bg-transparent text-blue-700 text-left"
                                        onClick={(e) => {
                                            op.current.toggle(e);
                                            setInvoiceBills(
                                                (prev) => (prev = rowData.bills)
                                            );
                                        }}
                                        model={items}
                                        aria-controls="popup_menu_right"
                                        aria-haspopup
                                    />
                                );
                            }}
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>

                        <Column
                            body={(rowData) => {
                                return rowData.invoice_subscription_doc ==
                                    null ? (
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
                                                "/storage/" +
                                                rowData.invoice_subscription_doc
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
                </div>
            </div>

            <OverlayPanel
                className="w-[95%] md:max-w-[50%] dark:bg-slate-900 dark:text-gray-300"
                ref={op}
                showCloseIcon
            >
                <DataTable
                    value={invoiceBills}
                    className="my-4 overflow-x-auto w-full"
                    emptyMessage="Produk tidak ditemukan."
                >
                    <Column
                        header="No"
                        body={(_, { rowIndex }) => rowIndex + 1}
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        className="dark:border-none"
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    />
                    <Column
                        field="bill"
                        header="Tagihan"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="nominal"
                        header="Nominal"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        body={(rowData) => {
                            return rowData.nominal.toLocaleString("id-ID");
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>

                    <Column
                        field="ppn"
                        header="Pajak (%)"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        body={(rowData) => {
                            return rowData.ppn;
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="Pajak"
                        header="Pajak"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        body={(rowData) => {
                            return rowData.total_ppn.toLocaleString("id-ID");
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>

                    <Column
                        field="total_bill"
                        header="Jumlah"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        body={(rowData) => {
                            return rowData.total_bill.toLocaleString("id-ID");
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                </DataTable>
            </OverlayPanel>

            <Dialog
                header="Invoice Massal"
                headerClassName="dark:glass shadow-md dark:text-white"
                className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                contentClassName=" dark:glass dark:text-white"
                visible={modalBundleIsVisible}
                onHide={() => setModalBundleIsVisible(false)}
            >
                <form onSubmit={(e) => handleSubmitFormMassal(e, "tambah")}>
                    <div className="flex flex-col justify-around gap-4 mt-4">
                        <div className="flex bg-green-600 text-white text-xs p-3 rounded-lg justify-between w-full h-full">
                            <p>Template</p>
                            <p className="font-semibold">
                                <a
                                    href={
                                        "/assets/template/excel/invoice_sample.csv"
                                    }
                                    download="sample.csv"
                                    class="font-bold underline w-full h-full text-center rounded-full "
                                >
                                    sample.csv
                                </a>
                            </p>
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="name">CSV</label>

                            <div className="App">
                                <FilePond
                                    onaddfile={(error, fileItems) => {
                                        setData("partner", {
                                            ...data.partner,
                                            excell: fileItems.file,
                                        });
                                    }}
                                    maxFileSize="2mb"
                                    labelMaxFileSizeExceeded="File terlalu besar"
                                    name="files"
                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                />
                            </div>
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="signature">Tanda Tangan *</label>
                            <Dropdown
                                value={data.signature}
                                onChange={(e) => {
                                    setData("signature", {
                                        ...data.signature,
                                        name: e.target.value.name,
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
                                panelClassName="max-w-[300px]"
                                className="w-full md:w-14rem"
                            />
                        </div>

                        {/* <div className="flex flex-col">
                            <label htmlFor="estimation_date">Tanggal *</label>
                            <Calendar
                                value={data.date ? new Date(data.date) : null}
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setData("date", e.target.value);
                                }}
                                showIcon
                                dateFormat="dd/mm/yy"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="estimation_date">
                                Jatuh Tempo Invoice *
                            </label>
                            <Calendar
                                value={
                                    data.due_date
                                        ? new Date(data.due_date)
                                        : null
                                }
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setData("due_date", e.target.value);
                                }}
                                showIcon
                                dateFormat="dd/mm/yy"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="activity">Pilih lembaga *</label>
                            <DataTable
                                value={partners}
                                paginator
                                filters={filtersPartner}
                                rows={5}
                                header={headerPartner}
                                scrollable
                                scrollHeight="flex"
                                paginatorClassName="text-xs"
                                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                                tableStyle={{
                                    width: "100%",
                                }}
                                selectionMode={rowClick ? null : "checkbox"}
                                selection={selectedPartners}
                                onSelectionChange={(e) => {
                                    setSelectedPartners(e.value);
                                    setData("partners", e.value);
                                }}
                                dataKey="id"
                            >
                                <Column
                                    selectionMode="multiple"
                                    headerStyle={{ width: "3rem" }}
                                ></Column>
                                <Column
                                    field="name"
                                    header="Lembaga"
                                    style={{ minWidth: "5rem" }}
                                ></Column>
                            </DataTable>
                        </div>

                        <div className="flex flex-col mt-3">
                            <label htmlFor="signature">Tanda Tangan *</label>
                            <Dropdown
                                value={data.signature}
                                onChange={(e) => {
                                    setData("signature", {
                                        ...data.signature,
                                        name: e.target.value.name,
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
                                panelClassName="max-w-[300px]"
                                className="w-full md:w-14rem"
                            />
                        </div> */}
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
                                    {dataTransaction.rest_bill
                                        ? dataTransaction.rest_bill.toLocaleString(
                                              "id-ID"
                                          )
                                        : 0}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="date">Tanggal *</label>
                            <Calendar
                                value={
                                    dataTransaction.date
                                        ? new Date(dataTransaction.date)
                                        : null
                                }
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setDataTransaction("date", e.target.value);
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
                                value={dataTransaction.partner}
                                dataKey="id"
                                onChange={(e) => {
                                    setDataTransaction("partner", {
                                        ...dataTransaction.partner,
                                        id: e.target.value.id,
                                        name: e.target.value.name,
                                    });
                                }}
                                options={partners}
                                optionLabel="name"
                                placeholder="Pilih Lembaga"
                                filter
                                disabled
                                valueTemplate={selectedOptionTemplate}
                                itemTemplate={optionTemplate}
                                className="w-full md:w-14rem"
                            />
                        </div>
                        <div className="flex flex-col justify-around mt-3">
                            <label htmlFor="nominal">Nominal *</label>
                            <InputNumber
                                value={dataTransaction.nominal}
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
                                value={dataTransaction.money}
                                onChange={(e) =>
                                    setDataTransaction("money", e.target.value)
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
                                value={dataTransaction.payment_for}
                                onChange={(e) =>
                                    setDataTransaction(
                                        "payment_for",
                                        e.target.value
                                    )
                                }
                                className="dark:bg-gray-300"
                                id="payment_for"
                                aria-describedby="payment_for-help"
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="metode">Metode *</label>
                            <Dropdown
                                value={dataTransaction.metode}
                                onChange={(e) =>
                                    setDataTransaction("metode", e.target.value)
                                }
                                options={[
                                    { name: "Tunai" },
                                    { name: "Cazhbox" },
                                    { name: "Transfer Bank" },
                                ]}
                                optionLabel="name"
                                placeholder="Pilih Metode"
                                className="w-full md:w-14rem"
                                editable
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="signature">Tanta tangan *</label>
                            <Dropdown
                                value={dataTransaction.signature}
                                onChange={(e) => {
                                    setDataTransaction("signature", {
                                        ...dataTransaction.signature,
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

            {/* Modal edit transaksi */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Input Pembayaran"
                    headerClassName="dark:glass shadow-md dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName=" dark:glass dark:text-white"
                    visible={modalEditTransactionIsVisible}
                    onHide={() => setModalEditTransactionIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitForm(e, "update")}>
                        <div className="flex flex-col mt-3">
                            <div className="flex bg-purple-600 text-white text-xs p-3 rounded-lg justify-between w-full h-full">
                                <p>Sisa tagihan</p>
                                <p className="font-semibold">
                                    Rp{" "}
                                    {dataTransaction.rest_bill
                                        ? dataTransaction.rest_bill.toLocaleString(
                                              "id-ID"
                                          )
                                        : 0}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="date">Tanggal *</label>
                            <Calendar
                                value={
                                    dataTransaction.date
                                        ? new Date(dataTransaction.date)
                                        : null
                                }
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setDataTransaction("date", e.target.value);
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
                                value={dataTransaction.partner}
                                dataKey="id"
                                onChange={(e) => {
                                    setDataTransaction("partner", {
                                        ...dataTransaction.partner,
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
                                value={dataTransaction.nominal}
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
                                value={dataTransaction.money}
                                onChange={(e) =>
                                    setDataTransaction("money", e.target.value)
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
                                value={dataTransaction.payment_for}
                                onChange={(e) =>
                                    setDataTransaction(
                                        "payment_for",
                                        e.target.value
                                    )
                                }
                                className="dark:bg-gray-300"
                                id="payment_for"
                                aria-describedby="payment_for-help"
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="metode">Metode *</label>
                            <Dropdown
                                value={dataTransaction.metode}
                                onChange={(e) =>
                                    setDataTransaction("metode", e.target.value)
                                }
                                options={[
                                    { name: "Tunai" },
                                    { name: "Cazhbox" },
                                    { name: "Transfer Bank" },
                                ]}
                                optionLabel="name"
                                placeholder="Pilih Metode"
                                className="w-full md:w-14rem"
                                editable
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="signature">Tanta tangan *</label>
                            <Dropdown
                                value={dataTransaction.signature}
                                onChange={(e) => {
                                    setDataTransaction("signature", {
                                        ...dataTransaction.signature,
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
