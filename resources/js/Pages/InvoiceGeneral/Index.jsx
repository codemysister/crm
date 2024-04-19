import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import DashboardLayout from "@/Layouts/DashboardLayout";
import HeaderModule from "@/Components/HeaderModule";
import { InputText } from "primereact/inputtext";
import { router, useForm } from "@inertiajs/react";
import {
    ConfirmDialog,
    ConfirmDialog as ConfirmDialog2,
    confirmDialog,
} from "primereact/confirmdialog";
import { Link } from "@inertiajs/react";
import { FilterMatchMode } from "primereact/api";
import { Dialog } from "primereact/dialog";
import { OverlayPanel } from "primereact/overlaypanel";
import { ProgressSpinner } from "primereact/progressspinner";
import { Badge } from "primereact/badge";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import HeaderDatatable from "@/Components/HeaderDatatable";
import SkeletonDatatable from "@/Components/SkeletonDatatable";
import { handleSelectedDetailPartner } from "../../Utils/handleSelectedDetailPartner";
import { Sidebar } from "primereact/sidebar";
import { TabPanel, TabView } from "primereact/tabview";
import { formateDate } from "../../Utils/formatDate";
import InputError from "@/Components/InputError";
import getViewportSize from "../../Utils/getViewportSize";
import { formatNPWP } from "../../Utils/formatNPWP";

export default function Index({
    auth,
    invoiceGeneralProps,
    usersProp,
    partnersProp,
    signaturesProp,
    statusProp,
}) {
    const [invoiceGenerals, setInvoiceGenerals] = useState(invoiceGeneralProps);
    const [partners, setPartners] = useState(partnersProp);
    const [users, setUsers] = useState(usersProp);
    const [status, setStatus] = useState(statusProp);
    const [signatures, setSignatures] = useState(signaturesProp);
    const viewportSize = getViewportSize();
    const isMobile = viewportSize.width < 992;
    const [invoiceProducts, setInvoiceProducts] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [modalTransactionIsVisible, setModalTransactionIsVisible] =
        useState(false);
    const [modalEditTransactionIsVisible, setModalEditTransactionIsVisible] =
        useState(false);
    const [confirmIsVisible, setConfirmIsVisible] = useState(false);
    const [dataXendit, setDataXendit] = useState(null);
    const [selectedInvoiceGeneral, setSelectedInvoiceGeneral] = useState(null);
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const op = useRef(null);
    const action = useRef(null);
    const btnFilterRef = useRef(null);
    const [sidebarFilter, setSidebarFilter] = useState(null);
    const windowEscapeRef = useRef(null);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const toast = useRef(null);
    const { roles, permissions } = auth.user;
    const [expandedRows, setExpandedRows] = useState(null);
    useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const {
        data: dataFilter,
        setData: setDataFilter,
        reset: resetFilter,
    } = useForm({
        user: null,
        input_date: { start: null, end: null },
        payment_metode: null,
    });

    useEffect(() => {
        if (activeIndexTab == 0) {
            fetchData(getInvoiceGenerals);
        }
    }, [activeIndexTab]);

    const fetchData = async (fnc) => {
        try {
            await Promise.all([fnc()]);
            setIsLoadingData(false);
            setPreRenderLoad((prev) => (prev = false));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const columns = [
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
            field: "reason_late",
            header: "Alasan Terlewat",
            type: "regular",
            width: "10rem",
        },
    ];

    const [visibleColumns, setVisibleColumns] = useState([
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

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <i
                    className="pi pi-ellipsis-h pointer cursor-pointer"
                    onClick={(event) => {
                        setSelectedInvoiceGeneral(rowData);
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

    const showError = (message) => {
        toast.current.show({
            severity: "error",
            summary: "Error",
            detail: message,
            life: 3000,
        });
    };

    const handleEditTransaction = (transaction) => {
        setData({
            ...data,
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
        destroy("invoice_generals/" + invoice_general.uuid, {
            onSuccess: () => {
                getInvoiceGenerals();
                showSuccess("Hapus");
            },
            onError: () => {
                showError("Hapus");
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
                axios
                    .delete(
                        "invoice_generals/transaction/" + invoice_general.uuid,

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
                            getInvoiceGenerals();
                            reset(
                                "nominal",
                                "date",
                                "money",
                                "payment_for",
                                "metode",
                                "signature"
                            );
                            setData((prev) => ({
                                ...prev,
                                rest_bill: response.data.rest_of_bill,
                            }));
                        }
                    });
                // destroy(
                //     "invoice_generals/transaction/" + invoice_general.uuid,
                //     {
                //         onSuccess: () => {
                //             getInvoiceGenerals();
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

    const exportExcel = () => {
        const exports = invoiceGenerals.map((data) => {
            return {
                Kode: data.code ?? "-",
                Lembaga: data.partner ? data.partner.name : "-",
                NPWP: data.partner ? data.partner.npwp : "-",
                Link_Dokumen: {
                    v:
                        window.location.origin +
                            "/" +
                            data.invoice_general_doc ?? "-",
                    h: "link",
                    l: {
                        Target:
                            window.location.origin +
                                "/storage/" +
                                data.invoice_general_doc ?? "-",
                        Tooltip: "Klik untuk membuka dokumen",
                    },
                },
                Tanggal_Pembuatan: formateDate(data.created_at),
            };
        });

        import("xlsx").then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(exports);
            const workbook = {
                Sheets: { data: worksheet },
                SheetNames: ["data"],
            };
            const excelBuffer = xlsx.write(workbook, {
                bookType: "xlsx",
                type: "array",
            });

            saveAsExcelFile(excelBuffer, "invoice_umum");
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import("file-saver").then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE =
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
                let EXCEL_EXTENSION = ".xlsx";
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE,
                });

                module.default.saveAs(data, fileName + EXCEL_EXTENSION);
            }
        });
    };

    const header = () => {
        return (
            <HeaderDatatable
                globalFilterValue={globalFilterValue}
                onGlobalFilterChange={onGlobalFilterChange}
            >
                <Button
                    className="shadow-md w-[10px] lg:w-[90px] border border-slate-600 bg-transparent text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-lg"
                    onClick={() => setSidebarFilter(true)}
                >
                    <span className="w-full flex justify-center items-center gap-1">
                        <i
                            className="pi pi-filter"
                            style={{ fontSize: "0.7rem" }}
                        ></i>{" "}
                        {!isMobile && <span>filter</span>}
                    </span>
                </Button>
                <Button
                    className="shadow-md w-[10px] lg:w-[90px] bg-transparent text-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:border rounded-lg"
                    onClick={exportExcel}
                    data-pr-tooltip="XLS"
                >
                    <span className="w-full flex items-center justify-center gap-1">
                        <i
                            className="pi pi-file-excel"
                            style={{ fontSize: "0.8rem" }}
                        ></i>{" "}
                        {!isMobile && <span>export</span>}
                    </span>
                </Button>
            </HeaderDatatable>
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

    const optionSignatureTemplate = (item) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <img
                    className="w-[6rem] shadow-2 flex-shrink-0 border-round"
                    src={"/storage/" + item.image}
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

    const confirmDeleteInvoice = () => {
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

    const headerTransaction = (
        <div className="flex flex-row gap-2 bg-gray-50 dark:bg-transparent p-2 rounded-lg align-items-center items-center justify-between justify-content-between">
            <div className="w-[30%]">
                {permissions.includes("tambah transaksi") && (
                    <Button
                        label="Input Pembayaran"
                        className="bg-purple-600 max-w-[146px] w-full text-xs shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalTransactionIsVisible(
                                (prev) => (prev = true)
                            );
                            reset(
                                "nominal",
                                "date",
                                "money",
                                "payment_for",
                                "signature"
                            );
                        }}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                )}
            </div>
        </div>
    );

    const handleEditXenditLink = () => {
        const formData = { xendit_link: dataXendit };
        windowEscapeRef.current.click();
        axios
            .put("invoice_generals/" + data.uuid + "/xendit", formData, {
                headers: {
                    "X-CSRF-TOKEN": document.head.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                },
            })
            .then((response) => {
                if (response.data.error) {
                    showError(response.data.error);
                } else {
                    showSuccess("Update");
                    getInvoiceGenerals();
                    setDataXendit((prev) => (prev = null));
                    reset();
                }
            });
    };

    const textEditor = (options) => {
        setData(options.rowData);
        return (
            <div className="flex items-center gap-1">
                <InputText
                    type="text"
                    className="w-[10rem]"
                    value={options.value}
                    onChange={(e) => {
                        options.editorCallback(e.target.value);
                        setDataXendit(e.target.value);
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                />
                <div className="flex gap-1">
                    <Button
                        icon="pi pi-times"
                        onClick={() => {
                            windowEscapeRef.current.click();
                        }}
                        className="p-0 rounded-full bg-red-500  dark:text-white"
                    ></Button>
                    <Button
                        icon="pi pi-check"
                        className="p-0 rounded-full bg-green-500  dark:text-white"
                        onClick={handleEditXenditLink}
                    ></Button>
                </div>
            </div>
        );
    };

    const cellEditor = (options) => {
        return textEditor(options);
    };

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
            <div className="md:px-14">
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
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        />
                        <Column
                            field="date"
                            header="Tanggal"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
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
                            field="money"
                            header="Uang Terbilang"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        ></Column>
                        <Column
                            field="metode"
                            header="Metode"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        ></Column>
                        <Column
                            field="created_by"
                            header="Diinput Oleh"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
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
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            header="Action"
                            body={actionTransactionBodyTemplate}
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        ></Column>
                    </DataTable>
                </div>
            </div>
        );
    };

    const handleFilter = async (e) => {
        e.preventDefault();
        setIsLoadingData(true);
        const formData = {
            user: dataFilter.user,
            input_date: dataFilter.input_date,
            status: dataFilter.status,
        };

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");

        const response = await axios.post(
            "/invoice_generals/filter",
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
            }
        );
        const data = response.data;
        setInvoiceGenerals(data);
        setSidebarFilter(false);
        setIsLoadingData(false);
    };

    const handleSubmitForm = (e, type) => {
        e.preventDefault();

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");
        if (type === "tambah") {
            axios
                .post(
                    "/invoice_generals/transaction",
                    {
                        ...data,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRF-TOKEN": csrfToken,
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
                        getInvoiceGenerals();
                        reset(
                            "nominal",
                            "date",
                            "money",
                            "payment_for",
                            "metode",
                            "signature"
                        );
                        setData((prev) => ({
                            ...prev,
                            rest_bill: response.data.rest_of_bill,
                        }));
                    }
                });
        } else {
            axios
                .put(
                    "/invoice_generals/transaction/" + data.uuid,
                    {
                        ...data,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRF-TOKEN": csrfToken,
                        },
                    }
                )
                .then((response) => {
                    if (response.data.error) {
                        showError(response.data.error);
                    } else {
                        showSuccess("Tambah");
                        setModalEditTransactionIsVisible((prev) => false);

                        getInvoiceGenerals();
                        reset(
                            "nominal",
                            "date",
                            "money",
                            "payment_for",
                            "metode",
                            "signature"
                        );
                        setData((prev) => ({
                            ...prev,
                            rest_bill: response.data.rest_of_bill,
                        }));
                    }
                });
        }
    };

    if (preRenderLoad) {
        return <SkeletonDatatable auth={auth} />;
    }

    return (
        <DashboardLayout auth={auth.user}>
            <Toast ref={toast} />

            <ConfirmPopup />

            {/* Sidebar filter */}
            <Sidebar
                header="Filter"
                visible={sidebarFilter}
                className="w-full md:w-[30%] px-3 dark:glass dark:text-white"
                position="right"
                onHide={() => setSidebarFilter(false)}
            >
                <form onSubmit={handleFilter}>
                    <div className="flex flex-col mt-3">
                        <label htmlFor="name">Berdasarkan penginput</label>
                        <Dropdown
                            optionLabel="name"
                            dataKey="id"
                            value={dataFilter.user}
                            onChange={(e) =>
                                setDataFilter("user", e.target.value)
                            }
                            options={users}
                            placeholder="Pilih User"
                            filter
                            showClear
                            valueTemplate={selectedOptionTemplate}
                            itemTemplate={optionTemplate}
                            className="flex justify-center  dark:text-gray-400   "
                        />
                    </div>

                    <div className="flex flex-col mt-3">
                        <label htmlFor="status">Status </label>
                        <Dropdown
                            dataKey="name"
                            value={dataFilter.status}
                            onChange={(e) => {
                                setDataFilter("status", e.target.value);
                            }}
                            options={status}
                            optionLabel="name"
                            placeholder="Pilih Status"
                            className="w-full md:w-14rem"
                        />
                    </div>

                    <div className="flex flex-col mt-3">
                        <label htmlFor="metode">Metode *</label>
                        <Dropdown
                            value={dataFilter.payment_metode}
                            onChange={(e) =>
                                setDataFilter("payment_metode", e.target.value)
                            }
                            options={[
                                { name: "Tunai" },
                                { name: "Cazhbox" },
                                { name: "Transfer Bank" },
                            ]}
                            optionLabel="name"
                            placeholder="Pilih metode"
                            className="w-full md:w-14rem"
                            editable
                        />
                    </div>

                    <div className="flex flex-col mt-3">
                        <label htmlFor="">Tanggal Input</label>
                        <div className="flex items-center gap-2">
                            <Calendar
                                value={
                                    dataFilter.input_date.start
                                        ? new Date(dataFilter.input_date.start)
                                        : null
                                }
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setDataFilter("input_date", {
                                        ...dataFilter.input_date,
                                        start: e.target.value,
                                    });
                                }}
                                placeholder="mulai"
                                showIcon
                                dateFormat="dd/mm/yy"
                            />
                            <span>-</span>
                            <Calendar
                                value={
                                    dataFilter.input_date.end
                                        ? new Date(dataFilter.input_date.end)
                                        : null
                                }
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setDataFilter("input_date", {
                                        ...dataFilter.input_date,
                                        end: e.target.value,
                                    });
                                }}
                                placeholder="selesai"
                                showIcon
                                dateFormat="dd/mm/yy"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row mt-5">
                        <Button
                            ref={btnFilterRef}
                            label="Terapkan"
                            className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        />
                        <Button
                            type="button"
                            label="Reset"
                            onClick={(e) => {
                                resetFilter();
                                setTimeout(() => {
                                    btnFilterRef.current.click();
                                }, 500);
                            }}
                            className="outline-purple-600 outline-1 outline-dotted bg-transparent text-slate-700  text-sm shadow-md rounded-lg mr-2"
                        />
                    </div>
                </form>
            </Sidebar>

            {/* Tombol Aksi */}
            <OverlayPanel
                className=" shadow-md p-1 dark:bg-slate-800 dark:text-gray-300"
                ref={action}
            >
                <div className="flex flex-col flex-wrap w-full">
                    {permissions.includes("edit invoice umum") && (
                        <Button
                            icon="pi pi-pencil"
                            label="edit"
                            className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                            onClick={() => {
                                router.get(
                                    "/invoice_generals/" +
                                        selectedInvoiceGeneral.uuid
                                );
                            }}
                        />
                    )}
                    {permissions.includes("hapus invoice umum") && (
                        <Button
                            icon="pi pi-trash"
                            label="hapus"
                            className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                            onClick={() => {
                                confirmDeleteInvoice();
                            }}
                        />
                    )}
                </div>
            </OverlayPanel>

            <HeaderModule title="Invoice Umum">
                {permissions.includes("tambah invoice umum") && (
                    <>
                        <Link
                            href="/invoice_generals/create"
                            className="bg-purple-600 block text-white py-2 px-3 font-semibold text-sm shadow-md rounded-lg mr-2"
                        >
                            <i
                                className="pi pi-plus"
                                style={{
                                    fontSize: "0.7rem",
                                    paddingRight: "5px",
                                }}
                            ></i>
                            Tambah
                        </Link>
                    </>
                )}
            </HeaderModule>

            <TabView
                activeIndex={activeIndexTab}
                onTabChange={(e) => {
                    setActiveIndexTab(e.index);
                }}
                className="mt-2"
            >
                <TabPanel header="Semua Invoice">
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
                                accept={handleDeleteInvoiceGeneral}
                            />

                            <div
                                className="flex mx-auto flex-col justify-center mt-5 gap-5"
                                ref={windowEscapeRef}
                            >
                                <div className="card p-fluid w-full h-full flex justify-center rounded-lg">
                                    <DataTable
                                        loading={isLoadingData}
                                        className="w-full h-auto rounded-lg dark:glass border-none text-center shadow-md"
                                        pt={{
                                            bodyRow:
                                                "dark:bg-transparent  dark:text-gray-300",
                                            table: "dark:bg-transparent bg-white dark:text-gray-300",
                                        }}
                                        paginator
                                        rowsPerPageOptions={[10, 25, 50, 100]}
                                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                        currentPageReportTemplate="{first} - {last} dari {totalRecords}"
                                        filters={filters}
                                        rows={10}
                                        emptyMessage="Invoice Umum tidak ditemukan."
                                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                                        header={header}
                                        globalFilterFields={[
                                            "partner.name",
                                            "partner.npwp",
                                            "code",
                                            "status.name",
                                        ]}
                                        scrollable
                                        value={invoiceGenerals}
                                        dataKey="id"
                                        expandedRows={expandedRows}
                                        onRowToggle={(e) => {
                                            setExpandedRows(e.data);
                                        }}
                                        rowExpansionTemplate={
                                            rowExpansionTemplate
                                        }
                                        onRowExpand={onRowExpand}
                                        editMode="cell"
                                    >
                                        <Column
                                            align="center"
                                            expander={allowExpansion}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                            frozen
                                            headerClassName="dark:border-none bg-white pl-6 dark:bg-slate-900 dark:text-gray-300"
                                        />

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

                                        <Column
                                            field="code"
                                            className="dark:border-none bg-white lg:whitespace-nowrap lg:w-max"
                                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                            header="Kode"
                                            align="left"
                                            frozen={!isMobile}
                                            style={
                                                !isMobile
                                                    ? {
                                                          width: "max-content",
                                                          whiteSpace: "nowrap",
                                                      }
                                                    : null
                                            }
                                        ></Column>

                                        <Column
                                            header="Status"
                                            body={(rowData) => {
                                                return (
                                                    <Badge
                                                        value={
                                                            rowData.status.name
                                                        }
                                                        className="text-white"
                                                        style={{
                                                            backgroundColor:
                                                                "#" +
                                                                rowData.status
                                                                    .color,
                                                        }}
                                                    ></Badge>
                                                );
                                            }}
                                            frozen={!isMobile}
                                            style={
                                                !isMobile
                                                    ? {
                                                          width: "max-content",
                                                          whiteSpace: "nowrap",
                                                      }
                                                    : null
                                            }
                                            className="dark:border-none bg-white lg:whitespace-nowrap lg:w-max"
                                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                            align="left"
                                        ></Column>
                                        <Column
                                            header="Nama"
                                            body={(rowData) => (
                                                <button
                                                    onClick={() =>
                                                        handleSelectedDetailPartner(
                                                            rowData
                                                        )
                                                    }
                                                    className="hover:text-blue-700 text-left"
                                                >
                                                    {rowData.partner.name}
                                                </button>
                                            )}
                                            className="dark:border-none bg-white lg:whitespace-nowrap lg:w-max"
                                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                            align="left"
                                            frozen={!isMobile}
                                            style={
                                                !isMobile
                                                    ? {
                                                          width: "max-content",
                                                          whiteSpace: "nowrap",
                                                      }
                                                    : null
                                            }
                                        ></Column>
                                        <Column
                                            header="NPWP"
                                            body={(rowData) =>
                                                rowData.partner.npwp !== null
                                                    ? formatNPWP(
                                                          rowData.partner.npwp
                                                      )
                                                    : "-"
                                            }
                                            className="dark:border-none"
                                            headerClassName="dark:border-none  dark:bg-slate-900 dark:text-gray-300"
                                            align="left"
                                            frozen={!isMobile}
                                            style={
                                                !isMobile
                                                    ? {
                                                          width: "max-content",
                                                          whiteSpace: "nowrap",
                                                      }
                                                    : null
                                            }
                                        ></Column>
                                        <Column
                                            field="xendit_link"
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            header="Link Xendit"
                                            align="left"
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                            editor={(options) =>
                                                cellEditor(options)
                                            }
                                        ></Column>

                                        <Column
                                            body={(rowData) => {
                                                return rowData.invoice_general_doc ==
                                                    "" ? (
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
                                                                    fontSize:
                                                                        "1.5rem",
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
                                                    if (
                                                        col.type === "location"
                                                    ) {
                                                        return JSON.parse(
                                                            rowData[col.field]
                                                        ).name;
                                                    } else if (
                                                        col.type === "date"
                                                    ) {
                                                        return rowData[
                                                            col.field
                                                        ]
                                                            ? new Date(
                                                                  rowData[
                                                                      col.field
                                                                  ]
                                                              ).toLocaleDateString(
                                                                  "id"
                                                              )
                                                            : "-";
                                                    } else if (
                                                        col.type === "price"
                                                    ) {
                                                        return rowData[
                                                            col.field
                                                        ]
                                                            ? rowData[
                                                                  col.field
                                                              ].toLocaleString(
                                                                  "id"
                                                              )
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
                                                return (
                                                    rowData.invoice_age +
                                                    " hari"
                                                );
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
                                            header="Produk"
                                            body={(rowData) => {
                                                return (
                                                    <Button
                                                        label="List"
                                                        className="p-0 underline bg-transparent text-blue-700 text-left"
                                                        onClick={(e) => {
                                                            op.current.toggle(
                                                                e
                                                            );
                                                            setInvoiceProducts(
                                                                (prev) =>
                                                                    (prev =
                                                                        rowData.products)
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
                            users={users}
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

            <OverlayPanel
                className="w-[95%] shadow-md md:max-w-[50%] dark:bg-slate-900 dark:text-gray-300"
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
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        className="dark:border-none"
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    />
                    <Column
                        field="name"
                        header="Produk"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="price"
                        header="Harga"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        body={(rowData) => {
                            return rowData.price.toLocaleString("id-ID");
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="quantity"
                        header="Kuantitas"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="total"
                        header="Total Harga"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        body={(rowData) => {
                            return rowData.total.toLocaleString("id-ID");
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="ppn"
                        header="PPN (%)"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        body={(rowData) => {
                            return rowData.ppn + "%";
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="total_ppn"
                        header="PPN"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
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
                                disabled
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
                                on
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
                                placeholder="Pilih metode"
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
        </DashboardLayout>
    );
}
