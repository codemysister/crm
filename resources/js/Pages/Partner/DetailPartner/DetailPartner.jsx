import React, { useState, useEffect, useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { Badge } from "primereact/badge";
import { Menu } from "primereact/menu";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useForm } from "@inertiajs/react";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { ProgressSpinner } from "primereact/progressspinner";
import { Image } from "primereact/image";
import DetailPIC from "./DetailPIC";
import DetailBank from "./DetailBank";
import DetailSubscription from "./DetailSubscription";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
registerPlugin(FilePondPluginFileValidateSize);
import DetailPriceList from "./DetailPriceList";
import InputError from "@/Components/InputError";
import { InputMask } from "primereact/inputmask";
import DetailStatusLog from "./DetailStatusLog";
import DetailLog from "./DetailLog";
import { upperCaseEachWord } from "@/Utils/UppercaseEachWord";

const DetailPartner = ({
    partners,
    detailPartner,
    handleSelectedDetailPartner,
    sales,
    referrals,
    status,
    account_managers,
    showSuccess,
    showError,
    provinces,
    regencys,
    subdistricts,
    setProvinceName,
    setRegencyName,
    isLoading,
}) => {
    const [partner, setPartner] = useState(detailPartner);
    const [activeMenu, setActiveMenu] = useState("lembaga");
    const [modalStatusIsVisible, setModalStatusIsVisible] = useState(false);
    const [modalEditPartnersIsVisible, setModalEditPartnersIsVisible] =
        useState(false);

    useEffect(() => {
        setPartner((prev) => (prev = detailPartner));
    }, [detailPartner]);

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
        sales: {},
        account_manager: {
            name: null,
            id: null,
        },
        referral: {},
        name: "",
        logo: null,
        npwp: null,
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
    });

    let menuDetailPartnerItems = [
        {
            label: "Lembaga",
            className: `${activeMenu == "lembaga" ? "p-menuitem-active" : ""}`,
            command: () => {
                setActiveMenu((prev) => (prev = "lembaga"));
            },
        },
        {
            label: "PIC",
            className: `${activeMenu == "pic" ? "p-menuitem-active" : ""}`,
            command: () => {
                setActiveMenu((prev) => (prev = "pic"));
            },
        },
        {
            label: "Bank",
            className: `${activeMenu == "bank" ? "p-menuitem-active" : ""}`,
            command: () => {
                setActiveMenu((prev) => (prev = "bank"));
            },
        },
        {
            label: "Langganan",
            className: `${
                activeMenu == "langganan" ? "p-menuitem-active" : ""
            }`,
            command: () => {
                setActiveMenu((prev) => (prev = "langganan"));
            },
        },

        {
            label: "Harga",
            className: `${
                activeMenu == "price_list" ? "p-menuitem-active" : ""
            }`,
            command: () => {
                setActiveMenu((prev) => (prev = "price_list"));
            },
        },
        {
            label: "Log",
            className: `${activeMenu == "log" ? "p-menuitem-active" : ""}`,
            command: () => {
                setActiveMenu((prev) => (prev = "log"));
            },
        },
        {
            label: "Status Log",
            className: `${
                activeMenu == "log_status" ? "p-menuitem-active" : ""
            }`,
            command: () => {
                setActiveMenu((prev) => (prev = "log_status"));
            },
        },
    ];

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

    const option_period_subscription = [
        { name: "kartu/bulan" },
        { name: "kartu/tahun" },
        { name: "lembaga/bulan" },
        { name: "lembaga/tahun" },
    ];

    const optionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const title = () => {
        return (
            <>
                <div className="flex flex-col lg:flex-row w-full gap-5 items-center ">
                    <Dropdown
                        optionLabel="name"
                        dataKey="id"
                        value={partner}
                        onChange={(e) =>
                            handleSelectedDetailPartner(e.target.value)
                        }
                        options={partners}
                        placeholder="Pilih Partner"
                        filter
                        valueTemplate={selectedOptionTemplate}
                        itemTemplate={optionTemplate}
                        style={{ color: "#CBD5E1" }}
                        className="w-full md:min-w-[28%] md:w-[28%] md:max-w-[28%] flex justify-center rounded-lg shadow-md border-none dark:text-slate-300 dark:bg-slate-700"
                    />
                    <div className="text-center w-full flex items-center gap-2 justify-center">
                        {partner?.logo ? (
                            <Image
                                src={`storage/${partner.logo}`}
                                alt="Image"
                                width="40"
                                preview
                            />
                        ) : null}
                        <h1 className="dark:text-white">{partner?.name}</h1>
                    </div>
                </div>
            </>
        );
    };

    const handleEditPartner = (partner) => {
        setData((prevData) => ({
            ...prevData,
            uuid: partner.uuid,
            name: partner.name,
            npwp: partner.npwp,
            password: partner.password,
            logo: partner.logo,
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
            address: partner.address,
            status: partner.status,
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

    const handleSubmitForm = (e) => {
        e.preventDefault();

        post("api/partner/detail/" + data.uuid, {
            onSuccess: () => {
                showSuccess("Update");
                setModalEditPartnersIsVisible((prev) => false);
                handleSelectedDetailPartner(data);
                // reset();
            },
            onError: () => {
                showError("Update");
            },
        });
    };

    const monitoringDateCalculator = async (date) => {
        const options = {
            method: "GET",
            url: "https://business-days-work-days-calculator.p.rapidapi.com/api/v1/get_result",
            params: {
                state: "ID",
                work_days: "58",
                start_date: date,
                options: "0",
            },
            headers: {
                "X-RapidAPI-Key":
                    "86befdd570mshba24e2554cfa5cep1506c3jsnc4442d5a518e",
                "X-RapidAPI-Host":
                    "business-days-work-days-calculator.p.rapidapi.com",
            },
        };

        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            return new Date(date).setMonth(
                new Date(date).getMonth() + 3,
                new Date(date).getDate() - 1
            );
        }
    };

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

    return (
        <>
            <Card title={title} className="mt-5 mx-auto p-3 rounded-lg">
                <div className="flex flex-col lg:flex-row gap-5 min-h-[300px]">
                    <div className="w-full lg:w-[40%]">
                        <Menu
                            model={menuDetailPartnerItems}
                            className="w-full rounded-lg dark:text-slate-300 dark:bg-slate-700"
                        />
                    </div>
                    <div class="w-full rounded-lg bg-gray-50/50 dark:text-slate-300 dark:bg-slate-700 overflow-y-auto min-h-[300px] max-h-[300px] h-full  p-4">
                        {partner ? (
                            <>
                                {isLoading ? (
                                    <div class="w-full h-full min-h-[300px] flex items-center justify-center">
                                        <ProgressSpinner
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                            }}
                                            strokeWidth="8"
                                            fill="var(--surface-ground)"
                                            animationDuration=".5s"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        {activeMenu === "lembaga" && (
                                            <table class="w-full">
                                                <tr class="border-b">
                                                    <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                                        Nama
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-[2%]">
                                                        :
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-7/12">
                                                        {partner.name}
                                                    </td>
                                                </tr>
                                                <tr class="border-b">
                                                    <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                                        Status
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-[2%]">
                                                        :
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-7/12">
                                                        <Badge
                                                            value={
                                                                partner.status
                                                                    .name
                                                            }
                                                            className="text-white"
                                                            style={{
                                                                backgroundColor:
                                                                    "#" +
                                                                    partner
                                                                        .status
                                                                        .color,
                                                            }}
                                                        ></Badge>
                                                    </td>
                                                </tr>
                                                <tr class="border-b">
                                                    <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                                        NPWP
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-[2%]">
                                                        :
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-7/12">
                                                        {partner.npwp
                                                            ? partner.npwp
                                                            : "-"}
                                                    </td>
                                                </tr>
                                                <tr class="border-b">
                                                    <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                                        Nomor Telepon
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-[2%]">
                                                        :
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-7/12">
                                                        {partner.phone_number
                                                            ? partner.phone_number
                                                            : "-"}
                                                    </td>
                                                </tr>
                                                <tr class="border-b">
                                                    <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                                        Provinsi
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-[2%]">
                                                        :
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-7/12">
                                                        {partner.province
                                                            ? upperCaseEachWord(
                                                                  JSON.parse(
                                                                      partner.province
                                                                  ).name
                                                              )
                                                            : "-"}
                                                    </td>
                                                </tr>
                                                <tr class="border-b">
                                                    <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                                        Kabupaten
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-[2%]">
                                                        :
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-7/12">
                                                        {partner.regency
                                                            ? upperCaseEachWord(
                                                                  JSON.parse(
                                                                      partner.regency
                                                                  ).name
                                                              )
                                                            : "-"}
                                                    </td>
                                                </tr>
                                                <tr class="border-b">
                                                    <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                                        Kecamatan
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-[2%]">
                                                        :
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-7/12">
                                                        {partner.subdistrict
                                                            ? JSON.parse(
                                                                  partner.subdistrict
                                                              ).name
                                                            : "-"}
                                                    </td>
                                                </tr>
                                                <tr class="border-b">
                                                    <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                                        Alamat
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-[2%]">
                                                        :
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-7/12">
                                                        {partner.address
                                                            ? partner.address
                                                            : "-"}
                                                    </td>
                                                </tr>
                                                <tr class="border-b">
                                                    <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                                        Sales
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-[2%]">
                                                        :
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-7/12">
                                                        {partner.sales?.name
                                                            ? partner.sales.name
                                                            : "-"}
                                                    </td>
                                                </tr>
                                                <tr class="border-b">
                                                    <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                                        Account Manager
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-[2%]">
                                                        :
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-7/12">
                                                        {partner.account_manager !==
                                                        null
                                                            ? partner
                                                                  .account_manager
                                                                  .name
                                                            : "-"}
                                                    </td>
                                                </tr>
                                                <tr class="border-b">
                                                    <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                                        Referral
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-[2%]">
                                                        :
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-7/12">
                                                        {partner.referral !==
                                                        null
                                                            ? partner.referral
                                                                  .name
                                                            : "-"}
                                                    </td>
                                                </tr>
                                                <tr class="border-b">
                                                    <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                                        Tanggal Onboarding
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-[2%]">
                                                        :
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-7/12">
                                                        {partner.onboarding_date
                                                            ? new Date(
                                                                  partner.onboarding_date
                                                              ).toLocaleDateString(
                                                                  "id"
                                                              )
                                                            : "-"}
                                                    </td>
                                                </tr>
                                                <tr class="border-b">
                                                    <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                                        Umur Onboarding
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-[2%]">
                                                        :
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-7/12">
                                                        {partner.onboarding_age
                                                            ? partner.onboarding_age
                                                            : "-"}
                                                    </td>
                                                </tr>
                                                <tr class="border-b">
                                                    <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                                        Tanggal Live
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-[2%]">
                                                        :
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-7/12">
                                                        {partner.live_date
                                                            ? new Date(
                                                                  partner.live_date
                                                              ).toLocaleDateString(
                                                                  "id"
                                                              )
                                                            : "-"}
                                                    </td>
                                                </tr>
                                                <tr class="border-b">
                                                    <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                                        Umur Live
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-[2%]">
                                                        :
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-7/12">
                                                        {partner.live_age
                                                            ? partner.live_age
                                                            : "-"}
                                                    </td>
                                                </tr>
                                                <tr class="border-b">
                                                    <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                                        Tanggal Monitoring
                                                        setelah 3 bulan live
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-[2%]">
                                                        :
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-7/12">
                                                        {partner.monitoring_date_after_3_month_live
                                                            ? new Date(
                                                                  partner.monitoring_date_after_3_month_live
                                                              ).toLocaleDateString(
                                                                  "id"
                                                              )
                                                            : "-"}
                                                    </td>
                                                </tr>

                                                <tr class="border-b">
                                                    <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                                        Aksi
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-[2%]">
                                                        :
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-7/12">
                                                        <Button
                                                            label="edit"
                                                            className="p-0 underline bg-transparent text-blue-700 text-left"
                                                            onClick={() =>
                                                                handleEditPartner(
                                                                    partner
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            </table>
                                        )}

                                        {activeMenu === "bank" && (
                                            <DetailBank
                                                partner={partner}
                                                partners={partners}
                                                handleSelectedDetailPartner={
                                                    handleSelectedDetailPartner
                                                }
                                                showSuccess={showSuccess}
                                                showError={showError}
                                            />
                                        )}

                                        {activeMenu === "pic" && (
                                            <DetailPIC
                                                partner={partner}
                                                partners={partners}
                                                handleSelectedDetailPartner={
                                                    handleSelectedDetailPartner
                                                }
                                                showSuccess={showSuccess}
                                                showError={showError}
                                            />
                                        )}

                                        {activeMenu === "langganan" && (
                                            <DetailSubscription
                                                partner={partner}
                                                partners={partners}
                                                handleSelectedDetailPartner={
                                                    handleSelectedDetailPartner
                                                }
                                                showSuccess={showSuccess}
                                                showError={showError}
                                            />
                                        )}

                                        {activeMenu === "price_list" && (
                                            <DetailPriceList
                                                partner={partner}
                                                partners={partners}
                                                handleSelectedDetailPartner={
                                                    handleSelectedDetailPartner
                                                }
                                                showSuccess={showSuccess}
                                                showError={showError}
                                            />
                                        )}

                                        {activeMenu === "log" && (
                                            <DetailLog
                                                partner={partner}
                                                handleSelectedDetailPartner={
                                                    handleSelectedDetailPartner
                                                }
                                            />
                                        )}

                                        {activeMenu === "log_status" && (
                                            <DetailStatusLog
                                                partner={partner}
                                                handleSelectedDetailPartner={
                                                    handleSelectedDetailPartner
                                                }
                                            />
                                        )}
                                    </>
                                )}
                            </>
                        ) : (
                            <div class="w-full h-full min-h-[300px] flex items-center justify-center">
                                <p class="text-center">
                                    Pilih partner terlebih dahulu
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Modal edit partner */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Partner"
                    headerClassName="dark:glass shadow-md z-20 dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName=" dark:glass dark:text-white"
                    visible={modalEditPartnersIsVisible}
                    onHide={() => setModalEditPartnersIsVisible(false)}
                >
                    <form
                        onSubmit={(e) => handleSubmitForm(e)}
                        enctype="multipart/form-data"
                    >
                        <div className="flex flex-col justify-around gap-4 mt-1">
                            <div className="flex flex-col">
                                <label htmlFor="name">Nama *</label>
                                <InputText
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="name"
                                    required
                                    aria-describedby="name-help"
                                />
                                <InputError
                                    message={errors["name"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="name">Logo</label>
                                <div className="App">
                                    {data.logo !== null &&
                                    typeof data.logo == "string" ? (
                                        <>
                                            <FilePond
                                                files={"storage/" + data.logo}
                                                onaddfile={(
                                                    error,
                                                    fileItems
                                                ) => {
                                                    setData(
                                                        "logo",
                                                        fileItems.file
                                                    );
                                                }}
                                                onremovefile={() => {
                                                    setData("logo", null);
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
                                                    setData(
                                                        "logo",
                                                        fileItems.file
                                                    );
                                                }}
                                                onremovefile={() => {
                                                    setData("logo", null);
                                                }}
                                                maxFileSize="2mb"
                                                labelMaxFileSizeExceeded="File terlalu besar"
                                                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                            />
                                        </>
                                    )}
                                </div>
                                <InputError
                                    message={errors["logo"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="name">NPWP</label>
                                <InputMask
                                    keyfilter="int"
                                    value={data.npwp}
                                    onChange={(e) =>
                                        setData("npwp", e.target.value)
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
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="password"
                                    aria-describedby="password-help"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="name">Nomor Telepon</label>
                                <InputText
                                    keyfilter="int"
                                    value={data.phone_number}
                                    onChange={(e) =>
                                        setData("phone_number", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="phone_number"
                                    aria-describedby="phone_number-help"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="sales">Sales</label>
                                <Dropdown
                                    value={data.sales}
                                    onChange={(e) =>
                                        setData("sales", e.target.value)
                                    }
                                    options={sales}
                                    optionLabel="name"
                                    placeholder="Pilih Sales"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="account_manager">
                                    Account Manager (AM)
                                </label>
                                <Dropdown
                                    value={data.account_manager}
                                    onChange={(e) =>
                                        setData(
                                            "account_manager",
                                            e.target.value
                                        )
                                    }
                                    options={account_managers}
                                    optionLabel="name"
                                    placeholder="Pilih Account Manager (AM)"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="referral">Referral</label>
                                <Dropdown
                                    dataKey="id"
                                    value={data.referral}
                                    onChange={(e) =>
                                        setData("referral", e.target.value)
                                    }
                                    options={referrals}
                                    optionLabel="name"
                                    placeholder="Pilih Referral"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="province">Provinsi</label>
                                <Dropdown
                                    dataKey="code"
                                    value={
                                        data.province
                                            ? JSON.parse(data.province)
                                            : null
                                    }
                                    onChange={(e) => {
                                        setProvinceName(
                                            (prev) =>
                                                (prev = e.target.value.name)
                                        );
                                        setData(
                                            "province",
                                            JSON.stringify(e.target.value)
                                        );
                                    }}
                                    options={provinces}
                                    optionLabel="name"
                                    placeholder="Pilih Provinsi"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                                <InputError
                                    message={errors["province"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="regency">Kabupaten</label>
                                <Dropdown
                                    dataKey="code"
                                    value={
                                        data.regency
                                            ? JSON.parse(data.regency)
                                            : null
                                    }
                                    onChange={(e) => {
                                        setRegencyName(
                                            (prev) =>
                                                (prev = e.target.value.name)
                                        );
                                        setData(
                                            "regency",
                                            JSON.stringify(e.target.value)
                                        );
                                    }}
                                    options={regencys}
                                    optionLabel="name"
                                    placeholder="Pilih Kabupaten"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                                <InputError
                                    message={errors["regency"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="subdistrict">Kecamatan</label>
                                <Dropdown
                                    dataKey="code"
                                    value={
                                        data.subdistrict
                                            ? JSON.parse(data.subdistrict)
                                            : null
                                    }
                                    onChange={(e) =>
                                        setData(
                                            "subdistrict",
                                            JSON.stringify(e.target.value)
                                        )
                                    }
                                    options={subdistricts}
                                    optionLabel="name"
                                    placeholder="Pilih Kecamatan"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
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
                                        data.onboarding_date
                                            ? new Date(data.onboarding_date)
                                            : null
                                    }
                                    style={{ height: "35px" }}
                                    onChange={(e) => {
                                        setData(
                                            "onboarding_date",
                                            e.target.value
                                        );
                                    }}
                                    showIcon
                                    dateFormat="dd/mm/yy"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="live_date">Tanggal Live</label>
                                <Calendar
                                    value={
                                        data.live_date
                                            ? new Date(data.live_date)
                                            : null
                                    }
                                    style={{ height: "35px" }}
                                    onChange={(e) => {
                                        const onboarding_age = Math.ceil(
                                            (e.target.value -
                                                new Date(
                                                    data.onboarding_date
                                                )) /
                                                (1000 * 60 * 60 * 24)
                                        );

                                        const live_age = Math.ceil(
                                            (new Date() - e.target.value) /
                                                (1000 * 60 * 60 * 24)
                                        );

                                        let startDate = e.target.value;
                                        let endDate = new Date(
                                            new Date().setDate(
                                                new Date().getDate() + 90
                                            )
                                        );

                                        let workDayCount =
                                            calculateWorkdays(
                                                startDate,
                                                endDate
                                            ) - 1;

                                        const monitoring_date_after_3_month_live =
                                            new Date(e.target.value).setDate(
                                                new Date(
                                                    e.target.value
                                                ).getDate() + workDayCount
                                            );

                                        setData({
                                            ...data,
                                            live_date: e.target.value,
                                            onboarding_age: onboarding_age,
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
                                    value={data.onboarding_age}
                                    onChange={(e) =>
                                        setData(
                                            "onboarding_age",
                                            e.target.value
                                        )
                                    }
                                    className="dark:bg-gray-300"
                                    id="onboarding_age"
                                    aria-describedby="onboarding_age-help"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="name">Umur Live (hari)</label>
                                <InputText
                                    value={data.live_age}
                                    onChange={(e) =>
                                        setData("live_age", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="live_age"
                                    aria-describedby="live_age-help"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="live_date">
                                    Tanggal Monitoring 3 Bulan After Live
                                </label>
                                <Calendar
                                    value={
                                        data.monitoring_date_after_3_month_live
                                            ? new Date(
                                                  data.monitoring_date_after_3_month_live
                                              )
                                            : null
                                    }
                                    style={{ height: "35px" }}
                                    onChange={(e) => {
                                        setData(
                                            "monitoring_date_after_3_month_live",
                                            e.target.value
                                        );
                                    }}
                                    showIcon
                                    dateFormat="dd/mm/yy"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="address">Alamat</label>
                                <InputTextarea
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
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
                                    value={data.period}
                                    onChange={(e) => {
                                        setData("period", e.target.value);
                                    }}
                                    options={option_period_subscription}
                                    optionLabel="name"
                                    placeholder="Langganan Per-"
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    editable
                                    className={`w-full md:w-14rem 
                                        `}
                                />
                                <InputError
                                    message={errors["partner.period"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="payment_metode">
                                    Metode Pembayaran
                                </label>
                                <Dropdown
                                    value={data.payment_metode}
                                    onChange={(e) => {
                                        setData(
                                            "payment_metode",
                                            e.target.value
                                        );
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
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                    editable
                                />
                                <InputError
                                    message={errors["payment_metode"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="status">Status *</label>
                                <Dropdown
                                    value={data.status}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            status: e.target.value,
                                            note_status: null,
                                        });
                                        setModalStatusIsVisible(
                                            (prev) => (prev = true)
                                        );
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
                            value={data.note_status}
                            onChange={(e) =>
                                setData("note_status", e.target.value)
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
                                data.note_status == null ||
                                data.note_status == ""
                            }
                            onClick={() => setModalStatusIsVisible(false)}
                            className="bg-purple-600 text-sm shadow-md rounded-lg"
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default DetailPartner;
