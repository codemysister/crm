import { useForm } from "@inertiajs/react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
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
            nominal: subscription.nominal,
            period: subscription.period,
            price_card: JSON.parse(subscription.price_card),
            ppn: subscription.ppn,
            total_bill: subscription.total_bill,
            price_training_online: subscription.price_training_online,
            price_training_offline: subscription.price_training_offline,
            price_lanyard: subscription.price_lanyard,
            price_subscription_system: subscription.price_subscription_system,
            fee_purchase_cazhpoin: subscription.fee_purchase_cazhpoin,
            fee_bill_cazhpoin: subscription.fee_bill_cazhpoin,
            fee_topup_cazhpos: subscription.fee_topup_cazhpos,
            fee_withdraw_cazhpos: subscription.fee_withdraw_cazhpos,
            fee_bill_saldokartu: subscription.fee_bill_saldokartu,
        }));

        setModalEditSubscriptionIsVisible(true);
    };

    return (
        <>
            <table class="w-full">
                <tr class="border-b">
                    <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                        Nominal
                    </td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">:</td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                        {partner.subscription[0].nominal.toLocaleString(
                            "id-ID"
                        )}
                    </td>
                </tr>

                <tr class="border-b">
                    <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                        Periode
                    </td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">:</td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                        {partner.subscription[0].period}
                    </td>
                </tr>

                <tr class="border-b">
                    <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                        PPN
                    </td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">:</td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                        {partner.subscription[0].ppn != null
                            ? partner.subscription[0].ppn
                            : ""}
                        %
                    </td>
                </tr>

                <tr class="border-b">
                    <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                        Total Tagihan (nominal + ppn)
                    </td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">:</td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                        {partner.subscription[0].total_bill.toLocaleString(
                            "id-ID"
                        )}
                    </td>
                </tr>

                <tr class="border-b">
                    <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                        Tarif Kartu{" "}
                    </td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">:</td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                        {partner.subscription[0].price_card != null
                            ? JSON.parse(partner.subscription[0].price_card)
                                  .price +
                              "(" +
                              JSON.parse(partner.subscription[0].price_card)
                                  .type +
                              ")"
                            : ""}
                    </td>
                </tr>

                <tr class="border-b">
                    <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                        Tarif Lanyard
                    </td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">:</td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                        {partner.subscription[0].price_lanyard
                            ? partner.subscription[0].price_lanyard.toLocaleString(
                                  "id-ID"
                              )
                            : "belum diisi"}
                    </td>
                </tr>
                <tr class="border-b">
                    <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                        Tarif Langganan Sistem
                    </td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">:</td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                        {partner.subscription[0].price_subscription_system
                            ? partner.subscription[0].price_subscription_system.toLocaleString(
                                  "id-ID"
                              )
                            : "belum diisi"}
                    </td>
                </tr>
                <tr class="border-b">
                    <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                        Tarif Training Offline
                    </td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">:</td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                        {partner.subscription[0].price_training_offline
                            ? partner.subscription[0].price_training_offline.toLocaleString(
                                  "id-ID"
                              )
                            : "belum diisi"}
                    </td>
                </tr>
                <tr class="border-b">
                    <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                        Tarif Training Online
                    </td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">:</td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                        {partner.subscription[0].price_training_online
                            ? partner.subscription[0].price_training_online.toLocaleString(
                                  "id-ID"
                              )
                            : "belum diisi"}
                    </td>
                </tr>
                <tr class="border-b">
                    <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                        Fee Isi Kartu via CazhPOIN
                    </td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">:</td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                        {partner.subscription[0].fee_purchase_cazhpoin
                            ? partner.subscription[0].fee_purchase_cazhpoin.toLocaleString(
                                  "id-ID"
                              )
                            : "belum diisi"}
                    </td>
                </tr>
                <tr class="border-b">
                    <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                        Fee Bayar Tagihan via CazhPOIN
                    </td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">:</td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                        {partner.subscription[0].fee_bill_cazhpoin
                            ? partner.subscription[0].fee_bill_cazhpoin.toLocaleString(
                                  "id-ID"
                              )
                            : "belum diisi"}
                    </td>
                </tr>
                <tr class="border-b">
                    <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                        Fee Topup Kartu via CazhPos
                    </td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">:</td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                        {partner.subscription[0].fee_topup_cazhpos
                            ? partner.subscription[0].fee_topup_cazhpos.toLocaleString(
                                  "id-ID"
                              )
                            : "belum diisi"}
                    </td>
                </tr>
                <tr class="border-b">
                    <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                        Fee Withdraw Kartu via Cazh POS
                    </td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">:</td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                        {partner.subscription[0].fee_withdraw_cazhpos
                            ? partner.subscription[0].fee_withdraw_cazhpos.toLocaleString(
                                  "id-ID"
                              )
                            : "belum diisi"}
                    </td>
                </tr>
                <tr class="border-b">
                    <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                        Fee Bayar Tagihan via Saldo Kartu
                    </td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">:</td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                        {partner.subscription[0].fee_bill_saldokartu
                            ? partner.subscription[0].fee_bill_saldokartu.toLocaleString(
                                  "id-ID"
                              )
                            : "belum diisi"}
                    </td>
                </tr>
                <tr class="border-b">
                    <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                        Aksi
                    </td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">:</td>
                    <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                        <Button
                            label="edit"
                            className="p-0 underline bg-transparent text-blue-700 text-left"
                            onClick={() =>
                                handleEditSubscription(partner.subscription[0])
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
                    onHide={() => setModalEditSubscriptionIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitFormSubscription(e)}>
                        <div className="flex flex-col justify-around gap-4 mt-1">
                            <div className="flex flex-col">
                                <label htmlFor="nominal">
                                    Nominal Langganan *
                                </label>
                                <InputNumber
                                    value={dataSubscription.nominal}
                                    onValueChange={(e) => {
                                        const total_bill =
                                            (e.target.value *
                                                dataSubscription.ppn) /
                                                100 +
                                            e.target.value;
                                        setDataSubscription({
                                            ...dataSubscription,
                                            nominal: e.target.value,
                                            total_bill:
                                                dataSubscription.ppn === 0
                                                    ? e.target.value
                                                    : total_bill,
                                        });
                                    }}
                                    locale="id-ID"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="ppn">PPN(%)</label>
                                <InputNumber
                                    value={dataSubscription.ppn}
                                    onValueChange={(e) => {
                                        const ppn =
                                            (e.target.value *
                                                dataSubscription.nominal) /
                                            100;
                                        setDataSubscription({
                                            ...dataSubscription,
                                            ppn: e.target.value,
                                            total_bill:
                                                dataSubscription.nominal + ppn,
                                        });
                                    }}
                                    locale="id-ID"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="ppn">
                                    Total Tagihan(nominal + ppn)
                                </label>
                                <InputNumber
                                    value={dataSubscription.total_bill}
                                    onValueChange={(e) => {
                                        setDataSubscription({
                                            ...dataSubscription,
                                            total_bill: e.target.value,
                                        });
                                    }}
                                    locale="id-ID"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="period">Periode*</label>
                                <Dropdown
                                    value={dataSubscription.period}
                                    onChange={(e) => {
                                        setDataSubscription({
                                            ...dataSubscription,
                                            period: e.target.value,
                                        });
                                    }}
                                    options={option_period_subscription}
                                    optionLabel="name"
                                    optionValue="name"
                                    placeholder="Langganan Per-"
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className={`w-full md:w-14rem`}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">Tarif Kartu</label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="tarif"
                                            value={
                                                dataSubscription.price_card
                                                    .price
                                            }
                                            onValueChange={(e) =>
                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    price_card: {
                                                        ...dataSubscription.price_card,
                                                        price: e.target.value,
                                                    },
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="account_bank_name"
                                            aria-describedby="account_bank_name-help"
                                            locale="id-ID"
                                        />
                                        <Dropdown
                                            value={
                                                dataSubscription.price_card.type
                                            }
                                            onChange={(e) =>
                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    price_card: {
                                                        ...dataSubscription.price_card,
                                                        type: e.target.value,
                                                    },
                                                })
                                            }
                                            options={cardCategories}
                                            optionLabel="name"
                                            optionValue="name"
                                            placeholder="kategori"
                                            className="w-full md:w-14rem"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Tarif Lanyard
                                </label>
                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <Dropdown
                                            value={
                                                dataSubscription.price_lanyard
                                            }
                                            onChange={(e) =>
                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    price_lanyard:
                                                        e.target.value,
                                                })
                                            }
                                            options={option_price_lanyard}
                                            optionLabel="price"
                                            optionValue="price"
                                            placeholder="Pilih Tarif"
                                            editable
                                            valueTemplate={
                                                selectedOptionTrainingTemplate
                                            }
                                            itemTemplate={
                                                optionTrainingTemplate
                                            }
                                            className="w-full md:w-14rem"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Tarif Langganan Sistem
                                </label>
                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="tarif"
                                            value={
                                                dataSubscription.price_subscription_system
                                            }
                                            onValueChange={(e) =>
                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    price_subscription_system:
                                                        e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="account_bank_name"
                                            aria-describedby="account_bank_name-help"
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Tarif Pelatihan Offline
                                </label>
                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <Dropdown
                                            value={
                                                dataSubscription.price_training_offline
                                            }
                                            onChange={(e) =>
                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    price_training_offline:
                                                        e.target.value,
                                                })
                                            }
                                            options={option_training_offline}
                                            optionLabel="price"
                                            optionValue="price"
                                            placeholder="Pilih Tarif"
                                            editable
                                            valueTemplate={
                                                selectedOptionTrainingTemplate
                                            }
                                            itemTemplate={
                                                optionTrainingTemplate
                                            }
                                            className="w-full md:w-14rem"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Tarif Pelatihan Online
                                </label>
                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <div className="p-inputgroup flex-1 h-full">
                                            <InputNumber
                                                value={
                                                    dataSubscription.price_training_online
                                                }
                                                onChange={(e) =>
                                                    setDataSubscription({
                                                        ...dataSubscription,
                                                        price_training_online:
                                                            e.value,
                                                    })
                                                }
                                                className={`h-full`}
                                                locale="id-ID"
                                            />
                                            <Button
                                                type="button"
                                                className="h-[35px]"
                                                icon="pi pi-info-circle"
                                                onClick={(e) =>
                                                    infoPriceTrainingOnlineRef.current.toggle(
                                                        e
                                                    )
                                                }
                                            />
                                            <OverlayPanel
                                                className="shadow-md"
                                                ref={infoPriceTrainingOnlineRef}
                                            >
                                                <ul className="list-disc list-inside">
                                                    <li>
                                                        Harga Implementasi
                                                        Training dan/atau
                                                        sosialisasi secara
                                                        Daring/Online
                                                    </li>
                                                    <li>
                                                        Harga implementasi 3x
                                                        sesi training secara
                                                        gratis. (Harga yang di
                                                        imput adalah harga
                                                        training tambahan)
                                                    </li>
                                                </ul>
                                            </OverlayPanel>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Tarif Isi Kartu Via Cazhpoin
                                </label>
                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <Dropdown
                                            value={
                                                dataSubscription.fee_purchase_cazhpoin
                                            }
                                            onChange={(e) =>
                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    fee_purchase_cazhpoin:
                                                        e.target.value,
                                                })
                                            }
                                            options={option_fee}
                                            optionLabel="name"
                                            optionValue="name"
                                            placeholder="Pilih Tarif"
                                            editable
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Tarif Bayar Tagihan via CazhPOIN
                                </label>
                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <Dropdown
                                            value={
                                                dataSubscription.fee_bill_cazhpoin
                                            }
                                            onChange={(e) =>
                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    fee_bill_cazhpoin:
                                                        e.target.value,
                                                })
                                            }
                                            options={option_fee}
                                            optionLabel="name"
                                            optionValue="name"
                                            placeholder="Pilih Tarif"
                                            editable
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Tarif TopUp Kartu via Cazh POS
                                </label>
                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <Dropdown
                                            value={
                                                dataSubscription.fee_topup_cazhpos
                                            }
                                            onChange={(e) =>
                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    fee_topup_cazhpos:
                                                        e.target.value,
                                                })
                                            }
                                            options={option_fee}
                                            optionLabel="name"
                                            optionValue="name"
                                            placeholder="Pilih Tarif"
                                            editable
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Tarif Penarikan Saldo Kartu via Cazh POS
                                </label>
                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <Dropdown
                                            value={
                                                dataSubscription.fee_withdraw_cazhpos
                                            }
                                            onChange={(e) =>
                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    fee_withdraw_cazhpos:
                                                        e.target.value,
                                                })
                                            }
                                            options={option_fee}
                                            optionLabel="name"
                                            optionValue="name"
                                            placeholder="Pilih Tarif"
                                            editable
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Tarif Pembayaran Tagihan via Saldo Kartu
                                </label>
                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <Dropdown
                                            value={
                                                dataSubscription.fee_bill_saldokartu
                                            }
                                            onChange={(e) =>
                                                setDataSubscription({
                                                    ...dataSubscription,
                                                    fee_bill_saldokartu:
                                                        e.target.value,
                                                })
                                            }
                                            options={option_fee}
                                            optionLabel="name"
                                            optionValue="name"
                                            placeholder="Pilih Tarif"
                                            editable
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>
                                </div>
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
    );
};

export default DetailSubscription;
