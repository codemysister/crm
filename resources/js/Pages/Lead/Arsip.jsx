import HeaderDatatable from "@/Components/HeaderDatatable";
import SkeletonDatatable from "@/Components/SkeletonDatatable";
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
    const [selectedLead, setselectedLead] = useState(null);
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
        name: null,
        address: null,
        pic: null,
        total_members: null,
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
        let response = await fetch("/api/leads/arsip");
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
                        setselectedLead(rowData);
                        action.current.toggle(event);
                    }}
                ></i>
            </React.Fragment>
        );
    };

    const handleRestoreLead = () => {
        confirmDialog({
            message: "Apakah Anda yakin mengembalikan data ini?",
            header: "Konfirmasi pemulihan",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-success",
            accept: async () => {
                put("leads/" + selectedLead.uuid + "/restore", {
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

    const handleDeleteLead = () => {
        destroy("leads/" + selectedLead.uuid + "/force", {
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
                accept={handleDeleteLead}
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
                            handleRestoreLead(selectedLead);
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
                        emptyMessage="Lead tidak ditemukan."
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
                                        value={rowData.status.name}
                                        className="text-white"
                                        style={{
                                            backgroundColor:
                                                "#" + rowData.status.color,
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
                            header="Diinput Oleh"
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
    );
};

export default Arsip;
