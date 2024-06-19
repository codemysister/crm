import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Link, useForm } from "@inertiajs/react";
import {
    ConfirmDialog,
    ConfirmDialog as ConfirmDialog2,
    confirmDialog,
    confirmDialog as confirmDialog2,
} from "primereact/confirmdialog";
import { TabPanel, TabView } from "primereact/tabview";
import SkeletonDatatable from "@/Components/SkeletonDatatable";
import HeaderDatatable from "@/Components/HeaderDatatable";
import Modal from "@/Components/Modal";
import { ColorPicker } from "primereact/colorpicker";
import { Toast } from "primereact/toast";
import InputError from "@/Components/InputError";
import HeaderModule from "@/Components/HeaderModule";
import { OverlayPanel } from "primereact/overlaypanel";
import getViewportSize from "@/Utils/getViewportSize";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
import { Image } from "primereact/image";
import { formateDate } from "@/Utils/formatDate";
import ReactPlayer from "react-player";
import LogComponent from "@/Components/LogComponent";
import ArsipComponent from "@/Components/ArsipComponent";
import { InputNumber } from "primereact/inputnumber";
import { Badge } from "primereact/badge";
import { handleSelectedDetailInstitution } from "@/Utils/handleSelectedDetailInstitution";
registerPlugin(FilePondPluginFileValidateSize);

const Index = ({ auth, usersProp, partnersProp, statusesProp }) => {
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const [cards, setCards] = useState(null);
    const [partners, setPartners] = useState(partnersProp);
    const [status, setStatus] = useState();
    const [users, setUsers] = useState(usersProp);
    const [statuses, setStatuses] = useState(statusesProp);
    const [confirmIsVisible, setConfirmIsVisible] = useState(false);
    const [selectedData, setSelectedStatus] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const toast = useRef(null);
    const action = useRef(null);
    const viewportSize = getViewportSize();
    const isMobile = viewportSize.width < 992;
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [modalCardIsVisible, setModalCardIsVisible] = useState(false);
    const [modalEditCardIsVisible, setModalEditCardIsVisible] = useState(false);

    const { roles, permissions, data: currentUser } = auth.user;
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const {
        data,
        setData,
        post,
        put,
        patch,
        delete: destroy,
        reset,
        processing,
        errors,
        clearErrors,
    } = useForm({
        id: null,
        uuid: null,
        status: { id: statuses[0].id, name: statuses[0].name },
        partner: { id: null, name: null },
        pcs: 0,
        price: 0,
        total: 0,
        approve_date: null,
        design_date: null,
        print_date: null,
        delivery_date: null,
        revision_detail: null,
    });

    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    useEffect(() => {
        if (activeIndexTab == 0) {
            fetchData(getCards);
        }
    }, [activeIndexTab]);

    useEffect(() => {
        if (data.price !== null && data.pcs !== null) {
            let total = data.price * data.pcs;
            setData({
                ...data,
                total: total,
            });
        }
    }, [data.price, data.pcs]);

    const getCards = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/cards");
        let data = await response.json();

        setCards((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            setPreRenderLoad((prev) => (prev = false));
            // await getLog();
        };

        fetchData();
    }, []);

    const fetchData = async (fnc) => {
        try {
            await Promise.all([fnc()]);
            setIsLoadingData(false);
            setPreRenderLoad((prev) => (prev = false));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData(getCards);
        setStatus((prev) => data.status?.name ?? null);
    }, []);

    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <i
                    className="pi pi-ellipsis-h pointer cursor-pointer"
                    onClick={(event) => {
                        setSelectedStatus(rowData);
                        action.current.toggle(event);
                    }}
                ></i>
            </React.Fragment>
        );
    };

    const handleEditCard = (card) => {
        setData({
            ...data,
            uuid: card.uuid,
            partner: card.partner,
            status: card.status,
            price: card.price,
            type: card.type,
            address: card.address,
            revision_detail: card.revision_detail,
            pcs: card.pcs,
            total: card.total,
            google_drive_link: card.google_drive_link,
            approve_date: card.approve_date,
            design_date: card.design_date,
            print_date: card.print_date,
            delivery_date: card.delivery_date,
        });
        setStatus((prev) => card.status.name);
        clearErrors();
        setModalEditCardIsVisible(true);
    };

    const handleDeleteCard = () => {
        destroy("cards/" + selectedData.uuid, {
            onSuccess: () => {
                getCards();
                showSuccess("Hapus");
                reset();
            },
            onError: () => {
                showError("Hapus");
            },
        });
    };

    const confirmDeleteCard = () => {
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

    const headerCard = () => {
        return (
            <HeaderDatatable
                filters={filters}
                setFilters={setFilters}
            ></HeaderDatatable>
        );
    };

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

    const handleSubmitForm = (e, type) => {
        e.preventDefault();
        if (type === "tambah") {
            post("/cards", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalCardIsVisible((prev) => false);
                    getCards();
                    reset();
                    setActiveIndexTab((prev) => (prev = 0));
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            put("/cards/" + data.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditCardIsVisible((prev) => false);
                    getCards();
                    reset();
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
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

    const columns = [
        {
            header: "Lembaga",
            frozen: !isMobile,
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
            body: (rowData) => (
                <button
                    onClick={() => handleSelectedDetailInstitution(rowData)}
                    className="hover:text-blue-700 text-left"
                >
                    {rowData.partner.name}
                </button>
            ),
        },

        {
            field: "status",
            header: "Status",
            frozen: !isMobile,
            style: !isMobile
                ? {
                      width: "max-content",
                      whiteSpace: "nowrap",
                  }
                : null,
            body: (rowData) => {
                return (
                    <Badge
                        value={rowData.status.name}
                        className="text-white"
                        style={{
                            backgroundColor: "#" + rowData.status.color,
                        }}
                    ></Badge>
                );
            },
        },

        {
            field: "revision",
            header: "Revisi",
            frozen: !isMobile,
            style: !isMobile
                ? {
                      width: "max-content",
                      whiteSpace: "nowrap",
                  }
                : null,
            body: (rowData) => {
                if (rowData.status.name == "revisi") {
                    return rowData.revision_detail;
                } else {
                    return "-";
                }
            },
        },
        {
            field: "pcs",
            header: "Jumlah kartu",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
            body: (rowData) => {
                return rowData.pcs;
            },
        },
        {
            field: "type",
            header: "Tipe",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
            body: (rowData) => {
                return rowData.type;
            },
        },
        {
            field: "price",
            header: "Harga per kartu",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
            body: (rowData) => {
                return "Rp" + rowData.price.toLocaleString("id");
            },
        },
        {
            field: "total",
            header: "Total",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
            body: (rowData) => {
                return "Rp" + rowData.total.toLocaleString("id");
            },
        },
        {
            field: "address",
            header: "Alamat pengiriman",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },

        {
            field: "google_drive_link",
            header: "Link Google Drive",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
            body: (rowData) => {
                return (
                    <a
                        className="text-blue-600 underline"
                        href={rowData.google_drive_link}
                        target="_blank"
                    >
                        drive
                    </a>
                );
            },
        },
        {
            field: "approval_date",
            header: "Tanggal Approval",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
            body: (rowData) => {
                return rowData.approval_date
                    ? formateDate(rowData.approval_date)
                    : "-";
            },
        },
        {
            field: "design_date",
            header: "Tanggal Design",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
            body: (rowData) => {
                return rowData.design_date
                    ? formateDate(rowData.design_date)
                    : "-";
            },
        },
        {
            field: "print_date",
            header: "Tanggal Cetak",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
            body: (rowData) => {
                return rowData.print_date
                    ? formateDate(rowData.print_date)
                    : "-";
            },
        },
        {
            field: "delivery_date",
            header: "Tanggal Pengiriman",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
            body: (rowData) => {
                return rowData.delivery_date
                    ? formateDate(rowData.delivery_date)
                    : "-";
            },
        },
        {
            field: "arrive_date",
            header: "Tanggal Sampai",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
            body: (rowData) => {
                return rowData.arrive_date
                    ? formateDate(rowData.arrive_date)
                    : "-";
            },
        },
    ];

    let cardCategories = [{ type: "digital" }, { type: "cetak" }];

    const objectKeyToIndo = (key) => {
        let keyIndo;
        if (key == "partner.name") {
            keyIndo = "Lembaga";
        } else if (key == "status.name") {
            keyIndo = "Status";
        } else if (key == "pcs") {
            keyIndo = "Jumlah";
        } else if (key == "price") {
            keyIndo = "Harga";
        } else if (key == "total") {
            keyIndo = "Total";
        } else if (key == "google_drive_link") {
            keyIndo = "Link google drive";
        } else if (key == "type") {
            keyIndo = "Tipe kartu";
        } else if (key == "approval_date") {
            keyIndo = "Tanggal Approval";
        } else if (key == "design_date") {
            keyIndo = "Tanggal Design";
        } else if (key == "delivery_date") {
            keyIndo = "Tanggal Pengiriman";
        } else if (key == "arrive_date") {
            keyIndo = "Tanggal Sampai";
        }

        return keyIndo;
    };

    const globalFilterFields = ["partner.name", "status.name", "category"];

    if (preRenderLoad) {
        return <SkeletonDatatable auth={auth} />;
    }

    return (
        <DashboardLayout auth={auth.user} className="">
            {/* Tombol Aksi */}
            <OverlayPanel
                className=" shadow-md p-1 dark:bg-slate-900 dark:text-gray-300"
                ref={action}
            >
                <div className="flex flex-col flex-wrap w-full">
                    <Button
                        icon="pi pi-pencil"
                        label="edit"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            handleEditCard(selectedData);
                        }}
                    />
                    <Button
                        icon="pi pi-trash"
                        label="hapus"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            confirmDeleteCard();
                        }}
                    />
                </div>
            </OverlayPanel>

            <HeaderModule title="Kartu">
                {/* {permissions.includes("tambah produk") && ( */}
                <Button
                    label="Tambah"
                    className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                    icon={addButtonIcon}
                    onClick={() => {
                        setModalCardIsVisible((prev) => (prev = true));
                        reset();
                        clearErrors();
                    }}
                    aria-controls="popup_menu_right"
                    aria-haspopup
                />
                {/* )} */}
            </HeaderModule>

            <Toast ref={toast} />

            <TabView
                activeIndex={activeIndexTab}
                onTabChange={(e) => {
                    setActiveIndexTab(e.index);
                }}
                className="mt-2"
            >
                <TabPanel header="Semua Kartu">
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
                                accept={handleDeleteCard}
                            />

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
                                        rowsPerPageOptions={[5, 10, 25, 50]}
                                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                        currentPageReportTemplate="{first} - {last} dari {totalRecords}"
                                        filters={filters}
                                        rows={10}
                                        emptyMessage="Kartu tidak ditemukan."
                                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                                        header={headerCard}
                                        globalFilterFields={globalFilterFields}
                                        value={cards}
                                        dataKey="id"
                                    >
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
                                        {columns.map((col) => {
                                            return (
                                                <Column
                                                    field={col.field}
                                                    header={col.header}
                                                    body={col.body}
                                                    style={col.style}
                                                    frozen={col.frozen}
                                                    align="left"
                                                    className="dark:border-none bg-white"
                                                    headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                                ></Column>
                                            );
                                        })}
                                        <Column
                                            field="created_at"
                                            className="dark:border-none bg-white lg:whitespace-nowrap lg:w-max"
                                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                            header="Tanggal Input"
                                            align="left"
                                            body={(rowData) => {
                                                return formateDate(
                                                    rowData.created_at
                                                );
                                            }}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>
                                        <Column
                                            field="created_by"
                                            className="dark:border-none bg-white lg:whitespace-nowrap lg:w-max"
                                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                            header="Diinput Oleh"
                                            align="left"
                                            body={(rowData) => {
                                                return rowData.created_by.name;
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
                        <LogComponent
                            auth={auth}
                            fetchUrl={"/api/cards/logs"}
                            filterUrl={"/cards/logs/filter"}
                            deleteUrl={"/cards/logs"}
                            objectKeyToIndo={objectKeyToIndo}
                            users={users}
                            showSuccess={showSuccess}
                            showError={showError}
                        />
                    )}
                </TabPanel>

                <TabPanel header="Arsip">
                    {activeIndexTab == 2 && (
                        <ArsipComponent
                            auth={auth}
                            users={users}
                            fetchUrl={"/api/cards/arsip"}
                            forceDeleteUrl={"/cards/{id}/force"}
                            restoreUrl={"/cards/{id}/restore"}
                            filterUrl={"/cards/arsip/filter"}
                            columns={columns}
                            showSuccess={showSuccess}
                            showError={showError}
                            globalFilterFields={globalFilterFields}
                        />
                    )}
                </TabPanel>
            </TabView>

            {/* Modal tambah kartu*/}
            <Modal
                header="Kartu"
                modalVisible={modalCardIsVisible}
                setModalVisible={setModalCardIsVisible}
            >
                <form onSubmit={(e) => handleSubmitForm(e, "tambah")}>
                    <div className="flex flex-col justify-around gap-4 mt-4">
                        <div className="flex flex-col">
                            <label htmlFor="lembaga">Lembaga *</label>
                            <Dropdown
                                value={data.partner}
                                dataKey="id"
                                onChange={(e) => {
                                    setData((data) => ({
                                        ...data,
                                        partner: {
                                            ...data.partner,
                                            id: e.target.value.id,
                                            name: e.target.value.name,
                                        },
                                        pcs: e.target.value.total_members,
                                        type: e.target.value.price_list
                                            ? JSON.parse(
                                                  e.target.value.price_list
                                                      .price_card
                                              ).type
                                            : null,
                                        price: e.target.value.price_list
                                            ? JSON.parse(
                                                  e.target.value.price_list
                                                      .price_card
                                              ).price
                                            : 0,
                                    }));
                                }}
                                options={partners}
                                optionLabel="name"
                                placeholder="Pilih Lembaga"
                                filter
                                valueTemplate={selectedOptionTemplate}
                                itemTemplate={optionTemplate}
                                className="w-full md:w-14rem"
                            />
                            <InputError
                                message={errors["partner.name"]}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="price">Harga *</label>
                            <InputNumber
                                value={data.price}
                                onChange={(e) => {
                                    let total = e.value * data.pcs;
                                    setData({
                                        ...data,
                                        price: e.value,
                                        total: total,
                                    });
                                }}
                                className="dark:bg-gray-300"
                                id="price"
                                aria-describedby="price-help"
                                defaultValue={0}
                                locale="id-ID"
                            />
                            <InputError
                                message={errors.price}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="type">Tipe *</label>
                            <Dropdown
                                dataKey="type"
                                value={data.type}
                                onChange={(e) => setData("type", e.value)}
                                options={cardCategories}
                                optionLabel="type"
                                optionValue="type"
                                placeholder="kategori"
                                className="w-full md:w-14rem"
                            />
                            <InputError
                                message={errors.type}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="pcs">Jumlah (pcs) *</label>
                            <InputNumber
                                value={data.pcs}
                                onChange={(e) => {
                                    let total = e.value * data.price;
                                    setData({
                                        ...data,
                                        pcs: e.value,
                                        total: total,
                                    });
                                }}
                                className="dark:bg-gray-300"
                                id="pcs"
                                locale="id-ID"
                                aria-describedby="pcs-help"
                            />
                            <InputError message={errors.pcs} className="mt-2" />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="total">Total *</label>
                            <InputNumber
                                value={data.total}
                                onChange={(e) => setData("total", e.value)}
                                className="dark:bg-gray-300"
                                id="total"
                                aria-describedby="total-help"
                                defaultValue={0}
                                disabled
                                locale="id-ID"
                            />
                            <InputError
                                message={errors.total}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="address">Alamat pengiriman *</label>
                            <InputText
                                value={data.address}
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        address: e.target.value,
                                    });
                                }}
                                className="dark:bg-gray-300"
                                id="address"
                                aria-describedby="address-help"
                            />
                            <InputError
                                message={errors.address}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="google_drive_link">
                                Link Google Drive *
                            </label>
                            <InputText
                                value={data.google_drive_link}
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        google_drive_link: e.target.value,
                                    });
                                }}
                                className="dark:bg-gray-300"
                                id="google_drive_link"
                                aria-describedby="google_drive_link-help"
                            />
                            <InputError
                                message={errors.google_drive_link}
                                className="mt-2"
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
            </Modal>

            {/* Modal edit kartu*/}
            <Modal
                header="Edit Kartu"
                modalVisible={modalEditCardIsVisible}
                setModalVisible={setModalEditCardIsVisible}
            >
                <form onSubmit={(e) => handleSubmitForm(e, "update")}>
                    <div className="flex flex-col justify-around gap-4 mt-4">
                        {currentUser.roles[0].name == "account manager" && (
                            <>
                                <div className="flex flex-col">
                                    <label htmlFor="lembaga">Lembaga *</label>
                                    <Dropdown
                                        value={data.partner}
                                        dataKey="id"
                                        onChange={(e) => {
                                            setData((data) => ({
                                                ...data,
                                                partner: {
                                                    ...data.partner,
                                                    id: e.target.value.id,
                                                    name: e.target.value.name,
                                                },
                                                pcs: e.target.value
                                                    .total_members,
                                                type: e.target.value.price_list
                                                    ? JSON.parse(
                                                          e.target.value
                                                              .price_list
                                                              .price_card
                                                      ).type
                                                    : null,
                                                price: e.target.value.price_list
                                                    ? JSON.parse(
                                                          e.target.value
                                                              .price_list
                                                              .price_card
                                                      ).price
                                                    : 0,
                                            }));
                                        }}
                                        options={partners}
                                        optionLabel="name"
                                        placeholder="Pilih Lembaga"
                                        filter
                                        valueTemplate={selectedOptionTemplate}
                                        itemTemplate={optionTemplate}
                                        className="w-full md:w-14rem"
                                    />
                                    <InputError
                                        message={errors["partner.name"]}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="address">
                                        Alamat pengiriman *
                                    </label>
                                    <InputText
                                        value={data.address}
                                        onChange={(e) => {
                                            setData({
                                                ...data,
                                                address: e.target.value,
                                            });
                                        }}
                                        className="dark:bg-gray-300"
                                        id="address"
                                        aria-describedby="address-help"
                                    />
                                    <InputError
                                        message={errors.address}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="price">Harga *</label>
                                    <InputNumber
                                        value={data.price}
                                        onChange={(e) => {
                                            let total = e.value * data.pcs;
                                            setData({
                                                ...data,
                                                price: e.value,
                                                total: total,
                                            });
                                        }}
                                        className="dark:bg-gray-300"
                                        id="price"
                                        aria-describedby="price-help"
                                        defaultValue={0}
                                        locale="id-ID"
                                    />
                                    <InputError
                                        message={errors.price}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="type">Tipe *</label>
                                    <Dropdown
                                        dataKey="type"
                                        value={data.type}
                                        onChange={(e) =>
                                            setData("type", e.value)
                                        }
                                        options={cardCategories}
                                        optionLabel="type"
                                        optionValue="type"
                                        placeholder="kategori"
                                        className="w-full md:w-14rem"
                                    />
                                    <InputError
                                        message={errors.type}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="pcs">Jumlah (pcs) *</label>
                                    <InputNumber
                                        value={data.pcs}
                                        onChange={(e) => {
                                            let total = e.value * data.price;
                                            setData({
                                                ...data,
                                                pcs: e.value,
                                                total: total,
                                            });
                                        }}
                                        className="dark:bg-gray-300"
                                        id="pcs"
                                        locale="id-ID"
                                        aria-describedby="pcs-help"
                                    />
                                    <InputError
                                        message={errors.pcs}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="total">Total *</label>
                                    <InputNumber
                                        value={data.total}
                                        onChange={(e) =>
                                            setData("total", e.value)
                                        }
                                        className="dark:bg-gray-300"
                                        id="total"
                                        aria-describedby="total-help"
                                        defaultValue={0}
                                        disabled
                                        locale="id-ID"
                                    />
                                    <InputError
                                        message={errors.total}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="google_drive_link">
                                        Link Google Drive *
                                    </label>
                                    <InputText
                                        value={data.google_drive_link}
                                        onChange={(e) => {
                                            setData({
                                                ...data,
                                                google_drive_link:
                                                    e.target.value,
                                            });
                                        }}
                                        className="dark:bg-gray-300"
                                        id="google_drive_link"
                                        aria-describedby="google_drive_link-help"
                                    />
                                    <InputError
                                        message={errors.google_drive_link}
                                        className="mt-2"
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex flex-col">
                            <label htmlFor="status">Status *</label>
                            <Dropdown
                                dataKey="name"
                                value={data.status}
                                onChange={(e) => {
                                    setData("status", e.target.value);
                                    setStatus((prev) => e.target.value.name);
                                }}
                                options={statuses}
                                optionLabel="name"
                                placeholder="Pilih Status"
                                className="w-full md:w-14rem"
                            />
                            <InputError
                                message={errors["status.name"]}
                                className="mt-2"
                            />
                        </div>
                        {status == "revisi" && (
                            <div className="flex flex-col">
                                <label htmlFor="revision_detail">
                                    Detail Revisi
                                </label>
                                <InputText
                                    value={data.revision_detail}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            revision_detail: e.target.value,
                                        });
                                    }}
                                    className="dark:bg-gray-300"
                                    id="revision_detail"
                                    aria-describedby="revision_detail-help"
                                />
                                <InputError
                                    message={errors.revision_detail}
                                    className="mt-2"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-center mt-5">
                        <Button
                            label="Submit"
                            disabled={processing}
                            className="bg-purple-600 text-sm shadow-md rounded-lg"
                        />
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
};

export default Index;
