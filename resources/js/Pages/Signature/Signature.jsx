import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import DashboardLayout from "@/Layouts/DashboardLayout";
import HeaderModule from "@/Components/HeaderModule";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { useForm } from "@inertiajs/react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Skeleton } from "primereact/skeleton";
import { InputNumber } from "primereact/inputnumber";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
import { OverlayPanel } from "primereact/overlaypanel";
import { Image } from "primereact/image";
registerPlugin(FilePondPluginFileValidateSize);

export default function Index({ auth, signaturesProp, rolesProp, usersProp }) {
    const [users, setUsers] = useState(usersProp);
    const [signatures, setSignatures] = useState(signaturesProp);
    const [positions, setPositions] = useState(rolesProp);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const dummyArray = Array.from({ length: 5 }, (v, i) => i);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [modalSignatureIsVisible, setModalSignatureIsVisible] =
        useState(false);
    const [modalEditSignatureIsVisible, setModalEditSignatureIsVisible] =
        useState(false);
    const toast = useRef(null);
    const { roles, permissions } = auth.user;
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
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
        id: null,
        user: { name: null, id: null },
        image: null,
        position: null,
    });

    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const getSignatures = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/signatures");
        let data = await response.json();

        setSignatures((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([getSignatures()]);
                setIsLoadingData(false);
                setPreRenderLoad((prev) => (prev = false));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {permissions.includes("edit produk") && (
                    <Button
                        icon="pi pi-pencil"
                        rounded
                        outlined
                        className="mr-2"
                        onClick={() => handleEditSignature(rowData)}
                    />
                )}
                {permissions.includes("hapus produk") && (
                    <Button
                        icon="pi pi-trash"
                        rounded
                        outlined
                        severity="danger"
                        onClick={() => {
                            handleDeleteSignature(rowData);
                        }}
                    />
                )}
            </React.Fragment>
        );
    };

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

    const handleEditSignature = (signature) => {
        setData((data) => ({
            ...data,
            uuid: signature.uuid,
            user: { name: signature.name, id: signature.user_id },
            image: signature.image,
            position: signature.position,
        }));

        setModalEditSignatureIsVisible(true);
    };

    const handleDeleteSignature = (signature) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroy("signatures/" + signature.uuid, {
                    onSuccess: () => {
                        getSignatures();
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

    const optionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const renderHeader = () => {
        return (
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
    };

    const header = renderHeader();

    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };

    const handleSubmitForm = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            post("/signatures", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalSignatureIsVisible((prev) => false);
                    getSignatures();
                    reset();
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            post("/signatures/" + data.uuid, {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalEditSignatureIsVisible((prev) => false);
                    getSignatures();
                    reset();
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
    };

    if (preRenderLoad) {
        return (
            <>
                <DashboardLayout auth={auth.user} className="">
                    <div className="card my-5">
                        <DataTable
                            value={dummyArray}
                            className="p-datatable-striped dark:bg-slate-900"
                            pt={{
                                bodyRow:
                                    "dark:bg-transparent bg-transparent dark:text-gray-300",
                                table: "dark:bg-transparent bg-white dark:text-gray-300",
                                header: "dark:bg-transparent",
                            }}
                        >
                            <Column
                                style={{ width: "25%" }}
                                body={<Skeleton />}
                                headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                            ></Column>
                            <Column
                                style={{ width: "25%" }}
                                body={<Skeleton />}
                                headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                            ></Column>
                            <Column
                                style={{ width: "25%" }}
                                body={<Skeleton />}
                                headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                            ></Column>
                            <Column
                                style={{ width: "25%" }}
                                body={<Skeleton />}
                                headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                            ></Column>
                        </DataTable>
                    </div>
                </DashboardLayout>
            </>
        );
    }

    return (
        <DashboardLayout auth={auth.user} className="">
            <Toast ref={toast} />
            <ConfirmDialog />

            <HeaderModule title="Tanda Tangan">
                {permissions.includes("tambah produk") && (
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalSignatureIsVisible((prev) => (prev = true));
                            reset(
                                "name",
                                "category",
                                "price",
                                "unit",
                                "description"
                            );
                        }}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                )}
            </HeaderModule>

            {/* Modal tambah tanda tangan */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Tanda Tangan"
                    headerClassName="dark:glass shadow-md dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName=" dark:glass dark:text-white"
                    visible={modalSignatureIsVisible}
                    onHide={() => setModalSignatureIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitForm(e, "tambah")}>
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="name">Nama</label>
                                <Dropdown
                                    dataKey="name"
                                    value={data.user}
                                    onChange={(e) => {
                                        setData((data) => ({
                                            ...data,
                                            user: {
                                                name: e.target.value.name,
                                                id: e.target.value.id,
                                            },
                                            position: e.target.value.position,
                                        }));
                                    }}
                                    options={users}
                                    optionLabel="name"
                                    placeholder="Pilih User"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="image">
                                    Upload Tanda Tangan
                                </label>
                                <div className="App">
                                    {data.image !== null &&
                                    typeof data.image == "string" ? (
                                        <>
                                            <FilePond
                                                files={"/storage/" + data.image}
                                                onaddfile={(
                                                    error,
                                                    fileItems
                                                ) => {
                                                    if (!error) {
                                                        setData(
                                                            "image",
                                                            fileItems.file
                                                        );
                                                    }
                                                }}
                                                onremovefile={() => {
                                                    setData("image", null);
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
                                                    if (!error) {
                                                        setData(
                                                            "image",
                                                            fileItems.file
                                                        );
                                                    }
                                                }}
                                                onremovefile={() => {
                                                    setData("image", null);
                                                }}
                                                maxFileSize="2mb"
                                                labelMaxFileSizeExceeded="File terlalu besar"
                                                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="name">Divisi</label>
                            <Dropdown
                                value={data.position}
                                onChange={(e) => {
                                    setData("position", e.target.value);
                                }}
                                options={positions}
                                optionLabel="name"
                                optionValue="name"
                                placeholder="Pilih Divisi"
                                filter
                                valueTemplate={selectedOptionTemplate}
                                itemTemplate={optionTemplate}
                                className="w-full md:w-14rem"
                            />
                        </div>
                        <div className="flex justify-center my-5">
                            <Button
                                label="Submit"
                                disabled={processing}
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>

            {/* Modal edit tanda tangan */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Tanda Tangan"
                    headerClassName="dark:glass shadow-md dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName=" dark:glass dark:text-white"
                    visible={modalEditSignatureIsVisible}
                    onHide={() => setModalEditSignatureIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitForm(e, "update")}>
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="name">Nama</label>
                                <Dropdown
                                    dataKey="name"
                                    value={data.user}
                                    onChange={(e) => {
                                        setData((data) => ({
                                            ...data,
                                            user: {
                                                name: e.target.value.name,
                                                id: e.target.value.id,
                                            },
                                            position: e.target.value.position,
                                        }));
                                    }}
                                    options={users}
                                    optionLabel="name"
                                    placeholder="Pilih User"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="image">
                                    Upload Tanda Tangan
                                </label>
                                <div className="App">
                                    {data.image !== null &&
                                    typeof data.image == "string" ? (
                                        <>
                                            <FilePond
                                                files={"/storage/" + data.image}
                                                onaddfile={(
                                                    error,
                                                    fileItems
                                                ) => {
                                                    if (!error) {
                                                        setData(
                                                            "image",
                                                            fileItems.file
                                                        );
                                                    }
                                                }}
                                                onremovefile={() => {
                                                    setData("image", null);
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
                                                    if (!error) {
                                                        setData(
                                                            "image",
                                                            fileItems.file
                                                        );
                                                    }
                                                }}
                                                onremovefile={() => {
                                                    setData("image", null);
                                                }}
                                                maxFileSize="2mb"
                                                labelMaxFileSizeExceeded="File terlalu besar"
                                                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="name">Divisi</label>
                            <Dropdown
                                value={data.position}
                                onChange={(e) => {
                                    setData("position", e.target.value);
                                }}
                                options={positions}
                                optionLabel="name"
                                optionValue="name"
                                placeholder="Pilih Divisi"
                                filter
                                valueTemplate={selectedOptionTemplate}
                                itemTemplate={optionTemplate}
                                className="w-full md:w-14rem"
                            />
                        </div>
                        <div className="flex justify-center my-5">
                            <Button
                                label="Submit"
                                disabled={processing}
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
                        filters={filters}
                        rows={5}
                        emptyMessage="Tanda tangan tidak ditemukan."
                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                        header={header}
                        globalFilterFields={["name"]}
                        value={signatures}
                        dataKey="id"
                    >
                        <Column
                            header="No"
                            body={(_, { rowIndex }) => rowIndex + 1}
                            style={{ width: "5%" }}
                            className="dark:border-none pl-6"
                            headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                        />
                        <Column
                            field="uuid"
                            hidden
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Nama"
                            align="left"
                            style={{ width: "10%" }}
                        ></Column>
                        <Column
                            field="name"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Nama"
                            align="left"
                            style={{ width: "20%" }}
                        ></Column>
                        <Column
                            field="image"
                            header="Tanda Tangan"
                            headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                            body={(rowData) => {
                                return rowData.image ? (
                                    <div className="flex justify-center">
                                        <Image
                                            src={"/storage/" + rowData.image}
                                            alt="Bukti"
                                            width="50%"
                                            height="50%"
                                            preview
                                            downloadable
                                        />
                                    </div>
                                ) : (
                                    "-"
                                );
                            }}
                            style={{ width: "10rem" }}
                        ></Column>
                        <Column
                            field="position"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Divisi"
                            align="left"
                            style={{ width: "15%" }}
                        ></Column>

                        <Column
                            header="Action"
                            body={actionBodyTemplate}
                            style={{ minWidth: "12rem" }}
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                        ></Column>
                    </DataTable>
                </div>
            </div>
        </DashboardLayout>
    );
}
