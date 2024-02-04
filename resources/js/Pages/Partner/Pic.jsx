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

const Pic = ({
    partners,
    showSuccess,
    showError,
    handleSelectedDetailPartner,
}) => {
    const [pics, setPics] = useState("");
    const [modalPicIsVisible, setModalPicIsVisible] = useState(false);
    const [modalEditPicIsVisible, setModalEditPicIsVisible] = useState(false);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const {
        data: dataPIC,
        setData: setDataPIC,
        post: postPIC,
        put: putPIC,
        delete: destroyPIC,
        reset: resetPIC,
        processing: processingPIC,
        errors: errorPIC,
    } = useForm({
        uuid: "",
        partner: {},
        name: "",
        number: "",
        position: "",
        address: "",
        email: "",
    });

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

    const getPics = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/partners/pics");
        let data = await response.json();

        setPics((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            setPreRenderLoad((prev) => (prev = false));
            await getPics();
        };

        fetchData();
    }, []);

    const actionBodyTemplatePIC = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => handleEditPIC(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => {
                        handleDeletePIC(rowData);
                    }}
                />
            </React.Fragment>
        );
    };

    const optionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const handleEditPIC = (pic) => {
        setDataPIC((data) => ({
            ...data,
            uuid: pic.uuid,
            partner: pic.partner,
            name: pic.name,
            number: pic.number,
            position: pic.position,
            address: pic.address,
            email: pic.email,
        }));

        setModalEditPicIsVisible(true);
    };

    const handleDeletePIC = (pic) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroyPIC("partners/pics/" + pic.uuid, {
                    onSuccess: () => {
                        getPics();
                        showSuccess("Hapus");
                    },
                    onError: () => {
                        showError("Hapus");
                    },
                });
            },
        });
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

    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-row justify-between gap-2 align-items-center items-end">
                <div>
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalPicIsVisible((prev) => (prev = true));
                            resetPIC();
                        }}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                </div>
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
    };

    const header = renderHeader();

    const handleSubmitFormPIC = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            postPIC("/partners/pics", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalPicIsVisible((prev) => false);
                    getPics();
                    resetPIC(
                        "partner",
                        "name",
                        "number",
                        "position",
                        "address"
                    );
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            putPIC("/partners/pics/" + dataPIC.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditPicIsVisible((prev) => false);
                    getPics();
                    resetPIC(
                        "partner",
                        "name",
                        "number",
                        "position",
                        "address"
                    );
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
    };

    return (
        <>
            {/* Modal tambah pic */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="PIC"
                    headerClassName="dark:glass dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                    contentClassName="dark:glass dark:text-white"
                    visible={modalPicIsVisible}
                    onHide={() => setModalPicIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitFormPIC(e, "tambah")}>
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="name">Nama</label>
                                <InputText
                                    value={dataPIC.name}
                                    onChange={(e) =>
                                        setDataPIC("name", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="name"
                                    aria-describedby="name-help"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="pic_partner">Partner</label>
                                <Dropdown
                                    optionLabel="name"
                                    value={dataPIC.partner}
                                    onChange={(e) =>
                                        setDataPIC("partner", e.target.value)
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
                                <label htmlFor="number">Email *</label>
                                <InputText
                                    value={dataPIC.email}
                                    onChange={(e) =>
                                        setDataPIC("email", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="email"
                                    aria-describedby="email-help"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="number">No.Hp</label>
                                <InputText
                                    keyfilter="int"
                                    min={0}
                                    value={dataPIC.number}
                                    onChange={(e) =>
                                        setDataPIC("number", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="number"
                                    aria-describedby="number-help"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="position">Jabatan</label>
                                <InputText
                                    value={dataPIC.position}
                                    onChange={(e) =>
                                        setDataPIC("position", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="position"
                                    aria-describedby="position-help"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="address">Alamat</label>
                                <InputTextarea
                                    value={dataPIC.address}
                                    onChange={(e) =>
                                        setDataPIC("address", e.target.value)
                                    }
                                    rows={5}
                                    cols={30}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-5">
                            <Button
                                label="Submit"
                                disabled={processingPIC}
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>

            {/* Modal edit pic */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Edit PIC"
                    headerClassName="dark:glass shadow-md z-20 dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName=" dark:glass dark:text-white"
                    visible={modalEditPicIsVisible}
                    onHide={() => setModalEditPicIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitFormPIC(e, "update")}>
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="name">Nama</label>
                                <InputText
                                    value={dataPIC.name}
                                    onChange={(e) =>
                                        setDataPIC("name", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="name"
                                    aria-describedby="name-help"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="pic_partner">Partner</label>

                                <Dropdown
                                    value={dataPIC.partner}
                                    options={partners}
                                    onChange={(e) =>
                                        setDataPIC("partner", e.target.value)
                                    }
                                    optionLabel="name"
                                    placeholder="Pilih Partner"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="number">Email *</label>
                                <InputText
                                    value={dataPIC.email}
                                    onChange={(e) =>
                                        setDataPIC("email", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="email"
                                    aria-describedby="email-help"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="number">No.Hp</label>
                                <InputText
                                    keyfilter="int"
                                    min={0}
                                    value={dataPIC.number}
                                    onChange={(e) =>
                                        setDataPIC("number", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="number"
                                    aria-describedby="number-help"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="position">Jabatan</label>
                                <InputText
                                    value={dataPIC.position}
                                    onChange={(e) =>
                                        setDataPIC("position", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="position"
                                    aria-describedby="position-help"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="address">Alamat</label>
                                <InputTextarea
                                    value={dataPIC.address}
                                    onChange={(e) =>
                                        setDataPIC("address", e.target.value)
                                    }
                                    rows={5}
                                    cols={30}
                                />
                            </div>
                        </div>

                        <div className="flex justify-center mt-5">
                            <Button
                                label="Submit"
                                disabled={processingPIC}
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
                        emptyMessage="Partner tidak ditemukan."
                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                        header={header}
                        filters={filters}
                        globalFilterFields={["name", "partner.name"]}
                        value={pics}
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
                            field="name"
                            header="PIC"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{ minWidth: "8rem" }}
                        ></Column>
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
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        <Column
                            field="uuid"
                            hidden
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Nama"
                            align="left"
                        ></Column>
                        <Column
                            field="email"
                            header="Email"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        <Column
                            field="number"
                            header="Nomor Handphone"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        <Column
                            field="position"
                            header="Jabatan"
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        <Column
                            field="address"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Alamat"
                            align="left"
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        <Column
                            header="Action"
                            body={actionBodyTemplatePIC}
                            style={{ width: "10%" }}
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                        ></Column>
                    </DataTable>
                </div>
            </div>
        </>
    );
};

export default Pic;
