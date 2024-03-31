import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { useForm } from "@inertiajs/react";
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
registerPlugin(FilePondPluginFileValidateSize);

export default function Index({ auth, usersProp, statusProp }) {
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const [leads, setLeads] = useState(null);
    const [users, setUsers] = useState(usersProp);
    const [status, setStatus] = useState(statusProp);
    const [confirmIsVisible, setConfirmIsVisible] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const toast = useRef(null);
    const action = useRef(null);
    const menuAddRef = useRef(null);
    const btnFilterRef = useRef(null);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [modalLeadIsVisible, setModalLeadIsVisible] = useState(false);
    const [modalEditLeadIsVisible, setModalEditLeadIsVisible] = useState(false);
    const [sidebarFilter, setSidebarFilter] = useState(null);
    const [modalImportLeadIsVisible, setModalImportLeadIsVisible] =
        useState(false);
    const { roles, permissions } = auth.user;
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

        let response = await fetch("/api/leads");
        let data = await response.json();

        setLeads((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
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

    let categories = [{ name: "lead" }, { name: "partner" }];

    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };

    const filterButtonIcon = () => {
        return (
            <i
                className="pi pi-filter"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };
    const exportButtonIcon = () => {
        return (
            <i
                className="pi pi-file-excel
                "
                style={{ fontSize: "0.8rem", paddingRight: "5px" }}
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
            pic: lead.pic,
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
            onError: () => {
                showError("Hapus");
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

    const headerLead = () => {
        return (
            <HeaderDatatable
                globalFilterValue={globalFilterValue}
                onGlobalFilterChange={onGlobalFilterChange}
            >
                <Button
                    icon={filterButtonIcon}
                    className="shadow-md border border-slate-600 bg-transparent text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-lg"
                    label="filter"
                    onClick={() => setSidebarFilter(true)}
                />
                <Button
                    icon={exportButtonIcon}
                    className="shadow-md bg-transparent text-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:border rounded-lg"
                    label="export"
                    onClick={exportExcel}
                    data-pr-tooltip="XLS"
                />
            </HeaderDatatable>
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
                onError: () => {
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
                onError: () => {
                    showError("Update");
                },
            });
        }
    };

    const handleSubmitImportLeadForm = (e) => {
        e.preventDefault();
        post("/leads/import", {
            onSuccess: () => {
                showSuccess("Tambah");
                setModalImportLeadIsVisible((prev) => (prev = false));
                getLeads();
                reset();
            },
            onError: () => {
                showError("Tambah");
            },
        });
    };

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
                            handleEditLead(selectedLead);
                        }}
                    />
                    <Button
                        icon="pi pi-trash"
                        label="hapus"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            confirmDeleteStatus();
                        }}
                    />
                </div>
            </OverlayPanel>

            <Toast ref={toast} />

            <HeaderModule title="Lead">
                {/* {permissions.includes("tambah produk") && ( */}
                <Button
                    label="Tambah"
                    className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                    icon={addButtonIcon}
                    onClick={(event) => menuAddRef.current.toggle(event)}
                    aria-controls="popup_menu_right"
                    aria-haspopup
                />

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

                    <div className="flex flex-row mt-5">
                        <Button
                            ref={btnFilterRef}
                            label="Terapkan"
                            className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        />
                        <Button
                            type="button"
                            label="Kosongkan"
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
                                        emptyMessage="Lead tidak ditemukan."
                                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                                        header={headerLead}
                                        globalFilterFields={[
                                            "name",
                                            "status.name",
                                            "address",
                                            "phone_number",
                                            "pic",
                                        ]}
                                        value={leads}
                                        dataKey="id"
                                    >
                                        <Column
                                            header="Aksi"
                                            body={actionBodyTemplate}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                            className="dark:border-none"
                                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                        ></Column>
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
                                            field="name"
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
                                            field="status"
                                            className="dark:border-none"
                                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                            align="left"
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
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>
                                        <Column
                                            field="phone_number"
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            header="Nomor Telepon"
                                            align="left"
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>
                                        <Column
                                            field="address"
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            header="Alamat"
                                            align="left"
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>
                                        <Column
                                            field="pic"
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            header="PIC"
                                            align="left"
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>
                                        <Column
                                            field="created_by"
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            header="Penginput"
                                            align="left"
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                            body={(rowData) => {
                                                return rowData.created_by.name;
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
                                <label htmlFor="phone_number">
                                    Nomor Telepon
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
                                <label htmlFor="address">Alamat</label>
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
                                    Jumlah Member
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
                                <label htmlFor="phone_number">
                                    Nomor Telepon
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
                                <label htmlFor="address">Alamat</label>
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
                                    Jumlah Member
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

            {/* Modal import partner */}
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
        </DashboardLayout>
    );
}
