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
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Index({ auth }) {
    const [slas, setSlas] = useState("");
    const [positions, setPositions] = useState("");
    const [isLoadingData, setIsLoadingData] = useState(false);
    const dummyArray = Array.from({ length: 5 }, (v, i) => i);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [modalEditActivityIsVisible, setModalEditActivityIsVisible] =
        useState(false);
    const [expandedRows, setExpandedRows] = useState(null);
    useState(false);
    const toast = useRef(null);
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
        realization: "",
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

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {permissions.includes("edit produk") && (
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
                {permissions.includes("hapus produk") && (
                    <Button
                        icon="pi pi-trash"
                        rounded
                        outlined
                        severity="danger"
                        onClick={() => {
                            handleDeleteActivity(rowData);
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
                {permissions.includes("hapus produk") && (
                    <Button
                        icon="pi pi-trash"
                        rounded
                        outlined
                        severity="danger"
                        onClick={() => {
                            handleDeleteActivity(rowData);
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

    const handleEditActivity = (activity) => {
        setData((data) => ({
            ...data,
            uuid: activity.uuid,
            sla_id: activity.sla_id,
            activity: activity.activity,
            cazh_pic: activity.cazh_pic,
            duration: activity.duration,
            estimation_date: activity.estimation_date,
            realization: activity.realization,
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

    const allowExpansion = (rowData) => {
        return rowData.activities.length > 0;
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="px-14 py-5 flex">
                <DataTable
                    headerClassName="bg-red-500"
                    value={data.activities}
                    className=""
                >
                    <Column
                        header="No"
                        body={(_, { rowIndex }) => rowIndex + 1}
                        style={{ width: "1rem" }}
                        className="dark:border-none"
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    />
                    <Column
                        field="activity"
                        header="Tahapan"
                        style={{ minWidth: "10rem" }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="cazh_pic"
                        header="Penanggungjawab"
                        style={{ minWidth: "8rem" }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="duration"
                        header="Estimasi Waktu"
                        style={{ minWidth: "8rem" }}
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
                        style={{ minWidth: "8rem" }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="realization"
                        body={(rowData) => {
                            return rowData.realization ?? "belum diisi";
                        }}
                        header="Realisasi"
                        style={{ minWidth: "12rem" }}
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
            put(`/activity/${data.uuid}`, {
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
                        emptyMessage="Produk tidak ditemukan."
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
                        <Column
                            field="code"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Kode"
                            align="left"
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        <Column
                            field="partner_name"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Lembaga"
                            align="left"
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        <Column
                            field="partner_address"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Alamat Lembaga"
                            align="left"
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        <Column
                            field="partner_phone_number"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Nomor Telepon Lembaga"
                            align="left"
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        <Column
                            field="partner_pic"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="PIC Lembaga"
                            align="left"
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        <Column
                            field="partner_pic_email"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Email PIC"
                            align="left"
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        <Column
                            field="partner_pic_number"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Nomor Telepon PIC"
                            align="left"
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        <Column
                            body={(rowData) => {
                                return rowData.sla_doc == "tes" ? (
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
                                    <a
                                        href={BASE_URL + "/" + rowData.sla_doc}
                                        download={`MOU_${rowData.partner_name}`}
                                        class="p-button font-bold text-center rounded-full block pi pi-file-pdf"
                                    ></a>
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
                {console.log(data)}
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
                                        options={positions}
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
                                    <InputTextarea
                                        className="dark:bg-gray-300"
                                        value={data.realization}
                                        onChange={(e) =>
                                            setData(
                                                "realization",
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
