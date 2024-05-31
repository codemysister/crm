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

export const DatatablePartner = memo(
    ({
        children,
        dialogOnboarding,
        setDialogOnboardingVisible,
        isLoadingData,
        partners,
        handleSelectedDetailPartner,
        action,
        setSelectedPartner,
        setSidebarFilter,
    }) => {
        const viewportSize = getViewportSize();
        const isMobile = viewportSize.width < 992;
        const [filters, setFilters] = useState({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        });

        const exportExcel = () => {
            const exports = partners.map((data) => {
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
                                setSelectedPartner(rowData);
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
                field: "npwp",
                header: "NPWP",
                frozen: !isMobile,
                style: {
                    width: "max-content",
                    whiteSpace: "nowrap",
                },
                body: (rowData) => {
                    return rowData.npwp !== null
                        ? formatNPWP(rowData.npwp)
                        : "-";
                },
            },

            {
                field: "pic",
                header: "PIC",
                style: {
                    width: "max-content",
                    whiteSpace: "nowrap",
                },
                body: (rowData) => {
                    return rowData.pic ? rowData.pic.name : "-";
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
                field: "account_manager",
                header: "Account Manager",
                style: {
                    width: "max-content",
                    whiteSpace: "nowrap",
                },
                body: (rowData) => {
                    return rowData.account_manager
                        ? rowData.account_manager.name
                        : "-";
                },
            },

            {
                field: "province",
                header: "Provinsi",
                style: {
                    width: "max-content",
                    whiteSpace: "nowrap",
                },
                body: (rowData) => {
                    return rowData.province
                        ? upperCaseEachWord(JSON.parse(rowData.province).name)
                        : "belum diiisi";
                },
            },
            {
                field: "regency",
                header: "Kabupaten",
                style: {
                    width: "max-content",
                    whiteSpace: "nowrap",
                },
                body: (rowData) => {
                    return rowData.regency
                        ? upperCaseEachWord(JSON.parse(rowData.regency).name)
                        : "-";
                },
            },
            {
                field: "subdistrict",
                header: "Kecamatan",
                style: {
                    width: "max-content",
                    whiteSpace: "nowrap",
                },
                body: (rowData) => {
                    return rowData.subdistrict
                        ? JSON.parse(rowData.subdistrict).name
                        : "-";
                },
            },

            {
                field: "onboarding_date",
                header: "Tanggal Onboarding",
                style: {
                    width: "max-content",
                    whiteSpace: "nowrap",
                },
                body: (rowData) => {
                    return rowData.onboarding_date
                        ? new Date(rowData.onboarding_date).toLocaleDateString(
                              "id"
                          )
                        : "-";
                },
            },
            {
                field: "live_date",
                header: "Tanggal Live",
                style: {
                    width: "max-content",
                    whiteSpace: "nowrap",
                },
                body: (rowData) => {
                    return rowData.live_date !== null
                        ? new Date(rowData.live_date).toLocaleDateString("id")
                        : "-";
                },
            },

            {
                field: "monitoring_date_after_3_month_live",
                header: "Tanggal Monitoring (3 bulan setelah live)",
                style: {
                    width: "max-content",
                    whiteSpace: "nowrap",
                },
                body: (rowData) => {
                    return rowData.live_date !== null
                        ? new Date(rowData.live_date).toLocaleDateString("id")
                        : "-";
                },
            },

            {
                field: "onboarding_age",
                header: "Umur Onboarding",
                style: {
                    width: "max-content",
                    whiteSpace: "nowrap",
                },
                body: (rowData) => {
                    return rowData.onboarding_age !== null
                        ? rowData.onboarding_age + " hari"
                        : "-";
                },
            },

            {
                field: "live_age",
                header: "Umur Onboarding",
                style: {
                    width: "max-content",
                    whiteSpace: "nowrap",
                },
                body: (rowData) => {
                    return rowData.live_age !== null
                        ? rowData.live_age + " hari"
                        : "-";
                },
            },

            {
                field: "total_members",
                header: "Jumlah Member",
                style: {
                    width: "max-content",
                    whiteSpace: "nowrap",
                },
            },

            {
                field: "password",
                header: "Password",
                style: {
                    width: "max-content",
                    whiteSpace: "nowrap",
                },
                body: (rowData) => {
                    return rowData.password ?? "-";
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
        ];

        const header = () => {
            return (
                <HeaderDatatable filters={filters} setFilters={setFilters}>
                    <Button
                        className="shadow-md w-[10px] lg:w-[120px] border border-slate-600 bg-transparent text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-lg"
                        onClick={() => {
                            setDialogOnboardingVisible(true);
                        }}
                    >
                        <span className="w-full flex justify-center items-center gap-1">
                            <i
                                className="pi pi-filter"
                                style={{ fontSize: "0.7rem" }}
                            ></i>{" "}
                            {!isMobile && <span>onboarding</span>}
                        </span>
                    </Button>
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
                    "status",
                    "province",
                    "regency",
                    "onboarding_date",
                    "live_date",
                    "monitoring_date_after_3_month_live",
                    "sales.name",
                    "account_manager.name",
                ]}
                emptyMessage="Partner tidak ditemukan."
                paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                header={header}
                value={partners}
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
