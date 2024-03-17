import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import DashboardLayout from "@/Layouts/DashboardLayout";
import HeaderModule from "@/Components/HeaderModule";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Link, useForm } from "@inertiajs/react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Skeleton } from "primereact/skeleton";
import { InputNumber } from "primereact/inputnumber";
import { ProgressSpinner } from "primereact/progressspinner";
import { Calendar } from "primereact/calendar";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
import { OverlayPanel } from "primereact/overlaypanel";
import { Image } from "primereact/image";
registerPlugin(FilePondPluginFileValidateSize);
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Index({ auth }) {
    const [slas, setSlas] = useState("");
    const [positions, setPositions] = useState("");
    const [users, setUsers] = useState("");
    const [isLoadingData, setIsLoadingData] = useState(false);
    const dummyArray = Array.from({ length: 5 }, (v, i) => i);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [modalEditActivityIsVisible, setModalEditActivityIsVisible] =
        useState(false);
    const [expandedRows, setExpandedRows] = useState(null);
    useState(false);
    const toast = useRef(null);
    const op = useRef(null);
    const modalProduct = useRef(null);
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
        id: "",
        sla_id: "",
        activity: "",
        cazh_pic: "",
        duration: "",
        estimation_date: "",
        realization_date: "",
        realization: null,
        information: null,
    });

    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const getSlas = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/sla");
        let data = await response.json();

        setSlas((prev) => data.sla);
        setPositions((prev) => data.roles);
        setUsers((prev) => data.users);
        setIsLoadingData(false);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([getSlas()]);
                setIsLoadingData(false);
                setPreRenderLoad((prev) => (prev = false));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleSelectedDetailPartner = (partner) => {
        const newUrl = `/partners?uuid=${partner.uuid}`;
        window.location = newUrl;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {permissions.includes("edit sla") && (
                    <Button
                        icon="pi pi-pencil"
                        rounded
                        outlined
                        className="mr-2"
                        onClick={() =>
                            (window.location = "/sla/" + rowData.uuid)
                        }
                    />
                )}
                {permissions.includes("hapus sla") && (
                    <Button
                        icon="pi pi-trash"
                        rounded
                        outlined
                        severity="danger"
                        onClick={() => {
                            handleDeleteSla(rowData);
                        }}
                    />
                )}
            </React.Fragment>
        );
    };

    const actionActivityBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {permissions.includes("edit produk") && (
                    <Button
                        icon="pi pi-pencil"
                        rounded
                        outlined
                        className="mr-2"
                        onClick={() => handleEditActivity(rowData)}
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

    const handleEditActivity = (activity) => {
        setData((data) => ({
            ...data,
            uuid: activity.uuid,
            sla_id: activity.sla_id,
            activity: activity.activity,
            cazh_pic: activity.cazh_pic,
            duration: activity.duration,
            estimation_date: activity.estimation_date,
            realization_date: activity.realization_date,
            realization: activity.realization,
            information: activity.information,
        }));
        setModalEditActivityIsVisible(true);
    };

    const handleDeleteActivity = (activity) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroy("activity/" + activity.uuid, {
                    onSuccess: () => {
                        getSlas();
                        showSuccess("Hapus");
                    },
                    onError: () => {
                        showError("Hapus");
                    },
                });
            },
        });
    };

    const handleDeleteSla = (sla) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroy("sla/" + sla.uuid, {
                    onSuccess: () => {
                        getSlas();
                        showSuccess("Hapus");
                    },
                    onError: () => {
                        showError("Hapus");
                    },
                });
            },
        });
    };

    const allowExpansion = (rowData) => {
        return rowData.activities.length > 0;
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="px-14 py-5 flex dark:bg-transparent">
                <DataTable
                    value={data.activities}
                    paginator
                    filters={filters}
                    rows={5}
                    emptyMessage="SLA tidak ditemukan."
                    paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
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
                        field="activity"
                        header="Tahapan"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="cazh_pic"
                        header="Penanggungjawab"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="duration"
                        header="Estimasi Waktu"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="estimation_date"
                        header="Tanggal"
                        body={(rowData) => {
                            return new Date(
                                rowData.estimation_date
                            ).toLocaleDateString("id");
                        }}
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="realization_date"
                        header="Realisasi"
                        body={(rowData) => {
                            return rowData.realization_date !== null
                                ? new Date(
                                      rowData.realization_date
                                  ).toLocaleDateString("id")
                                : "-";
                        }}
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="realization"
                        header="Bukti"
                        body={(rowData) => {
                            return rowData.realization ? (
                                <div className="flex justify-center">
                                    <Image
                                        src={"/storage/" + rowData.realization}
                                        alt="Bukti"
                                        width="50%"
                                        height="50%"
                                        preview
                                        downloadable
                                    />
                                </div>
                            ) : (
                                "-"
                            );
                        }}
                        style={{
                            width: "8rem",
                            // whiteSpace: "nowrap",
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="realization"
                        header="Catatan"
                        body={(rowData) => {
                            return rowData.information ? (
                                <>
                                    <Button
                                        icon="pi pi-info"
                                        rounded
                                        outlined
                                        severity="info"
                                        aria-label="Info"
                                        onClick={(e) => op.current.toggle(e)}
                                    />
                                    <OverlayPanel
                                        className="shadow-md max-w-[40%]"
                                        ref={op}
                                        showCloseIcon
                                    >
                                        <p>{rowData.information}</p>
                                    </OverlayPanel>
                                </>
                            ) : (
                                "-"
                            );
                        }}
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        header="Action"
                        body={actionActivityBodyTemplate}
                        className="dark:border-none"
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                </DataTable>
            </div>
        );
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

    const header = renderHeader();

    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };

    const handleSubmitForm = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            post("/products", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalProductIsVisible((prev) => false);
                    getProducts();
                    reset("name", "category", "price", "unit", "description");
                },
                onError: () => {
                    showError("Tambah");
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

            <HeaderModule title="Service Level Agreement">
                {permissions.includes("tambah produk") && (
                    <Link
                        href="/sla/create"
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
                            table: "dark:bg-transparent bg-white dark:text-gray-300",
                            header: "",
                        }}
                        paginator
                        filters={filters}
                        rows={5}
                        emptyMessage="SLA tidak ditemukan."
                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                        header={header}
                        globalFilterFields={["name", "category"]}
                        value={slas}
                        dataKey="id"
                        expandedRows={expandedRows}
                        onRowToggle={(e) => setExpandedRows(e.data)}
                        rowExpansionTemplate={rowExpansionTemplate}
                    >
                        <Column
                            expander={allowExpansion}
                            headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        />

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
                            field="partner_province"
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Provinsi"
                            body={(rowData) => {
                                return JSON.parse(rowData.partner_province)
                                    .name;
                            }}
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            field="partner_regency"
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Kabupaten"
                            body={(rowData) => {
                                return JSON.parse(rowData.partner_regency).name;
                            }}
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            field="partner_phone_number"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Nomor Telepon Lembaga"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            field="partner_pic"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="PIC Lembaga"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            field="partner_pic_email"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Email PIC"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            field="partner_pic_number"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Nomor Telepon PIC"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            body={(rowData) => {
                                return rowData.sla_doc == "" ? (
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
                                            href={"/" + rowData.sla_doc}
                                            download={`SLA-${rowData.partner_name}`}
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
                <div className="card flex justify-content-center">
                    <Dialog
                        header="Aktivitas"
                        headerClassName="dark:glass shadow-md dark:text-white"
                        className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                        contentClassName=" dark:glass dark:text-white"
                        visible={modalEditActivityIsVisible}
                        onHide={() => setModalEditActivityIsVisible(false)}
                    >
                        <form onSubmit={(e) => handleSubmitForm(e, "update")}>
                            <div className="flex flex-col justify-around gap-4 mt-4">
                                <div className="flex flex-col">
                                    <label htmlFor="activity">Aktivitas</label>
                                    <InputText
                                        value={data.activity}
                                        onChange={(e) =>
                                            setData("activity", e.target.value)
                                        }
                                        className="dark:bg-gray-300"
                                        id="activity"
                                        aria-describedby="activity-help"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="activity">
                                        Penanggungjawab
                                    </label>
                                    <Dropdown
                                        value={data.cazh_pic}
                                        onChange={(e) => {
                                            setData("cazh_pic", e.target.value);
                                        }}
                                        options={users}
                                        optionLabel="name"
                                        optionValue="name"
                                        placeholder="Pilih Penanggungjawab"
                                        filter
                                        valueTemplate={selectedOptionTemplate}
                                        itemTemplate={optionTemplate}
                                        className="w-full md:w-14rem"
                                        editable
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="price">
                                        Estimasi Waktu
                                    </label>
                                    <InputText
                                        value={data.duration}
                                        onChange={(e) =>
                                            setData("duration", e.target.value)
                                        }
                                        className="dark:bg-gray-300"
                                        id="duration"
                                        aria-describedby="duration-help"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="estimation_date">
                                        Tanggal
                                    </label>
                                    <Calendar
                                        value={
                                            data.estimation_date
                                                ? new Date(data.estimation_date)
                                                : null
                                        }
                                        style={{ height: "35px" }}
                                        onChange={(e) => {
                                            setData(
                                                "estimation_date",
                                                e.target.value
                                            );
                                        }}
                                        showIcon
                                        dateFormat="dd/mm/yy"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="realization">
                                        Realisasi
                                    </label>
                                    <Calendar
                                        value={
                                            data.realization_date
                                                ? new Date(
                                                      data.realization_date
                                                  )
                                                : null
                                        }
                                        style={{ height: "35px" }}
                                        onChange={(e) => {
                                            setData(
                                                "realization_date",
                                                e.target.value
                                            );
                                        }}
                                        showIcon
                                        dateFormat="dd/mm/yy"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="realization">
                                        Bukti (foto)
                                    </label>
                                    <div className="App">
                                        {data.realization !== null &&
                                        typeof data.realization == "string" ? (
                                            <>
                                                <FilePond
                                                    files={
                                                        "/storage/" +
                                                        data.realization
                                                    }
                                                    onaddfile={(
                                                        error,
                                                        fileItems
                                                    ) => {
                                                        if (!error) {
                                                            setData(
                                                                "realization",
                                                                fileItems.file
                                                            );
                                                        }
                                                    }}
                                                    onremovefile={() => {
                                                        setData(
                                                            "realization",
                                                            null
                                                        );
                                                    }}
                                                    maxFileSize="2mb"
                                                    labelMaxFileSizeExceeded="File terlalu besar"
                                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <FilePond
                                                    onaddfile={(
                                                        error,
                                                        fileItems
                                                    ) => {
                                                        if (!error) {
                                                            setData(
                                                                "realization",
                                                                fileItems.file
                                                            );
                                                        }
                                                    }}
                                                    onremovefile={() => {
                                                        setData(
                                                            "realization",
                                                            null
                                                        );
                                                    }}
                                                    maxFileSize="2mb"
                                                    labelMaxFileSizeExceeded="File terlalu besar"
                                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="information">Catatan</label>
                                    <InputTextarea
                                        value={data.information}
                                        onChange={(e) =>
                                            setData(
                                                "information",
                                                e.target.value
                                            )
                                        }
                                        rows={5}
                                        cols={30}
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
                </div>
            </div>
        </DashboardLayout>
    );
}
