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
    handleSelectedDetailPartner,
    showSuccess,
    showError,
}) => {
    const [modalEditSubscriptionIsVisible, setModalEditSubscriptionIsVisible] =
        useState(false);
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

    const option_period_subscription = [
        { name: "kartu/bulan" },
        { name: "kartu/tahun" },
        { name: "lembaga/bulan" },
        { name: "lembaga/tahun" },
    ];

    let cardCategories = [{ name: "digital" }, { name: "cetak" }];

    const option_fee = [{ name: 1000 }, { name: 2000 }, { name: 2500 }];
    const option_price_lanyard = [
        { name: "Lanyard Polos", price: 10000 },
        { name: "Lanyard Sablon", price: 12000 },
        { name: "Lanyard Printing", price: 20000 },
    ];

    const option_training_offline = [
        { name: "Jawa", price: 15000000 },
        { name: "Kalimantan", price: 25000000 },
        { name: "Sulawesi", price: 27000000 },
        { name: "Sumatra", price: 23000000 },
        { name: "Bali", price: 26000000 },
        { name: "Jabodetabek", price: 15000000 },
    ];

    const onColumnToggle = (event) => {
        let selectedColumns = event.value;
        let orderedSelectedColumns = columnsSubscription.filter((col) =>
            selectedColumns.some((sCol) => sCol.field === col.field)
        );

        setVisibleColumnsSubscription(orderedSelectedColumns);
    };

    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
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

    const selectedOptionTrainingTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.price}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const optionTrainingTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>
                    {option.name} - {option.price}
                </div>
            </div>
        );
    };

    const handleSubmitFormSubscription = (e, type) => {
        e.preventDefault();

        putSubscription("/partners/subscriptions/" + dataSubscription.uuid, {
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
            // period: subscription.period,
            // price_card: JSON.parse(subscription.price_card),
            // price_training_online: subscription.price_training_online,
            // price_training_offline: subscription.price_training_offline,
            // price_lanyard: subscription.price_lanyard,
            // price_subscription_system: subscription.price_subscription_system,
            // fee_purchase_cazhpoin: subscription.fee_purchase_cazhpoin,
            // fee_bill_cazhpoin: subscription.fee_bill_cazhpoin,
            // fee_topup_cazhpos: subscription.fee_topup_cazhpos,
            // fee_withdraw_cazhpos: subscription.fee_withdraw_cazhpos,
            // fee_bill_saldokartu: subscription.fee_bill_saldokartu,
        }));

        setModalEditSubscriptionIsVisible(true);
    };

    return (
        <>
            {partner.subscriptions[0] !== undefined ? (
                <>
                    <table class="w-full">
                        <tr class="border-b">
                            <td class="pt-2 pb-1 text-gray-900 text-base font-bold w-1/5">
                                Tagihan
                            </td>
                            <td class="pt-2 pb-1 text-gray-900 text-base w-[2%]">
                                :
                            </td>
                            <td class="pt-2 pb-1 text-gray-900 text-base w-7/12">
                                {partner.subscriptions[0].bill}
                            </td>
                        </tr>

                        <tr class="border-b">
                            <td class="pt-2 pb-1 text-gray-900 text-base font-bold w-1/5">
                                Nominal
                            </td>
                            <td class="pt-2 pb-1 text-gray-900 text-base w-[2%]">
                                :
                            </td>
                            <td class="pt-2 pb-1 text-gray-900 text-base w-7/12">
                                {partner.subscriptions[0].nominal.toLocaleString(
                                    "id-ID"
                                )}
                            </td>
                        </tr>

                        <tr class="border-b">
                            <td class="pt-2 pb-1 text-gray-900 text-base font-bold w-1/5">
                                PPN
                            </td>
                            <td class="pt-2 pb-1 text-gray-900 text-base w-[2%]">
                                :
                            </td>
                            <td class="pt-2 pb-1 text-gray-900 text-base w-7/12">
                                {partner.subscriptions[0].ppn != null
                                    ? partner.subscriptions[0].ppn
                                    : ""}
                                %
                            </td>
                        </tr>

                        <tr class="border-b">
                            <td class="pt-2 pb-1 text-gray-900 text-base font-bold w-1/5">
                                Total Tagihan (nominal + ppn)
                            </td>
                            <td class="pt-2 pb-1 text-gray-900 text-base w-[2%]">
                                :
                            </td>
                            <td class="pt-2 pb-1 text-gray-900 text-base w-7/12">
                                {partner.subscriptions[0].total_bill.toLocaleString(
                                    "id-ID"
                                )}
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
                                        handleEditSubscription(
                                            partner.subscriptions[0]
                                        )
                                    }
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
                                    handleSubmitFormSubscription(e)
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
                    <p class="text-center">Tidak ada data langganan</p>
                </div>
            )}
        </>
    );
};

export default DetailSubscription;
