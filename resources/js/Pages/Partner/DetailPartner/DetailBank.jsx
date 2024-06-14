import InputError from "@/Components/InputError";
import LogDetailPartnerComponents from "@/Components/LogDetailPartnerComponent";
import { formateDate } from "@/Utils/formatDate";
import { useForm } from "@inertiajs/react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

const DetailBank = ({
    partner,
    partners,
    handleSelectedDetailPartner,
    showSuccess,
    showError,
    permissions,
    currentUser,
    permissionErrorIsVisible,
    setPermissionErrorIsVisible,
}) => {
    const [modalBankIsVisible, setModalBankIsVisible] = useState(false);
    const [modalEditBankIsVisible, setModalEditBankIsVisible] = useState(false);
    const [modalLogIsVisible, setModalLogIsVisible] = useState(false);

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

    const handleEditBank = (bank) => {
        setDataBank((data) => ({
            ...data,
            uuid: bank.uuid,
            partner: partner,
            bank: bank.bank,
            account_bank_number: bank.account_bank_number,
            account_bank_name: bank.account_bank_name,
        }));

        setModalEditBankIsVisible(true);
    };

    const handleSubmitFormBank = (e, type) => {
        e.preventDefault();

        if (type != "update") {
            postBank("/banks/" + dataBank.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalBankIsVisible((prev) => false);
                    handleSelectedDetailPartner(dataBank.partner);
                    resetBank();
                },
                onError: () => {
                    showError("Update");
                },
            });
        } else {
            putBank("/banks/" + dataBank.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditBankIsVisible((prev) => false);
                    handleSelectedDetailPartner(dataBank.partner);
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

    const objectKeyToIndo = (key) => {
        let keyIndo;
        if (key == "bank") {
            keyIndo = "Bank";
        } else if (key == "account_bank_name") {
            keyIndo = "Atas Nama";
        } else if (key == "account_bank_number") {
            keyIndo = "Nomor Rekening";
        }

        return keyIndo;
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

    return (
        <>
            {partner.bank !== null ? (
                <>
                    <table class="w-full dark:text-slate-300 dark:bg-slate-700">
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Bank
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.bank?.bank ?? "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                No. Rekening
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.bank?.account_bank_number ?? "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Atas Nama
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.bank?.account_bank_name ?? "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Log
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                <Button
                                    onClick={() => {
                                        setModalLogIsVisible(true);
                                    }}
                                    className="bg-transparent p-0 cursor-pointer text-blue-700 underline "
                                >
                                    logs
                                </Button>
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Aksi
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                <Button
                                    label="edit"
                                    className="p-0 underline bg-transparent text-blue-700 text-left"
                                    onClick={() => {
                                        if (
                                            permissions.includes(
                                                "tambah bank partner"
                                            ) &&
                                            partner.account_manager_id ==
                                                currentUser.id
                                        ) {
                                            handleEditBank(partner.bank);
                                        } else {
                                            setPermissionErrorIsVisible(
                                                (prev) => (prev = true)
                                            );
                                        }
                                    }}
                                />
                            </td>
                        </tr>
                    </table>
                </>
            ) : (
                <div class="w-full h-full min-h-[300px] -mt-4 flex items-center justify-center">
                    <p class="text-center">
                        Tidak ada data bank,{" "}
                        <Button
                            onClick={() => {
                                if (
                                    permissions.includes(
                                        "tambah bank partner"
                                    ) &&
                                    partner.account_manager_id == currentUser.id
                                ) {
                                    resetBank();
                                    setDataBank("partner", partner);
                                    setModalBankIsVisible(true);
                                } else {
                                    setPermissionErrorIsVisible(
                                        (prev) => (prev = true)
                                    );
                                }
                            }}
                            className="bg-transparent p-0 cursor-pointer text-blue-700 underline "
                        >
                            tambah bank
                        </Button>
                    </p>
                </div>
            )}

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
                                    dataKey="name"
                                    optionLabel="name"
                                    value={dataBank.partner}
                                    onChange={(e) =>
                                        setDataBank("partner", e.target.value)
                                    }
                                    options={partners}
                                    placeholder="Pilih Lembaga"
                                    filter
                                    disabled
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                                <InputError
                                    message={errorBank.partner}
                                    className="mt-2"
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
                                <InputError
                                    message={errorBank.bank}
                                    className="mt-2"
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
                                <InputError
                                    message={errorBank.account_bank_number}
                                    className="mt-2"
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
                                <InputError
                                    message={errorBank.account_bank_name}
                                    className="mt-2"
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
                            {/* <div className="flex flex-col">
                                <label htmlFor="partner_subcription">
                                    Partner
                                </label>
                                <Dropdown
                                    dataKey="name"
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
                                <InputError
                                    message={errorBank.partner}
                                    className="mt-2"
                                />
                            </div> */}

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
                                <InputError
                                    message={errorBank.bank}
                                    className="mt-2"
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
                                <InputError
                                    message={errorBank.account_bank_number}
                                    className="mt-2"
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
                                <InputError
                                    message={errorBank.account_bank_name}
                                    className="mt-2"
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

            <Dialog
                header="Log Bank"
                visible={modalLogIsVisible}
                maximizable
                className="w-[90vw] lg:w-[50vw]"
                onHide={() => {
                    setModalLogIsVisible(false);
                }}
            >
                {modalLogIsVisible && (
                    <LogDetailPartnerComponents
                        selectedData={partner.bank}
                        fetchUrl={"/api/banks/{partner:id}/logs"}
                        objectKeyToIndo={objectKeyToIndo}
                    />
                )}
            </Dialog>
        </>
    );
};

export default DetailBank;
