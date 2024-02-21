import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Link, useForm } from "@inertiajs/react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Steps } from "primereact/steps";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Badge } from "primereact/badge";
import { TabPanel, TabView } from "primereact/tabview";
import { Skeleton } from "primereact/skeleton";
import { FilterMatchMode } from "primereact/api";
import { OverlayPanel } from "primereact/overlaypanel";
import { FileUpload } from "primereact/fileupload";

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
import HeaderModule from "@/Components/HeaderModule";
import InvoiceSubscription from "./InvoiceSubscription";
registerPlugin(FilePondPluginFileValidateSize);

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Index({
    auth,
    invoiceSubscription,
    partnersProp,
    signaturesProp,
}) {
    const [invoiceSubscriptions, setInvoiceSubscriptions] = useState("");
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [partners, setPartners] = useState(partnersProp);
    const [signatures, setSignatures] = useState(signaturesProp);
    const [selectedPartners, setSelectedPartners] = useState(partnersProp);
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const [expandedRows, setExpandedRows] = useState(null);
    const toast = useRef(null);

    const [rowClick, setRowClick] = useState(true);
    const [modalBundleIsVisible, setModalBundleIsVisible] = useState(false);
    const [modalEditBundleIsVisible, setModalEditBundleIsVisible] =
        useState(false);
    const { roles, permissions } = auth.user;
    const [activeIndex, setActiveIndex] = useState(0);
    const dummyArray = Array.from({ length: 5 }, (v, i) => i);
    const [preRenderLoad, setPreRenderLoad] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            await getInvoiceSubscriptions();

            setPreRenderLoad((prev) => (prev = false));
        };

        fetchData();
    }, [activeIndexTab]);

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
        date: null,
        due_date: null,
        period_subscription: null,
        partners: partnersProp,
        signature: {
            name: null,
            image: null,
        },
    });

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

    const getInvoiceSubscriptions = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/invoice_subscriptions/bundle");
        let data = await response.json();

        setInvoiceSubscriptions((prev) => (prev = data));

        setIsLoadingData(false);
    };

    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-row justify-between gap-2 align-items-center items-end">
                <div>
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalBundleIsVisible((prev) => (prev = true));
                            reset();
                            setActiveIndex((prev) => (prev = 0));
                        }}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                </div>
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

    const header = renderHeader();

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

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => handleEditPartner(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => {
                        handleDeletePartner(rowData);
                    }}
                />
            </React.Fragment>
        );
    };

    const handleSubmitForm = (e, type) => {
        e.preventDefault();

        showDocumentLoading();
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

    const option_period_subscription = [
        { name: "kartu/bulan" },
        { name: "lembaga/bulan" },
    ];

    const handleEditPartner = (partner) => {
        setData((prevData) => ({
            ...prevData,
            partner: {
                ...prevData.partner,
                uuid: partner.uuid,
                name: partner.name,
                phone_number: partner.phone_number,
                sales: partner.sales,
                account_manager: partner.account_manager,
                onboarding_date: partner.onboarding_date,
                onboarding_age: partner.onboarding_age,
                live_age: partner.live_age,
                monitoring_date_after_3_month_live:
                    partner.monitoring_date_after_3_month_live,
                live_date: partner.live_date,
                province: partner.province,
                regency: partner.regency,
                subdistrict: partner.subdistrict,
                address: partner.address,
                status: partner.status,
            },
        }));
        setcodeRegency(JSON.parse(partner.regency).code);
        setcodeProvince(JSON.parse(partner.province).code);
        setModalEditPartnersIsVisible(true);
    };

    const handleDeletePartner = (partner) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroy("partners/" + partner.uuid, {
                    onSuccess: () => {
                        getPartners();
                        showSuccess("Hapus");
                    },
                    onError: () => {
                        showError("Hapus");
                    },
                });
            },
        });
    };

    const zipAll = async (uuid) => {
        let response = await fetch(`/invoice_subscriptions/zip?uuid=${uuid}`);
        let data = await response.json();
        const zipBlob = data.zip_blob;

        const dataURI = `data:application/zip;base64,${zipBlob}`;

        const downloadLink = document.createElement("a");
        downloadLink.href = dataURI;
        downloadLink.download = "invoice_langganan.zip";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const allowExpansion = (rowData) => {
        return rowData.invoice_subscriptions.length > 0;
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="px-14 py-5 flex">
                <DataTable
                    value={data.invoice_subscriptions}
                    paginator
                    filters={filters}
                    rows={5}
                    emptyMessage="Invoice tidak ditemukan."
                    paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                >
                    <Column
                        header="No"
                        body={(_, { rowIndex }) => rowIndex + 1}
                        style={{ width: "1rem" }}
                        className="dark:border-none"
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    />
                    <Column
                        field="code"
                        header="No"
                        style={{ minWidth: "10rem", maxWidth: "16rem" }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="partner_name"
                        header="Lembaga"
                        style={{ minWidth: "8rem" }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
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
                                              rowData.status == "belum terbayar"
                                            ? "warning"
                                            : null || rowData.status == "telat"
                                            ? "danger"
                                            : null
                                    }
                                ></Badge>
                            );
                        }}
                        className="dark:border-none"
                        align="left"
                        style={{ minWidth: "8rem" }}
                    ></Column>

                    <Column
                        field="date"
                        header="Tanggal"
                        body={(rowData) => {
                            return new Date(rowData.date).toLocaleDateString(
                                "id"
                            );
                        }}
                        style={{ minWidth: "8rem" }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="due_date"
                        header="Jatuh Tempo"
                        body={(rowData) => {
                            return new Date(
                                rowData.due_date
                            ).toLocaleDateString("id");
                        }}
                        style={{ minWidth: "8rem" }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        body={(rowData) => {
                            return rowData.invoice_subscription_doc == "" ? (
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
                                            rowData.invoice_subscription_doc
                                        }
                                        download={`${rowData.partner_name}_${rowData.code}`}
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
                        align="left"
                        header="Dokumen"
                        style={{ minWidth: "2rem" }}
                    ></Column>
                </DataTable>
            </div>
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

            <TabView
                className="mt-3"
                activeIndex={activeIndexTab}
                onTabChange={(e) => {
                    setActiveIndexTab(e.index);
                }}
            >
                <TabPanel header="Invoice Massal">
                    <ConfirmDialog />

                    <div className="flex mx-auto flex-col justify-center mt-5 gap-5">
                        <Dialog
                            header="Invoice Massal"
                            headerClassName="dark:glass shadow-md dark:text-white"
                            className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                            contentClassName=" dark:glass dark:text-white"
                            visible={modalBundleIsVisible}
                            onHide={() => setModalBundleIsVisible(false)}
                        >
                            <form
                                onSubmit={(e) => handleSubmitForm(e, "tambah")}
                            >
                                <div className="flex flex-col justify-around gap-4 mt-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="estimation_date">
                                            Tanggal *
                                        </label>
                                        <Calendar
                                            value={
                                                data.date
                                                    ? new Date(data.date)
                                                    : null
                                            }
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
                                                setData(
                                                    "due_date",
                                                    e.target.value
                                                );
                                            }}
                                            showIcon
                                            dateFormat="dd/mm/yy"
                                        />
                                    </div>
                                    {/* <div className="flex flex-col">
                                        <label htmlFor="activity">
                                            Periode Langganan
                                        </label>
                                        <Dropdown
                                            value={data.period_subscription}
                                            onChange={(e) => {
                                                setData(
                                                    "period_subscription",
                                                    e.target.value
                                                );
                                            }}
                                            options={option_period_subscription}
                                            optionLabel="name"
                                            optionValue="name"
                                            placeholder="Pilih Periode"
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div> */}

                                    <div className="flex flex-col">
                                        <label htmlFor="activity">
                                            Pilih lembaga *
                                        </label>
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
                                            selectionMode={
                                                rowClick ? null : "checkbox"
                                            }
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
                                        <label htmlFor="signature">
                                            Tanda Tangan *
                                        </label>
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
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={
                                                optionSignatureTemplate
                                            }
                                            panelClassName="max-w-[300px]"
                                            className="w-full md:w-14rem"
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
                                globalFilterFields={["name", "category"]}
                                value={invoiceSubscriptions}
                                dataKey="id"
                                expandedRows={expandedRows}
                                onRowToggle={(e) => setExpandedRows(e.data)}
                                rowExpansionTemplate={rowExpansionTemplate}
                            >
                                <Column
                                    expander={allowExpansion}
                                    style={{ width: "1rem" }}
                                    headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                                />

                                <Column
                                    header="No"
                                    body={(_, { rowIndex }) => rowIndex + 1}
                                    style={{ width: "5%" }}
                                    className="dark:border-none pl-6"
                                    headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                                />

                                <Column
                                    field="date"
                                    header="Periode"
                                    body={(rowData) => {
                                        return new Date(
                                            rowData.date
                                        ).toLocaleDateString("id-ID", {
                                            day: "2-digit",
                                            year: "numeric",
                                            month: "long",
                                        });
                                    }}
                                    style={{ minWidth: "5rem" }}
                                    headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                                ></Column>
                                <Column
                                    field="created_by"
                                    header="Dibuat oleh"
                                    body={(rowData) => {
                                        return rowData.user.name;
                                    }}
                                    style={{ minWidth: "7rem" }}
                                    headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                                ></Column>
                                <Column
                                    header="Download Semua"
                                    body={(rowData) => {
                                        return (
                                            <Button
                                                label="invoice.zip"
                                                className="rounded-lg text-left p-0 bg-transparent underline text-blue-500 text-base"
                                                onClick={(e) => {
                                                    zipAll(rowData.uuid);
                                                }}
                                            />
                                        );
                                    }}
                                    style={{
                                        minWidth: "5rem",
                                    }}
                                    headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                                ></Column>

                                <Column
                                    header="Action"
                                    body={actionBodyTemplate}
                                    style={{ minWidth: "12rem" }}
                                    className="dark:border-none"
                                    headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                                ></Column>
                            </DataTable>
                        </div>
                    </div>
                </TabPanel>

                <TabPanel header="Invoice Langganan">
                    <InvoiceSubscription auth={auth} />
                </TabPanel>
            </TabView>
        </DashboardLayout>
    );
}
