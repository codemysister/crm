import HeaderDatatable from "@/Components/HeaderDatatable";
import SkeletonDatatable from "@/Components/SkeletonDatatable";
import getViewportSize from "@/Pages/Utils/getViewportSize";
import { useForm } from "@inertiajs/react";
import { FilterMatchMode } from "primereact/api";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import {
    ConfirmDialog,
    ConfirmDialog as ConfirmDialog2,
    confirmDialog,
} from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { OverlayPanel } from "primereact/overlaypanel";
import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

const Arsip = ({ auth, showSuccess, showError }) => {
    const [arsip, setArsip] = useState(null);
    const action = useRef(null);
    const [selectedPic, setselectedPic] = useState(null);
    const viewportSize = getViewportSize();
    const isMobile = viewportSize.width < 992;
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [confirmIsVisible, setConfirmIsVisible] = useState();
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const {
        put,
        delete: destroy,
        reset,
    } = useForm({
        id: null,
        uuid: null,
        partner: {},
        name: null,
        number: null,
        position: null,
        email: null,
    });

    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    const getArsip = async () => {
        setIsLoadingData(true);
        let response = await fetch("/api/pics/arsip");
        let data = await response.json();

        setArsip((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            setPreRenderLoad((prev) => (prev = false));
            await getArsip();
        };

        fetchData();
    }, []);

    const headerArsip = () => {
        return (
            <HeaderDatatable
                globalFilterValue={globalFilterValue}
                onGlobalFilterChange={onGlobalFilterChange}
            ></HeaderDatatable>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <i
                    className="pi pi-ellipsis-h pointer cursor-pointer"
                    onClick={(event) => {
                        setselectedPic(rowData);
                        action.current.toggle(event);
                    }}
                ></i>
            </React.Fragment>
        );
    };

    const handleRestorePIC = () => {
        confirmDialog({
            message: "Apakah Anda yakin mengembalikan data ini?",
            header: "Konfirmasi pemulihan",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-success",
            accept: async () => {
                put("pics/" + selectedPic.uuid + "/restore", {
                    onSuccess: () => {
                        getArsip();
                        showSuccess("Hapus");
                    },
                    onError: () => {
                        showError("Hapus");
                    },
                });
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

    const handleDeletePIC = () => {
        destroy("pics/" + selectedPic.uuid + "/force", {
            onSuccess: () => {
                getArsip();
                showSuccess("Hapus");
                reset();
            },
            onError: () => {
                showError("Hapus");
            },
        });
    };

    if (preRenderLoad) {
        return <SkeletonDatatable auth={auth} />;
    }

    return (
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

            <OverlayPanel
                className="shadow-md p-1 dark:bg-slate-900 dark:text-gray-300"
                ref={action}
            >
                <div className="flex flex-col flex-wrap w-full">
                    <Button
                        icon="pi pi-replay"
                        label="pulihkan"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            handleRestorePIC(selectedPic);
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
                        rows={10}
                        filters={filters}
                        emptyMessage="PIC tidak ditemukan."
                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                        header={headerArsip}
                        globalFilterFields={[
                            "name",
                            "pic",
                            "address",
                            "total_members",
                            "phone_number",
                            "created_by.name",
                        ]}
                        value={arsip}
                        dataKey="id"
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
                            className="dark:border-none lg:w-max bg-white lg:whitespace-nowrap text-center"
                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300 text-center"
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
    );
};

export default Arsip;
