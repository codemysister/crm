import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import DashboardLayout from "@/Layouts/DashboardLayout";
import HeaderModule from "@/Components/HeaderModule";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { useForm } from "@inertiajs/react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Steps } from "primereact/steps";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Badge } from "primereact/badge";
import { TabMenu } from "primereact/tabmenu";
import { TabPanel, TabView } from "primereact/tabview";
import { Skeleton } from "primereact/skeleton";
import { FilterMatchMode } from "primereact/api";
import { SelectButton } from "primereact/selectbutton";
import { Menu } from "primereact/menu";
import { Fieldset } from "primereact/fieldset";
import { Tooltip } from "primereact/tooltip";
import { Card } from "primereact/card";
import { OverlayPanel } from "primereact/overlaypanel";
import { MultiSelect } from "primereact/multiselect";

const PriceList = ({
    partners,
    showSuccess,
    showError,
    handleSelectedDetailPartner,
}) => {
    const [priceLists, setPriceLists] = useState([]);
    const [modalSubscriptionIsVisible, setModalSubscriptionIsVisible] =
        useState(false);
    const [modalEditSubscriptionIsVisible, setModalEditSubscriptionIsVisible] =
        useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const infoPriceTrainingOfflineRef = useRef(null);
    const infoPriceTrainingOnlineRef = useRef(null);
    const [visibleColumnsSubscription, setVisibleColumnsSubscription] =
        useState([
            { field: "price_lanyard", header: "Tarif Lanyard" },
            {
                field: "price_subscription_system",
                header: "Tarif Langganan Sistem",
            },
            {
                field: "price_training_offline",
                header: "Tarif Training Offline",
            },
            { field: "price_training_online", header: "Tarif Training Online" },
            {
                field: "fee_purchase_cazhpoin",
                header: "Fee Isi Kartu via CazhPOIN",
            },
            {
                field: "fee_bill_cazhpoin",
                header: "Fee Bayar Tagihan via CazhPOIN",
            },
            {
                field: "fee_topup_cazhpos",
                header: "Fee Topup Kartu via CazhPos",
            },
            {
                field: "fee_withdraw_cazhpos",
                header: "Fee Withdraw Kartu via Cazh POS",
            },
            {
                field: "fee_bill_saldokartu",
                header: "Fee Bayar Tagihan via Saldo Kartu",
            },
        ]);
    const columnsSubscription = [
        { field: "price_lanyard", header: "Tarif Lanyard" },
        {
            field: "price_subscription_system",
            header: "Tarif Langganan Sistem",
        },
        { field: "price_training_offline", header: "Tarif Training Offline" },
        { field: "price_training_online", header: "Tarif Training Online" },
        {
            field: "fee_purchase_cazhpoin",
            header: "Fee Isi Kartu via CazhPOIN",
        },
        {
            field: "fee_bill_cazhpoin",
            header: "Fee Bayar Tagihan via CazhPOIN",
        },
        { field: "fee_topup_cazhpos", header: "Fee Topup Kartu via CazhPos" },
        {
            field: "fee_withdraw_cazhpos",
            header: "Fee Withdraw Kartu via Cazh POS",
        },
        {
            field: "fee_bill_saldokartu",
            header: "Fee Bayar Tagihan via Saldo Kartu",
        },
    ];
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
        price_subscription_system: null,
        fee_purchase_cazhpoin: null,
        fee_bill_cazhpoin: null,
        fee_topup_cazhpos: null,
        fee_withdraw_cazhpos: null,
        fee_bill_saldokartu: null,
    });

    const getPriceLists = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/partners/prices");
        let data = await response.json();

        setPriceLists((prev) => (prev = data));

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            await getPriceLists();
        };

        fetchData();
    }, []);

    const option_period_subscription = [
        { name: "kartu/bulan" },
        { name: "kartu/tahun" },
        { name: "lembaga/bulan" },
        { name: "lembaga/tahun" },
    ];

    let cardCategories = [{ name: "digital" }, { name: "cetak" }];

    const option_fee_price = [
        { name: "1", price: 1000 },
        { name: "2", price: 2000 },
        { name: "3", price: 2500 },
    ];
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

    const option_fee_price_price = [
        { name: "1", price: 1000 },
        { name: "2", price: 2000 },
        { name: "3", price: 2500 },
    ];

    const optionTrainingTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>
                    {option.name} - {option.price}
                </div>
            </div>
        );
    };

    const actionBodyTemplateSubscriptipn = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => handleEditSubscription(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => {
                        handleDeleteSubscription(rowData);
                    }}
                />
            </React.Fragment>
        );
    };

    const headerSubscription = (
        <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
                <Button
                    label="Tambah"
                    className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                    icon={addButtonIcon}
                    onClick={() => {
                        setModalSubscriptionIsVisible((prev) => (prev = true));
                        resetPriceList();
                    }}
                    aria-controls="popup_menu_right"
                    aria-haspopup
                />
            </div>
            <div className="flex w-full sm:w-[30%] flex-row justify-left gap-2 align-items-center items-end">
                <div className="w-full">
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
            <MultiSelect
                value={visibleColumnsSubscription}
                options={columnsSubscription}
                optionLabel="header"
                onChange={onColumnToggle}
                className="w-full sm:w-[30%] p-0"
                display="chip"
            />
        </div>
    );

    const handleSubmitFormSubscription = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            postPriceList("/partners/prices", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalSubscriptionIsVisible((prev) => (prev = false));
                    getPriceLists();
                    resetPriceList();
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            putPriceList("/partners/prices/" + dataPriceList.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditSubscriptionIsVisible((prev) => (prev = false));
                    getPriceLists();
                    resetPriceList();
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
    };

    const handleEditSubscription = (priceList) => {
        setDataPriceList((data) => ({
            ...data,
            uuid: priceList.uuid,
            partner: priceList.partner,
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

        setModalEditSubscriptionIsVisible(true);
    };

    const handleDeleteSubscription = (subscription) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroyPriceList("partners/prices/" + subscription.uuid, {
                    onSuccess: () => {
                        getPriceLists();
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
                                    value={dataPriceList.partner}
                                    onChange={(e) =>
                                        setDataPriceList(
                                            "partner",
                                            e.target.value
                                        )
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
                                <label htmlFor="price_card">Tarif Kartu</label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="tarif"
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
                                        <InputNumber
                                            placeholder="tarif"
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
                                        <InputNumber
                                            placeholder="tarif"
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
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Tarif Bayar Tagihan via CazhPOIN
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="tarif"
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
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Tarif TopUp Kartu via Cazh POS
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="tarif"
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
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Tarif Penarikan Saldo Kartu via Cazh POS
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="tarif"
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
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Tarif Pembayaran Tagihan via Saldo Kartu
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="tarif"
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

            {/* Modal edit langganan */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Tarif"
                    headerClassName="dark:glass dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                    contentClassName="dark:glass dark:text-white"
                    visible={modalEditSubscriptionIsVisible}
                    onHide={() => setModalEditSubscriptionIsVisible(false)}
                >
                    <form
                        onSubmit={(e) =>
                            handleSubmitFormSubscription(e, "update")
                        }
                    >
                        <div className="flex flex-col justify-around gap-4 mt-1">
                            <div className="flex flex-col mt-3">
                                <label htmlFor="partner_subcription">
                                    Partner
                                </label>
                                <Dropdown
                                    dataKey="name"
                                    optionLabel="name"
                                    value={dataPriceList.partner}
                                    onChange={(e) =>
                                        setDataPriceList(
                                            "partner",
                                            e.target.value
                                        )
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
                                <label htmlFor="price_card">Tarif Kartu</label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="tarif"
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
                                        <InputNumber
                                            placeholder="tarif"
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
                                        <InputNumber
                                            placeholder="tarif"
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
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Tarif Bayar Tagihan via CazhPOIN
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="tarif"
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
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Tarif TopUp Kartu via Cazh POS
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="tarif"
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
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Tarif Penarikan Saldo Kartu via Cazh POS
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="tarif"
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
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="price_card">
                                    Tarif Pembayaran Tagihan via Saldo Kartu
                                </label>

                                <div className="flex justify-between gap-1 w-full items-center">
                                    <div className="w-full flex gap-2 h-full">
                                        <InputNumber
                                            placeholder="tarif"
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
                        header={headerSubscription}
                        filters={filters}
                        globalFilterFields={["partner.name", "period"]}
                        value={priceLists}
                        dataKey="id"
                    >
                        <Column
                            header="No"
                            body={(_, { rowIndex }) => rowIndex + 1}
                            className="dark:border-none pl-6"
                            headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
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
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>

                        <Column
                            header="Tarif Kartu"
                            body={(rowData) =>
                                JSON.parse(
                                    rowData.price_card
                                ).price?.toLocaleString("id-ID")
                                    ? JSON.parse(
                                          rowData.price_card
                                      ).price.toLocaleString("id-ID") +
                                      ` (${
                                          JSON.parse(rowData.price_card).type
                                      })`
                                    : "-"
                            }
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>

                        {visibleColumnsSubscription.map((col) => (
                            <Column
                                key={col.field}
                                style={{
                                    width: "max-content",
                                    whiteSpace: "nowrap",
                                }}
                                headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                                field={col.field}
                                header={col.header}
                                body={(rowData) => {
                                    return rowData[col.field]?.toLocaleString(
                                        "id-ID"
                                    )
                                        ? rowData[col.field].toLocaleString(
                                              "id-ID"
                                          )
                                        : "-";
                                }}
                            />
                        ))}

                        <Column
                            header="Action"
                            body={actionBodyTemplateSubscriptipn}
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                        ></Column>
                    </DataTable>
                </div>
            </div>
        </>
    );
};

export default PriceList;
