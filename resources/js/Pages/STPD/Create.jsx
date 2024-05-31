import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Head, Link, useForm } from "@inertiajs/react";
import { Calendar } from "primereact/calendar";
import { useRef } from "react";
import { FilterMatchMode } from "primereact/api";
import { Dropdown } from "primereact/dropdown";
import React from "react";
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
import { useEffect } from "react";
import DialogInstitution from "@/Components/DialogInstitution";
import { getRegencys } from "@/Services/getRegency";
import { getSubdistricts } from "@/Services/getSubdistrict";
import LoadingDocument from "@/Components/LoadingDocument";
import { BlockUI } from "primereact/blockui";
import InputError from "@/Components/InputError";
import { getProvince } from "@/Services/getProvince";
import { upperCaseEachWord } from "@/Utils/UppercaseEachWord";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Create = ({ usersDefault, partnersDefault, signaturesProp }) => {
    const [users, setUsers] = useState(usersDefault);
    const [partners, setPartners] = useState(partnersDefault);
    const [signatures, setSignatures] = useState(signaturesProp);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [rowClick, setRowClick] = useState(true);
    const toast = useRef(null);
    const [provinces, setProvinces] = useState([]);
    const [regencys, setRegencys] = useState([]);
    const [dialogInstitutionVisible, setDialogInstitutionVisible] =
        useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [leads, setLeads] = useState(null);
    const [provinceName, setProvinceName] = useState(null);
    const [regencyName, setRegencyName] = useState(null);
    const [blocked, setBlocked] = useState(false);

    const [theme, setTheme] = useState(localStorage.theme);
    useEffect(() => {
        theme
            ? (localStorage.theme = "dark")
            : localStorage.removeItem("theme");

        if (
            localStorage.theme === "dark" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    const animatePartnerNameRef = useRef(null);
    const animateLocationRef = useRef(null);
    const animateDepartureDateRef = useRef(null);
    const animateReturnDateRef = useRef(null);
    const animateTransportationRef = useRef(null);
    const animateAccomodationRef = useRef(null);
    const animatePartnerProvinceRef = useRef(null);
    const animatePartnerRegencyRef = useRef(null);

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

    const triggerInputFocus = (ref) => {
        if (ref.current) {
            ref.current.classList.add("twinkle");
            ref.current.focus();
        }
        return null;
    };

    const stopAnimateInputFocus = (ref) => {
        ref.current.classList.remove("twinkle");

        return null;
    };

    document.querySelector("body").classList.add("overflow-hidden");

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        reset,
        processing,
        errors,
    } = useForm({
        uuid: "",
        code: `${Math.floor(
            Math.random() * 1000
        )}/CAZH-SPJ/X/${new Date().getFullYear()}`,
        employees: [],
        partner: {
            name: null,
            province: null,
            regency: null,
        },
        departure_date: new Date(),
        return_date: new Date(),
        transportation: "",
        accommodation: "",
        signature: {
            name: "Muh Arif Mahmudin",
            position: "CEO",
            image: "/assets/img/signatures/ttd.png",
        },
        stpd_doc: "",
    });

    useEffect(() => {
        if (processing) {
            setBlocked(true);
        } else {
            setBlocked(false);
        }
    }, [processing]);

    useEffect(() => {
        const fetch = async () => {
            let response = await getProvince();
            setProvinces((prev) => (prev = response));
        };

        fetch();
    }, []);

    useEffect(() => {
        const fetch = async () => {
            if (provinceName) {
                let response = await getRegencys(provinceName);
                setRegencys((prev) => (prev = response));
            }
        };

        fetch();
    }, [provinceName, regencyName]);

    useEffect(() => {
        if (provinceName) {
            getRegencys(provinceName);
        }
    }, [provinceName]);

    const dialogFooterTemplate = () => {
        return (
            <Button
                label="OK"
                icon="pi pi-check"
                onClick={() => setDialogVisible(false)}
            />
        );
    };

    const ubahFormatTanggal = (tanggal) => {
        if (!tanggal) {
            return "N/A";
        }
        let tanggalAngka = tanggal.getDate();
        let bulanAngka = tanggal.getMonth() + 1;
        let tahunAngka = tanggal.getFullYear();

        let bulanFormat = bulanAngka < 10 ? "0" + bulanAngka : bulanAngka;
        let tahunFormat = tahunAngka;

        let formatTanggal =
            tanggalAngka + "/" + bulanFormat + "/" + tahunFormat;

        return formatTanggal;
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

    const optionSignatureTemplate = (item) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center items-center gap-3">
                <img
                    className="w-[6rem] shadow-2 flex-shrink-0 border-round"
                    src={"/storage/" + item.image}
                    alt={item.name}
                />
                <div className="flex-1 flex flex-col gap-2 xl:mr-8">
                    <span className="font-bold">{item.name}</span>
                    <div className="flex align-items-center gap-2">
                        <span>{item.position}</span>
                    </div>
                </div>
                {/* <span className="font-bold text-900">${item.price}</span> */}
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

    const header = (
        <div className="flex flex-row justify-left gap-2 align-items-center items-end">
            <div className="w-[30%]">
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
    );

    // fungsi toast
    const showSuccess = (type) => {
        toast.current.show({
            severity: "success",
            summary: "Success",
            detail: `${type} data berhasil`,
            life: 3000,
        });
    };

    const showError = (type) => {
        toast.current.show({
            severity: "error",
            summary: "Error",
            detail: `${type} data gagal`,
            life: 3000,
        });
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();

        post("/stpd", {
            onSuccess: () => {
                showSuccess("Tambah");
                window.location = "/stpd";
                // reset("name", "category", "price", "unit", "description");
            },

            onError: () => {
                showError("Tambah");
            },
        });
    };

    return (
        <>
            <Head title="Surat Keterangan Perjalanan Dinas"></Head>
            <Toast ref={toast} />
            <BlockUI blocked={blocked} template={LoadingDocument}>
                <div className="h-screen max-h-screen overflow-y-hidden">
                    <div className="flex flex-col h-screen max-h-screen overflow-hidden md:flex-row z-40 relative gap-5">
                        <div className="md:w-[35%] overflow-y-auto h-screen max-h-screen p-5">
                            <Card>
                                <div className="flex justify-between items-center mb-4">
                                    <h1 className="font-bold text-xl">
                                        Surat Keterangan Perjalanan Dinas
                                    </h1>
                                    <Link href="/stpd">
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
                                                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                                            />
                                        </svg>
                                    </Link>
                                </div>
                                <div className="flex flex-col">
                                    <Button
                                        label="Tambah karyawan"
                                        icon="pi pi-external-link"
                                        onClick={() => setDialogVisible(true)}
                                    />

                                    <div className="flex flex-col mt-3">
                                        <InputText
                                            value={data.code}
                                            onChange={(e) =>
                                                setData("code", e.target.value)
                                            }
                                            className="dark:bg-gray-300"
                                            id="code"
                                            aria-describedby="code-help"
                                            hidden
                                        />
                                    </div>

                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="lembaga">
                                            Lembaga *
                                        </label>
                                        <InputText
                                            value={data.partner.name}
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animatePartnerNameRef
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animatePartnerNameRef
                                                );
                                            }}
                                            onClick={() => {
                                                setDialogInstitutionVisible(
                                                    true
                                                );
                                            }}
                                            placeholder="Pilih lembaga"
                                            className="dark:bg-gray-300 cursor-pointer"
                                            id="partner"
                                            aria-describedby="partner-help"
                                        />
                                        <InputError
                                            message={errors["partner.name"]}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="province">
                                            Provinsi *
                                        </label>

                                        <Dropdown
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
                                            dataKey="code"
                                            options={provinces}
                                            optionLabel="name"
                                            placeholder="Pilih Provinsi"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={optionTemplate}
                                            className="w-full md:w-14rem"
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animatePartnerProvinceRef
                                                );
                                            }}
                                            onShow={() => {
                                                triggerInputFocus(
                                                    animatePartnerProvinceRef
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animatePartnerProvinceRef
                                                );
                                            }}
                                        />
                                    </div>

                                    <div className="flex flex-col mt-3">
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
                                                setData("partner", {
                                                    ...data.partner,
                                                    regency: JSON.stringify(
                                                        e.target.value
                                                    ),
                                                });
                                            }}
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animatePartnerRegencyRef
                                                );
                                            }}
                                            onShow={() => {
                                                triggerInputFocus(
                                                    animatePartnerRegencyRef
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animatePartnerRegencyRef
                                                );
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
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="register_date">
                                            Tanggal Berangkat *
                                        </label>
                                        <Calendar
                                            value={
                                                data.departure_date
                                                    ? new Date(
                                                          data.departure_date
                                                      )
                                                    : null
                                            }
                                            style={{ height: "35px" }}
                                            onChange={(e) => {
                                                const formattedDate = new Date(
                                                    e.target.value
                                                )
                                                    .toISOString()
                                                    .split("T")[0];
                                                setData(
                                                    "departure_date",
                                                    e.target.value
                                                );
                                            }}
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateDepartureDateRef
                                                );
                                            }}
                                            onShow={() => {
                                                triggerInputFocus(
                                                    animateDepartureDateRef
                                                );
                                            }}
                                            onHide={() => {
                                                stopAnimateInputFocus(
                                                    animateDepartureDateRef
                                                );
                                            }}
                                            showIcon
                                            dateFormat="dd/mm/yy"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="register_date">
                                            Tanggal Kembali *
                                        </label>
                                        <Calendar
                                            value={
                                                data.return_date
                                                    ? new Date(data.return_date)
                                                    : null
                                            }
                                            style={{ height: "35px" }}
                                            onChange={(e) => {
                                                const formattedDate = new Date(
                                                    e.target.value
                                                )
                                                    .toISOString()
                                                    .split("T")[0];
                                                setData(
                                                    "return_date",
                                                    e.target.value
                                                );
                                            }}
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateReturnDateRef
                                                );
                                            }}
                                            onShow={() => {
                                                triggerInputFocus(
                                                    animateReturnDateRef
                                                );
                                            }}
                                            onHide={() => {
                                                stopAnimateInputFocus(
                                                    animateReturnDateRef
                                                );
                                            }}
                                            showIcon
                                            dateFormat="dd/mm/yy"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="transportation">
                                            Kendaraan *
                                        </label>
                                        <InputText
                                            value={data.transportation}
                                            onChange={(e) =>
                                                setData(
                                                    "transportation",
                                                    e.target.value
                                                )
                                            }
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateTransportationRef
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateTransportationRef
                                                );
                                            }}
                                            className="dark:bg-gray-300"
                                            id="transportation"
                                            aria-describedby="transportation-help"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="accomodation">
                                            Akomodasi *
                                        </label>
                                        <InputText
                                            value={data.accommodation}
                                            onChange={(e) =>
                                                setData(
                                                    "accommodation",
                                                    e.target.value
                                                )
                                            }
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateAccomodationRef
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateAccomodationRef
                                                );
                                            }}
                                            className="dark:bg-gray-300"
                                            id="accommodation"
                                            aria-describedby="accommodation-help"
                                        />
                                    </div>

                                    <div className="flex-flex-col mt-3">
                                        <form onSubmit={handleSubmitForm}>
                                            <Button className="mx-auto justify-center block">
                                                Submit
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <Dialog
                            header="Karyawan"
                            visible={dialogVisible}
                            style={{ width: "75vw" }}
                            maximizable
                            modal
                            contentStyle={{ height: "550px" }}
                            onHide={() => setDialogVisible(false)}
                            footer={dialogFooterTemplate}
                        >
                            <DataTable
                                value={users}
                                paginator
                                filters={filters}
                                rows={5}
                                header={header}
                                scrollable
                                scrollHeight="flex"
                                tableStyle={{ minWidth: "50rem" }}
                                selectionMode={rowClick ? null : "checkbox"}
                                selection={data.employees}
                                onSelectionChange={(e) => {
                                    setData("employees", e.value);
                                }}
                                dataKey="id"
                            >
                                <Column
                                    selectionMode="multiple"
                                    headerStyle={{ width: "3rem" }}
                                ></Column>
                                <Column field="name" header="Name"></Column>
                                <Column
                                    filter
                                    body={(rowData) => {
                                        return <span>{rowData.position}</span>;
                                    }}
                                    header="Jabatan"
                                    field="position"
                                ></Column>
                            </DataTable>
                        </Dialog>

                        <div className="md:w-[65%] hidden md:block h-screen text-sm max-h-screen overflow-y-auto p-5">
                            <header>
                                <div className="flex justify-between items-center">
                                    <div className="w-full">
                                        <img
                                            src="/assets/img/cazh.png"
                                            alt=""
                                            className="float-left w-1/3 h-1/3"
                                        />
                                    </div>
                                    <div className="w-full text-right text-xs">
                                        <h2 className="font-bold">
                                            PT CAZH TEKNOLOGI INOVASI
                                        </h2>
                                        <p>
                                            Bonavida Park D1, Jl. Raya
                                            Karanggintung
                                        </p>
                                        <p>
                                            Kec. Sumbang, Kab. Banyumas,Jawa
                                            Tengah 53183
                                        </p>

                                        <p>
                                            hello@cards.co.id |
                                            https://cards.co.id
                                        </p>
                                    </div>
                                </div>
                            </header>

                            <div className="text-center mt-5">
                                <h1 className="font-bold underline mx-auto">
                                    SURAT TUGAS PERJALANAN DINAS
                                </h1>
                                <p className="">Nomor : 001/CAZH-SPJ/X/2023</p>
                            </div>

                            <div className="w-full mt-5">
                                <table className="w-full">
                                    <thead className="bg-blue-100  dark:text-gray-600 text-left">
                                        <th className="px-2 py-1">No</th>
                                        <th className="px-2 py-1">
                                            Nama Karyawan
                                        </th>
                                        <th className="px-2 py-1">Jabatan</th>
                                    </thead>
                                    <tbody>
                                        {data.employees?.length == 0 && (
                                            <tr className="text-center">
                                                <td colSpan={3}>
                                                    Karyawan belum ditambah
                                                </td>
                                            </tr>
                                        )}
                                        {data.employees?.map((data, i) => {
                                            return (
                                                <tr key={data.name + i}>
                                                    <td className="px-2 py-1">
                                                        {++i}
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        {data.name}
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        {data.position}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <p className="mt-10">
                                Untuk melaksanakan tugas melakukan perjalanan
                                dinas dengan ketentuan sebagai berikut:
                            </p>

                            <div className="w-full mt-5">
                                <table className="w-full">
                                    <tbody>
                                        <tr>
                                            <td className="text-gray-700 dark:text-gray-300 w-1/6">
                                                Lembaga Tujuan
                                            </td>
                                            <td className="text-gray-700 dark:text-gray-300 w-[1%]">
                                                :
                                            </td>
                                            <td className="text-gray-700 dark:text-gray-300 font-bold w-7/12">
                                                {data.partner.name ??
                                                    "{{Lembaga}}"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-gray-700 dark:text-gray-300 w-1/6">
                                                Lokasi
                                            </td>
                                            <td className="text-gray-700 dark:text-gray-300 w-[1%]">
                                                :
                                            </td>
                                            <td className="text-gray-700 dark:text-gray-300 font-bold w-7/12">
                                                <span
                                                    ref={
                                                        animatePartnerRegencyRef
                                                    }
                                                >
                                                    {data.partner.regency
                                                        ? upperCaseEachWord(
                                                              JSON.parse(
                                                                  data.partner
                                                                      .regency
                                                              ).name
                                                          )
                                                        : "{{Kab/Kota}}"}
                                                </span>
                                                {", "}
                                                <span
                                                    ref={
                                                        animatePartnerProvinceRef
                                                    }
                                                >
                                                    {data.partner.province
                                                        ? upperCaseEachWord(
                                                              JSON.parse(
                                                                  data.partner
                                                                      .province
                                                              ).name
                                                          )
                                                        : "{{Provinsi}}"}
                                                </span>
                                            </td>
                                        </tr>
                                        <br />
                                        <tr>
                                            <td className="text-gray-700 dark:text-gray-300 w-1/6">
                                                Berangkat
                                            </td>
                                            <td className="text-gray-700 dark:text-gray-300 w-[1%]">
                                                :
                                            </td>
                                            <td
                                                ref={animateDepartureDateRef}
                                                className="text-gray-700 dark:text-gray-300 font-bold w-7/12"
                                            >
                                                {ubahFormatTanggal(
                                                    data.departure_date
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-gray-700 dark:text-gray-300 w-1/6">
                                                Kembali
                                            </td>
                                            <td className="text-gray-700 dark:text-gray-300 w-[1%]">
                                                :
                                            </td>
                                            <td
                                                ref={animateReturnDateRef}
                                                className="text-gray-700 dark:text-gray-300 font-bold w-7/12"
                                            >
                                                {ubahFormatTanggal(
                                                    data.return_date
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-gray-700 dark:text-gray-300 w-1/6">
                                                Kendaraan
                                            </td>
                                            <td className="text-gray-700 dark:text-gray-300 w-[1%]">
                                                :
                                            </td>
                                            <td
                                                ref={animateTransportationRef}
                                                className="text-gray-700 dark:text-gray-300 font-bold w-7/12"
                                            >
                                                {data.transportation ??
                                                    "{{Kendaraan}}"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-gray-700 dark:text-gray-300 w-1/6">
                                                Akomodasi
                                            </td>
                                            <td className="text-gray-700 dark:text-gray-300 w-[1%]">
                                                :
                                            </td>
                                            <td
                                                ref={animateAccomodationRef}
                                                className="text-gray-700 dark:text-gray-300 font-bold w-7/12"
                                            >
                                                {data.accommodation ??
                                                    "{{Akomodasi}}"}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="w-full mt-5 text-justify">
                                Semua biaya dalam perjalanan dinas, konsumsi,
                                serta akomodasi dalam rangka perjalanan dinas
                                ini akan menjadi tanggung jawab PT Cazh
                                Teknologi Inovasi sesuai peraturan perjalanan
                                dinas yang berlaku.
                            </div>

                            <div className="w-full mt-5 text-justify">
                                Demikian surat ini dibuat agar dapat
                                dilaksanakan dengan baik dan penuh tanggung
                                jawab. Kepada semua pihak yang terlibat dimohon
                                kerja sama yang baik agar perjalanan dinas ini
                                dapat terlaksana dengan lancar.
                            </div>

                            <div className="flex flex-col mt-5 justify-start w-[30%]">
                                <p>Purwokerto, {new Date().getFullYear()}</p>
                                <div className="h-[100px] w-[170px] py-2">
                                    <img
                                        src={data.signature.image}
                                        alt=""
                                        className="w-full h-full object-fill"
                                    />
                                </div>
                                <p>{data.signature.name}</p>
                                <p>{data.signature.position}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </BlockUI>

            <DialogInstitution
                dialogInstitutionVisible={dialogInstitutionVisible}
                setDialogInstitutionVisible={setDialogInstitutionVisible}
                filters={filters}
                setFilters={setFilters}
                isLoadingData={isLoadingData}
                setIsLoadingData={setIsLoadingData}
                leads={leads}
                setLeads={setLeads}
                partners={partners}
                setPartners={setPartners}
                data={data}
                setData={setData}
                setProvinceName={setProvinceName}
                reset={reset}
            />
        </>
    );
};

export default Create;
