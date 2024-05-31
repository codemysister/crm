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

const DetailPriceList = ({
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
    const [modalPriceListIsVisible, setModalPriceListIsVisible] =
        useState(false);
    const [modalEditPriceList, setModalEditPriceList] = useState(false);
    const [modalLogIsVisible, setModalLogIsVisible] = useState(false);
    const infoPriceTrainingOnlineRef = useRef(null);
    const infoPriceTrainingOfflineRef = useRef(null);

    const {
        data: dataPriceList,
        setData: setDataPriceList,
        post: postPriceList,
        put: putPriceList,
        delete: destroyPriceList,
        reset: resetPriceList,
        processing: processingPriceList,
        errors: errorPriceList,
    } = useForm({
        uuid: "",
        partner: {},

        price_card: {
            price: "",
            type: "",
        },
        price_training_online: null,
        price_training_offline: null,
        price_lanyard: null,
        price_PriceList_system: null,
        fee_qris: null,
        fee_purchase_cazhpoin: null,
        fee_bill_cazhpoin: null,
        fee_topup_cazhpos: null,
        fee_withdraw_cazhpos: null,
        fee_bill_saldokartu: null,
    });

    let cardCategories = [{ name: "digital" }, { name: "cetak" }];

    const option_training_offline = [
        { name: "Jawa", price: 15000000 },
        { name: "Kalimantan", price: 25000000 },
        { name: "Sulawesi", price: 27000000 },
        { name: "Sumatra", price: 23000000 },
        { name: "Bali", price: 26000000 },
        { name: "Jabodetabek", price: 15000000 },
    ];

    const option_price_lanyard = [
        { name: "Lanyard Polos", price: 10000 },
        { name: "Lanyard Sablon", price: 12000 },
        { name: "Lanyard Printing", price: 20000 },
    ];

    const option_fee_price = [
        { name: "1", price: 1000 },
        { name: "2", price: 2000 },
        { name: "3", price: 2500 },
    ];

    const selectedOptionFeeTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.price}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const optionFeeTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.price}</div>
            </div>
        );
    };

    const optionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
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

    const handleEditPriceList = (priceList) => {
        setDataPriceList((data) => ({
            ...data,
            uuid: priceList.uuid,
            partner: partner,
            period: priceList.period,
            price_card: JSON.parse(priceList.price_card),
            price_subscription_system: priceList.price_subscription_system,
            price_training_online: priceList.price_training_online,
            price_training_offline: priceList.price_training_offline,
            price_lanyard: priceList.price_lanyard,
            price_priceList_system: priceList.price_priceList_system,
            fee_qris: priceList.fee_qris,
            fee_purchase_cazhpoin: priceList.fee_purchase_cazhpoin,
            fee_bill_cazhpoin: priceList.fee_bill_cazhpoin,
            fee_topup_cazhpos: priceList.fee_topup_cazhpos,
            fee_withdraw_cazhpos: priceList.fee_withdraw_cazhpos,
            fee_bill_saldokartu: priceList.fee_bill_saldokartu,
        }));

        setModalEditPriceList(true);
    };

    const handleSubmitFormPriceList = (e, type) => {
        e.preventDefault();

        if (type != "update") {
            postPriceList("/prices/", {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalPriceListIsVisible((prev) => (prev = false));
                    handleSelectedDetailPartner(dataPriceList.partner);
                    resetPriceList();
                },
                onError: () => {
                    showError("Update");
                },
            });
        } else {
            putPriceList("/prices/" + dataPriceList.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditPriceList((prev) => (prev = false));
                    handleSelectedDetailPartner(dataPriceList.partner);
                    resetPriceList();
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
    };

    const objectKeyToIndo = (key) => {
        let keyIndo;
        if (key == "price_card") {
            keyIndo = "Harga Kartu";
        } else if (key == "price_lanyard") {
            keyIndo = "Harga Lanyard";
        } else if (key == "price_subscription_system") {
            keyIndo = "Harga Langganan Sistem";
        } else if (key == "price_training_offline") {
            keyIndo = "Harga Training Offline";
        } else if (key == "price_training_online") {
            keyIndo = "Harga Training Online";
        } else if (key == "fee_qris") {
            keyIndo = "Harga QRIS";
        } else if (key == "fee_purchase_cazhpoin") {
            keyIndo = "Harga Pembelian Cazhpoin";
        } else if (key == "fee_bill_cazhpoin") {
            keyIndo = "Harga Tagihan Cazhpoin";
        } else if (key == "fee_topup_cazhpos") {
            keyIndo = "Harga Topup Cazhpos";
        } else if (key == "fee_withdraw_cazhpos") {
            keyIndo = "Harga Penarikan Cazhpos";
        } else if (key == "fee_bill_saldokartu") {
            keyIndo = "Harga Tagihan Saldokartu";
        }

        return keyIndo;
    };

    return (
        <>
            {partner.price_list !== null ? (
                <>
                    <table class="w-full dark:text-slate-300 dark:bg-slate-700">
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Harga Kartu
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.price_list.price_card
                                    ? JSON.parse(partner.price_list.price_card)
                                          .price
                                    : "-"}{" "}
                                (
                                {partner.price_list.price_card
                                    ? JSON.parse(partner.price_list.price_card)
                                          .type
                                    : ""}
                                )
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Harga Lanyard
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.price_list.price_lanyard
                                    ? partner.price_list.price_lanyard.toLocaleString(
                                          "id-ID"
                                      )
                                    : "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Harga Langganan Sistem
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.price_list.price_subscription_system
                                    ? partner.price_list.price_subscription_system.toLocaleString(
                                          "id-ID"
                                      )
                                    : "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Harga Training Offline
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.price_list.price_training_offline
                                    ? partner.price_list.price_training_offline.toLocaleString(
                                          "id-ID"
                                      )
                                    : "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Harga Training Online
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.price_list.price_training_online
                                    ? partner.price_list.price_training_online.toLocaleString(
                                          "id-ID"
                                      )
                                    : "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Fee Isi Kartu via CazhPOIN
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.price_list.fee_purchase_cazhpoin
                                    ? partner.price_list.fee_purchase_cazhpoin.toLocaleString(
                                          "id-ID"
                                      )
                                    : "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Fee Bayar Tagihan via CazhPOIN
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.price_list.fee_bill_cazhpoin
                                    ? partner.price_list.fee_bill_cazhpoin.toLocaleString(
                                          "id-ID"
                                      )
                                    : "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Fee Topup Kartu via CazhPos
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.price_list.fee_topup_cazhpos
                                    ? partner.price_list.fee_topup_cazhpos.toLocaleString(
                                          "id-ID"
                                      )
                                    : "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Fee Withdraw Kartu via Cazh POS
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.price_list.fee_withdraw_cazhpos
                                    ? partner.price_list.fee_withdraw_cazhpos.toLocaleString(
                                          "id-ID"
                                      )
                                    : "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Fee Bayar Tagihan via Saldo Kartu
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.price_list.fee_bill_saldokartu
                                    ? partner.price_list.fee_bill_saldokartu.toLocaleString(
                                          "id-ID"
                                      )
                                    : "-"}
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
                                                "tambah harga partner"
                                            ) &&
                                            partner.account_manager_id ==
                                                currentUser.id
                                        ) {
                                            handleEditPriceList(
                                                partner.price_list
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
                            header="Harga"
                            headerClassName="dark:glass dark:text-white"
                            className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                            contentClassName="dark:glass dark:text-white"
                            visible={modalEditPriceList}
                            onHide={() => setModalEditPriceList(false)}
                        >
                            <form
                                onSubmit={(e) =>
                                    handleSubmitFormPriceList(e, "update")
                                }
                            >
                                <div className="flex flex-col justify-around gap-4 mt-1">
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="price_card">
                                            Harga Kartu
                                        </label>

                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <InputNumber
                                                    placeholder="harga"
                                                    value={
                                                        dataPriceList.price_card
                                                            .price
                                                    }
                                                    onValueChange={(e) =>
                                                        setDataPriceList({
                                                            ...dataPriceList,
                                                            price_card: {
                                                                ...dataPriceList.price_card,
                                                                price: e.target
                                                                    .value,
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
                                                        dataPriceList.price_card
                                                            .type
                                                    }
                                                    onChange={(e) =>
                                                        setDataPriceList({
                                                            ...dataPriceList,
                                                            price_card: {
                                                                ...dataPriceList.price_card,
                                                                type: e.target
                                                                    .value,
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
                                            Harga Lanyard
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <Dropdown
                                                    value={
                                                        dataPriceList.price_lanyard
                                                    }
                                                    onChange={(e) =>
                                                        setDataPriceList({
                                                            ...dataPriceList,
                                                            price_lanyard:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={
                                                        option_price_lanyard
                                                    }
                                                    optionLabel="price"
                                                    optionValue="price"
                                                    placeholder="Pilih Harga"
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
                                            Harga Langganan Sistem
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <InputNumber
                                                    placeholder="harga"
                                                    value={
                                                        dataPriceList.price_subscription_system
                                                    }
                                                    onValueChange={(e) =>
                                                        setDataPriceList({
                                                            ...dataPriceList,
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
                                            Harga Pelatihan Offline
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <Dropdown
                                                    value={
                                                        dataPriceList.price_training_offline
                                                    }
                                                    onChange={(e) =>
                                                        setDataPriceList({
                                                            ...dataPriceList,
                                                            price_training_offline:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={
                                                        option_training_offline
                                                    }
                                                    optionLabel="price"
                                                    optionValue="price"
                                                    placeholder="Pilih Harga"
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
                                            Harga Pelatihan Online
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <div className="p-inputgroup flex-1 h-full">
                                                    <InputNumber
                                                        value={
                                                            dataPriceList.price_training_online
                                                        }
                                                        onChange={(e) =>
                                                            setDataPriceList({
                                                                ...dataPriceList,
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
                                                        ref={
                                                            infoPriceTrainingOnlineRef
                                                        }
                                                    >
                                                        <ul className="list-disc list-inside">
                                                            <li>
                                                                Harga
                                                                Implementasi
                                                                Training
                                                                dan/atau
                                                                sosialisasi
                                                                secara
                                                                Daring/Online
                                                            </li>
                                                            <li>
                                                                Harga
                                                                implementasi 3x
                                                                sesi training
                                                                secara gratis.
                                                                (Harga yang di
                                                                imput adalah
                                                                harga training
                                                                tambahan)
                                                            </li>
                                                        </ul>
                                                    </OverlayPanel>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Harga QRIS *
                                        </label>

                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <InputText
                                                    placeholder="harga"
                                                    value={
                                                        dataPriceList.fee_qris
                                                    }
                                                    onChange={(e) =>
                                                        setDataPriceList({
                                                            ...dataPriceList,
                                                            fee_qris:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="dark:bg-gray-300 w-full"
                                                    id="qris"
                                                    aria-describedby="qris-help"
                                                />
                                            </div>
                                        </div>
                                        <InputError
                                            message={
                                                errorPriceList.fee_purchase_cazhpoin
                                            }
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Harga Isi Kartu Via Cazhpoin
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <Dropdown
                                                    value={
                                                        dataPriceList.fee_purchase_cazhpoin
                                                    }
                                                    onChange={(e) =>
                                                        setDataPriceList({
                                                            ...dataPriceList,
                                                            fee_purchase_cazhpoin:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={option_fee_price}
                                                    optionLabel="price"
                                                    optionValue="price"
                                                    placeholder="Pilih Harga"
                                                    editable
                                                    valueTemplate={
                                                        selectedOptionFeeTemplate
                                                    }
                                                    itemTemplate={
                                                        optionFeeTemplate
                                                    }
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Harga Bayar Tagihan via CazhPOIN
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <Dropdown
                                                    value={
                                                        dataPriceList.fee_bill_cazhpoin
                                                    }
                                                    onChange={(e) =>
                                                        setDataPriceList({
                                                            ...dataPriceList,
                                                            fee_bill_cazhpoin:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={option_fee_price}
                                                    optionLabel="price"
                                                    optionValue="price"
                                                    placeholder="Pilih Harga"
                                                    editable
                                                    valueTemplate={
                                                        selectedOptionFeeTemplate
                                                    }
                                                    itemTemplate={
                                                        optionFeeTemplate
                                                    }
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Harga TopUp Kartu via Cazh POS
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <Dropdown
                                                    value={
                                                        dataPriceList.fee_topup_cazhpos
                                                    }
                                                    onChange={(e) =>
                                                        setDataPriceList({
                                                            ...dataPriceList,
                                                            fee_topup_cazhpos:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={option_fee_price}
                                                    optionLabel="price"
                                                    optionValue="price"
                                                    placeholder="Pilih Harga"
                                                    editable
                                                    valueTemplate={
                                                        selectedOptionFeeTemplate
                                                    }
                                                    itemTemplate={
                                                        optionFeeTemplate
                                                    }
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Harga Penarikan Saldo Kartu via Cazh
                                            POS
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <Dropdown
                                                    value={
                                                        dataPriceList.fee_withdraw_cazhpos
                                                    }
                                                    onChange={(e) =>
                                                        setDataPriceList({
                                                            ...dataPriceList,
                                                            fee_withdraw_cazhpos:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={option_fee_price}
                                                    optionLabel="price"
                                                    optionValue="price"
                                                    placeholder="Pilih Harga"
                                                    editable
                                                    valueTemplate={
                                                        selectedOptionFeeTemplate
                                                    }
                                                    itemTemplate={
                                                        optionFeeTemplate
                                                    }
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="price_card">
                                            Harga Pembayaran Tagihan via Saldo
                                            Kartu
                                        </label>
                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <Dropdown
                                                    value={
                                                        dataPriceList.fee_bill_saldokartu
                                                    }
                                                    onChange={(e) =>
                                                        setDataPriceList({
                                                            ...dataPriceList,
                                                            fee_bill_saldokartu:
                                                                e.target.value,
                                                        })
                                                    }
                                                    options={option_fee_price}
                                                    optionLabel="price"
                                                    optionValue="price"
                                                    placeholder="Pilih Harga"
                                                    editable
                                                    valueTemplate={
                                                        selectedOptionFeeTemplate
                                                    }
                                                    itemTemplate={
                                                        optionFeeTemplate
                                                    }
                                                    className="w-full md:w-14rem"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center mt-5">
                                    <Button
                                        label="Submit"
                                        disabled={processingPriceList}
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
                        Tidak ada data harga
                        <Button
                            onClick={() => {
                                if (
                                    permissions.includes(
                                        "tambah harga partner"
                                    ) &&
                                    partner.account_manager_id == currentUser.id
                                ) {
                                    resetPriceList();
                                    setDataPriceList("partner", partner);
                                    setModalPriceListIsVisible(true);
                                } else {
                                    setPermissionErrorIsVisible(
                                        (prev) => (prev = true)
                                    );
                                }
                            }}
                            className="bg-transparent p-0 cursor-pointer text-blue-700 underline "
                        >
                            , tambah daftar harga
                        </Button>
                    </p>
                </div>
            )}

            {/* Modal tambah harga */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Harga"
                    headerClassName="dark:glass dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                    contentClassName="dark:glass dark:text-white"
                    visible={modalPriceListIsVisible}
                    onHide={() => setModalPriceListIsVisible(false)}
                >
                    <form
                        onSubmit={(e) => handleSubmitFormPriceList(e, "tambah")}
                    >
                        <div className="flex flex-col justify-around gap-4 mt-1">
                            <div className="flex flex-col mt-3">
                                <label htmlFor="partner_subcription">
                                    Partner *
                                </label>
                                <Dropdown
                                    dataKey="id"
                                    optionLabel="name"
                                    value={dataPriceList.partner}
                                    onChange={(e) =>
                                        setDataPriceList(
                                            "partner",
                                            e.target.value
                                        )
                                    }
                                    options={partners}
                                    disabled
                                    placeholder="Pilih Lembaga"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                                <InputError
                                    message={errorPriceList.partner}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Kartu *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={
                                                dataPriceList.price_card.price
                                            }
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    price_card: {
                                                        ...dataPriceList.price_card,
                                                        price: Number(
                                                            e.target.value
                                                        ),
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
                                                dataPriceList.price_card.type
                                            }
                                            onChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    price_card: {
                                                        ...dataPriceList.price_card,
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
                                <InputError
                                    message={errorPriceList.price_card}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Lanyard *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={dataPriceList.price_lanyard}
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    price_lanyard: Number(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="lanyard"
                                            aria-describedby="lanyard-help"
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={errorPriceList.price_lanyard}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Langganan Sistem *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={
                                                dataPriceList.price_subscription_system
                                            }
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
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
                                <InputError
                                    message={
                                        errorPriceList.price_subscription_system
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Pelatihan Offline *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <div className="p-inputgroup flex-1 h-full">
                                            <InputNumber
                                                value={
                                                    dataPriceList.price_training_offline
                                                }
                                                onChange={(e) =>
                                                    setDataPriceList({
                                                        ...dataPriceList,
                                                        price_training_offline:
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
                                                    infoPriceTrainingOfflineRef.current.toggle(
                                                        e
                                                    )
                                                }
                                            />
                                            <OverlayPanel
                                                className="shadow-md"
                                                id="overpanel-info"
                                                ref={
                                                    infoPriceTrainingOfflineRef
                                                }
                                            >
                                                <ul className="list-disc list-inside">
                                                    <li>Jawa - 15.000.000</li>
                                                    <li>
                                                        Kalimatan - 25.000.000
                                                    </li>
                                                    <li>
                                                        Sulawesi - 27.000.000
                                                    </li>
                                                    <li>
                                                        Sumatra - 23.000.000
                                                    </li>
                                                    <li>Bali - 26.000.000</li>
                                                    <li>
                                                        Jabodetabek - 15.000.000
                                                    </li>
                                                </ul>
                                            </OverlayPanel>
                                        </div>
                                    </div>
                                </div>
                                <InputError
                                    message={
                                        errorPriceList.price_training_offline
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Pelatihan Online *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <div className="p-inputgroup flex-1 h-full">
                                            <InputNumber
                                                value={
                                                    dataPriceList.price_training_online
                                                }
                                                onChange={(e) =>
                                                    setDataPriceList({
                                                        ...dataPriceList,
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
                                                id="overpanel-info"
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
                                <InputError
                                    message={
                                        errorPriceList.price_training_online
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">Harga QRIS *</label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputText
                                            placeholder="harga"
                                            value={dataPriceList.fee_qris}
                                            onChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    fee_qris: e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="qris"
                                            aria-describedby="qris-help"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={
                                        errorPriceList.fee_purchase_cazhpoin
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Isi Kartu Via Cazhpoin *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={
                                                dataPriceList.fee_purchase_cazhpoin
                                            }
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    fee_purchase_cazhpoin:
                                                        Number(e.target.value),
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="lanyard"
                                            aria-describedby="lanyard-help"
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={
                                        errorPriceList.fee_purchase_cazhpoin
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Bayar Tagihan via CazhPOIN *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={
                                                dataPriceList.fee_bill_cazhpoin
                                            }
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    fee_bill_cazhpoin: Number(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="lanyard"
                                            aria-describedby="lanyard-help"
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={errorPriceList.fee_bill_cazhpoin}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga TopUp Kartu via Cazh POS *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={
                                                dataPriceList.fee_topup_cazhpos
                                            }
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    fee_topup_cazhpos: Number(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="lanyard"
                                            aria-describedby="lanyard-help"
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={errorPriceList.fee_topup_cazhpos}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Penarikan Saldo Kartu via Cazh POS *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={
                                                dataPriceList.fee_withdraw_cazhpos
                                            }
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    fee_withdraw_cazhpos:
                                                        Number(e.target.value),
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="lanyard"
                                            aria-describedby="lanyard-help"
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={
                                        errorPriceList.fee_withdraw_cazhpos
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Harga Pembayaran Tagihan via Saldo Kartu *
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="harga"
                                            value={
                                                dataPriceList.fee_bill_saldokartu
                                            }
                                            onValueChange={(e) =>
                                                setDataPriceList({
                                                    ...dataPriceList,
                                                    fee_bill_saldokartu: Number(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            className="dark:bg-gray-300 w-full"
                                            id="lanyard"
                                            aria-describedby="lanyard-help"
                                            locale="id-ID"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={errorPriceList.fee_bill_saldokartu}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-5">
                            <Button
                                label="Submit"
                                disabled={processingPriceList}
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>

            <Dialog
                header="Log Harga"
                visible={modalLogIsVisible}
                maximizable
                className="w-[90vw] lg:w-[50vw]"
                onHide={() => {
                    setModalLogIsVisible(false);
                }}
            >
                {modalLogIsVisible && (
                    <LogDetailPartnerComponents
                        selectedData={partner.price_list}
                        fetchUrl={"/api/prices/{partner:id}/logs"}
                        objectKeyToIndo={objectKeyToIndo}
                    />
                )}
            </Dialog>
        </>
    );
};

export default DetailPriceList;
