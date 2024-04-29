import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { useForm } from "@inertiajs/react";
import {
    ConfirmDialog,
    ConfirmDialog as ConfirmDialog2,
    confirmDialog,
} from "primereact/confirmdialog";
import { Badge } from "primereact/badge";
import { TabPanel, TabView } from "primereact/tabview";
import { FilterMatchMode } from "primereact/api";
import { OverlayPanel } from "primereact/overlaypanel";
import DetailPartner from "./DetailPartner/DetailPartner.jsx";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
import InputError from "@/Components/InputError.jsx";
import SkeletonDatatable from "@/Components/SkeletonDatatable.jsx";
import HeaderDatatable from "@/Components/HeaderDatatable.jsx";
import HeaderModule from "@/Components/HeaderModule.jsx";
import { Sidebar } from "primereact/sidebar";
import axios from "axios";
import getViewportSize from "../../Utils/getViewportSize.js";
import { Calendar } from "primereact/calendar";
import { InputMask } from "primereact/inputmask";
import { DatatablePartner } from "./Component/DatatablePartner.jsx";
import { memo } from "react";
import { useCallback } from "react";
import { useMemo } from "react";
import { getProvince } from "@/Services/getProvince.js";
import { getRegencys } from "@/Services/getRegency.js";
import { getSubdistricts } from "@/Services/getSubdistrict.js";
registerPlugin(FilePondPluginFileValidateSize);

export default function Index({
    auth,
    partner,
    usersProp,
    statusProp,
    queryParamsProp,
}) {
    const [partners, setPartners] = useState(null);
    const [users, setUsers] = useState(usersProp);
    const [sales, setSales] = useState(null);
    const [status, setStatus] = useState(statusProp);
    const [account_managers, setAccountManagers] = useState(null);
    const [referrals, setReferrals] = useState(null);
    const [sidebarFilter, setSidebarFilter] = useState(false);
    const [detailPartner, setDetailPartner] = useState(partner);
    const viewportSize = getViewportSize();
    const isMobile = viewportSize.width < 992;
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [confirmIsVisible, setConfirmIsVisible] = useState(false);
    const btnFilterRef = useRef(null);
    const action = useRef(null);
    const menuRight = useRef(null);
    const dt = useRef(null);
    const [provinces, setProvinces] = useState([]);
    const [regencys, setRegencys] = useState([]);
    const [subdistricts, setSubdistricts] = useState([]);
    const [ProvinceName, setProvinceName] = useState(null);
    const [RegencyName, setRegencyName] = useState(null);
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [modalImportPartnerIsVisible, setModalImportPartnerIsVisible] =
        useState(false);
    const [modalPartnersIsVisible, setModalPartnersIsVisible] = useState(false);
    const [modalStatusIsVisible, setModalStatusIsVisible] = useState(false);
    const [modalEditPartnersIsVisible, setModalEditPartnersIsVisible] =
        useState(false);
    const toast = useRef(null);
    const modalPartner = useRef(null);
    const { roles, permissions } = auth.user;
    const [preRenderLoad, setPreRenderLoad] = useState(true);

    // const [totalRecords, setTotalRecords] = useState(0);
    // const [lazyState, setlazyState] = useState({
    //     first: 0,
    //     rows: 200,
    //     page: 1,
    //     sortField: null,
    //     sortOrder: null,
    //     filters: {
    //         global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    //         name: { value: "", matchMode: "contains" },
    //     },
    // });

    // let networkTimeout = null;

    // useEffect(() => {
    //     loadLazyData();
    // }, [lazyState]);

    // const loadLazyData = () => {
    //     setIsLoadingData(true);

    //     if (networkTimeout) {
    //         clearTimeout(networkTimeout);
    //     }
    //     networkTimeout = setTimeout(() => {
    //         axios
    //             .get(
    //                 `/api/partners?first=${lazyState.first}&rows=${lazyState.rows}`
    //             )
    //             .then((response) => {
    //                 const { totalRecords, partners } = response.data;
    //                 setTotalRecords(totalRecords);
    //                 setPartners(partners);
    //                 setIsLoadingData(false);
    //             })
    //             .catch((error) => {
    //                 console.error("Error fetching partners:", error);
    //                 setIsLoadingData(false);
    //             });
    //     }, Math.random() * 1000 + 250);
    // };

    // const onPage = (event) => {
    //     setlazyState(event);
    // };

    // const onSort = (event) => {
    //     setlazyState(event);
    // };

    // const onFilter = (event) => {
    //     event["first"] = 0;
    //     setlazyState(event);
    // };

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

    useEffect(() => {
        if (partner) {
            setActiveIndexTab(1);
        }

        if (queryParamsProp.onboarding) {
            fetchData(getLeads);
            setModalPartnersIsVisible(true);
        }

        let sales = usersProp.filter((user) => {
            return user.roles[0].name == "sales";
        });

        let account_manager = usersProp.filter((user) => {
            return user.roles[0].name == "account manager";
        });

        let referrals = usersProp.filter((user) => {
            return user.roles[0].name == "referral";
        });

        setSales(sales);
        setAccountManagers(account_manager);
        setReferrals(referrals);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await getPartners();
            let response = await getProvince();
            setProvinces((prev) => (prev = response));
            setPreRenderLoad((prev) => (prev = false));
        };

        fetchData();
    }, [activeIndexTab]);

    useEffect(() => {
        const fetch = async () => {
            if (ProvinceName) {
                let response = await getRegencys(ProvinceName);
                setRegencys((prev) => (prev = response));
            }
            if (RegencyName && ProvinceName) {
                let response = await getSubdistricts(RegencyName);
                setSubdistricts((prev) => (prev = response));
            }
        };

        fetch();
    }, [ProvinceName, RegencyName]);

    const fetchData = async (fnc) => {
        try {
            await Promise.all([fnc()]);
            setIsLoadingData(false);
            setPreRenderLoad((prev) => (prev = false));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const getLeads = async () => {
        setIsLoadingData(true);

        let response = await fetch("/leads/" + queryParamsProp.onboarding);
        let data = await response.json();

        setData((prevData) => ({
            ...prevData,
            partner: {
                ...prevData.partner,
                uuid: data.uuid,
                pic: data.pic,
                name: data.name,
                npwp: data.npwp,
                total_members: data.total_members,
                address: data.address,
                onboarding: true,
                uuid_lead: data.uuid,
            },
        }));

        setIsLoadingData(false);
    };

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        reset,
        processing,
        errors,
        clearErrors,
    } = useForm({
        partner: {
            uuid: "",
            sales: {},
            account_manager: {
                name: null,
                id: null,
            },
            referral: {},
            name: "",
            logo: null,
            npwp: null,
            total_members: null,
            pic: null,
            password: null,
            phone_number: null,
            province: null,
            regency: null,
            subdistrict: null,
            address: null,
            onboarding_date: null,
            onboarding_age: null,
            live_date: null,
            live_age: null,
            monitoring_date_after_3_month_live: null,
            period: null,
            payment_metode: null,
            status: "",
            note_status: null,
            excell: null,
            onboarding: false,
            uuid_lead: null,
        },
    });

    const {
        data: dataFilter,
        setData: setDataFilter,
        get: getFilter,
        post: postFilter,
        reset: resetFilter,
        processing: processingFilter,
        errors: errorsFilter,
        clearErrors: clearErrorsFilter,
    } = useForm({
        user: null,
        sales: null,
        referral: null,
        account_manager: null,
        status: null,
        province: null,
        onboarding_date: { start: null, end: null },
        live_date: { start: null, end: null },
    });

    const calculateWorkdays = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const weekdays = [1, 2, 3, 4, 5];

        let count = 0;
        let current = start;

        while (current <= end) {
            if (weekdays.includes(current.getDay())) {
                count++;
            }
            current.setDate(current.getDate() + 1);
        }

        return count;
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

    const getPartners = async () => {
        setIsLoadingData(true);

        let response = await fetch(`/api/partners`);
        let data = await response.json();
        setPartners(data.partners);
        setSales(data.sales);
        setAccountManagers(data.account_managers);
        // setTotalRecords(data.totalRecords);
        setIsLoadingData(false);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <div className="flex justify-center">
                    <i
                        className="pi pi-ellipsis-h pointer cursor-pointer"
                        onClick={(event) => {
                            setSelectedPartner(rowData);
                            action.current.toggle(event);
                        }}
                    ></i>
                </div>
            </React.Fragment>
        );
    };

    const option_period_subscription = [
        { name: "kartu/bulan" },
        { name: "kartu/tahun" },
        { name: "lembaga/bulan" },
        { name: "lembaga/tahun" },
    ];

    // fungsi toast
    const showSuccess = (type) => {
        toast.current.show({
            severity: "success",
            summary: "Success",
            detail: `${type} data berhasil`,
            life: 3000,
        });
    };

    const showError = (message) => {
        toast.current.show({
            severity: "error",
            summary: "Error",
            detail: message,
            content: (props) => {
                return (
                    <div className="flex w-full flex-col">
                        <div className="flex align-items-center gap-2">
                            <span className="font-bold text-900">Error</span>
                        </div>
                        <div className="w-[90%] my-3 text-900">
                            <ul className="text-base list-inside list-disc">
                                {Object.values(props.message.detail).map(
                                    (error) => {
                                        return (
                                            <li className="my-2">{error}</li>
                                        );
                                    }
                                )}
                            </ul>
                        </div>
                    </div>
                );
            },
            life: 3000,
        });
    };

    const handleEditPartner = (partner) => {
        clearErrors();
        setData((prevData) => ({
            ...prevData,
            partner: {
                ...prevData.partner,
                uuid: partner.uuid,
                name: partner.name,
                npwp: partner.npwp,
                password: partner.password,
                total_members: partner.total_members,
                pic: partner.pics[0].name,
                logo: partner.logo ?? null,
                phone_number: partner.phone_number,
                sales: partner.sales,
                referral: partner.referral,
                account_manager: partner.account_manager,
                onboarding_date: partner.onboarding_date,
                onboarding_age: partner.onboarding_age,
                live_age: partner.live_age,
                monitoring_date_after_3_month_live:
                    partner.monitoring_date_after_3_month_live,
                live_date: partner.live_date,
                province: partner.province,
                regency: partner.regency,
                subdistrict: partner.subdistrict,
                period: partner.period,
                payment_metode: partner.payment_metode,
                address: partner.address,
                status: partner.status,
            },
        }));

        partner.regency
            ? setRegencyName(
                  (prev) => (prev = JSON.parse(partner.regency).name)
              )
            : null;

        partner.regency
            ? setProvinceName(
                  (prev) => (prev = JSON.parse(partner.province).name)
              )
            : null;
        setModalEditPartnersIsVisible(true);
    };

    const confirmDeletePartner = () => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: () => {
                setConfirmIsVisible(true);
            },
        });
    };

    const handleDeletePartner = () => {
        destroy("partners/" + selectedPartner.uuid, {
            onSuccess: () => {
                getPartners();
                showSuccess("Hapus");
            },
            onError: () => {
                showError("Hapus");
            },
        });
    };

    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };

    function formatNPWP(input) {
        let digitsOnly = input.replace(/\D/g, "");

        let formattedString =
            digitsOnly.slice(0, 2) +
            "." +
            digitsOnly.slice(2, 5) +
            "." +
            digitsOnly.slice(5, 8) +
            "." +
            digitsOnly.slice(8, 9) +
            "-" +
            digitsOnly.slice(9, 12) +
            "." +
            digitsOnly.slice(12);

        return formattedString;
    }

    const formateDate = (date) => {
        const parts = date.split("-");
        const formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
        return formattedDate;
    };

    const exportExcel = () => {
        const exports = partners.map((data) => {
            return {
                Nama: data.name,
                Status: data.status ? data.status.name : "-",
                NPWP: data.npwp ? data.npwp : "-",
                Jumlah_Member: data.total_members ? data.total_members : "-",
                Nomor_Telepon_Lembaga: data.phone_number
                    ? data.phone_number
                    : "-",
                Sales: data.sales ? data.sales.name : "-",
                Account_Manager: data.account_manager
                    ? data.account_manager.name
                    : "-",
                PIC: data.pics.length !== 0 ? data.pics[0].name : "-",
                Nomor_Telepon_PIC:
                    data.pics.length !== 0 ? data.pics[0].number : "-",
                Provinsi: data.province ? JSON.parse(data.province).name : "-",
                Kabupaten: data.regency ? JSON.parse(data.regency).name : "-",
                Tanggal_Onboarding: data.onboarding_date
                    ? formateDate(data.onboarding_date)
                    : "-",
                Tanggal_Live: data.live_date
                    ? formateDate(data.live_date)
                    : "-",
                Tanggal_Monitoring_3_Bulan_After_Live:
                    data.monitoring_date_after_3_month_live
                        ? formateDate(data.monitoring_date_after_3_month_live)
                        : "-",
            };
        });
        import("xlsx").then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(exports);
            const workbook = {
                Sheets: { data: worksheet },
                SheetNames: ["data"],
            };
            const excelBuffer = xlsx.write(workbook, {
                bookType: "xlsx",
                type: "array",
            });

            saveAsExcelFile(excelBuffer, "partner");
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import("file-saver").then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE =
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
                let EXCEL_EXTENSION = ".xlsx";
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE,
                });

                module.default.saveAs(data, fileName + EXCEL_EXTENSION);
            }
        });
    };

    const header = () => {
        return (
            <HeaderDatatable
                globalFilterValue={globalFilterValue}
                onGlobalFilterChange={onGlobalFilterChange}
            >
                <Button
                    className="shadow-md w-[10px] lg:w-[90px] border border-slate-600 bg-transparent text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-lg"
                    onClick={() => setSidebarFilter(true)}
                >
                    <span className="w-full flex justify-center items-center gap-1">
                        <i
                            className="pi pi-filter"
                            style={{ fontSize: "0.7rem" }}
                        ></i>{" "}
                        {!isMobile && <span>filter</span>}
                    </span>
                </Button>
                <Button
                    className="shadow-md w-[10px] lg:w-[90px] bg-transparent text-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:border rounded-lg"
                    onClick={exportExcel}
                    data-pr-tooltip="XLS"
                >
                    <span className="w-full flex items-center justify-center gap-1">
                        <i
                            className="pi pi-file-excel"
                            style={{ fontSize: "0.8rem" }}
                        ></i>{" "}
                        {!isMobile && <span>export</span>}
                    </span>
                </Button>
            </HeaderDatatable>
        );
    };

    const handleFilter = async (e) => {
        e.preventDefault();
        setIsLoadingData(true);
        const formData = {
            user: dataFilter.user,
            sales: dataFilter.sales,
            account_manager: dataFilter.account_manager,
            referral: dataFilter.referral,
            province: dataFilter.province,
            onboarding_date: dataFilter.onboarding_date,
            live_date: dataFilter.live_date,
            status: dataFilter.status,
        };

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");

        const response = await axios.post("/partners/filter", formData, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
        });
        const data = response.data;
        setPartners(data);
        setSidebarFilter(false);
        setIsLoadingData(false);
    };

    const handleSubmitForm = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            post("/partners", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalPartnersIsVisible((prev) => false);
                    getPartners();
                    reset("partner");
                },
                onError: (errors) => {
                    showError(errors);
                },
            });
        } else {
            post("/partners/" + data.partner.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditPartnersIsVisible((prev) => false);
                    getPartners();
                    reset("partner", "pic", "subscription");
                },
                onError: (errors) => {
                    showError(errors);
                },
            });
        }
    };

    const handleSubmitImportPartnerForm = (e, type) => {
        e.preventDefault();
        post("/partners/import", {
            onSuccess: () => {
                showSuccess("Tambah");
                setModalImportPartnerIsVisible((prev) => false);
                getPartners();
                reset();

                setActiveIndex((prev) => (prev = 0));
            },
            onError: (errors) => {
                showError(errors);
            },
        });
    };

    const getSelectedDetailPartner = async (partner) => {
        setIsLoading((prev) => (prev = true));
        let response = await fetch("/partners/" + partner.uuid);
        let data = await response.json();
        setDetailPartner((prev) => (prev = data));
        setIsLoading((prev) => (prev = false));
    };

    const handleSelectedDetailPartner = useCallback(
        (partner) => {
            getSelectedDetailPartner(partner);
            setActiveIndexTab(1);
        },
        [partner]
    );

    if (preRenderLoad) {
        return <SkeletonDatatable auth={auth} />;
    }

    return (
        <DashboardLayout auth={auth.user} className="">
            <Toast ref={toast} />
            <OverlayPanel
                className=" shadow-md p-1 dark:bg-slate-800 dark:text-gray-300"
                ref={action}
            >
                <div className="flex flex-col flex-wrap w-full">
                    {permissions.includes("edit partner") && (
                        <Button
                            icon="pi pi-pencil"
                            label="edit"
                            className="bg-transparent hover:bg-slate-200 w-full text-slate-500 dark:hover:text-slate-900 dark:text-white border-b-2 border-slate-400"
                            onClick={() => {
                                handleEditPartner(selectedPartner);
                            }}
                        />
                    )}
                    {permissions.includes("hapus partner") && (
                        <Button
                            icon="pi pi-trash"
                            label="hapus"
                            className="bg-transparent hover:bg-slate-200 w-full text-slate-500 dark:hover:text-slate-900 dark:text-white border-b-2 border-slate-400"
                            onClick={() => {
                                confirmDeletePartner();
                            }}
                        />
                    )}
                </div>
            </OverlayPanel>

            <HeaderModule title="Partner">
                {permissions.includes("tambah partner") && (
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={(event) => menuRight.current.toggle(event)}
                        aria-haspopup
                    />
                )}

                <OverlayPanel
                    ref={menuRight}
                    className="shadow-md dark:bg-slate-800 dark:text-white"
                >
                    <div className="flex flex-col text-left">
                        <span>
                            <Button
                                label="satuan"
                                className="bg-transparent hover:bg-slate-200 w-full text-slate-500 dark:hover:text-slate-900 dark:text-white border-b-2 border-slate-400"
                                onClick={() => {
                                    setModalPartnersIsVisible(
                                        (prev) => (prev = true)
                                    );
                                    reset();
                                }}
                                aria-controls="popup_menu_right"
                                aria-haspopup
                            />
                        </span>
                        <span>
                            <Button
                                label="import"
                                className="bg-transparent hover:bg-slate-200 w-full text-slate-500 dark:hover:text-slate-900 dark:text-white border-b-2 border-slate-400"
                                onClick={() => {
                                    setModalImportPartnerIsVisible(
                                        (prev) => (prev = true)
                                    );
                                }}
                                aria-controls="popup_menu_right"
                                aria-haspopup
                            />
                        </span>
                    </div>
                </OverlayPanel>
            </HeaderModule>

            <Sidebar
                header="Filter"
                visible={sidebarFilter}
                className="w-full md:w-[30%] px-3 dark:glass dark:text-white"
                position="right"
                onHide={() => setSidebarFilter(false)}
            >
                <form onSubmit={handleFilter}>
                    <div className="flex flex-col">
                        <label htmlFor="name">Berdasarkan sales</label>
                        <Dropdown
                            optionLabel="name"
                            dataKey="id"
                            value={dataFilter.sales}
                            onChange={(e) =>
                                setDataFilter("sales", e.target.value)
                            }
                            options={sales}
                            placeholder="Pilih sales"
                            filter
                            showClear
                            valueTemplate={selectedOptionTemplate}
                            itemTemplate={optionTemplate}
                            className="flex justify-center  dark:text-gray-400   "
                        />
                    </div>

                    <div className="flex flex-col mt-3">
                        <label htmlFor="name">
                            Berdasarkan account manager
                        </label>
                        <Dropdown
                            optionLabel="name"
                            dataKey="id"
                            value={dataFilter.account_manager}
                            onChange={(e) =>
                                setDataFilter("account_manager", e.target.value)
                            }
                            options={account_managers}
                            placeholder="Pilih account manager"
                            filter
                            showClear
                            valueTemplate={selectedOptionTemplate}
                            itemTemplate={optionTemplate}
                            className="flex justify-center  dark:text-gray-400   "
                        />
                    </div>

                    <div className="flex flex-col mt-3">
                        <label htmlFor="name">Berdasarkan referral</label>
                        <Dropdown
                            optionLabel="name"
                            dataKey="id"
                            value={dataFilter.referral}
                            onChange={(e) =>
                                setDataFilter("referral", e.target.value)
                            }
                            options={referrals}
                            placeholder="Pilih referral"
                            filter
                            showClear
                            valueTemplate={selectedOptionTemplate}
                            itemTemplate={optionTemplate}
                            className="flex justify-center  dark:text-gray-400   "
                        />
                    </div>

                    <div className="flex flex-col mt-3">
                        <label htmlFor="name">Berdasarkan penginput</label>
                        <Dropdown
                            optionLabel="name"
                            dataKey="id"
                            value={dataFilter.user}
                            onChange={(e) =>
                                setDataFilter("user", e.target.value)
                            }
                            options={users}
                            placeholder="Pilih User"
                            filter
                            showClear
                            valueTemplate={selectedOptionTemplate}
                            itemTemplate={optionTemplate}
                            className="flex justify-center  dark:text-gray-400   "
                        />
                    </div>
                    <div className="flex flex-col mt-3">
                        <label htmlFor="status">Status </label>
                        <Dropdown
                            dataKey="name"
                            value={dataFilter.status}
                            onChange={(e) => {
                                setDataFilter("status", e.target.value);
                            }}
                            options={status}
                            optionLabel="name"
                            placeholder="Pilih Status"
                            className="w-full md:w-14rem"
                        />
                        <InputError
                            message={errors["status"]}
                            className="mt-2"
                        />
                    </div>
                    <div className="flex flex-col mt-3">
                        <label htmlFor="province">Provinsi *</label>
                        <Dropdown
                            dataKey="name"
                            value={
                                dataFilter.province
                                    ? JSON.parse(dataFilter.province)
                                    : null
                            }
                            onChange={(e) => {
                                setDataFilter(
                                    "province",
                                    JSON.stringify(e.target.value)
                                );
                            }}
                            options={provinces}
                            optionLabel="name"
                            placeholder="Pilih Provinsi"
                            filter
                            showClear
                            valueTemplate={selectedOptionTemplate}
                            itemTemplate={optionTemplate}
                            className="w-full md:w-14rem"
                        />
                    </div>

                    <div className="flex flex-col mt-3">
                        <label htmlFor="">Tanggal onboarding</label>
                        <div className="flex items-center gap-2">
                            <Calendar
                                value={
                                    dataFilter.onboarding_date.start
                                        ? new Date(
                                              dataFilter.onboarding_date.start
                                          )
                                        : null
                                }
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setDataFilter("onboarding_date", {
                                        ...dataFilter.onboarding_date,
                                        start: e.target.value,
                                    });
                                }}
                                placeholder="mulai"
                                showIcon
                                dateFormat="dd/mm/yy"
                            />
                            <span>-</span>
                            <Calendar
                                value={
                                    dataFilter.onboarding_date.end
                                        ? new Date(
                                              dataFilter.onboarding_date.end
                                          )
                                        : null
                                }
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setDataFilter("onboarding_date", {
                                        ...dataFilter.onboarding_date,
                                        end: e.target.value,
                                    });
                                }}
                                placeholder="selesai"
                                showIcon
                                dateFormat="dd/mm/yy"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col mt-3">
                        <label htmlFor="">Tanggal live</label>
                        <div className="flex items-center gap-2">
                            <Calendar
                                value={
                                    dataFilter.live_date.start
                                        ? new Date(dataFilter.live_date.start)
                                        : null
                                }
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setDataFilter("live_date", {
                                        ...dataFilter.live_date,
                                        start: e.target.value,
                                    });
                                }}
                                placeholder="mulai"
                                showIcon
                                dateFormat="dd/mm/yy"
                            />
                            <span>-</span>
                            <Calendar
                                value={
                                    dataFilter.live_date.end
                                        ? new Date(dataFilter.live_date.end)
                                        : null
                                }
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setDataFilter("live_date", {
                                        ...dataFilter.live_date,
                                        end: e.target.value,
                                    });
                                }}
                                placeholder="selesai"
                                showIcon
                                dateFormat="dd/mm/yy"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row mt-5">
                        <Button
                            ref={btnFilterRef}
                            label="Terapkan"
                            className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        />
                        <Button
                            type="button"
                            label="Reset"
                            onClick={(e) => {
                                resetFilter();
                                setTimeout(() => {
                                    btnFilterRef.current.click();
                                }, 500);
                            }}
                            className="outline-purple-600 outline-1 outline-dotted bg-transparent text-slate-700  text-sm shadow-md rounded-lg mr-2"
                        />
                    </div>
                </form>
            </Sidebar>

            <TabView
                className="mt-3"
                activeIndex={activeIndexTab}
                onTabChange={(e) => {
                    setActiveIndexTab(e.index);
                }}
            >
                <TabPanel header="List Partner">
                    <ConfirmDialog />
                    <ConfirmDialog2
                        group="declarative"
                        visible={confirmIsVisible}
                        onHide={() => setConfirmIsVisible(false)}
                        message="Konfirmasi kembali jika anda yakin!"
                        header="Konfirmasi kembali"
                        icon="pi pi-info-circle"
                        accept={handleDeletePartner}
                    />

                    {/* Modal tambah partner */}
                    <div className="card flex justify-content-center">
                        <Dialog
                            ref={modalPartner}
                            header="Partner"
                            headerClassName="dark:bg-slate-900 dark:text-white"
                            className="bg-white min-h-[500px] max-h-[80%] w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                            contentClassName="dark:bg-slate-900 dark:text-white"
                            visible={modalPartnersIsVisible}
                            onHide={() => {
                                reset("partner");
                                setModalPartnersIsVisible(false);
                            }}
                        >
                            <form
                                onSubmit={(e) => handleSubmitForm(e, "tambah")}
                            >
                                <div className="flex flex-col justify-around gap-4 mt-3">
                                    <div className="flex flex-col">
                                        <label htmlFor="name">Nama *</label>
                                        <InputText
                                            value={data.partner.name}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300"
                                            id="name"
                                            required
                                            aria-describedby="name-help"
                                        />
                                        <InputError
                                            message={errors["partner.name"]}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="name">Logo</label>
                                        <div className="App">
                                            {data.partner.logo !== null &&
                                            typeof data.partner.logo ==
                                                "string" ? (
                                                <>
                                                    <FilePond
                                                        files={
                                                            "storage/" +
                                                            data.partner.logo
                                                        }
                                                        onaddfile={(
                                                            error,
                                                            fileItems
                                                        ) => {
                                                            setData("partner", {
                                                                ...data.partner,
                                                                logo: fileItems.file,
                                                            });
                                                        }}
                                                        onremovefile={() => {
                                                            setData("partner", {
                                                                ...data.partner,
                                                                logo: null,
                                                            });
                                                        }}
                                                        maxFileSize="2mb"
                                                        labelMaxFileSizeExceeded="File terlalu besar"
                                                        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <FilePond
                                                        onaddfile={(
                                                            error,
                                                            fileItems
                                                        ) => {
                                                            setData("partner", {
                                                                ...data.partner,
                                                                logo: fileItems.file,
                                                            });
                                                        }}
                                                        onremovefile={() => {
                                                            setData("partner", {
                                                                ...data.partner,
                                                                logo: null,
                                                            });
                                                        }}
                                                        maxFileSize="2mb"
                                                        labelMaxFileSizeExceeded="File terlalu besar"
                                                        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                                    />
                                                </>
                                            )}
                                        </div>
                                        <InputError
                                            message={errors["partner.logo"]}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="name">
                                            Jumlah Member *
                                        </label>
                                        <InputText
                                            keyfilter="int"
                                            value={data.partner.total_members}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    total_members:
                                                        e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300"
                                            id="total_members"
                                            aria-describedby="total_members-help"
                                        />
                                        <InputError
                                            message={
                                                errors["partner.total_members"]
                                            }
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="pic">PIC *</label>
                                        <InputText
                                            value={data.partner.pic}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    pic: e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300"
                                            id="pic"
                                            aria-describedby="pic-help"
                                        />
                                        <InputError
                                            message={errors["partner.pic"]}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="name">NPWP</label>
                                        <InputMask
                                            keyfilter="int"
                                            value={data.partner.npwp}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    npwp: e.target.value,
                                                })
                                            }
                                            placeholder="99.999.999.9-999.999"
                                            mask="99.999.999.9-999.999"
                                            className="dark:bg-gray-300"
                                            id="npwp"
                                            aria-describedby="npwp-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="name">Password</label>
                                        <InputText
                                            value={data.partner.password}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    password: e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300"
                                            id="password"
                                            aria-describedby="password-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="name">
                                            Nomor Telepon
                                        </label>
                                        <InputText
                                            keyfilter="int"
                                            value={data.partner.phone_number}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    phone_number:
                                                        e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300"
                                            id="phone_number"
                                            aria-describedby="phone_number-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="sales">Sales</label>
                                        <Dropdown
                                            value={data.partner.sales}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    sales: e.target.value,
                                                })
                                            }
                                            options={sales}
                                            optionLabel="name"
                                            placeholder="Pilih Sales"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="account_manager">
                                            Account Manager (AM)
                                        </label>
                                        <Dropdown
                                            value={data.partner.account_manager}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    account_manager:
                                                        e.target.value,
                                                })
                                            }
                                            options={account_managers}
                                            optionLabel="name"
                                            placeholder="Pilih Account Manager (AM)"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="referral">
                                            Referral
                                        </label>
                                        <Dropdown
                                            dataKey="id"
                                            value={data.partner.referral}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    referral: e.target.value,
                                                })
                                            }
                                            options={referrals}
                                            optionLabel="name"
                                            placeholder="Pilih Referral"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="province">
                                            Provinsi *
                                        </label>
                                        <Dropdown
                                            dataKey="name"
                                            value={
                                                data.partner.province
                                                    ? JSON.parse(
                                                          data.partner.province
                                                      )
                                                    : null
                                            }
                                            onChange={(e) => {
                                                setProvinceName(
                                                    (prev) =>
                                                        (prev =
                                                            e.target.value.name)
                                                );
                                                setData("partner", {
                                                    ...data.partner,
                                                    province: JSON.stringify(
                                                        e.target.value
                                                    ),
                                                });
                                            }}
                                            options={provinces}
                                            optionLabel="name"
                                            placeholder="Pilih Provinsi"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                        <InputError
                                            message={errors["partner.province"]}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="regency">
                                            Kabupaten *
                                        </label>
                                        <Dropdown
                                            dataKey="name"
                                            value={
                                                data.partner.regency
                                                    ? JSON.parse(
                                                          data.partner.regency
                                                      )
                                                    : null
                                            }
                                            onChange={(e) => {
                                                setRegencyName(
                                                    (prev) =>
                                                        (prev =
                                                            e.target.value.name)
                                                );
                                                setData("partner", {
                                                    ...data.partner,
                                                    regency: JSON.stringify(
                                                        e.target.value
                                                    ),
                                                });
                                            }}
                                            options={regencys}
                                            optionLabel="name"
                                            placeholder="Pilih Kabupaten"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                        <InputError
                                            message={errors["partner.regency"]}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="subdistrict">
                                            Kecamatan
                                        </label>
                                        <Dropdown
                                            value={
                                                data.partner.subdistrict
                                                    ? JSON.parse(
                                                          data.partner
                                                              .subdistrict
                                                      )
                                                    : null
                                            }
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    subdistrict: JSON.stringify(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            options={subdistricts}
                                            optionLabel="name"
                                            placeholder="Pilih Kecamatan"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="register_date">
                                            Tanggal Onboarding
                                        </label>
                                        <Calendar
                                            value={
                                                data.partner.onboarding_date
                                                    ? new Date(
                                                          data.partner.onboarding_date
                                                      )
                                                    : null
                                            }
                                            style={{ height: "35px" }}
                                            onChange={(e) => {
                                                setData("partner", {
                                                    ...data.partner,
                                                    onboarding_date:
                                                        e.target.value,
                                                });
                                            }}
                                            showIcon
                                            dateFormat="dd/mm/yy"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="live_date">
                                            Tanggal Live
                                        </label>
                                        <Calendar
                                            value={
                                                data.partner.live_date
                                                    ? new Date(
                                                          data.partner.live_date
                                                      )
                                                    : null
                                            }
                                            style={{ height: "35px" }}
                                            onChange={(e) => {
                                                const onboarding_age =
                                                    Math.ceil(
                                                        (e.target.value -
                                                            new Date(
                                                                data.partner.onboarding_date
                                                            )) /
                                                            (1000 *
                                                                60 *
                                                                60 *
                                                                24)
                                                    );

                                                const live_age = Math.ceil(
                                                    (new Date() -
                                                        e.target.value) /
                                                        (1000 * 60 * 60 * 24)
                                                );

                                                let startDate = e.target.value;
                                                let endDate = new Date(
                                                    new Date().setDate(
                                                        new Date().getDate() +
                                                            90
                                                    )
                                                );

                                                let workDayCount =
                                                    calculateWorkdays(
                                                        startDate,
                                                        endDate
                                                    ) - 1;

                                                const monitoring_date_after_3_month_live =
                                                    new Date(
                                                        e.target.value
                                                    ).setDate(
                                                        new Date(
                                                            e.target.value
                                                        ).getDate() +
                                                            workDayCount
                                                    );

                                                setData("partner", {
                                                    ...data.partner,
                                                    live_date: e.target.value,
                                                    onboarding_age:
                                                        onboarding_age,
                                                    live_age: live_age,
                                                    monitoring_date_after_3_month_live:
                                                        new Date(
                                                            monitoring_date_after_3_month_live
                                                        ),
                                                });
                                            }}
                                            showIcon
                                            dateFormat="dd/mm/yy"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="name">
                                            Umur Onboarding (hari)
                                        </label>
                                        <InputText
                                            value={data.partner.onboarding_age}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    onboarding_age:
                                                        e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300"
                                            id="onboarding_age"
                                            aria-describedby="onboarding_age-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="name">
                                            Umur Live (hari)
                                        </label>
                                        <InputText
                                            value={data.partner.live_age}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    live_age: e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300"
                                            id="live_age"
                                            aria-describedby="live_age-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="live_date">
                                            Tanggal Monitoring 3 Bulan After
                                            Live
                                        </label>
                                        <Calendar
                                            value={
                                                data.partner
                                                    .monitoring_date_after_3_month_live
                                                    ? new Date(
                                                          data.partner.monitoring_date_after_3_month_live
                                                      )
                                                    : null
                                            }
                                            style={{ height: "35px" }}
                                            onChange={(e) => {
                                                setData("partner", {
                                                    ...data.partner,
                                                    monitoring_date_after_3_month_live:
                                                        e.target.value,
                                                });
                                            }}
                                            showIcon
                                            dateFormat="dd/mm/yy"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="address">Alamat</label>
                                        <InputTextarea
                                            value={data.partner.address}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    address: e.target.value,
                                                })
                                            }
                                            rows={5}
                                            cols={30}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="period">
                                            Periode Langganan
                                        </label>
                                        <Dropdown
                                            dataKey="name"
                                            value={data.partner.period}
                                            onChange={(e) => {
                                                setData("partner", {
                                                    ...data.partner,
                                                    period: e.target.value,
                                                });
                                            }}
                                            options={option_period_subscription}
                                            optionLabel="name"
                                            placeholder="Langganan Per-"
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            editable
                                            className={`w-full md:w-14rem 
                                        `}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="payment_metode">
                                            Metode Pembayaran
                                        </label>
                                        <Dropdown
                                            value={data.partner.payment_metode}
                                            onChange={(e) => {
                                                setData("partner", {
                                                    ...data.partner,
                                                    payment_metode:
                                                        e.target.value,
                                                });
                                            }}
                                            options={[
                                                { name: "cazhbox" },
                                                {
                                                    name: "payment link",
                                                },
                                            ]}
                                            optionLabel="name"
                                            optionValue="name"
                                            placeholder="Pilih Metode Pembayaran"
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                            editable
                                        />
                                        <InputError
                                            message={
                                                errors["partner.payment_metode"]
                                            }
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="status">Status *</label>
                                        <Dropdown
                                            dataKey="name"
                                            value={data.partner.status}
                                            onChange={(e) => {
                                                setData("partner", {
                                                    ...data.partner,
                                                    status: e.target.value,
                                                });
                                            }}
                                            options={status}
                                            optionLabel="name"
                                            placeholder="Pilih Status"
                                            className="w-full md:w-14rem"
                                        />
                                        <InputError
                                            message={errors["partner.status"]}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center mt-5">
                                    <Button
                                        label="Submit"
                                        disabled={processing}
                                        className="bg-purple-600 text-sm shadow-md rounded-lg"
                                    />
                                </div>
                            </form>
                        </Dialog>
                    </div>

                    {/* Modal import partner */}
                    <div className="card flex justify-content-center">
                        <Dialog
                            header="Import Partner"
                            headerClassName="dark:glass dark:text-white"
                            className="bg-white max-h-[80%] w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                            contentClassName=" dark:glass dark:text-white"
                            visible={modalImportPartnerIsVisible}
                            onHide={() => setModalImportPartnerIsVisible(false)}
                            // footer={footerTemplate}
                        >
                            <form
                                onSubmit={(e) =>
                                    handleSubmitImportPartnerForm(e, "tambah")
                                }
                                className="my-4"
                            >
                                <div className="flex flex-col mt-3">
                                    <div className="flex bg-green-600 text-white text-xs p-3 rounded-lg justify-between w-full h-full">
                                        <p>Template</p>
                                        <p className="font-semibold">
                                            <a
                                                href={
                                                    "/assets/template/excel/sample.xlsx"
                                                }
                                                download="sample.xlsx"
                                                class="font-bold underline w-full h-full text-center rounded-full "
                                            >
                                                sample.xlsx
                                            </a>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="name">Excel</label>

                                    <div className="App">
                                        <FilePond
                                            onaddfile={(error, fileItems) => {
                                                setData("partner", {
                                                    ...data.partner,
                                                    excell: fileItems.file,
                                                });
                                            }}
                                            maxFileSize="2mb"
                                            labelMaxFileSizeExceeded="File terlalu besar"
                                            name="files"
                                            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-center mt-3">
                                    <Button
                                        label="Submit"
                                        disabled={processing}
                                        className="bg-purple-600 text-sm shadow-md rounded-lg"
                                    />
                                </div>
                            </form>
                        </Dialog>
                    </div>

                    {/* Modal edit partner */}
                    <div className="card flex justify-content-center">
                        <Dialog
                            ref={modalPartner}
                            header="Partner"
                            headerClassName="dark:glass shadow-md z-20 dark:text-white"
                            className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                            contentClassName=" dark:glass dark:text-white"
                            visible={modalEditPartnersIsVisible}
                            onHide={() => setModalEditPartnersIsVisible(false)}
                        >
                            <form onSubmit={(e) => handleSubmitForm(e)}>
                                <div className="flex flex-col justify-around gap-4 mt-3">
                                    <div className="flex flex-col">
                                        <label htmlFor="name">Nama *</label>
                                        <InputText
                                            value={data.partner.name}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300"
                                            id="name"
                                            required
                                            aria-describedby="name-help"
                                        />
                                        <InputError
                                            message={errors["partner.name"]}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="name">Logo</label>
                                        <div className="App">
                                            {data.partner.logo !== null &&
                                            typeof data.partner.logo ==
                                                "string" ? (
                                                <>
                                                    {console.log(data.partner)}
                                                    <FilePond
                                                        files={
                                                            "storage/" +
                                                            data.partner.logo
                                                        }
                                                        onaddfile={(
                                                            error,
                                                            fileItems
                                                        ) => {
                                                            setData("partner", {
                                                                ...data.partner,
                                                                logo: fileItems.file,
                                                            });
                                                        }}
                                                        onremovefile={() => {
                                                            setData("partner", {
                                                                ...data.partner,
                                                                logo: null,
                                                            });
                                                        }}
                                                        maxFileSize="2mb"
                                                        labelMaxFileSizeExceeded="File terlalu besar"
                                                        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <FilePond
                                                        onaddfile={(
                                                            error,
                                                            fileItems
                                                        ) => {
                                                            setData("partner", {
                                                                ...data.partner,
                                                                logo: fileItems.file,
                                                            });
                                                        }}
                                                        onremovefile={() => {
                                                            setData("partner", {
                                                                ...data.partner,
                                                                logo: null,
                                                            });
                                                        }}
                                                        maxFileSize="2mb"
                                                        labelMaxFileSizeExceeded="File terlalu besar"
                                                        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                                    />
                                                </>
                                            )}
                                        </div>
                                        <InputError
                                            message={errors["partner.logo"]}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="name">
                                            Jumlah Member *
                                        </label>
                                        <InputText
                                            keyfilter="int"
                                            value={data.partner.total_members}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    total_members:
                                                        e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300"
                                            id="total_members"
                                            aria-describedby="total_members-help"
                                        />
                                        <InputError
                                            message={
                                                errors["partner.total_members"]
                                            }
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="pic">PIC *</label>
                                        <InputText
                                            value={data.partner.pic}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    pic: e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300"
                                            id="pic"
                                            aria-describedby="pic-help"
                                        />
                                        <InputError
                                            message={errors["partner.pic"]}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="name">NPWP</label>
                                        <InputMask
                                            keyfilter="int"
                                            value={data.partner.npwp}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    npwp: e.target.value,
                                                })
                                            }
                                            placeholder="99.999.999.9-999.999"
                                            mask="99.999.999.9-999.999"
                                            className="dark:bg-gray-300"
                                            id="npwp"
                                            aria-describedby="npwp-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="name">Password</label>
                                        <InputText
                                            value={data.partner.password}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    password: e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300"
                                            id="password"
                                            aria-describedby="password-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="name">
                                            Nomor Telepon
                                        </label>
                                        <InputText
                                            keyfilter="int"
                                            value={data.partner.phone_number}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    phone_number:
                                                        e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300"
                                            id="phone_number"
                                            aria-describedby="phone_number-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="sales">Sales</label>
                                        <Dropdown
                                            value={data.partner.sales}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    sales: e.target.value,
                                                })
                                            }
                                            options={sales}
                                            optionLabel="name"
                                            placeholder="Pilih Sales"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="account_manager">
                                            Account Manager (AM)
                                        </label>
                                        <Dropdown
                                            value={data.partner.account_manager}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    account_manager:
                                                        e.target.value,
                                                })
                                            }
                                            options={account_managers}
                                            optionLabel="name"
                                            placeholder="Pilih Account Manager (AM)"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="referral">
                                            Referral
                                        </label>
                                        <Dropdown
                                            dataKey="id"
                                            value={data.partner.referral}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    referral: e.target.value,
                                                })
                                            }
                                            options={referrals}
                                            optionLabel="name"
                                            placeholder="Pilih Referral"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="province">
                                            Provinsi *
                                        </label>
                                        <Dropdown
                                            dataKey="code"
                                            value={
                                                data.partner.province
                                                    ? JSON.parse(
                                                          data.partner.province
                                                      )
                                                    : null
                                            }
                                            onChange={(e) => {
                                                setProvinceName(
                                                    (prev) =>
                                                        (prev =
                                                            e.target.value.code)
                                                );
                                                setData("partner", {
                                                    ...data.partner,
                                                    province: JSON.stringify(
                                                        e.target.value
                                                    ),
                                                });
                                            }}
                                            options={provinces}
                                            optionLabel="name"
                                            placeholder="Pilih Provinsi"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                        <InputError
                                            message={errors["partner.province"]}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="regency">
                                            Kabupaten *
                                        </label>
                                        <Dropdown
                                            dataKey="code"
                                            value={
                                                data.partner.regency
                                                    ? JSON.parse(
                                                          data.partner.regency
                                                      )
                                                    : null
                                            }
                                            onChange={(e) => {
                                                setRegencyName(
                                                    (prev) =>
                                                        (prev =
                                                            e.target.value.name)
                                                );
                                                setData("partner", {
                                                    ...data.partner,
                                                    regency: JSON.stringify(
                                                        e.target.value
                                                    ),
                                                });
                                            }}
                                            options={regencys}
                                            optionLabel="name"
                                            placeholder="Pilih Kabupaten"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                        <InputError
                                            message={errors["partner.regency"]}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="subdistrict">
                                            Kecamatan
                                        </label>
                                        <Dropdown
                                            dataKey="code"
                                            value={
                                                data.partner.subdistrict
                                                    ? JSON.parse(
                                                          data.partner
                                                              .subdistrict
                                                      )
                                                    : null
                                            }
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    subdistrict: JSON.stringify(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            options={subdistricts}
                                            optionLabel="name"
                                            placeholder="Pilih Kecamatan"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="register_date">
                                            Tanggal Onboarding
                                        </label>
                                        <Calendar
                                            value={
                                                data.partner.onboarding_date
                                                    ? new Date(
                                                          data.partner.onboarding_date
                                                      )
                                                    : null
                                            }
                                            style={{ height: "35px" }}
                                            onChange={(e) => {
                                                setData("partner", {
                                                    ...data.partner,
                                                    onboarding_date:
                                                        e.target.value,
                                                });
                                            }}
                                            showIcon
                                            dateFormat="dd/mm/yy"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="live_date">
                                            Tanggal Live
                                        </label>
                                        <Calendar
                                            value={
                                                data.partner.live_date
                                                    ? new Date(
                                                          data.partner.live_date
                                                      )
                                                    : null
                                            }
                                            style={{ height: "35px" }}
                                            onChange={(e) => {
                                                const onboarding_age =
                                                    Math.ceil(
                                                        (e.target.value -
                                                            new Date(
                                                                data.partner.onboarding_date
                                                            )) /
                                                            (1000 *
                                                                60 *
                                                                60 *
                                                                24)
                                                    );

                                                const live_age = Math.ceil(
                                                    (new Date() -
                                                        e.target.value) /
                                                        (1000 * 60 * 60 * 24)
                                                );

                                                let startDate = e.target.value;
                                                let endDate = new Date(
                                                    new Date().setDate(
                                                        new Date().getDate() +
                                                            90
                                                    )
                                                );

                                                let workDayCount =
                                                    calculateWorkdays(
                                                        startDate,
                                                        endDate
                                                    ) - 1;

                                                const monitoring_date_after_3_month_live =
                                                    new Date(
                                                        e.target.value
                                                    ).setDate(
                                                        new Date(
                                                            e.target.value
                                                        ).getDate() +
                                                            workDayCount
                                                    );

                                                setData("partner", {
                                                    ...data.partner,
                                                    live_date: e.target.value,
                                                    onboarding_age:
                                                        onboarding_age,
                                                    live_age: live_age,
                                                    monitoring_date_after_3_month_live:
                                                        new Date(
                                                            monitoring_date_after_3_month_live
                                                        ),
                                                });
                                            }}
                                            showIcon
                                            dateFormat="dd/mm/yy"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="name">
                                            Umur Onboarding (hari)
                                        </label>
                                        <InputText
                                            value={data.partner.onboarding_age}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    onboarding_age:
                                                        e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300"
                                            id="onboarding_age"
                                            aria-describedby="onboarding_age-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="name">
                                            Umur Live (hari)
                                        </label>
                                        <InputText
                                            value={data.partner.live_age}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    live_age: e.target.value,
                                                })
                                            }
                                            className="dark:bg-gray-300"
                                            id="live_age"
                                            aria-describedby="live_age-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="live_date">
                                            Tanggal Monitoring 3 Bulan After
                                            Live
                                        </label>
                                        <Calendar
                                            value={
                                                data.partner
                                                    .monitoring_date_after_3_month_live
                                                    ? new Date(
                                                          data.partner.monitoring_date_after_3_month_live
                                                      )
                                                    : null
                                            }
                                            style={{ height: "35px" }}
                                            onChange={(e) => {
                                                setData("partner", {
                                                    ...data.partner,
                                                    monitoring_date_after_3_month_live:
                                                        e.target.value,
                                                });
                                            }}
                                            showIcon
                                            dateFormat="dd/mm/yy"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="address">Alamat</label>
                                        <InputTextarea
                                            value={data.partner.address}
                                            onChange={(e) =>
                                                setData("partner", {
                                                    ...data.partner,
                                                    address: e.target.value,
                                                })
                                            }
                                            rows={5}
                                            cols={30}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="period">
                                            Periode Langganan
                                        </label>
                                        <Dropdown
                                            dataKey="name"
                                            value={data.partner.period}
                                            onChange={(e) => {
                                                setData("partner", {
                                                    ...data.partner,
                                                    period: e.target.value,
                                                });
                                            }}
                                            options={option_period_subscription}
                                            optionLabel="name"
                                            placeholder="Langganan Per-"
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            editable
                                            className={`w-full md:w-14rem 
                                        `}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="payment_metode">
                                            Metode Pembayaran
                                        </label>
                                        <Dropdown
                                            value={data.partner.payment_metode}
                                            onChange={(e) => {
                                                setData("partner", {
                                                    ...data.partner,
                                                    payment_metode:
                                                        e.target.value,
                                                });
                                            }}
                                            options={[
                                                { name: "cazhbox" },
                                                {
                                                    name: "payment link",
                                                },
                                            ]}
                                            optionLabel="name"
                                            optionValue="name"
                                            placeholder="Pilih Metode Pembayaran"
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                            editable
                                        />
                                        <InputError
                                            message={
                                                errors["partner.payment_metode"]
                                            }
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="status">Status *</label>
                                        <Dropdown
                                            dataKey="name"
                                            value={data.partner.status}
                                            onChange={(e) => {
                                                setData("partner", {
                                                    ...data.partner,
                                                    status: e.target.value,
                                                });
                                            }}
                                            options={status}
                                            optionLabel="name"
                                            placeholder="Pilih Status"
                                            className="w-full md:w-14rem"
                                        />
                                        <InputError
                                            message={errors["partner.status"]}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center mt-5">
                                    <Button
                                        label="Submit"
                                        disabled={processing}
                                        className="bg-purple-600 text-sm shadow-md rounded-lg"
                                    />
                                </div>
                            </form>
                        </Dialog>
                    </div>

                    {/* Modal edit status */}
                    <Dialog
                        header="Edit status"
                        headerClassName="dark:bg-slate-900 dark:text-white"
                        className="bg-white h-[250px] max-h-[80%] w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                        contentClassName="dark:bg-slate-900 dark:text-white"
                        visible={modalStatusIsVisible}
                        modal={false}
                        closable={false}
                        onHide={() => setModalStatusIsVisible(false)}
                    >
                        <div className="flex flex-col justify-around gap-4 mt-3">
                            <div className="flex flex-col">
                                <label htmlFor="note_status">Keterangan</label>
                                <InputTextarea
                                    value={data.partner.note_status}
                                    onChange={(e) =>
                                        setData("partner", {
                                            ...data.partner,
                                            note_status: e.target.value,
                                        })
                                    }
                                    rows={5}
                                    cols={30}
                                />
                            </div>
                            <div className="flex justify-center mt-3">
                                <Button
                                    type="button"
                                    label="oke"
                                    disabled={
                                        data.partner.note_status == null ||
                                        data.partner.note_status == ""
                                    }
                                    onClick={() =>
                                        setModalStatusIsVisible(false)
                                    }
                                    className="bg-purple-600 text-sm shadow-md rounded-lg"
                                />
                            </div>
                        </div>
                    </Dialog>

                    <div className="flex w-full mx-auto flex-col justify-center mt-5 gap-5">
                        <div className="card p-fluid w-full h-full flex justify-center rounded-lg">
                            {
                                <DatatablePartner
                                    partners={partners}
                                    isLoadingData={isLoadingData}
                                    handleSelectedDetailPartner={
                                        handleSelectedDetailPartner
                                    }
                                    setSelectedPartner={setSelectedPartner}
                                    action={action}
                                    setSidebarFilter={setSidebarFilter}
                                />
                            }
                        </div>
                    </div>
                </TabPanel>

                <TabPanel header="Detail Partner">
                    <DetailPartner
                        partners={partners}
                        detailPartner={detailPartner}
                        handleSelectedDetailPartner={
                            handleSelectedDetailPartner
                        }
                        sales={sales}
                        account_managers={account_managers}
                        referrals={referrals}
                        status={status}
                        isLoading={isLoading}
                        provinces={provinces}
                        regencys={regencys}
                        subdistricts={subdistricts}
                        ProvinceName={ProvinceName}
                        RegencyName={RegencyName}
                        setProvinceName={setProvinceName}
                        setRegencyName={setRegencyName}
                        showSuccess={showSuccess}
                        showError={showError}
                    />
                </TabPanel>
            </TabView>
        </DashboardLayout>
    );
}
