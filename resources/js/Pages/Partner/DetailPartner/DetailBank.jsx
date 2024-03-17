import { useForm } from "@inertiajs/react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

const DetailBank = ({
    partner,
    handleSelectedDetailPartner,
    showSuccess,
    showError,
}) => {
    const [modalEditBankIsVisible, setModalEditBankIsVisible] = useState(false);

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

    const handleSubmitFormBank = (e) => {
        e.preventDefault();

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
    };

    return (
        <>
            {partner.banks[0] !== undefined ? (
                <>
                    <table class="w-full">
                        <tr class="border-b">
                            <td class="pt-2 pb-1 text-gray-900 text-base font-bold w-1/5">
                                Bank
                            </td>
                            <td class="pt-2 pb-1 text-gray-900 text-base w-[2%]">
                                :
                            </td>
                            <td class="pt-2 pb-1 text-gray-900 text-base w-7/12">
                                {partner.banks[0]?.bank ?? "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1 text-gray-900 text-base font-bold w-1/5">
                                No. Rekening
                            </td>
                            <td class="pt-2 pb-1 text-gray-900 text-base w-[2%]">
                                :
                            </td>
                            <td class="pt-2 pb-1 text-gray-900 text-base w-7/12">
                                {partner.banks[0]?.account_bank_number ?? "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1 text-gray-900 text-base font-bold w-1/5">
                                Atas Nama
                            </td>
                            <td class="pt-2 pb-1 text-gray-900 text-base w-[2%]">
                                :
                            </td>
                            <td class="pt-2 pb-1 text-gray-900 text-base w-7/12">
                                {partner.banks[0]?.account_bank_name ?? "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1 text-gray-900 text-base font-bold w-1/5">
                                Aksi
                            </td>
                            <td class="pt-2 pb-1 text-gray-900 text-base w-[2%]">
                                :
                            </td>
                            <td class="pt-2 pb-1 text-gray-900 text-base w-7/12">
                                <Button
                                    label="edit"
                                    className="p-0 underline bg-transparent text-blue-700 text-left"
                                    onClick={() =>
                                        handleEditBank(partner.banks[0])
                                    }
                                />
                            </td>
                        </tr>
                    </table>

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
                            <form onSubmit={(e) => handleSubmitFormBank(e)}>
                                <div className="flex flex-col justify-around gap-4 mt-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="bank">Bank</label>
                                        <InputText
                                            value={dataBank.bank}
                                            onChange={(e) =>
                                                setDataBank(
                                                    "bank",
                                                    e.target.value
                                                )
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
                </>
            ) : (
                <div class="w-full h-full min-h-[300px] -mt-4 flex items-center justify-center">
                    <p class="text-center">Tidak ada data bank</p>
                </div>
            )}
        </>
    );
};

export default DetailBank;
