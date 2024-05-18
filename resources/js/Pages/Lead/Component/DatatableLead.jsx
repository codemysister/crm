import HeaderDatatable from "@/Components/HeaderDatatable";
import { formatNPWP } from "@/Utils/formatNPWP";
import getViewportSize from "@/Utils/getViewportSize";
import { upperCaseEachWord } from "@/Utils/UppercaseEachWord";
import { FilterMatchMode } from "primereact/api";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";
import { memo } from "react";
import { formateDate } from "@/Utils/formatDate";
import { handleSelectedDetailInstitution } from "@/Utils/handleSelectedDetailInstitution";

export const DatatableLead = memo(
    ({
        children,
        isLoadingData,
        leads,
        action,
        setSelectedLead,
        setSidebarFilter,
    }) => {
        const viewportSize = getViewportSize();
        const isMobile = viewportSize.width < 992;
        const [filters, setFilters] = useState({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        });

        const exportExcel = () => {
            const exports = leads.map((data) => {
                return {
                    Nama: data.name,
                    Status: data.status ? data.status.name : "-",
                    NPWP: data.npwp ? data.npwp : "-",
                    Jumlah_Member: data.total_members
                        ? data.total_members
                        : "-",
                    Nomor_Telepon_Lembaga: data.phone_number
                        ? data.phone_number
                        : "-",
                    Sales: data.sales ? data.sales.name : "-",
                    Account_Manager: data.account_manager
                        ? data.account_manager.name
                        : "-",
                    PIC: data.pics.length !== 0 ? data.pics[0].name : "-",
                    Nomor_Telepon_PIC:
                        data.pics.length !== 0 ? data.pics[0].number : "-",
                    Provinsi: data.province
                        ? JSON.parse(data.province).name
                        : "-",
                    Kabupaten: data.regency
                        ? JSON.parse(data.regency).name
                        : "-",
                    Tanggal_Onboarding: data.onboarding_date
                        ? formateDate(data.onboarding_date)
                        : "-",
                    Tanggal_Live: data.live_date
                        ? formateDate(data.live_date)
                        : "-",
                    Tanggal_Monitoring_3_Bulan_After_Live:
                        data.monitoring_date_after_3_month_live
                            ? formateDate(
                                  data.monitoring_date_after_3_month_live
                              )
                            : "-",
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

                saveAsExcelFile(excelBuffer, "partner");
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

        const actionBodyTemplate = (rowData) => {
            return (
                <>
                    <div className="flex justify-center">
                        <i
                            className="pi pi-ellipsis-h pointer cursor-pointer"
                            onClick={(event) => {
                                setSelectedLead(rowData);
                                action.current.toggle(event);
                            }}
                        ></i>
                    </div>
                </>
            );
        };

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
                            onClick={() =>
                                handleSelectedDetailInstitution(rowData)
                            }
                            className="hover:text-blue-700 text-left"
                        >
                            {rowData.name}
                        </button>
                    );
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

        const header = () => {
            return (
                <HeaderDatatable filters={filters} setFilters={setFilters}>
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
                    <Button
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
                    </Button>
                </HeaderDatatable>
            );
        };

        return (
            <DataTable
                loading={isLoadingData}
                className="w-full h-auto rounded-lg dark:glass border-none text-center shadow-md"
                pt={{
                    bodyRow: "dark:bg-transparent  dark:text-gray-300",
                    table: "dark:bg-transparent bg-white dark:text-gray-300",
                }}
                paginator
                rowsPerPageOptions={[5, 10, 25, 50]}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} - {last} dari {totalRecords}"
                children={children}
                rows={10}
                filter
                filters={filters}
                scrollable
                globalFilterFields={[
                    "name",
                    "status.name",
                    "address",
                    "phone_number",
                    "pic",
                ]}
                emptyMessage="Lead tidak ditemukan."
                paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                header={header}
                value={leads}
                dataKey="id"
                // lazy
                // first={lazyState.first}
                // totalRecords={totalRecords}
                // onPage={onPage}
            >
                <Column
                    header="Aksi"
                    frozen
                    body={actionBodyTemplate}
                    className="dark:border-none lg:w-max lg:whitespace-nowrap"
                    headerClassName="dark:border-none dark:bg-slate-900 dark:text-gray-300"
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
                <Column
                    field="created_at"
                    className="dark:border-none"
                    headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                    header="Diinput Pada"
                    align="left"
                    style={{
                        width: "max-content",
                        whiteSpace: "nowrap",
                    }}
                    body={(rowData) => {
                        return formateDate(rowData.created_at);
                    }}
                ></Column>
            </DataTable>
        );
    }
);
