import InputError from "@/Components/InputError";
import LogDetailPartnerComponents from "@/Components/LogDetailPartnerComponent";
import { useForm } from "@inertiajs/react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";
import { useState } from "react";

const DetailSubscription = ({
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
    const [modalSubscriptionIsVisible, setModalSubscriptionIsVisible] =
        useState(false);
    const [modalEditSubscriptionIsVisible, setModalEditSubscriptionIsVisible] =
        useState(false);
    const [modalLogIsVisible, setModalLogIsVisible] = useState(false);

    const infoPriceTrainingOnlineRef = useRef(null);

    const {
        data: dataSubscription,
        setData: setDataSubscription,
        post: postSubscription,
        put: putSubscription,
        delete: destroySubscription,
        reset: resetSubscription,
        processing: processingSubscription,
        errors: errorSubscription,
    } = useForm({
        uuid: "",
        partner: {},
        nominal: 0,
        period: null,
        price_card: {
            price: "",
            type: "",
        },
        ppn: 0,
        total_bill: 0,
        price_training_online: null,
        price_training_offline: null,
        price_lanyard: null,
        price_subscription_system: null,
        fee_purchase_cazhpoin: null,
        fee_bill_cazhpoin: null,
        fee_topup_cazhpos: null,
        fee_withdraw_cazhpos: null,
        fee_bill_saldokartu: null,
    });

    const handleSubmitFormSubscription = (e, type) => {
        e.preventDefault();

        if (type != "update") {
            postSubscription("/subscriptions/", {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalSubscriptionIsVisible((prev) => (prev = false));
                    handleSelectedDetailPartner(dataSubscription.partner);
                    resetSubscription();
                },
                onError: () => {
                    showError("Update");
                },
            });
        } else {
            putSubscription("/subscriptions/" + dataSubscription.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditSubscriptionIsVisible((prev) => (prev = false));
                    handleSelectedDetailPartner(dataSubscription.partner);
                    resetSubscription();
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
    };

    const handleEditSubscription = (subscription) => {
        setDataSubscription((data) => ({
            ...data,
            uuid: subscription.uuid,
            partner: partner,
            bill: subscription.bill,
            nominal: subscription.nominal,
            total_bill: subscription.total_bill,
            ppn: subscription.ppn,
            total_ppn: subscription.total_ppn,
        }));

        setModalEditSubscriptionIsVisible(true);
    };

    const objectKeyToIndo = (key) => {
        let keyIndo;
        if (key == "bill") {
            keyIndo = "Tagihan";
        } else if (key == "nominal") {
            keyIndo = "Nominal";
        } else if (key == "ppn") {
            keyIndo = "Pajak";
        } else if (key == "total_ppn") {
            keyIndo = "Total Pajak";
        } else if (key == "total_bill") {
            keyIndo = "Total tagihan";
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
            {partner.subscription !== null ? (
                <>
                    <table class="w-full dark:text-slate-300 dark:bg-slate-700">
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Tagihan
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.subscription.bill}
                            </td>
                        </tr>

                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Nominal
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.subscription.nominal.toLocaleString(
                                    "id-ID"
                                )}
                            </td>
                        </tr>

                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                PPN
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.subscription.ppn != null
                                    ? partner.subscription.ppn
                                    : ""}
                                %
                            </td>
                        </tr>

                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Total Tagihan (nominal + ppn)
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.subscription.total_bill.toLocaleString(
                                    "id-ID"
                                )}
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
                                                "tambah langganan partner"
                                            ) &&
                                            partner.account_manager_id ==
                                                currentUser.id
                                        ) {
                                            handleEditSubscription(
                                                partner.subscription
                                            );
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

                    {/* Modal edit langganan */}
                    <div className="card flex justify-content-center">
                        <Dialog
                            header="Langganan"
                            headerClassName="dark:glass dark:text-white"
                            className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                            contentClassName="dark:glass dark:text-white"
                            visible={modalEditSubscriptionIsVisible}
                            onHide={() =>
                                setModalEditSubscriptionIsVisible(false)
                            }
                        >
                            <form
                                onSubmit={(e) =>
                                    handleSubmitFormSubscription(e, "update")
                                }
                            >
                                <div className="flex flex-col justify-around gap-4 mt-1">
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="bill">Tagihan *</label>

                                        <InputText
                                            value={dataSubscription.bill}
                                            onChange={(e) =>
                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    bill: e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300"
                                            id="bill"
                                            aria-describedby="bill-help"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="nominal">
                                            Nominal Langganan *
                                        </label>
                                        <InputNumber
                                            value={dataSubscription.nominal}
                                            onChange={(e) => {
                                                const total_bill =
                                                    (e.value *
                                                        dataSubscription.ppn) /
                                                    100;

                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    nominal: e.value,
                                                    total_ppn: total_bill,
                                                    total_bill:
                                                        dataSubscription.ppn ===
                                                        0
                                                            ? e.value
                                                            : total_bill +
                                                              e.value,
                                                });
                                            }}
                                            locale="id-ID"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="ppn">Pajak (%)</label>
                                        <InputNumber
                                            value={dataSubscription.ppn}
                                            onChange={(e) => {
                                                const total_ppn =
                                                    (e.value *
                                                        dataSubscription.nominal) /
                                                    100;

                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    ppn: e.value,
                                                    total_ppn: total_ppn,
                                                    total_bill:
                                                        dataSubscription.nominal +
                                                        total_ppn,
                                                });
                                            }}
                                            locale="id-ID"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="ppn">Jumlah PPN</label>
                                        <InputNumber
                                            value={dataSubscription.total_ppn}
                                            onChange={(e) => {
                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    total_ppn: e.target.value,
                                                });
                                            }}
                                            locale="id-ID"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="ppn">
                                            Total Tagihan(nominal + ppn) *
                                        </label>
                                        <InputNumber
                                            value={dataSubscription.total_bill}
                                            onChange={(e) => {
                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    total_ppn: e.target.value,
                                                });
                                            }}
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-center mt-5">
                                    <Button
                                        label="Submit"
                                        disabled={processingSubscription}
                                        className="bg-purple-600 text-sm shadow-md rounded-lg"
                                    />
                                </div>
                            </form>
                        </Dialog>
                    </div>
                </>
            ) : (
                <div class="w-full h-full min-h-[300px] -mt-4 flex items-center justify-center">
                    <p class="text-center">
                        Tidak ada data langganan
                        <Button
                            onClick={() => {
                                if (
                                    permissions.includes(
                                        "tambah langganan partner"
                                    ) &&
                                    partner.account_manager_id == currentUser.id
                                ) {
                                    resetSubscription();
                                    setDataSubscription("partner", partner);
                                    setModalSubscriptionIsVisible(true);
                                } else {
                                    setPermissionErrorIsVisible(
                                        (prev) => (prev = true)
                                    );
                                }
                            }}
                            className="bg-transparent p-0 cursor-pointer text-blue-700 underline "
                        >
                            , tambah langganan
                        </Button>
                    </p>
                </div>
            )}

            {/* Modal tambah langganan */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Langganan"
                    headerClassName="dark:glass dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                    contentClassName="dark:glass dark:text-white"
                    visible={modalSubscriptionIsVisible}
                    onHide={() => setModalSubscriptionIsVisible(false)}
                >
                    <form
                        onSubmit={(e) =>
                            handleSubmitFormSubscription(e, "tambah")
                        }
                    >
                        <div className="flex flex-col justify-around gap-4 mt-1">
                            <div className="flex flex-col mt-3">
                                <label htmlFor="partner_subcription">
                                    Partner
                                </label>
                                <Dropdown
                                    optionLabel="name"
                                    value={dataSubscription.partner}
                                    onChange={(e) =>
                                        setDataSubscription(
                                            "partner",
                                            e.target.value
                                        )
                                    }
                                    dataKey="id"
                                    disabled
                                    options={partners}
                                    placeholder="Pilih Partner"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                                <InputError
                                    message={errorSubscription.partner}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="bill">Tagihan *</label>

                                <InputText
                                    value={dataSubscription.bill}
                                    onChange={(e) =>
                                        setDataSubscription(
                                            "bill",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="bill"
                                    aria-describedby="bill-help"
                                />
                                <InputError
                                    message={errorSubscription.bill}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="nominal">
                                    Nominal Langganan *
                                </label>
                                <InputNumber
                                    value={dataSubscription.nominal}
                                    onChange={(e) => {
                                        const total_bill =
                                            (e.value * dataSubscription.ppn) /
                                            100;
                                        setDataSubscription({
                                            ...dataSubscription,
                                            nominal: e.value,
                                            total_ppn: total_bill,
                                            total_bill:
                                                dataSubscription.ppn === 0
                                                    ? e.value
                                                    : total_bill,
                                        });
                                    }}
                                    locale="id-ID"
                                />
                                <InputError
                                    message={errorSubscription.nominal}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="ppn">PPN(%)</label>
                                <InputNumber
                                    value={dataSubscription.ppn}
                                    onChange={(e) => {
                                        const total_ppn =
                                            (e.value *
                                                dataSubscription.nominal) /
                                            100;
                                        setDataSubscription({
                                            ...dataSubscription,
                                            ppn: e.value,
                                            total_ppn: total_ppn,
                                            total_bill:
                                                dataSubscription.nominal +
                                                total_ppn,
                                        });
                                    }}
                                    locale="id-ID"
                                />
                                <InputError
                                    message={errorSubscription.ppn}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="ppn">Jumlah Pajak</label>
                                <InputNumber
                                    value={dataSubscription.total_ppn}
                                    onChange={(e) => {
                                        setDataSubscription({
                                            ...dataSubscription,
                                            total_ppn: e.value,
                                        });
                                    }}
                                    locale="id-ID"
                                />
                                <InputError
                                    message={errorSubscription.total_ppn}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="ppn">
                                    Total Tagihan(nominal + pajak)
                                </label>
                                <InputNumber
                                    value={dataSubscription.total_bill}
                                    onChange={(e) => {
                                        setDataSubscription({
                                            ...dataSubscription,
                                            total_bill: e.value,
                                        });
                                    }}
                                    locale="id-ID"
                                />
                                <InputError
                                    message={errorSubscription.total_bill}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-5">
                            <Button
                                label="Submit"
                                disabled={processingSubscription}
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>

            <Dialog
                header="Log Langganan"
                visible={modalLogIsVisible}
                maximizable
                className="w-[90vw] lg:w-[50vw]"
                onHide={() => {
                    setModalLogIsVisible(false);
                }}
            >
                {modalLogIsVisible && (
                    <LogDetailPartnerComponents
                        selectedData={partner.subscription}
                        fetchUrl={"/api/subscriptions/{partner:id}/logs"}
                        objectKeyToIndo={objectKeyToIndo}
                    />
                )}
            </Dialog>
        </>
    );
};

export default DetailSubscription;
