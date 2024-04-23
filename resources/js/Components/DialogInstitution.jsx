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

const DialogInstitution = ({
    dialogInstitutionVisible,
    setDialogInstitutionVisible,
    isLoadingData,
    setIsLoadingData,
    partners,
    setPartners,
    leads,
    setLeads,
    filters,
    setFilters,
    data,
    setData,
    setProvinceName,
    reset,
}) => {
    const [institutionTypeOptions] = useState([
        { label: "Partner", value: "partner" },
        { label: "Lead", value: "lead" },
    ]);
    const [institutionType, setInstitutionType] = useState(
        institutionTypeOptions[0].value
    );
    const [selectedInstitution, setSelectedInstitution] = useState([]);

    useEffect(() => {
        setSelectedInstitution(data.partner);
    }, []);

    useEffect(() => {
        if (institutionType == "lead") {
            getLeads();
        } else {
            getPartners();
        }
    }, [institutionType]);

    const getPartners = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/partners");
        let data = await response.json();

        setPartners((prev) => (prev = data.partners));

        setIsLoadingData(false);
    };

    const getLeads = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/leads");
        let data = await response.json();

        setLeads((prev) => (prev = data.leads));

        setIsLoadingData(false);
    };

    const dialogFooterInstitutionTemplate = (type) => {
        return (
            <Button
                label="OK"
                icon="pi pi-check"
                onClick={() => {
                    reset();
                    if (selectedInstitution !== null) {
                        if (institutionType == "partner") {
                            setData({
                                ...data,
                                partner: {
                                    id: selectedInstitution.id,
                                    uuid: selectedInstitution.uuid,
                                    name: selectedInstitution.name,
                                    phone_number:
                                        selectedInstitution.phone_number,
                                    province: selectedInstitution.province,
                                    regency: selectedInstitution.regency,
                                    pic: selectedInstitution.pics
                                        ? selectedInstitution.pics[0].name
                                        : null,
                                    pic_position: selectedInstitution.pics.lgn
                                        ? selectedInstitution.pics[0].position
                                        : null,
                                    bank:
                                        selectedInstitution.banks.length > 0
                                            ? selectedInstitution.banks[0].bank
                                            : null,
                                    account_bank_number:
                                        selectedInstitution.banks.length > 0
                                            ? selectedInstitution.banks[0]
                                                  .account_bank_number
                                            : null,
                                    account_bank_name:
                                        selectedInstitution.banks.length > 0
                                            ? selectedInstitution.banks[0]
                                                  .account_bank_name
                                            : null,

                                    type: institutionType,
                                },
                                url_subdomain: selectedInstitution.accounts
                                    ? selectedInstitution.accounts[0].subdomain
                                    : null,
                            });

                            setProvinceName(
                                (prev) =>
                                    (prev = JSON.parse(
                                        selectedInstitution.province
                                    ).name)
                            );
                        } else {
                            setData("partner", {
                                ...data.partner,
                                id: selectedInstitution.id,
                                uuid: selectedInstitution.uuid,
                                phone_number: selectedInstitution.phone_number,
                                name: selectedInstitution.name,
                                pic: selectedInstitution.pic,
                                bank: null,
                                province: null,
                                regency: null,
                                account_bank_number: null,
                                account_bank_name: null,
                                type: institutionType,
                            });
                        }
                    }

                    setDialogInstitutionVisible(false);
                }}
            />
        );
    };

    const header = () => {
        return (
            <HeaderDatatable filters={filters} setFilters={setFilters}>
                <SelectButton
                    className="w-full flex justify-end lg:text-md text-center"
                    value={institutionType}
                    onChange={(e) => setInstitutionType(e.value)}
                    options={institutionTypeOptions}
                />
            </HeaderDatatable>
        );
    };

    return (
        <Dialog
            header="Pilih Lembaga"
            visible={dialogInstitutionVisible}
            className="w-[100vw] lg:w-[75vw]"
            maximizable
            modal
            onHide={() => setDialogInstitutionVisible(false)}
            footer={() => dialogFooterInstitutionTemplate()}
        >
            <DataTable
                value={institutionType == "partner" ? partners : leads}
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
                {institutionType == "partner" && (
                    <Column
                        header="NPWP"
                        body={(rowData) =>
                            rowData.npwp !== null
                                ? formatNPWP(rowData.npwp)
                                : "-"
                        }
                        className="dark:border-none"
                        headerClassName="dark:border-none  dark:bg-slate-900 dark:text-gray-300"
                        align="left"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                    ></Column>
                )}
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

export default DialogInstitution;
