import { useForm } from "@inertiajs/react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";
import { useState } from "react";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const DetailPriceList = ({
    partner,
    handleSelectedDetailPartner,
    showSuccess,
    showError,
}) => {
    const [modalEditPriceList, setModalEditPriceList] = useState(false);
    const infoPriceTrainingOnlineRef = useRef(null);

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

        putPriceList("/partners/prices/" + dataPriceList.uuid, {
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
    };

    return (
        <>
            {partner.price_list !== null ? (
                <>
                    <table class="w-full">
                        <tr class="border-b">
                            <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                                Tarif Kartu
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">
                                :
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
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
                            <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                                Tarif Lanyard
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">
                                :
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                                {partner.price_list.price_lanyard
                                    ? partner.price_list.price_lanyard.toLocaleString(
                                          "id-ID"
                                      )
                                    : "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                                Tarif Langganan Sistem
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">
                                :
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                                {partner.price_list.price_subscription_system
                                    ? partner.price_list.price_subscription_system.toLocaleString(
                                          "id-ID"
                                      )
                                    : "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                                Tarif Training Offline
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">
                                :
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                                {partner.price_list.price_training_offline
                                    ? partner.price_list.price_training_offline.toLocaleString(
                                          "id-ID"
                                      )
                                    : "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                                Tarif Training Online
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">
                                :
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                                {partner.price_list.price_training_online
                                    ? partner.price_list.price_training_online.toLocaleString(
                                          "id-ID"
                                      )
                                    : "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                                Fee Isi Kartu via CazhPOIN
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">
                                :
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                                {partner.price_list.fee_purchase_cazhpoin
                                    ? partner.price_list.fee_purchase_cazhpoin.toLocaleString(
                                          "id-ID"
                                      )
                                    : "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                                Fee Bayar Tagihan via CazhPOIN
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">
                                :
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                                {partner.price_list.fee_bill_cazhpoin
                                    ? partner.price_list.fee_bill_cazhpoin.toLocaleString(
                                          "id-ID"
                                      )
                                    : "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                                Fee Topup Kartu via CazhPos
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">
                                :
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                                {partner.price_list.fee_topup_cazhpos
                                    ? partner.price_list.fee_topup_cazhpos.toLocaleString(
                                          "id-ID"
                                      )
                                    : "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                                Fee Withdraw Kartu via Cazh POS
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">
                                :
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                                {partner.price_list.fee_withdraw_cazhpos
                                    ? partner.price_list.fee_withdraw_cazhpos.toLocaleString(
                                          "id-ID"
                                      )
                                    : "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                                Fee Bayar Tagihan via Saldo Kartu
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">
                                :
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                                {partner.price_list.fee_bill_saldokartu
                                    ? partner.price_list.fee_bill_saldokartu.toLocaleString(
                                          "id-ID"
                                      )
                                    : "-"}
                            </td>
                        </tr>

                        <tr class="border-b">
                            <td class="pt-2 pb-1 text-gray-700 text-base font-bold w-1/5">
                                Aksi
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-[2%]">
                                :
                            </td>
                            <td class="pt-2 pb-1 text-gray-700 text-base w-7/12">
                                <Button
                                    label="edit"
                                    className="p-0 underline bg-transparent text-blue-700 text-left"
                                    onClick={() =>
                                        handleEditPriceList(partner.price_list)
                                    }
                                />
                            </td>
                        </tr>
                    </table>

                    {/* Modal edit langganan */}
                    <div className="card flex justify-content-center">
                        <Dialog
                            header="Tarif"
                            headerClassName="dark:glass dark:text-white"
                            className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                            contentClassName="dark:glass dark:text-white"
                            visible={modalEditPriceList}
                            onHide={() => setModalEditPriceList(false)}
                        >
                            <form
                                onSubmit={(e) => handleSubmitFormPriceList(e)}
                            >
                                <div className="flex flex-col justify-around gap-4 mt-1">
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="price_card">
                                            Tarif Kartu
                                        </label>

                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className="w-full flex gap-2 h-full">
                                                <InputNumber
                                                    placeholder="tarif"
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
                                            Tarif Lanyard
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
                                            Tarif Pelatihan Offline
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
                                            Tarif Isi Kartu Via Cazhpoin
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
                                                    placeholder="Pilih Tarif"
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
                                            Tarif Bayar Tagihan via CazhPOIN
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
                                                    placeholder="Pilih Tarif"
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
                                            Tarif TopUp Kartu via Cazh POS
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
                                                    placeholder="Pilih Tarif"
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
                                            Tarif Penarikan Saldo Kartu via Cazh
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
                                                    placeholder="Pilih Tarif"
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
                                            Tarif Pembayaran Tagihan via Saldo
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
                                                    placeholder="Pilih Tarif"
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
                    <p class="text-center">Tidak ada data tarif</p>
                </div>
            )}
        </>
    );
};

export default DetailPriceList;
