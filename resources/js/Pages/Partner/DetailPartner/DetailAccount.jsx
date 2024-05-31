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

const DetailAccount = ({
    partner,
    partners,
    handleSelectedDetailPartner,
    showSuccess,
    showError,
    currentUser,
    permissions,
    permissionErrorIsVisible,
    setPermissionErrorIsVisible,
}) => {
    const [modalAccountIsVisible, setModalAccountIsVisible] = useState(false);
    const [modalEditAccountIsVisible, setModalEditAccountIsVisible] =
        useState(false);
    const [modalLogIsVisible, setModalLogIsVisible] = useState(false);

    const {
        data: dataAccount,
        setData: setDataAccount,
        post: postAccount,
        put: putAccount,
        delete: destroyAccount,
        reset: resetAccount,
        processing: processingAccount,
        errors: errorAccount,
        clearErrors: clearErrorsAccount,
    } = useForm({
        uuid: "",
        partner: {},
        subdomain: "",
        email_super_admin: "",
        password: "",
    });

    const handleEditAccount = (account) => {
        clearErrorsAccount();
        setDataAccount((data) => ({
            ...data,
            uuid: account.uuid,
            partner: partner,
            subdomain: account.subdomain,
            email_super_admin: account.email_super_admin,
            password: account.password,
        }));

        setModalEditAccountIsVisible(true);
    };

    const handleSubmitFormAccount = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            postAccount("/accounts", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalAccountIsVisible((prev) => false);
                    handleSelectedDetailPartner(dataAccount.partner);
                    getAccounts();
                    resetAccount();
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            putAccount("/accounts/" + dataAccount.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditAccountIsVisible((prev) => false);
                    handleSelectedDetailPartner(dataAccount.partner);
                    getAccounts();
                    resetAccount();
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
    };

    const objectKeyToIndo = (key) => {
        let keyIndo;
        if (key == "subdomain") {
            keyIndo = "Subdomain";
        } else if (key == "email_super_admin") {
            keyIndo = "Email super admin";
        } else if (key == "password") {
            keyIndo = "CAS link partner";
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
            {partner.account !== null ? (
                <>
                    <table class="w-full dark:text-slate-300 dark:bg-slate-700">
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Url Subdomain
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.account?.subdomain ?? "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Email Super Admin
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.account?.email_super_admin ?? "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Cas Link Partner
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.account?.password ?? "-"}
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
                                                "tambah akun partner"
                                            ) &&
                                            partner.account_manager_id ==
                                                currentUser.id
                                        ) {
                                            handleEditAccount(partner.account);
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
                        Tidak ada data akun setting,{" "}
                        <Button
                            onClick={() => {
                                if (
                                    permissions.includes(
                                        "tambah akun partner"
                                    ) &&
                                    partner.account_manager_id == currentUser.id
                                ) {
                                    resetAccount();
                                    setDataAccount("partner", partner);
                                    setModalAccountIsVisible(true);
                                } else {
                                    setPermissionErrorIsVisible(
                                        (prev) => (prev = true)
                                    );
                                }
                            }}
                            className="bg-transparent p-0 cursor-pointer text-blue-700 underline "
                        >
                            tambah akun setting
                        </Button>
                    </p>
                </div>
            )}

            {/* Modal tambah akun */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Akun"
                    headerClassName="dark:glass dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                    contentClassName="dark:glass dark:text-white"
                    visible={modalAccountIsVisible}
                    onHide={() => setModalAccountIsVisible(false)}
                >
                    <form
                        onSubmit={(e) => handleSubmitFormAccount(e, "tambah")}
                    >
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="partner_subcription">
                                    Partner
                                </label>
                                <Dropdown
                                    dataKey="name"
                                    optionLabel="name"
                                    value={dataAccount.partner}
                                    onChange={(e) =>
                                        setDataAccount(
                                            "partner",
                                            e.target.value
                                        )
                                    }
                                    options={partners}
                                    placeholder="Pilih Partner"
                                    filter
                                    disabled
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                                <InputError
                                    message={errorAccount.partner}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="subdomain">Subdomain</label>
                                <InputText
                                    value={dataAccount.subdomain}
                                    onChange={(e) =>
                                        setDataAccount(
                                            "subdomain",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="subdomain"
                                    aria-describedby="subdomain-help"
                                />
                                <InputError
                                    message={errorAccount.subdomain}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="email_super_admin">
                                    Email Super Admin
                                </label>
                                <InputText
                                    value={dataAccount.email_super_admin}
                                    onChange={(e) =>
                                        setDataAccount(
                                            "email_super_admin",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="email_super_admin"
                                    aria-describedby="email_super_admin-help"
                                />
                                <InputError
                                    message={errorAccount.email_super_admin}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="cars_link_partner">
                                    CAS link partner
                                </label>
                                <InputText
                                    value={dataAccount.password}
                                    onChange={(e) =>
                                        setDataAccount(
                                            "password",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="cars_link_partner"
                                    aria-describedby="cars_link_partner-help"
                                />
                                <InputError
                                    message={errorAccount.password}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-5">
                            <Button
                                label="Submit"
                                disabled={processingAccount}
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>

            {/* Modal edit akun */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Akun"
                    headerClassName="dark:glass dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                    contentClassName="dark:glass dark:text-white"
                    visible={modalEditAccountIsVisible}
                    onHide={() => setModalEditAccountIsVisible(false)}
                >
                    <form
                        onSubmit={(e) => handleSubmitFormAccount(e, "update")}
                    >
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="partner_subcription">
                                    Partner
                                </label>
                                <Dropdown
                                    dataKey="name"
                                    optionLabel="name"
                                    value={dataAccount.partner}
                                    onChange={(e) =>
                                        setDataAccount(
                                            "partner",
                                            e.target.value
                                        )
                                    }
                                    options={partners}
                                    placeholder="Pilih Partner"
                                    disabled
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                                <InputError
                                    message={errorAccount.partner}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="subdomain">Subdomain</label>
                                <InputText
                                    value={dataAccount.subdomain}
                                    onChange={(e) =>
                                        setDataAccount(
                                            "subdomain",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="subdomain"
                                    aria-describedby="subdomain-help"
                                />
                                <InputError
                                    message={errorAccount.subdomain}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="email_super_admin">
                                    Email Super Admin
                                </label>
                                <InputText
                                    value={dataAccount.email_super_admin}
                                    onChange={(e) =>
                                        setDataAccount(
                                            "email_super_admin",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="email_super_admin"
                                    aria-describedby="email_super_admin-help"
                                />
                                <InputError
                                    message={errorAccount.email_super_admin}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="cars_link_partner">
                                    CAS link partner
                                </label>
                                <InputText
                                    value={dataAccount.password}
                                    onChange={(e) =>
                                        setDataAccount(
                                            "password",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="cars_link_partner"
                                    aria-describedby="cars_link_partner-help"
                                />
                                <InputError
                                    message={errorAccount.password}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-5">
                            <Button
                                label="Submit"
                                disabled={processingAccount}
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>

            <Dialog
                header="Log Akun Setting"
                visible={modalLogIsVisible}
                maximizable
                className="w-[90vw] lg:w-[50vw]"
                onHide={() => {
                    setModalLogIsVisible(false);
                }}
            >
                {modalLogIsVisible && (
                    <LogDetailPartnerComponents
                        selectedData={partner.account}
                        fetchUrl={"/api/accounts/{partner:id}/logs"}
                        objectKeyToIndo={objectKeyToIndo}
                    />
                )}
            </Dialog>
        </>
    );
};

export default DetailAccount;
