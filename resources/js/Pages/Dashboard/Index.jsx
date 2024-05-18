import HeaderModule from "@/Components/HeaderModule";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Link } from "@inertiajs/react";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { useEffect } from "react";
import { useState } from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge } from "primereact/badge";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import HeaderDatatable from "@/Components/HeaderDatatable";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    ChartDataLabels,
    CategoryScale,
    LinearScale,
    BarElement
);

const Index = ({ statisticGeneralProp, usersProp }) => {
    const [statisticUser, setStatisticUser] = useState({
        data: [0, 0, 0, 0, 0],
    });
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [selectedAM, setSelectedAM] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([getPartnerByUser()]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (selectedAM !== null && selectedAM !== undefined) {
            fetchData();
        } else {
            getStatGeneral();
        }
    }, [selectedAM]);

    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const getStatGeneral = async () => {
        let response = await fetch("/api/dashboard");
        statisticGeneralProp = response;
        setStatisticUser((prev) => (prev = { data: [0, 0, 0, 0, 0] }));
    };

    const getPartnerByUser = async () => {
        let response = await fetch("/api/dashboard/" + selectedAM?.id);
        let data = await response.json();
        setStatisticUser((prev) => ({
            ...prev,
            data: [
                data[0].totalProses,
                data[0].totalAktif,
                data[0].totalNonaktif,
                data[0].totalCancel,
                data[0].totalCLBK,
            ],
            totalPartner: data[0].totalPartner,
            totalAktif: data[0].totalAktif,
            totalCLBK: data[0].totalCLBK,
            totalCancel: data[0].totalCancel,
            totalProses: data[0].totalProses,
            totalNonaktif: data[0].totalNonaktif,
            partnersByProvince: data[0].partnersByProvince,
            partners: data[0].partners,
        }));
    };

    const selectedOptionTemplate = (option, props) => {
        if (option) {
            return (
                <div
                    className="flex align-items-center"
                    style={{
                        color:
                            localStorage.theme == "dark"
                                ? "rgb(156 163 175 / 1)"
                                : "black",
                    }}
                >
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

    const colors = [
        "rgba(255, 99, 132, 0.7)",
        "rgba(54, 162, 235, 0.7)",
        "rgba(255, 206, 86, 0.7)",
        "rgba(75, 192, 192, 0.7)",
        "rgba(153, 102, 255, 0.7)",
    ];

    const backgroundColors = colors.slice(
        0,
        statisticUser.partnersByProvince?.length > 0
            ? statisticUser.partnersByProvince.length
            : statisticGeneralProp.partnersByProvince.length
    );

    const handleSelectedDetailPartner = (partner) => {
        const newUrl = `/partners?uuid=${partner.uuid}`;
        window.location = newUrl;
    };

    const header = () => {
        return (
            <HeaderDatatable
                globalFilterValue={globalFilterValue}
                onGlobalFilterChange={onGlobalFilterChange}
            ></HeaderDatatable>
        );
    };

    const options = {
        plugins: {
            legend: {
                display: true,
                position: "bottom",
            },
            width: "50%",
            height: "50%",
            datalabels: {
                color: "white",
                font: {
                    size: "12px",
                },
                formatter: (value) => {
                    return value.toFixed(1) + "%";
                },
            },
        },
    };

    return (
        <DashboardLayout>
            <HeaderModule title="Dashboard">
                <Dropdown
                    optionLabel="name"
                    dataKey="id"
                    value={selectedAM}
                    onChange={(e) => setSelectedAM(e.target.value)}
                    options={usersProp}
                    placeholder="Pilih User"
                    filter
                    showClear
                    valueTemplate={selectedOptionTemplate}
                    itemTemplate={optionTemplate}
                    className="w-[30%] flex justify-center dark:bg-slate-900 dark:text-gray-400 dark:border-b-slate-600 focus: rounded-none border-t-0 border-r-0 border-l-0 border-b-[1px] border-b-slate-200"
                />
            </HeaderModule>
            <div className="flex mx-auto flex-col justify-center gap-5 mt-5">
                <div className="grid gap-6 mb-8 grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-md dark:bg-slate-900">
                        <div className="p-3 mr-4 text-pink-500 bg-pink-100 rounded-full dark:text-pink-100 dark:bg-pink-500">
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Partner
                            </p>
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                {selectedAM
                                    ? statisticUser.totalPartner
                                    : statisticGeneralProp.totalPartner}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center p-4 bg-white rounded-lg shadow-md dark:bg-slate-900">
                        <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                // viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Proses
                            </p>
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                {selectedAM
                                    ? statisticUser.totalProses
                                    : statisticGeneralProp.totalProses}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center p-4 bg-white rounded-lg shadow-md dark:bg-slate-900">
                        <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                // viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Aktif
                            </p>
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                {selectedAM
                                    ? statisticUser.totalAktif
                                    : statisticGeneralProp.totalAktif}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center p-4 bg-white rounded-lg shadow-md dark:bg-slate-900">
                        <div className="p-3 mr-4 text-gray-500 bg-gray-100 rounded-full dark:text-gray-100 dark:bg-gray-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                // viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Non Aktif
                            </p>
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                {selectedAM
                                    ? statisticUser.totalNonaktif
                                    : statisticGeneralProp.totalNonaktif}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center p-4 bg-white rounded-lg shadow-md dark:bg-slate-900">
                        <div className="p-3 mr-4 text-purple-500 bg-purple-100 rounded-full dark:text-purple-100 dark:bg-purple-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Cancel
                            </p>
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                {selectedAM
                                    ? statisticUser.totalCancel
                                    : statisticGeneralProp.totalCancel}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center p-4 bg-white rounded-lg shadow-md dark:bg-slate-900">
                        <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                                />
                            </svg>
                        </div>

                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total CLBK
                            </p>
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                {selectedAM
                                    ? statisticUser.totalCLBK
                                    : statisticGeneralProp.totalCLBK}
                            </p>
                        </div>
                    </div>
                </div>
                {console.log(statisticUser)}

                <div className="card flex flex-col -mt-7 w-full md:max-h-[320px] md:flex-row mx-auto justify-between gap-7">
                    <div className="flex flex-col text-center md:w-[50%] justify-center border p-8 bg-white dark:bg-slate-900 dark:border-none dark:text-gray-400  shadow-md rounded-lg">
                        <h1 className="mb-2 font-semibold">
                            Presentase Status Partner By User
                        </h1>
                        <Doughnut
                            className="mx-auto"
                            data={{
                                labels: [
                                    "Proses",
                                    "Aktif",
                                    "Non Aktif",
                                    "Cancel",
                                    "CLBK",
                                ],
                                datasets: [
                                    {
                                        label: "Presentase",
                                        data: [
                                            (statisticUser.totalProses /
                                                statisticUser.totalPartner) *
                                                100,
                                            (statisticUser.totalAktif /
                                                statisticUser.totalPartner) *
                                                100,
                                            (statisticUser.totalNonaktif /
                                                statisticUser.totalPartner) *
                                                100,
                                            (statisticUser.totalCLBK /
                                                statisticUser.totalPartner) *
                                                100,
                                            (statisticUser.totalCancel /
                                                statisticUser.totalPartner) *
                                                100,
                                        ],
                                        backgroundColor: [
                                            "orange",
                                            "green",
                                            "gray",
                                            "purple",
                                            "blue",
                                        ],
                                    },
                                ],
                            }}
                            options={options}
                        />
                    </div>
                    <div className=" flex flex-col text-center md:w-[50%] justify-center border p-8 bg-white dark:bg-slate-900 dark:border-none dark:text-gray-400 shadow-md rounded-lg">
                        <h1 className="mb-2 font-semibold">
                            Presentase Status Partner
                        </h1>
                        <Doughnut
                            className="mx-auto"
                            data={{
                                labels: [
                                    "Proses",
                                    "Aktif",
                                    "Non Aktif",
                                    "Cancel",
                                    "CLBK",
                                ],
                                datasets: [
                                    {
                                        label: "Persentase",
                                        data: [
                                            (statisticGeneralProp.totalProses /
                                                statisticGeneralProp.totalPartner) *
                                                100,
                                            (statisticGeneralProp.totalAktif /
                                                statisticGeneralProp.totalPartner) *
                                                100,
                                            (statisticGeneralProp.totalNonaktif /
                                                statisticGeneralProp.totalPartner) *
                                                100,
                                            (statisticGeneralProp.totalCLBK /
                                                statisticGeneralProp.totalPartner) *
                                                100,
                                            (statisticGeneralProp.totalCancel /
                                                statisticGeneralProp.totalPartner) *
                                                100,
                                        ],
                                        backgroundColor: [
                                            "orange",
                                            "green",
                                            "gray",
                                            "purple",
                                            "blue",
                                        ],
                                    },
                                ],
                            }}
                            options={options}
                        />
                    </div>
                </div>
                <div className="card flex flex-col w-full h-[400px] md:max-h-[400px]  md:flex-row mx-auto justify-between gap-5">
                    <div className="flex w-full h-full  text-center justify-center p-5 border dark:border-none bg-white dark:bg-slate-900 shadow-md rounded-lg">
                        <Bar
                            className="w-full bg-white dark:text-white object-cover dark:bg-slate-900 h-full rounded-lg"
                            data={{
                                labels:
                                    statisticUser.partnersByProvince?.length > 0
                                        ? statisticUser.partnersByProvince.map(
                                              (province) =>
                                                  province.province_name
                                          )
                                        : statisticGeneralProp.partnersByProvince.map(
                                              (province) =>
                                                  province.province_name
                                          ),
                                datasets: [
                                    {
                                        label:
                                            statisticUser.partnersByProvince
                                                ?.length > 0
                                                ? "Jumlah Partner Tiap Provinsi By User"
                                                : "Jumlah Partner Tiap Provinsi",
                                        data:
                                            statisticUser.partnersByProvince
                                                ?.length > 0
                                                ? statisticUser.partnersByProvince.map(
                                                      (province) =>
                                                          province.total
                                                  )
                                                : statisticGeneralProp.partnersByProvince.map(
                                                      (province) =>
                                                          province.total
                                                  ),
                                        backgroundColor: backgroundColors,
                                    },
                                ],
                            }}
                            options={{
                                width: "100%",
                                height: "100%",
                                maintainAspectRatio: false,
                                responsive: true,

                                scales: {
                                    y: {
                                        ticks: {
                                            beginAtZero: true,
                                        },
                                    },
                                    x: {
                                        barPercentage: 0.2,
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                <div className="card p-fluid w-full h-full flex justify-center rounded-lg ">
                    <DataTable
                        loading={isLoadingData}
                        className="w-full h-auto rounded-lg dark:bg-slate-900 dark:text-gray-400 border-none text-center shadow-md"
                        pt={{
                            bodyRow:
                                "dark:bg-transparent bg-transparent dark:text-gray-300",
                            table: "dark:bg-transparent bg-white dark:text-gray-300",
                            header: "",
                            emptyMessage:
                                "dark:bg-slate-900 dark:text-gray-400",
                        }}
                        paginator
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        currentPageReportTemplate="{first} - {last} dari {totalRecords}"
                        rows={10}
                        filters={filters}
                        globalFilterFields={[
                            "name",
                            "sales.name",
                            "status",

                            "account_manager.name",
                        ]}
                        emptyMessage="Partner tidak ditemukan."
                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                        header={header}
                        value={
                            statisticUser.partners ??
                            statisticGeneralProp.partners
                        }
                        dataKey="id"
                    >
                        <Column
                            header="No"
                            body={(_, { rowIndex }) => rowIndex + 1}
                            className="dark:border-none pl-6"
                            headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                            style={{ width: "3%" }}
                        />
                        <Column
                            header="Nama"
                            body={(rowData) => (
                                <button
                                    onClick={() =>
                                        handleSelectedDetailPartner(rowData)
                                    }
                                    className="hover:text-blue-700 text-left"
                                >
                                    {rowData.name}
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
                            header="Status"
                            body={(rowData) => {
                                return (
                                    <Badge
                                        value={rowData.status.name}
                                        className="text-white"
                                        style={{
                                            backgroundColor:
                                                "#" + rowData.status.color,
                                        }}
                                    ></Badge>
                                );
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            field="uuid"
                            hidden
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Nama"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            field="phone_number"
                            body={(rowData) => {
                                return rowData.phone_number
                                    ? rowData.phone_number
                                    : "-";
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="No. Telepon"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            header="Sales"
                            body={(rowData) => {
                                return rowData.sales ? rowData.sales.name : "-";
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
                            header="Account Manager"
                            body={(rowData) =>
                                rowData.account_manager !== null
                                    ? rowData.account_manager.name
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
                        <Column
                            field="province"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Provinsi"
                            body={(rowData) => {
                                return rowData.province
                                    ? JSON.parse(rowData.province).name
                                    : "belum diiisi";
                            }}
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            field="regency"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Kabupaten"
                            body={(rowData) => {
                                return rowData.regency
                                    ? JSON.parse(rowData.regency).name
                                    : "-";
                            }}
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            field="subdistrict"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Kecamatan"
                            body={(rowData) => {
                                return rowData.subdistrict
                                    ? JSON.parse(rowData.subdistrict).name
                                    : "-";
                            }}
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            header="Tanggal onboarding"
                            body={(rowData) => {
                                return rowData.onboarding_date
                                    ? new Date(
                                          rowData.onboarding_date
                                      ).toLocaleDateString("id")
                                    : "-";
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            header="Tanggal live"
                            body={(rowData) =>
                                rowData.live_date !== null
                                    ? new Date(
                                          rowData.live_date
                                      ).toLocaleDateString("id")
                                    : "-"
                            }
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            header="Tanggal Monitoring (3 bulan setelah live)"
                            body={(rowData) =>
                                rowData.monitoring_date_after_3_month_live !==
                                null
                                    ? new Date(
                                          rowData.monitoring_date_after_3_month_live
                                      ).toLocaleDateString("id")
                                    : "-"
                            }
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            header="Umur Onboarding"
                            body={(rowData) =>
                                rowData.onboarding_age !== null
                                    ? rowData.onboarding_age + " hari"
                                    : "-"
                            }
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            header="Umur Live"
                            body={(rowData) =>
                                rowData.live_age !== null
                                    ? rowData.live_age + " hari"
                                    : "-"
                            }
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                    </DataTable>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Index;
