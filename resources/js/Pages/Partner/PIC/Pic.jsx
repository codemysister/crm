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
import { InputTextarea } from "primereact/inputtextarea";
import { useForm } from "@inertiajs/react";
import {
    ConfirmDialog,
    ConfirmDialog as ConfirmDialog2,
    confirmDialog,
} from "primereact/confirmdialog";
import { TabPanel, TabView } from "primereact/tabview";
import { FilterMatchMode } from "primereact/api";
import { OverlayPanel } from "primereact/overlaypanel";
import InputError from "@/Components/InputError";
import HeaderDatatable from "@/Components/HeaderDatatable";
import SkeletonDatatable from "@/Components/SkeletonDatatable";
import getViewportSize from "../../Utils/getViewportSize";
import { Sidebar } from "primereact/sidebar";
import { Calendar } from "primereact/calendar";
import Log from "./Log";

const Pic = ({
    auth,
    partnersProp,
    usersProp,
    handleSelectedDetailPartner,
}) => {
    const [partners, setPartners] = useState(partnersProp);
    const [users, setUsers] = useState(usersProp);
    const [pics, setPics] = useState(null);
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const [confirmIsVisible, setConfirmIsVisible] = useState(false);
    const [selectedPic, setSelectedPic] = useState(null);
    const [modalPicIsVisible, setModalPicIsVisible] = useState(false);
    const [modalEditPicIsVisible, setModalEditPicIsVisible] = useState(false);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [sidebarFilter, setSidebarFilter] = useState(false);
    const viewportSize = getViewportSize();
    const isMobile = viewportSize.width < 992;
    const toast = useRef(null);
    const action = useRef(null);
    const { roles, permissions } = auth.user;
    const [isLoadingData, setIsLoadingData] = useState(false);
    const {
        data: dataPIC,
        setData: setDataPIC,
        post: postPIC,
        put: putPIC,
        delete: destroyPIC,
        reset: resetPIC,
        processing: processingPIC,
        errors: errorPIC,
        clearErrors: clearErrorsPIC,
    } = useForm({
        uuid: "",
        partner: {},
        name: "",
        number: "",
        position: "",
        email: "",
    });

    const {
        data: dataFilter,
        setData: setDataFilter,
        reset: resetFilter,
    } = useForm({
        user: null,
        input_date: { start: null, end: null },
    });

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

    const getPics = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/pics");
        let data = await response.json();

        setPics((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            setPreRenderLoad((prev) => (prev = false));
            await getPics();
        };

        fetchData();
    }, []);

    const confirmDeletePIC = () => {
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
            input_date: dataFilter.input_date,
        };

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");

        const response = await axios.post("/pics/filter", formData, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
        });
        const data = response.data;
        setPics(data);
        setSidebarFilter(false);
        setIsLoadingData(false);
    };

    const optionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const handleEditPIC = (pic) => {
        clearErrorsPIC();
        setDataPIC((data) => ({
            ...data,
            uuid: pic.uuid,
            partner: pic.partner,
            name: pic.name,
            number: pic.number,
            position: pic.position,
            address: pic.address,
            email: pic.email,
        }));

        setModalEditPicIsVisible(true);
    };

    const handleDeletePIC = (pic) => {
        destroyPIC("/pics/" + selectedPic.uuid, {
            onSuccess: () => {
                getPics();
                showSuccess("Hapus");
            },
            onError: () => {
                showError("Hapus");
            },
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

    const exportExcel = () => {
        const exports = pics.map((data) => {
            return {
                Nama: data.name,
                Lembaga: data.partner ? data.partner.name : "-",
                Nomor_Telepon_Lembaga: data.number ? data.number : "-",
                Email: data.email ? data.email : "-",
                Jabatan: data.position ? data.position : "-",
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

            saveAsExcelFile(excelBuffer, "pic");
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

    const renderHeader = () => {
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

    const header = renderHeader();

    const handleSubmitFormPIC = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            postPIC("/pics", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalPicIsVisible((prev) => false);
                    getPics();
                    resetPIC(
                        "partner",
                        "name",
                        "number",
                        "position",
                        "address"
                    );
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            putPIC("/pics/" + dataPIC.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditPicIsVisible((prev) => false);
                    getPics();
                    resetPIC(
                        "partner",
                        "name",
                        "number",
                        "position",
                        "address"
                    );
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <i
                    className="pi pi-ellipsis-h pointer cursor-pointer"
                    onClick={(event) => {
                        setSelectedPic(rowData);
                        action.current.toggle(event);
                    }}
                ></i>
            </React.Fragment>
        );
    };

    if (preRenderLoad) {
        return <SkeletonDatatable auth={auth} />;
    }

    return (
        <DashboardLayout auth={auth.user}>
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
                            handleEditPIC(selectedPic);
                        }}
                    />
                    <Button
                        icon="pi pi-trash"
                        label="hapus"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            confirmDeletePIC();
                        }}
                    />
                </div>
            </OverlayPanel>

            <HeaderModule title="PIC">
                {permissions.includes("tambah pic") && (
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalPicIsVisible((prev) => (prev = true));
                            reset();
                            clearErrorsPIC();
                        }}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                )}
            </HeaderModule>

            <Toast ref={toast} />
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
                            label="Terapkan"
                            className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        />
                        <Button
                            type="button"
                            label="Reset"
                            onClick={(e) => {
                                resetFilter();
                                handleFilter(e);
                            }}
                            className="outline-purple-600 outline-1 outline-dotted bg-transparent text-slate-700  text-sm shadow-md rounded-lg mr-2"
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
                <TabPanel header="Semua PIC">
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
                                accept={handleDeletePIC}
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
                                        emptyMessage="PIC tidak ditemukan."
                                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                                        header={header}
                                        globalFilterFields={[
                                            "name",
                                            "category",
                                        ]}
                                        value={pics}
                                        dataKey="id"
                                        scrollable
                                    >
                                        <Column
                                            header="Aksi"
                                            body={actionBodyTemplate}
                                            frozen
                                            style={
                                                !isMobile
                                                    ? {
                                                          width: "max-content",
                                                          whiteSpace: "nowrap",
                                                      }
                                                    : null
                                            }
                                            className="dark:border-none lg:w-max lg:whitespace-nowrap text-center"
                                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
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
                                            frozen={!isMobile}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>
                                        <Column
                                            header="Partner"
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
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            align="left"
                                            frozen={!isMobile}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>
                                        <Column
                                            field="uuid"
                                            hidden
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            header="Nama"
                                            align="left"
                                        ></Column>
                                        <Column
                                            field="email"
                                            header="Email"
                                            body={(rowData) => {
                                                return rowData.email ?? "-";
                                            }}
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            align="left"
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>
                                        <Column
                                            field="number"
                                            header="Nomor Handphone"
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            align="left"
                                            body={(rowData) => {
                                                return rowData.number ?? "-";
                                            }}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>
                                        <Column
                                            field="position"
                                            header="Jabatan"
                                            body={(rowData) => {
                                                return rowData.position ?? "-";
                                            }}
                                            className="dark:border-none"
                                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                            align="left"
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

            {/* Modal tambah pic */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="PIC"
                    headerClassName="dark:glass dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                    contentClassName="dark:glass dark:text-white"
                    visible={modalPicIsVisible}
                    onHide={() => setModalPicIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitFormPIC(e, "tambah")}>
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="name">Nama *</label>
                                <InputText
                                    value={dataPIC.name}
                                    onChange={(e) =>
                                        setDataPIC("name", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="name"
                                    aria-describedby="name-help"
                                />
                                <InputError
                                    message={errorPIC.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="pic_partner">Partner *</label>
                                <Dropdown
                                    dataKey="name"
                                    optionLabel="name"
                                    value={dataPIC.partner}
                                    onChange={(e) =>
                                        setDataPIC("partner", e.target.value)
                                    }
                                    options={partners}
                                    placeholder="Pilih Partner"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />

                                <InputError
                                    message={errorPIC.partner}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="number">Email </label>
                                <InputText
                                    value={dataPIC.email}
                                    onChange={(e) =>
                                        setDataPIC("email", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="email"
                                    aria-describedby="email-help"
                                />
                                <InputError
                                    message={errorPIC.email}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="number">No.Hp *</label>
                                <InputText
                                    keyfilter="int"
                                    min={0}
                                    value={dataPIC.number}
                                    onChange={(e) =>
                                        setDataPIC("number", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="number"
                                    aria-describedby="number-help"
                                />
                                <InputError
                                    message={errorPIC.number}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="position">Jabatan *</label>
                                <InputText
                                    value={dataPIC.position}
                                    onChange={(e) =>
                                        setDataPIC("position", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="position"
                                    aria-describedby="position-help"
                                />
                                <InputError
                                    message={errorPIC.position}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-5">
                            <Button
                                label="Submit"
                                disabled={processingPIC}
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>

            {/* Modal edit pic */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Edit PIC"
                    headerClassName="dark:glass shadow-md z-20 dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName=" dark:glass dark:text-white"
                    visible={modalEditPicIsVisible}
                    onHide={() => setModalEditPicIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitFormPIC(e, "update")}>
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="name">Nama *</label>
                                <InputText
                                    value={dataPIC.name}
                                    onChange={(e) =>
                                        setDataPIC("name", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="name"
                                    aria-describedby="name-help"
                                />
                                <InputError
                                    message={errorPIC.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="pic_partner">Partner *</label>

                                <Dropdown
                                    dataKey="name"
                                    value={dataPIC.partner}
                                    options={partners}
                                    onChange={(e) =>
                                        setDataPIC("partner", e.target.value)
                                    }
                                    optionLabel="name"
                                    placeholder="Pilih Partner"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                                <InputError
                                    message={errorPIC.partner}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="number">Email </label>
                                <InputText
                                    value={dataPIC.email}
                                    onChange={(e) =>
                                        setDataPIC("email", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="email"
                                    aria-describedby="email-help"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="number">No.Hp *</label>
                                <InputText
                                    keyfilter="int"
                                    min={0}
                                    value={dataPIC.number}
                                    onChange={(e) =>
                                        setDataPIC("number", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="number"
                                    aria-describedby="number-help"
                                />
                                <InputError
                                    message={errorPIC.number}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="position">Jabatan *</label>
                                <InputText
                                    value={dataPIC.position}
                                    onChange={(e) =>
                                        setDataPIC("position", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="position"
                                    aria-describedby="position-help"
                                />
                                <InputError
                                    message={errorPIC.position}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center mt-5">
                            <Button
                                label="Submit"
                                disabled={processingPIC}
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default Pic;
