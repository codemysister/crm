import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import DashboardLayout from "@/Layouts/DashboardLayout";
import HeaderModule from "@/Components/HeaderModule";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useForm } from "@inertiajs/react";
import {
    ConfirmDialog,
    ConfirmDialog as ConfirmDialog2,
    confirmDialog,
} from "primereact/confirmdialog";
import { Password } from "primereact/password";
import { FilterMatchMode } from "primereact/api";
import HeaderDatatable from "@/Components/HeaderDatatable";
import getViewportSize from "@/Utils/getViewportSize";
import SkeletonDatatable from "@/Components/SkeletonDatatable";
import { Sidebar } from "primereact/sidebar";
import { OverlayPanel } from "primereact/overlaypanel";
import { Calendar } from "primereact/calendar";
import { TabPanel, TabView } from "primereact/tabview";
import { formateDate } from "@/Utils/formatDate";
import LogComponent from "@/Components/LogComponent";
import ArsipComponent from "@/Components/ArsipComponent";
import InputError from "@/Components/InputError";

export default function Index({ auth }) {
    const [users, setUsers] = useState("");
    const [selectedData, setSelectedData] = useState(null);
    const viewportSize = getViewportSize();
    const isMobile = viewportSize.width < 992;
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [confirmIsVisible, setConfirmIsVisible] = useState(false);
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const toast = useRef(null);
    const action = useRef(null);
    const btnFilterRef = useRef(null);
    const [sidebarFilter, setSidebarFilter] = useState(null);
    const windowEscapeRef = useRef(null);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [modalUserIsVisible, setModalUserIsVisible] = useState(false);
    const [modalEditUserIsVisible, setModalEditUserIsVisible] = useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [roles, setRoles] = useState("");
    const { roles: roleAuth, permissions: permissionAuth } = auth.user;

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
        name: "",
        email: "",
        number: "",
        role: "",
        role_id: "",
        password: "",
        password_confirmation: "",
        new_password: null,
    });

    const {
        data: dataFilter,
        setData: setDataFilter,
        reset: resetFilter,
    } = useForm({
        role: null,
        input_date: { start: null, end: null },
        institution_type: null,
    });

    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const getUsers = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/users");
        let data = await response.json();

        setUsers((prev) => (prev = data.users));
        setRoles((prev) => (prev = data.roles));

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([getUsers()]);
                setIsLoadingData(false);
                setPreRenderLoad((prev) => (prev = false));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

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

    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
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

    const handleEditData = (user) => {
        setData((data) => ({
            ...data,
            id: user.id,
            name: user.name,
            email: user.email,
            number: user.number,
            role: user.role,
            role_id: user.role_id,
        }));
        setModalEditUserIsVisible(true);
    };

    const handleDeleteData = () => {
        destroy("users/" + selectedData.id, {
            onSuccess: () => {
                getUsers();
                showSuccess("Hapus");
            },
            onError: () => {
                showError("Hapus");
            },
        });
    };

    const globalFilterFields = ["name", "role", "email", "number"];

    const columns = [
        {
            field: "name",
            header: "Nama",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },
        {
            field: "role",
            header: "Role",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },
        {
            field: "number",
            header: "Nomor",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
            body: (rowData) => {
                return rowData.number ?? "-";
            },
        },
        {
            field: "email",
            header: "Email",
            style: {
                width: "max-content",
                whiteSpace: "nowrap",
            },
        },
    ];

    const handleFilter = async (e) => {
        e.preventDefault();
        setIsLoadingData(true);
        const formData = {
            role: dataFilter.role,
            input_date: dataFilter.input_date,
        };

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");

        const response = await axios.post("/users/filter", formData, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
        });
        const data = response.data;
        setUsers(data);
        setSidebarFilter(false);
        setIsLoadingData(false);
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
                {/* <Button
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
                </Button> */}
            </HeaderDatatable>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <i
                    className="pi pi-ellipsis-h pointer cursor-pointer"
                    onClick={(event) => {
                        setSelectedData(rowData);
                        action.current.toggle(event);
                    }}
                ></i>
            </React.Fragment>
        );
    };

    const exportExcel = () => {
        const exports = sphs.map((data) => {
            return {
                Kode: data.code ?? "-",
                Lembaga: data.partner_name ?? "-",
                NPWP: data.lead == undefined ? data.partner.npwp : "-",
                Link_Dokumen: {
                    v: window.location.origin + "/" + data.sph_doc ?? "-",
                    h: "link",
                    l: {
                        Target:
                            window.location.origin + "/" + data.sph_doc ?? "-",
                        Tooltip: "Klik untuk membuka dokumen",
                    },
                },
                Tanggal_Pembuatan: formateDate(data.created_at),
                Diinput_Oleh: data.created_by.name,
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

            saveAsExcelFile(excelBuffer, "sph_" + formateDate(new Date()));
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

    const handleSubmitForm = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            post("/users", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalUserIsVisible((prev) => false);
                    getUsers();
                    reset();
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            put("/users/" + data.id, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditUserIsVisible((prev) => false);
                    getUsers();
                    reset();
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
    };

    const confirmDeleteSph = () => {
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

    const objectKeyToIndo = (key) => {
        let keyIndo;
        if (key == "name") {
            keyIndo = "Nama";
        } else if (key == "email") {
            keyIndo = "Email";
        } else if (key == "phone_number") {
            keyIndo = "Nomor Telepon";
        } else if (key == "role") {
            keyIndo = "Role";
        }

        return keyIndo;
    };

    if (preRenderLoad) {
        return <SkeletonDatatable auth={auth} />;
    }

    return (
        <DashboardLayout auth={auth.user} className="">
            <Toast ref={toast} />

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
                        <label htmlFor="name">Berdasarkan role</label>
                        <Dropdown
                            optionLabel="name"
                            dataKey="id"
                            value={dataFilter.role}
                            onChange={(e) =>
                                setDataFilter("role", e.target.value)
                            }
                            options={roles}
                            placeholder="Pilih Role"
                            filter
                            showClear
                            valueTemplate={selectedOptionTemplate}
                            itemTemplate={optionTemplate}
                            className="flex justify-center  dark:text-gray-400   "
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
                    {permissionAuth.includes("edit sph") && (
                        <Button
                            icon="pi pi-pencil"
                            label="edit"
                            className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                            onClick={() => {
                                handleEditData(selectedData);
                            }}
                        />
                    )}
                    {permissionAuth.includes("hapus sph") && (
                        <Button
                            icon="pi pi-trash"
                            label="hapus"
                            className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                            onClick={() => {
                                confirmDeleteSph();
                            }}
                        />
                    )}
                </div>
            </OverlayPanel>

            <HeaderModule title="User">
                {permissionAuth.includes("tambah user") && (
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalUserIsVisible((prev) => (prev = true));
                            reset();
                        }}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                )}
            </HeaderModule>

            <TabView
                activeIndex={activeIndexTab}
                onTabChange={(e) => {
                    setActiveIndexTab(e.index);
                }}
                className="mt-2"
            >
                <TabPanel header="Semua User">
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
                                accept={handleDeleteData}
                            />

                            <div
                                className="flex  mx-auto flex-col justify-center mt-5 gap-5"
                                ref={windowEscapeRef}
                            >
                                <div className="card p-fluid w-full h-full flex justify-center rounded-lg">
                                    <div className="card  p-fluid w-full h-full flex justify-center rounded-lg">
                                        <DataTable
                                            loading={isLoadingData}
                                            className="w-full h-auto rounded-lg dark:glass border-none text-center shadow-md"
                                            pt={{
                                                bodyRow:
                                                    "dark:bg-transparent  dark:text-gray-300",
                                                table: "dark:bg-transparent bg-white dark:text-gray-300",
                                            }}
                                            paginator
                                            rowsPerPageOptions={[
                                                10, 25, 50, 100,
                                            ]}
                                            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                            currentPageReportTemplate="{first} - {last} dari {totalRecords}"
                                            filters={filters}
                                            rows={10}
                                            emptyMessage="User tidak ditemukan."
                                            paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                                            header={header}
                                            globalFilterFields={
                                                globalFilterFields
                                            }
                                            scrollable
                                            value={users}
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
                                        </DataTable>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </TabPanel>

                <TabPanel header="Log">
                    {activeIndexTab == 1 && (
                        <LogComponent
                            auth={auth}
                            fetchUrl={"/api/users/logs"}
                            filterUrl={"/users/logs/filter"}
                            deleteUrl={"/users/logs"}
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
                            fetchUrl={"/api/users/arsip"}
                            forceDeleteUrl={"/users/{id}/force"}
                            restoreUrl={"/users/{id}/restore"}
                            filterUrl={"/users/arsip/filter"}
                            columns={columns}
                            showSuccess={showSuccess}
                            showError={showError}
                            globalFilterFields={globalFilterFields}
                        />
                    )}
                </TabPanel>
            </TabView>

            {/* Modal tambah user */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="User"
                    headerClassName="dark:glass shadow-md dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName=" dark:glass dark:text-white"
                    visible={modalUserIsVisible}
                    onHide={() => setModalUserIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitForm(e, "tambah")}>
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="name">Nama *</label>
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
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="email">Email *</label>
                                <InputText
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="email"
                                    aria-describedby="email-help"
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="number">Whatsapp</label>
                                <InputText
                                    value={data.number}
                                    onChange={(e) =>
                                        setData("number", e.target.value)
                                    }
                                    keyfilter="int"
                                    className="dark:bg-gray-300"
                                    id="number"
                                    aria-describedby="number-help"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="password">Password *</label>
                                <Password
                                    inputClassName="w-full dark:bg-gray-300"
                                    className="flex justify-center items-center align-middle justify-items-center"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    toggleMask
                                    feedback={false}
                                />
                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="password_confirmation">
                                    Konfirmasi Password *
                                </label>
                                <Password
                                    inputClassName="w-full dark:bg-gray-300"
                                    feedback={false}
                                    className="flex justify-center  items-center align-middle justify-items-center"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    toggleMask
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="role">Role</label>
                                <Dropdown
                                    value={data.role}
                                    onChange={(e) =>
                                        setData("role", e.target.value)
                                    }
                                    options={roles}
                                    optionLabel="name"
                                    placeholder="Pilih Role"
                                    className="w-full md:w-14rem dark:bg-gray-300"
                                />
                                <InputError
                                    message={errors.role}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center my-5">
                            <Button
                                label="Submit"
                                disabled={processing}
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>

            {/* Modal edit user */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="User"
                    headerClassName="dark:glass shadow-md dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName="dark:glass dark:text-white"
                    visible={modalEditUserIsVisible}
                    onHide={() => setModalEditUserIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitForm(e, "update")}>
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="name">Nama</label>
                                <InputText
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="name"
                                    aria-describedby="name-help"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="email">Email</label>
                                <InputText
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="email"
                                    aria-describedby="email-help"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="number">Whatsapp</label>
                                <InputText
                                    value={data.number}
                                    onChange={(e) =>
                                        setData("number", e.target.value)
                                    }
                                    keyfilter="int"
                                    className="dark:bg-gray-300"
                                    id="number"
                                    aria-describedby="number-help"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="role">Role</label>
                                <Dropdown
                                    value={data.role}
                                    onChange={(e) =>
                                        setData("role", e.target.value)
                                    }
                                    options={roles}
                                    optionValue="name"
                                    optionLabel="name"
                                    placeholder="Pilih Role"
                                    className="w-full md:w-14rem dark:bg-gray-300"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="new_password">
                                    Password Baru
                                </label>
                                <Password
                                    inputClassName="w-full dark:bg-gray-300"
                                    className="flex justify-center items-center align-middle justify-items-center"
                                    value={data.new_password}
                                    onChange={(e) =>
                                        setData("new_password", e.target.value)
                                    }
                                    toggleMask
                                    feedback={false}
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
        </DashboardLayout>
    );
}
