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

const Subscription = ({
    partners,
    showSuccess,
    showError,
    handleSelectedDetailPartner,
}) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [modalSubscriptionIsVisible, setModalSubscriptionIsVisible] =
        useState(false);
    const [modalEditSubscriptionIsVisible, setModalEditSubscriptionIsVisible] =
        useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const infoPriceTrainingOnlineRef = useRef(null);

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
        bill: null,
        nominal: 0,
        ppn: 0,
        total_ppn: 0,
        total_bill: 0,
    });

    const getSubscriptions = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/partners/subscriptions");
        let data = await response.json();

        setSubscriptions((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            await getSubscriptions();
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
        <div className="flex flex-col sm:flex-row justify-between items-center">
            <div>
                <Button
                    label="Tambah"
                    className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                    icon={addButtonIcon}
                    onClick={() => {
                        setModalSubscriptionIsVisible((prev) => (prev = true));
                        resetSubscription();
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
        </div>
    );

    const handleSubmitFormSubscription = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            postSubscription("/partners/subscriptions", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalSubscriptionIsVisible((prev) => (prev = false));
                    getSubscriptions();
                    resetSubscription();
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            putSubscription(
                "/partners/subscriptions/" + dataSubscription.uuid,
                {
                    onSuccess: () => {
                        showSuccess("Update");
                        setModalEditSubscriptionIsVisible(
                            (prev) => (prev = false)
                        );
                        getSubscriptions();
                        resetSubscription();
                    },
                    onError: () => {
                        showError("Update");
                    },
                }
            );
        }
    };

    const handleEditSubscription = (subscription) => {
        setDataSubscription((data) => ({
            ...data,
            uuid: subscription.uuid,
            partner: subscription.partner,
            bill: subscription.bill,
            nominal: subscription.nominal,
            ppn: subscription.ppn,
            total_ppn: subscription.total_ppn,
            total_bill: subscription.total_bill,
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
                destroySubscription(
                    "partners/subscriptions/" + subscription.uuid,
                    {
                        onSuccess: () => {
                            getSubscriptions();
                            showSuccess("Hapus");
                        },
                        onError: () => {
                            showError("Hapus");
                        },
                    }
                );
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
                                    value={dataSubscription.partner}
                                    onChange={(e) =>
                                        setDataSubscription(
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
                                        setDataSubscription(
                                            "bill",
                                            e.target.value
                                        )
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
                                            (e.value * dataSubscription.ppn) /
                                            100;
                                        console.log(total_bill);
                                        setDataSubscription({
                                            ...dataSubscription,
                                            nominal: e.value,
                                            total_ppn: total_bill,
                                            total_bill:
                                                dataSubscription.ppn === 0
                                                    ? e.value
                                                    : e.value + total_bill,
                                        });
                                    }}
                                    locale="id-ID"
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
                        value={subscriptions}
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
                            header="Nominal"
                            body={(rowData) => {
                                return (
                                    "Rp " +
                                    rowData.nominal?.toLocaleString("id-ID")
                                );
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>

                        <Column
                            header="Pajak"
                            body={(rowData) => {
                                return rowData.ppn + "%" ?? "tidak ada";
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>

                        <Column
                            header="Jumlah Pajak"
                            body={(rowData) => {
                                return (
                                    "Rp " +
                                        rowData.total_ppn.toLocaleString(
                                            "id-ID"
                                        ) ?? "tidak ada"
                                );
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>

                        <Column
                            header="Total Tagihan"
                            body={(rowData) => {
                                return (
                                    "Rp " +
                                    rowData.total_bill.toLocaleString("id-ID")
                                );
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>

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

export default Subscription;
