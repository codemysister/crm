import { formatNPWP } from "@/Utils/formatNPWP";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { SelectButton } from "primereact/selectbutton";
import { useEffect } from "react";
import { useState } from "react";
import HeaderDatatable from "./HeaderDatatable";

const DialogOnboarding = ({
    dialogOnboardingVisible,
    setDialogOnboardingVisible,
    setModalPartnersIsVisible,
    isLoadingData,
    setIsLoadingData,
    leads,
    setLeads,
    filters,
    setFilters,
    data,
    setData,
    reset,
}) => {
    const [selectedInstitution, setSelectedInstitution] = useState([]);
    useEffect(() => {
        setSelectedInstitution(data.partner);
    }, []);

    const dialogFooterInstitutionTemplate = (type) => {
        return (
            <Button
                label="OK"
                icon="pi pi-check"
                onClick={() => {
                    reset();
                    if (selectedInstitution !== null) {
                        setData("partner", {
                            ...data.partner,
                            lead_id: selectedInstitution.id,
                            uuid: selectedInstitution.uuid,
                            phone_number: selectedInstitution.phone_number,
                            name: selectedInstitution.name,
                            total_members: selectedInstitution.total_members,
                            pic: selectedInstitution.pic,
                            address: selectedInstitution.address,
                            sales: selectedInstitution.sales,
                        });
                    }
                    setModalPartnersIsVisible(true);
                    setDialogOnboardingVisible(false);
                    setSelectedInstitution((prev) => null);
                }}
            />
        );
    };

    const header = () => {
        return (
            <HeaderDatatable
                filters={filters}
                setFilters={setFilters}
            ></HeaderDatatable>
        );
    };

    return (
        <Dialog
            header="Pilih Lead"
            visible={dialogOnboardingVisible}
            className="w-[100vw] lg:w-[75vw]"
            maximizable
            modal
            onHide={() => {
                setSelectedInstitution((prev) => null);
                setDialogOnboardingVisible(false);
            }}
            footer={() => dialogFooterInstitutionTemplate()}
        >
            <DataTable
                value={leads}
                paginator
                filters={filters}
                rowsPerPageOptions={[10, 25, 50, 100]}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} - {last} dari {totalRecords}"
                rows={10}
                header={header}
                globalFilterFields={[
                    "name",
                    "status",
                    "npwp",
                    "address",
                    "phone_number",
                ]}
                scrollable
                scrollHeight="flex"
                tableStyle={{ minWidth: "50rem" }}
                selectionMode="single"
                // selectionMode="radiobutton"
                loading={isLoadingData}
                selection={selectedInstitution}
                onSelectionChange={(e) => setSelectedInstitution(e.value)}
                dataKey="uuid"
            >
                <Column
                    selectionMode="single"
                    headerStyle={{ width: "3rem" }}
                ></Column>
                <Column
                    field="name"
                    header="Nama"
                    align="left"
                    style={{
                        width: "max-content",
                        whiteSpace: "nowrap",
                    }}
                ></Column>
                <Column
                    header="Status"
                    body={(rowData) => {
                        return (
                            <Badge
                                value={rowData.status.name}
                                className="text-white"
                                style={{
                                    backgroundColor: "#" + rowData.status.color,
                                }}
                            ></Badge>
                        );
                    }}
                    className="dark:border-none  lg:w-max lg:whitespace-nowrap"
                    headerClassName="dark:border-none  dark:bg-slate-900 dark:text-gray-300"
                    align="left"
                    style={{
                        width: "max-content",
                        whiteSpace: "nowrap",
                    }}
                ></Column>

                <Column
                    field="phone_number"
                    body={(rowData) => {
                        return rowData.phone_number
                            ? rowData.phone_number
                            : "-";
                    }}
                    className="dark:border-none"
                    headerClassName="dark:border-none dark:bg-transparent dark:text-gray-300"
                    header="No. Telepon"
                    align="left"
                    style={{
                        width: "max-content",
                        whiteSpace: "nowrap",
                    }}
                ></Column>
                <Column
                    field="address"
                    body={(rowData) => {
                        return rowData.address ? rowData.address : "-";
                    }}
                    className="dark:border-none"
                    headerClassName="dark:border-none dark:bg-transparent dark:text-gray-300"
                    header="Alamat"
                    align="left"
                    style={{
                        width: "max-content",
                        whiteSpace: "nowrap",
                    }}
                ></Column>
            </DataTable>
        </Dialog>
    );
};

export default DialogOnboarding;
