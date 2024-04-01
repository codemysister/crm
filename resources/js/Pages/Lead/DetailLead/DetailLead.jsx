import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Badge } from "primereact/badge";
import { Menu } from "primereact/menu";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useForm } from "@inertiajs/react";
import { InputTextarea } from "primereact/inputtextarea";
import { ProgressSpinner } from "primereact/progressspinner";
import InputError from "@/Components/InputError";
import DetailStatusLog from "./DetailStatusLog";

const DetailLead = ({
    leads,
    DetailLead,
    handleSelectedDetailLead,
    status,
    showSuccess,
    showError,
    isLoading,
}) => {
    const [lead, setLead] = useState(DetailLead);
    const [activeMenu, setActiveMenu] = useState("lembaga");
    const [modalStatusIsVisible, setModalStatusIsVisible] = useState(false);
    const [modalEditLeadIsVisible, setModalEditLeadIsVisible] = useState(false);

    useEffect(() => {
        setLead((prev) => (prev = DetailLead));
    }, [DetailLead]);

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
        uuid: "",
        name: null,
        address: null,
        pic: null,
        total_members: null,
        status: null,
        note_status: null,
    });

    let menuDetailLeadItems = [
        {
            label: "Lembaga",
            className: `${activeMenu == "lembaga" ? "p-menuitem-active" : ""}`,
            command: () => {
                setActiveMenu((prev) => (prev = "lembaga"));
            },
        },
        {
            label: "Status Log",
            className: `${
                activeMenu == "status log" ? "p-menuitem-active" : ""
            }`,
            command: () => {
                setActiveMenu((prev) => (prev = "status log"));
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
        { name: "lead/bulan" },
        { name: "lead/tahun" },
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
                        id="dropdown-detail"
                        optionLabel="name"
                        dataKey="id"
                        value={lead}
                        onChange={(e) =>
                            handleSelectedDetailLead(e.target.value)
                        }
                        options={leads}
                        placeholder="Pilih lead"
                        filter
                        valueTemplate={selectedOptionTemplate}
                        itemTemplate={optionTemplate}
                        style={{ color: "#CBD5E1" }}
                        className="w-full md:min-w-[28%] md:w-[28%] md:max-w-[28%] flex justify-center rounded-lg shadow-md border-none dark:text-slate-300 dark:bg-slate-700"
                    />
                    <div className="text-center w-full flex items-center gap-2 justify-center">
                        <h1 className="dark:text-white">{lead?.name}</h1>
                    </div>
                </div>
            </>
        );
    };

    const handleEditLead = (lead) => {
        setData({
            ...data,
            uuid: lead.uuid,
            name: lead.name,
            pic: lead.pic,
            phone_number: lead.phone_number,
            address: lead.address,
            total_members: lead.total_members,
            status: lead.status,
        });
        clearErrors();
        setModalEditLeadIsVisible(true);
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();

        put("/leads/" + data.uuid, {
            onSuccess: () => {
                showSuccess("Update");
                setModalEditLeadIsVisible((prev) => false);
                handleSelectedDetailLead(data);
                // reset();
            },
            onError: () => {
                showError("Update");
            },
        });
    };

    return (
        <>
            <Card title={title} className="mt-5 mx-auto p-3 rounded-lg">
                <div className="flex flex-col lg:flex-row gap-5 min-h-[300px]">
                    <div className="w-full lg:w-[40%]">
                        <Menu
                            model={menuDetailLeadItems}
                            className="w-full rounded-lg dark:text-slate-300 dark:bg-slate-700"
                        />
                    </div>
                    <div class="w-full rounded-lg bg-gray-50/50 border dark:border-none dark:text-slate-300 dark:bg-slate-700 overflow-y-auto min-h-[300px] max-h-[300px] h-full  p-4">
                        {lead ? (
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
                                                        {lead.name}
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
                                                                lead.status.name
                                                            }
                                                            className="text-white"
                                                            style={{
                                                                backgroundColor:
                                                                    "#" +
                                                                    lead.status
                                                                        .color,
                                                            }}
                                                        ></Badge>
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
                                                        {lead.phone_number
                                                            ? lead.phone_number
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
                                                        {lead.address
                                                            ? lead.address
                                                            : "-"}
                                                    </td>
                                                </tr>

                                                <tr class="border-b">
                                                    <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                                        Jumlah Member
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-[2%]">
                                                        :
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-7/12">
                                                        {lead.total_members
                                                            ? lead.total_members
                                                            : "-"}
                                                    </td>
                                                </tr>

                                                <tr class="border-b">
                                                    <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                                        Diinput Oleh
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-[2%]">
                                                        :
                                                    </td>
                                                    <td class="pt-2 pb-1  text-base w-7/12">
                                                        {lead.created_by.name
                                                            ? lead.created_by
                                                                  .name
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
                                                                handleEditLead(
                                                                    lead
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            </table>
                                        )}

                                        {activeMenu === "status log" && (
                                            <DetailStatusLog
                                                lead={lead}
                                                handleSelectedDetailLead={
                                                    handleSelectedDetailLead
                                                }
                                            />
                                        )}
                                    </>
                                )}
                            </>
                        ) : (
                            <div class="w-full h-full min-h-[300px] flex items-center justify-center">
                                <p class="text-center">
                                    Pilih lead terlebih dahulu
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Modal edit lead */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Lead"
                    headerClassName="dark:bg-slate-900 dark:text-white"
                    className="bg-white min-h-[500px] max-h-[80%] w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName="dark:bg-slate-900 dark:text-white"
                    visible={modalEditLeadIsVisible}
                    onHide={() => setModalEditLeadIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitForm(e)}>
                        <div className="flex flex-col justify-around gap-4 mt-3">
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
                                <label htmlFor="pic">PIC *</label>
                                <InputText
                                    value={data.pic}
                                    onChange={(e) =>
                                        setData("pic", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="pic"
                                    required
                                    aria-describedby="pic-help"
                                />
                                <InputError
                                    message={errors["pic"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="phone_number">
                                    Nomor Telepon
                                </label>
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
                                <InputError
                                    message={errors["phone_number"]}
                                    className="mt-2"
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
                                <label htmlFor="total_members">
                                    Jumlah Member
                                </label>
                                <InputText
                                    keyfilter="int"
                                    value={data.total_members}
                                    onChange={(e) =>
                                        setData("total_members", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="total_members"
                                    aria-describedby="total_members-help"
                                />
                                <InputError
                                    message={errors["total_members"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="status">Status *</label>
                                <Dropdown
                                    value={data.status}
                                    onChange={(e) => {
                                        setData("status", e.target.value);
                                        setModalStatusIsVisible(true);
                                    }}
                                    dataKey="name"
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

export default DetailLead;
