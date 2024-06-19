import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { router, useForm } from "@inertiajs/react";
import {
    ConfirmDialog,
    ConfirmDialog as ConfirmDialog2,
    confirmDialog,
} from "primereact/confirmdialog";
import { TabPanel, TabView } from "primereact/tabview";
import SkeletonDatatable from "@/Components/SkeletonDatatable";
import HeaderDatatable from "@/Components/HeaderDatatable";
import { Toast } from "primereact/toast";
import InputError from "@/Components/InputError";
import { Badge } from "primereact/badge";
import HeaderModule from "@/Components/HeaderModule";
import { OverlayPanel } from "primereact/overlaypanel";
import { Dialog } from "primereact/dialog";
import { Sidebar } from "primereact/sidebar";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
import Log from "./Log";
import Arsip from "./Arsip";
import DetailLead from "./DetailLead/DetailLead";
import getViewportSize from "../../Utils/getViewportSize";
import { formateDate } from "../../Utils/formatDate";
import ArsipComponent from "@/Components/ArsipComponent";
import { useCallback } from "react";
import { DatatableLead } from "./Component/DatatableLead";
import { Calendar } from "primereact/calendar";
import LogComponent from "@/Components/LogComponent";
import PermissionErrorDialog from "@/Components/PermissionErrorDialog";
import { InputMask } from "primereact/inputmask";
registerPlugin(FilePondPluginFileValidateSize);

export default function Index({
    auth,
    leadDetail,
    usersProp,
    statusProp,
    salesProp,
}) {
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const [leads, setLeads] = useState(null);
    const [detailLead, setDetailLead] = useState(null);
    const [users, setUsers] = useState(usersProp);
    const [status, setStatus] = useState(statusProp);
    const [sales, setSales] = useState(salesProp);
    const [confirmIsVisible, setConfirmIsVisible] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const viewportSize = getViewportSize();
    const isMobile = viewportSize.width < 992;
    const toast = useRef(null);
    const action = useRef(null);
    const menuAddRef = useRef(null);
    const btnFilterRef = useRef(null);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [modalLeadIsVisible, setModalLeadIsVisible] = useState(false);
    const [modalEditLeadIsVisible, setModalEditLeadIsVisible] = useState(false);
    const [modalStatusIsVisible, setModalStatusIsVisible] = useState(false);
    const [sidebarFilter, setSidebarFilter] = useState(null);
    const [modalImportLeadIsVisible, setModalImportLeadIsVisible] =
        useState(false);
    const [permissionErrorIsVisible, setPermissionErrorIsVisible] =
        useState(false);
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
        name: null,
        npwp: null,
        address: null,
        pic: null,
        total_members: null,
        excel: null,
    });

    const {
        data: dataFilter,
        setData: setDataFilter,
        get: getFilter,
        post: postFilter,
        reset: resetFilter,
        processing: processingFilter,
        errors: errorsFilter,
        clearErrors: clearErrorsFilter,
    } = useForm({
        user: null,
        status: null,
        address: null,
        input_date: { start: null, end: null },
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
            fetchData(getLeads);
        }
    }, [activeIndexTab]);

    const getLeads = async () => {
        setIsLoadingData(true);

        let response = await fetch(`/api/leads`);
        let data = await response.json();
        setLeads(data.leads);
        setIsLoadingData(false);
    };

    useEffect(() => {
        if (leadDetail) {
            getSelectedDetailLead(leadDetail);
            setActiveIndexTab(3);
        }
        const fetchData = async () => {
            setPreRenderLoad((prev) => (prev = false));
            await getLeads();
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
        fetchData(getLeads);
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
                        setSelectedLead(rowData);
                        action.current.toggle(event);
                    }}
                ></i>
            </React.Fragment>
        );
    };

    const handleEditLead = (lead) => {
        setData({
            ...data,
            uuid: lead.uuid,
            name: lead.name,
            npwp: lead.npwp,
            pic: lead.pic,
            sales: lead.sales,
            phone_number: lead.phone_number,
            address: lead.address,
            total_members: lead.total_members,
            status: lead.status,
        });
        clearErrors();
        setModalEditLeadIsVisible(true);
    };

    const handleDeleteLead = () => {
        destroy("leads/" + selectedLead.uuid, {
            onSuccess: () => {
                getLeads();
                showSuccess("Hapus");
                reset();
            },
            onError: (e) => {
                showError(e);
            },
        });
    };

    const confirmDeleteStatus = () => {
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

    const exportExcel = () => {
        const exports = leads.map((data) => {
            return {
                Nama: data.name,
                Status: data.status ? data.status.name : "",
                PIC: data.pic ? data.pic : "",
                NomorTelepon: data.phone_number ? data.phone_number : "",
                Alamat: data.address ? data.address : "",
                JumlahMember: data.total_members ? data.total_members : "",
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

            saveAsExcelFile(excelBuffer, "leads");
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

    const getSelectedDetailLead = async (lead) => {
        setIsLoadingData((prev) => (prev = true));
        let response = await fetch("/leads/" + lead.uuid);
        let data = await response.json();
        setDetailLead((prev) => (prev = data));
        setIsLoadingData((prev) => (prev = false));
    };

    const handleSelectedDetailLead = (lead) => {
        getSelectedDetailLead(lead);
        setActiveIndexTab(3);
    };

    const handleFilter = async (e) => {
        e.preventDefault();
        setIsLoadingData(true);
        const formData = {
            user: dataFilter.user,
            status: dataFilter.status,
            address: dataFilter.address,
            input_date: dataFilter.input_date,
        };

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");

        const response = await axios.post("/leads/filter", formData, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
        });
        const data = response.data;
        setLeads(data);
        setSidebarFilter(false);
        setIsLoadingData(false);
    };

    const handleSubmitForm = (e, type) => {
        e.preventDefault();
        if (type === "tambah") {
            post("/leads", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalLeadIsVisible((prev) => false);
                    getLeads();
                    reset();
                    setActiveIndexTab((prev) => (prev = 0));
                },
                onError: (e) => {
                    showError("Tambah");
                },
            });
        } else {
            put("/leads/" + data.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditLeadIsVisible((prev) => false);
                    getLeads();
                    reset();
                },
                onError: (e) => {
                    showError("Update");
                },
            });
        }
    };

    const handleSubmitImportLeadForm = (e) => {
        e.preventDefault();
        post("/leads/import", {
            onSuccess: () => {
                showSuccess("Import");
                setModalImportLeadIsVisible((prev) => (prev = false));
                getLeads();
                reset();
            },
            onError: (e) => {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: e.error,
                    life: 3000,
                });
            },
        });
    };

    const globalFilterFields = [
        ["name", "status.name", "npwp", "address", "phone_number", "pic"],
    ];

    const columns = [
        {
            field: "name",
            header: "Lembaga",
            frozen: !isMobile,
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
            body: (rowData) => {
                return (
                    <button
                        onClick={() => handleSelectedDetailLead(rowData)}
                        className="hover:text-blue-700 text-left"
                    >
                        {rowData.name}
                    </button>
                );
            },
        },
        {
            field: "npwp",
            header: "NPWP",
            frozen: !isMobile,
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },

        {
            field: "status",
            header: "Status",
            frozen: !isMobile,
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
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
            field: "sales",
            header: "Sales",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
            body: (rowData) => {
                return rowData.sales ? rowData.sales.name : "-";
            },
        },

        {
            field: "phone_number",
            header: "Nomor Telepon",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },

        {
            field: "address",
            header: "Alamat",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },

        {
            field: "pic",
            header: "PIC",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },
    ];

    const objectKeyToIndo = (key) => {
        let keyIndo;
        if (key == "name") {
            keyIndo = "Lembaga";
        } else if (key == "status.name") {
            keyIndo = "Status";
        } else if (key == "npwp") {
            keyIndo = "NPWP";
        } else if (key == "pic") {
            keyIndo = "PIC";
        } else if (key == "sales.name") {
            keyIndo = "Sales";
        } else if (key == "total_members") {
            keyIndo = "Jumlah Member";
        } else if (key == "address") {
            keyIndo = "Alamat";
        } else if (key == "status.color") {
            keyIndo = "Warna status";
        } else if (key == "note_status") {
            keyIndo = "Keterangan perubahan status";
        }

        return keyIndo;
    };

    if (preRenderLoad) {
        return <SkeletonDatatable auth={auth} />;
    }

    return (
        <DashboardLayout auth={auth.user} className="">
            {/* Tombol Aksi */}

            <PermissionErrorDialog
                dialogIsVisible={permissionErrorIsVisible}
                setDialogVisible={setPermissionErrorIsVisible}
            />

            <OverlayPanel
                className=" shadow-md p-1 dark:bg-slate-800 dark:text-gray-300"
                ref={action}
            >
                <div className="flex flex-col flex-wrap w-full">
                    <Button
                        icon="pi pi-pencil"
                        label="edit"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            if (
                                roles.includes("super admin") ||
                                (permissions.includes("edit lead") &&
                                    selectedLead.created_by.id ==
                                        currentUser.id)
                            ) {
                                handleEditLead(selectedLead);
                            } else {
                                setPermissionErrorIsVisible(
                                    (prev) => (prev = true)
                                );
                            }
                        }}
                    />
                    <Button
                        icon="pi pi-trash"
                        label="hapus"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            if (
                                roles.includes("super admin") ||
                                (permissions.includes("hapus lead") &&
                                    selectedLead.created_by.id ==
                                        currentUser.id)
                            ) {
                                confirmDeleteStatus();
                            } else {
                                setPermissionErrorIsVisible(
                                    (prev) => (prev = true)
                                );
                            }
                        }}
                    />
                </div>
            </OverlayPanel>

            <Toast ref={toast} />

            <HeaderModule title="Lead">
                {permissions.includes("tambah lead") && (
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={(event) => menuAddRef.current.toggle(event)}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                )}

                <OverlayPanel
                    ref={menuAddRef}
                    className="shadow-md dark:bg-slate-800 dark:text-white"
                >
                    <div className="flex flex-col text-left">
                        <span>
                            <Button
                                label="satuan"
                                className="bg-transparent hover:bg-slate-200 w-full text-slate-500 dark:hover:text-slate-900 dark:text-white border-b-2 border-slate-400"
                                onClick={() => {
                                    setModalLeadIsVisible(
                                        (prev) => (prev = true)
                                    );
                                    reset();
                                    clearErrors();
                                }}
                                aria-controls="popup_menu_right"
                                aria-haspopup
                            />
                        </span>
                        <span>
                            <Button
                                label="import"
                                className="bg-transparent hover:bg-slate-200 w-full text-slate-500 dark:hover:text-slate-900 dark:text-white border-b-2 border-slate-400"
                                onClick={() => {
                                    setModalImportLeadIsVisible(
                                        (prev) => (prev = true)
                                    );
                                }}
                                aria-controls="popup_menu_right"
                                aria-haspopup
                            />
                        </span>
                    </div>
                </OverlayPanel>
            </HeaderModule>

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
                        <label htmlFor="address">Alamat</label>
                        <InputText
                            value={dataFilter.address}
                            onChange={(e) =>
                                setDataFilter("address", e.target.value)
                            }
                            className="dark:bg-gray-300"
                            id="address"
                            aria-describedby="address-help"
                        />
                        <InputError
                            message={errors["address"]}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col mt-3">
                        <label htmlFor="status">Status </label>
                        <Dropdown
                            value={dataFilter.status}
                            onChange={(e) => {
                                setDataFilter("status", e.target.value);
                            }}
                            options={status}
                            optionLabel="name"
                            placeholder="Pilih Status"
                            className="w-full md:w-14rem"
                        />
                        <InputError
                            message={errors["status"]}
                            className="mt-2"
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
                                btnFilterRef.current.click();
                            }}
                            className="outline-purple-600 outline-1 outline-dotted bg-transparent text-slate-700 dark:text-slate-300  text-sm shadow-md rounded-lg mr-2"
                        />
                    </div>
                </form>
            </Sidebar>

            <TabView
                activeIndex={activeIndexTab}
                onTabChange={(e) => {
                    setActiveIndexTab(e.index);
                }}
                className="mt-2"
            >
                <TabPanel header="Semua Lead">
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
                                accept={handleDeleteLead}
                            />

                            <div className="flex mx-auto flex-col justify-center mt-5 gap-5">
                                <div className="card p-fluid w-full h-full flex justify-center rounded-lg">
                                    <DatatableLead
                                        leads={leads}
                                        isLoadingData={isLoadingData}
                                        setSelectedLead={setSelectedLead}
                                        action={action}
                                        setSidebarFilter={setSidebarFilter}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </TabPanel>

                <TabPanel header="Log">
                    {activeIndexTab == 1 && (
                        <LogComponent
                            auth={auth}
                            fetchUrl={"/api/leads/logs"}
                            filterUrl={"/leads/logs/filter"}
                            deleteUrl={"/leads/logs"}
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
                            fetchUrl={"/api/leads/arsip"}
                            forceDeleteUrl={"/leads/{id}/force"}
                            restoreUrl={"/leads/{id}/restore"}
                            filterUrl={"/leads/arsip/filter"}
                            columns={columns}
                            showSuccess={showSuccess}
                            showError={showError}
                            globalFilterFields={globalFilterFields}
                        />
                    )}
                </TabPanel>

                <TabPanel header="Detail lead">
                    {activeIndexTab == 3 && (
                        <DetailLead
                            auth={auth}
                            leads={leads}
                            DetailLead={detailLead}
                            showSuccess={showSuccess}
                            showError={showError}
                            status={status}
                            isLoading={isLoadingData}
                            handleSelectedDetailLead={handleSelectedDetailLead}
                            permissionErrorIsVisible={permissionErrorIsVisible}
                            setPermissionErrorIsVisible={
                                setPermissionErrorIsVisible
                            }
                        />
                    )}
                </TabPanel>
            </TabView>

            {/* Modal tambah lead */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Lead"
                    headerClassName="dark:bg-slate-900 dark:text-white"
                    className="bg-white min-h-[500px] max-h-[80%] w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName="dark:bg-slate-900 dark:text-white"
                    visible={modalLeadIsVisible}
                    onHide={() => setModalLeadIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitForm(e, "tambah")}>
                        <div className="flex flex-col justify-around gap-4 mt-3">
                            <div className="flex flex-col">
                                <label htmlFor="name">Lembaga *</label>
                                <InputText
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="name"
                                    aria-describedby="name-help"
                                />
                                <InputError
                                    message={errors["name"]}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="name">NPWP *</label>
                                <InputMask
                                    keyfilter="int"
                                    value={data.npwp}
                                    onChange={(e) =>
                                        setData("npwp", e.target.value)
                                    }
                                    placeholder="99.999.999.9-999.999"
                                    mask="99.999.999.9-999.999"
                                    className="dark:bg-gray-300"
                                    id="npwp"
                                    aria-describedby="npwp-help"
                                />
                                <InputError
                                    message={errors["npwp"]}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="pic">PIC *</label>
                                <InputText
                                    value={data.pic}
                                    onChange={(e) =>
                                        setData("pic", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="pic"
                                    aria-describedby="pic-help"
                                />
                                <InputError
                                    message={errors["pic"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="sales">Pilih Sales *</label>
                                <Dropdown
                                    value={data.sales}
                                    onChange={(e) =>
                                        setData("sales", e.target.value)
                                    }
                                    options={sales}
                                    dataKey="id"
                                    optionLabel="name"
                                    placeholder="Pilih Sales"
                                    filter
                                    showClear
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                                <InputError
                                    message={errors["sales"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="phone_number">
                                    Nomor Telepon *
                                </label>
                                <InputText
                                    keyfilter="int"
                                    value={data.phone_number}
                                    onChange={(e) =>
                                        setData("phone_number", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="phone_number"
                                    aria-describedby="phone_number-help"
                                />
                                <InputError
                                    message={errors["phone_number"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="address">Alamat *</label>
                                <InputTextarea
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                    rows={5}
                                    cols={30}
                                />
                                <InputError
                                    message={errors["address"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="total_members">
                                    Jumlah Member *
                                </label>
                                <InputText
                                    keyfilter="int"
                                    value={data.total_members}
                                    onChange={(e) =>
                                        setData("total_members", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="total_members"
                                    aria-describedby="total_members-help"
                                />
                                <InputError
                                    message={errors["total_members"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="status">Status *</label>
                                <Dropdown
                                    value={data.status}
                                    onChange={(e) => {
                                        setData("status", e.target.value);
                                    }}
                                    dataKey="name"
                                    options={status}
                                    optionLabel="name"
                                    placeholder="Pilih Status"
                                    className="w-full md:w-14rem"
                                />
                                <InputError
                                    message={errors["status"]}
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
                </Dialog>
            </div>

            {/* Modal edit lead */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Lead"
                    headerClassName="dark:bg-slate-900 dark:text-white"
                    className="bg-white min-h-[500px] max-h-[80%] w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName="dark:bg-slate-900 dark:text-white"
                    visible={modalEditLeadIsVisible}
                    onHide={() => setModalEditLeadIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitForm(e, "update")}>
                        <div className="flex flex-col justify-around gap-4 mt-3">
                            <div className="flex flex-col">
                                <label htmlFor="name">Nama *</label>
                                <InputText
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="name"
                                    required
                                    aria-describedby="name-help"
                                />
                                <InputError
                                    message={errors["name"]}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="name">NPWP *</label>
                                <InputMask
                                    keyfilter="int"
                                    value={data.npwp}
                                    onChange={(e) =>
                                        setData("npwp", e.target.value)
                                    }
                                    placeholder="99.999.999.9-999.999"
                                    mask="99.999.999.9-999.999"
                                    className="dark:bg-gray-300"
                                    id="npwp"
                                    aria-describedby="npwp-help"
                                />
                                <InputError
                                    message={errors["npwp"]}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="pic">PIC *</label>
                                <InputText
                                    value={data.pic}
                                    onChange={(e) =>
                                        setData("pic", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="pic"
                                    required
                                    aria-describedby="pic-help"
                                />
                                <InputError
                                    message={errors["pic"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="sales">Pilih Sales *</label>
                                <Dropdown
                                    dataKey="id"
                                    value={data.sales}
                                    onChange={(e) =>
                                        setData("sales", e.target.value)
                                    }
                                    options={sales}
                                    optionLabel="name"
                                    placeholder="Pilih Sales"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="phone_number">
                                    Nomor Telepon *
                                </label>
                                <InputText
                                    keyfilter="int"
                                    value={data.phone_number}
                                    onChange={(e) =>
                                        setData("phone_number", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="phone_number"
                                    aria-describedby="phone_number-help"
                                />
                                <InputError
                                    message={errors["phone_number"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="address">Alamat *</label>
                                <InputTextarea
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                    rows={5}
                                    cols={30}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="total_members">
                                    Jumlah Member *
                                </label>
                                <InputText
                                    keyfilter="int"
                                    value={data.total_members}
                                    onChange={(e) =>
                                        setData("total_members", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="total_members"
                                    aria-describedby="total_members-help"
                                />
                                <InputError
                                    message={errors["total_members"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="status">Status *</label>
                                <Dropdown
                                    value={data.status}
                                    onChange={(e) => {
                                        setData("status", e.target.value);
                                        setModalStatusIsVisible(true);
                                    }}
                                    dataKey="name"
                                    options={status}
                                    optionLabel="name"
                                    placeholder="Pilih Status"
                                    className="w-full md:w-14rem"
                                />
                                <InputError
                                    message={errors["status"]}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center mt-5">
                            <Button
                                label="Submit"
                                disabled={processing || modalStatusIsVisible}
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>

            {/* Modal import lead */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Import Lead"
                    headerClassName="dark:glass dark:text-white"
                    className="bg-white max-h-[80%] w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                    contentClassName=" dark:glass dark:text-white"
                    visible={modalImportLeadIsVisible}
                    onHide={() => setModalImportLeadIsVisible(false)}
                >
                    <form
                        onSubmit={(e) => handleSubmitImportLeadForm(e)}
                        className="my-4"
                    >
                        <div className="flex flex-col mt-3">
                            <div className="flex bg-green-600 text-white text-xs p-3 rounded-lg justify-between w-full h-full">
                                <p>Template</p>
                                <p className="font-semibold">
                                    <a
                                        href={
                                            "/assets/template/excel/lead_sample.xlsx"
                                        }
                                        download="sample.xlsx"
                                        class="font-bold underline w-full h-full text-center rounded-full "
                                    >
                                        sample.xlsx
                                    </a>
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="name">Excel</label>

                            <div className="App">
                                <FilePond
                                    onaddfile={(error, fileItems) => {
                                        setData("excel", fileItems.file);
                                    }}
                                    maxFileSize="2mb"
                                    labelMaxFileSizeExceeded="File terlalu besar"
                                    name="files"
                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-3">
                            <Button
                                label="Submit"
                                disabled={processing}
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>

            {/* Modal edit status */}
            <Dialog
                header="Edit status"
                headerClassName="dark:bg-slate-900 dark:text-white"
                className="bg-white h-[250px] max-h-[80%] w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                contentClassName="dark:bg-slate-900 dark:text-white"
                visible={modalStatusIsVisible}
                modal={false}
                closable={false}
                onHide={() => setModalStatusIsVisible(false)}
            >
                <div className="flex flex-col justify-around gap-4 mt-3">
                    <div className="flex flex-col">
                        <label htmlFor="note_status">Keterangan</label>
                        <InputTextarea
                            value={data.note_status}
                            onChange={(e) =>
                                setData("note_status", e.target.value)
                            }
                            rows={5}
                            cols={30}
                        />
                    </div>
                    <div className="flex justify-center mt-3">
                        <Button
                            type="button"
                            label="oke"
                            disabled={
                                data.note_status == null ||
                                data.note_status == ""
                            }
                            onClick={() => setModalStatusIsVisible(false)}
                            className="bg-purple-600 text-sm shadow-md rounded-lg"
                        />
                    </div>
                </div>
            </Dialog>
        </DashboardLayout>
    );
}
