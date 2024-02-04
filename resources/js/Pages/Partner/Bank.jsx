import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useForm } from "@inertiajs/react";
import { FilterMatchMode } from "primereact/api";

const Bank = ({
    partners,
    showSuccess,
    showError,
    handleSelectedDetailPartner,
}) => {
    const [banks, setBanks] = useState([]);
    const [modalBankIsVisible, setModalBankIsVisible] = useState(false);
    const [modalEditBankIsVisible, setModalEditBankIsVisible] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
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

    const actionBodyTemplateBank = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => handleEditBank(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => {
                        handleDeleteBank(rowData);
                    }}
                />
            </React.Fragment>
        );
    };

    const getBanks = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/partners/banks");
        let data = await response.json();

        setBanks((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            await getBanks();
        };

        fetchData();
    }, []);

    const {
        data: dataBank,
        setData: setDataBank,
        post: postBank,
        put: putBank,
        delete: destroyBank,
        reset: resetBank,
        processing: processingBank,
        errors: errorBank,
    } = useForm({
        uuid: "",
        partner: {},
        bank: "",
        account_bank_number: "",
        account_bank_name: "",
    });

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

    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };

    const header = () => {
        return (
            <div className="flex flex-row justify-between gap-2 align-items-center items-end">
                <div>
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalBankIsVisible((prev) => (prev = true));
                            resetBank();
                        }}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                </div>
                <div className="w-[30%]">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search dark:text-white" />
                        <InputText
                            className="dark:bg-transparent dark:placeholder-white"
                            value={globalFilterValue}
                            onChange={onGlobalFilterChange}
                            placeholder="Keyword Search"
                        />
                    </span>
                </div>
            </div>
        );
    };

    const handleEditBank = (bank) => {
        setDataBank((data) => ({ ...data, uuid: bank.uuid }));
        setDataBank((data) => ({ ...data, partner: bank.partner }));
        setDataBank((data) => ({ ...data, bank: bank.bank }));
        setDataBank((data) => ({
            ...data,
            account_bank_number: bank.account_bank_number,
        }));
        setDataBank((data) => ({
            ...data,
            account_bank_name: bank.account_bank_name,
        }));

        setModalEditBankIsVisible(true);
    };

    const handleSubmitFormBank = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            postBank("/partners/banks", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalBankIsVisible((prev) => false);
                    getBanks();
                    resetBank(
                        "partner",
                        "bank",
                        "account_bank_number",
                        "account_bank_name"
                    );
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            putBank("/partners/banks/" + dataBank.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditBankIsVisible((prev) => false);
                    getBanks();
                    resetBank(
                        "partner",
                        "bank",
                        "account_bank_number",
                        "account_bank_name"
                    );
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
    };

    const handleDeleteBank = (bank) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroyBank("partners/banks/" + bank.uuid, {
                    onSuccess: () => {
                        getBanks();
                        showSuccess("Hapus");
                    },
                    onError: () => {
                        showError("Hapus");
                    },
                });
            },
        });
    };

    return (
        <>
            {/* Modal tambah bank */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Bank"
                    headerClassName="dark:glass dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                    contentClassName="dark:glass dark:text-white"
                    visible={modalBankIsVisible}
                    onHide={() => setModalBankIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitFormBank(e, "tambah")}>
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="partner_subcription">
                                    Partner
                                </label>
                                <Dropdown
                                    optionLabel="name"
                                    value={dataBank.partner}
                                    onChange={(e) =>
                                        setDataBank("partner", e.target.value)
                                    }
                                    options={partners}
                                    placeholder="Pilih Lembaga"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="bank">Bank</label>
                                <InputText
                                    value={dataBank.bank}
                                    onChange={(e) =>
                                        setDataBank("bank", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="bank"
                                    aria-describedby="bank-help"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="account_bank_number">
                                    Nomor Rekening
                                </label>
                                <InputText
                                    value={dataBank.account_bank_number}
                                    onChange={(e) =>
                                        setDataBank(
                                            "account_bank_number",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="account_bank_number"
                                    aria-describedby="account_bank_number-help"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="account_bank_name">
                                    Atas Nama
                                </label>
                                <InputText
                                    value={dataBank.account_bank_name}
                                    onChange={(e) =>
                                        setDataBank(
                                            "account_bank_name",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="account_bank_name"
                                    aria-describedby="account_bank_name-help"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-5">
                            <Button
                                label="Submit"
                                disabled={processingBank}
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>

            {/* Modal edit bank */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Bank"
                    headerClassName="dark:glass dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                    contentClassName="dark:glass dark:text-white"
                    visible={modalEditBankIsVisible}
                    onHide={() => setModalEditBankIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitFormBank(e, "update")}>
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="partner_subcription">
                                    Partner
                                </label>
                                <Dropdown
                                    optionLabel="name"
                                    value={dataBank.partner}
                                    onChange={(e) =>
                                        setDataBank("partner", e.target.value)
                                    }
                                    options={partners}
                                    placeholder="Pilih Partner"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="bank">Bank</label>
                                <InputText
                                    value={dataBank.bank}
                                    onChange={(e) =>
                                        setDataBank("bank", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="bank"
                                    aria-describedby="bank-help"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="account_bank_number">
                                    Nomor Rekening
                                </label>
                                <InputText
                                    value={dataBank.account_bank_number}
                                    onChange={(e) =>
                                        setDataBank(
                                            "account_bank_number",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="account_bank_number"
                                    aria-describedby="account_bank_number-help"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="account_bank_name">
                                    Atas Nama
                                </label>
                                <InputText
                                    value={dataBank.account_bank_name}
                                    onChange={(e) =>
                                        setDataBank(
                                            "account_bank_name",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="account_bank_name"
                                    aria-describedby="account_bank_name-help"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-5">
                            <Button
                                label="Submit"
                                disabled={processingBank}
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>

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
                        rows={5}
                        emptyMessage="Langganan partner tidak ditemukan."
                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                        header={header}
                        filters={filters}
                        globalFilterFields={[
                            "partner.name",
                            "account_bank_name",
                        ]}
                        value={banks}
                        dataKey="id"
                    >
                        <Column
                            header="No"
                            body={(_, { rowIndex }) => rowIndex + 1}
                            className="dark:border-none pl-6"
                            headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                            style={{ minWidth: "3%" }}
                        />
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
                            style={{ minWidth: "4rem" }}
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
                            field="account_bank_name"
                            header="Atas Nama"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{ minWidth: "4rem" }}
                        ></Column>
                        <Column
                            field="bank"
                            header="Bank"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{ minWidth: "4rem" }}
                        ></Column>
                        <Column
                            field="account_bank_number"
                            header="Nomor Rekening"
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{ minWidth: "5rem" }}
                        ></Column>
                        <Column
                            header="Action"
                            body={actionBodyTemplateBank}
                            style={{ minWidth: "4rem" }}
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                        ></Column>
                    </DataTable>
                </div>
            </div>
        </>
    );
};

export default Bank;
