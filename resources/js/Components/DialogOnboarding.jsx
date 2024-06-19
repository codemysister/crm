import { formatNPWP } from "@/Utils/formatNPWP";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { SelectButton } from "primereact/selectbutton";
import { Toast } from "primereact/toast";
import { useRef } from "react";
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
    const toast = useRef(null);

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
                    if (
                        (selectedInstitution.mou !== null) &
                        (selectedInstitution.sph !== null)
                    ) {
                        if (selectedInstitution !== null) {
                            setData("partner", {
                                ...data.partner,
                                lead_id: selectedInstitution.id,
                                uuid: selectedInstitution.uuid,
                                npwp: selectedInstitution.npwp,
                                phone_number: selectedInstitution.phone_number,
                                name: selectedInstitution.name,
                                total_members:
                                    selectedInstitution.total_members,
                                pic: selectedInstitution.pic,
                                address: selectedInstitution.address,
                                sales: selectedInstitution.sales,
                                onboarding: true,
                            });
                        }
                        setModalPartnersIsVisible(true);
                        setDialogOnboardingVisible(false);
                        setSelectedInstitution((prev) => null);
                    } else {
                        toast.current.show({
                            severity: "error",
                            summary: "Error",
                            detail: "Lengkapi SPH dan MOU terlebih dahulu",
                            life: 3000,
                        });
                    }
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
        <>
            <Toast ref={toast} />
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
                        header="Lembaga"
                        align="left"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                    ></Column>

                    <Column
                        field="npwp"
                        className="dark:border-none"
                        headerClassName="dark:border-none dark:bg-transparent dark:text-gray-300"
                        header="NPWP"
                        align="left"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                    ></Column>
                    <Column
                        field="SPH"
                        body={(rowData) => {
                            return rowData.sph ? (
                                <a
                                    href={rowData.sph.sph_doc}
                                    download={`SPH_${rowData.sph.partner_name}`}
                                    class="font-bold  w-full h-full text-center rounded-full "
                                >
                                    <i
                                        className="pi pi-file-pdf"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            fontSize: "1.5rem",
                                        }}
                                    ></i>
                                </a>
                            ) : (
                                "-"
                            );
                        }}
                        className="dark:border-none"
                        headerClassName="dark:border-none dark:bg-transparent dark:text-gray-300"
                        header="Surat Penawaran Harga"
                        align="center"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                    ></Column>
                    <Column
                        field="MOU"
                        body={(rowData) => {
                            return rowData.mou ? (
                                <a
                                    href={rowData.mou.mou_doc}
                                    download={`SPH_${rowData.mou.partner_name}`}
                                    class="font-bold  w-full h-full text-center rounded-full "
                                >
                                    <i
                                        className="pi pi-file-pdf"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            fontSize: "1.5rem",
                                        }}
                                    ></i>
                                </a>
                            ) : (
                                "-"
                            );
                        }}
                        className="dark:border-none"
                        headerClassName="dark:border-none dark:bg-transparent dark:text-gray-300"
                        header="MOU"
                        align="left"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                    ></Column>
                </DataTable>
            </Dialog>
        </>
    );
};

export default DialogOnboarding;
