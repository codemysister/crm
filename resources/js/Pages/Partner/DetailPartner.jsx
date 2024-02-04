import React, { useState, useEffect, useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { Badge } from "primereact/badge";
import { Menu } from "primereact/menu";
import { Card } from "primereact/card";

const DetailPartner = ({ partners, detailPartner }) => {
    const [partner, setPartner] = useState(detailPartner);
    const [activeMenu, setActiveMenu] = useState("lembaga");

    const getSelectedDetailPartner = async (partner) => {
        let response = await fetch("/partners/" + partner.uuid);
        let data = await response.json();
        setPartner((prev) => (prev = data));
    };

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

    const optionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };
    return (
        <>
            <Dropdown
                optionLabel="name"
                value={partner}
                onChange={(e) => getSelectedDetailPartner(e.target.value)}
                options={partners}
                placeholder="Pilih Partner"
                filter
                valueTemplate={selectedOptionTemplate}
                itemTemplate={optionTemplate}
                className="w-full mt-5 md:w-[40%] mx-auto flex justify-center rounded-lg shadow-md border-none"
            />

            {partner && (
                <Card
                    title={partner.name}
                    className="mt-5 mx-auto p-3 w-[85%] rounded-lg"
                >
                    <div className="flex gap-5 max-h-[400px]">
                        <div className="w-[40%]">
                            <Menu
                                model={menuDetailPartnerItems}
                                className="w-full rounded-lg"
                            />
                        </div>

                        <div class="w-full rounded-lg bg-gray-50/50 border overflow-y-auto max-h-full p-4">
                            {activeMenu === "lembaga" && (
                                <table class="w-full">
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">
                                            Nama
                                        </td>
                                        <td class="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td class="text-gray-700 text-base w-7/12">
                                            {partner.name}
                                        </td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">
                                            Sales
                                        </td>
                                        <td class="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td class="text-gray-700 text-base w-7/12">
                                            {partner.sales.name}
                                        </td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">
                                            Account Manager
                                        </td>
                                        <td class="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td class="text-gray-700 text-base w-7/12">
                                            {partner.account_manager.name}
                                        </td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">
                                            Tanggal Daftar
                                        </td>
                                        <td class="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td class="text-gray-700 text-base w-7/12">
                                            {new Date(
                                                partner.register_date
                                            ).toLocaleDateString("id")}
                                        </td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">
                                            Tanggal Live
                                        </td>
                                        <td class="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td class="text-gray-700 text-base w-7/12">
                                            {new Date(
                                                partner.live_date
                                            ).toLocaleDateString("id")}
                                        </td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">
                                            Address
                                        </td>
                                        <td class="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td class="text-gray-700 text-base w-7/12">
                                            {partner.address}
                                        </td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">
                                            Status
                                        </td>
                                        <td class="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td class="text-gray-700 text-base w-7/12">
                                            <Badge
                                                value={partner.status}
                                                className="text-white"
                                                severity={
                                                    partner.status == "Aktif"
                                                        ? "success"
                                                        : null ||
                                                          partner.status ==
                                                              "CLBK"
                                                        ? "info"
                                                        : null ||
                                                          partner.status ==
                                                              "Proses"
                                                        ? "warning"
                                                        : null ||
                                                          partner.status ==
                                                              "Non Aktif"
                                                        ? "danger"
                                                        : null
                                                }
                                            ></Badge>
                                        </td>
                                    </tr>
                                </table>
                            )}

                            {activeMenu === "bank" && (
                                <table class="w-full">
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">
                                            Bank
                                        </td>
                                        <td class="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td class="text-gray-700 text-base w-7/12">
                                            {partner.banks[0].bank}
                                        </td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">
                                            No. Rekening
                                        </td>
                                        <td class="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td class="text-gray-700 text-base w-7/12">
                                            {
                                                partner.banks[0]
                                                    .account_bank_number
                                            }
                                        </td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">
                                            Atas Nama
                                        </td>
                                        <td class="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td class="text-gray-700 text-base w-7/12">
                                            {partner.banks[0].account_bank_name}
                                        </td>
                                    </tr>
                                </table>
                            )}

                            {activeMenu === "pic" && (
                                <table class="w-full">
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">
                                            Nama
                                        </td>
                                        <td class="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td class="text-gray-700 text-base w-7/12">
                                            {partner.pics[0].name}
                                        </td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">
                                            Jabatan
                                        </td>
                                        <td class="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td class="text-gray-700 text-base w-7/12">
                                            {partner.pics[0].position}
                                        </td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">
                                            No. Telp
                                        </td>
                                        <td class="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td class="text-gray-700 text-base w-7/12">
                                            {partner.pics[0].number}
                                        </td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">
                                            Address
                                        </td>
                                        <td class="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td class="text-gray-700 text-base w-7/12">
                                            {partner.pics[0].address}
                                        </td>
                                    </tr>
                                </table>
                            )}

                            {activeMenu === "langganan" && (
                                <table class="w-full">
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">
                                            Nominal
                                        </td>
                                        <td class="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td class="text-gray-700 text-base w-7/12">
                                            {partner.subscription.nominal}
                                        </td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">
                                            Periode
                                        </td>
                                        <td class="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td class="text-gray-700 text-base w-7/12">
                                            {partner.subscription.period} bulan
                                        </td>
                                    </tr>

                                    {partner.subscription.price_card !== {} && (
                                        <tr class="border-b">
                                            <td class="text-gray-700 text-base font-bold w-1/4">
                                                Kartu{" "}
                                                {
                                                    JSON.parse(
                                                        partner.subscription
                                                            .price_card
                                                    ).type
                                                }
                                            </td>
                                            <td class="text-gray-700 text-base w-[2%]">
                                                :
                                            </td>
                                            <td class="text-gray-700 text-base w-7/12">
                                                {
                                                    JSON.parse(
                                                        partner.subscription
                                                            .price_card
                                                    ).price
                                                }
                                            </td>
                                        </tr>
                                    )}
                                </table>
                            )}
                        </div>
                    </div>
                </Card>
            )}
        </>
    );
};

export default DetailPartner;
