import HeaderModule from "@/Components/HeaderModule";
import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useForm } from "@inertiajs/react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
import { Toast } from "primereact/toast";
import { Image } from "primereact/image";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
registerPlugin(FilePondPluginFileValidateSize);

export default function Index({ auth, userAsReferralProp }) {
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [referral, setReferral] = useState(null);
    const [userAsReferral, setUserAsReferral] = useState(userAsReferralProp);
    const dummyArray = Array.from({ length: 5 }, (v, i) => i);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [modalReferralIsVisible, setModalReferralIsVisible] = useState(false);
    const [modalEditReferralIsVisible, setModalEditReferralIsVisible] =
        useState(false);
    const toast = useRef(null);
    const [defaultLogoFile, setDefaultLogoFile] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await getReferrals();
            setPreRenderLoad((prev) => (prev = false));
        };

        fetchData();
    }, []);

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
        user: { id: null, name: null },
        institution: null,
        logo: null,
        signature: null,
    });

    const getReferrals = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/referral");

        let data = await response.json();

        setReferral((prev) => data);

        setIsLoadingData(false);
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
            post("/referral", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalReferralIsVisible((prev) => false);
                    getReferrals();
                    reset();
                },
                onError: () => {
                    showError("Tambah");
                },
                forceFormData: true,
            });
        } else {
            post("/referral/" + data.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditReferralIsVisible((prev) => false);
                    getReferrals();
                    reset();
                },
                onError: () => {
                    showError("Update");
                },
                forceFormData: true,
            });
        }
    };

    const handleDeleteReferral = (rowData) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroy("referral/" + rowData.uuid, {
                    onSuccess: () => {
                        getReferrals();
                        showSuccess("Hapus");
                    },
                    onError: () => {
                        showError("Hapus");
                    },
                });
            },
        });
    };

    const handleEditReferral = (rowData) => {
        setData((data) => ({
            ...data,
            uuid: rowData.uuid,
            user: { id: rowData.user.id, name: rowData.user.name },
            institution: rowData.institution,
            logo: rowData.logo,
            signature: rowData.signature,
        }));

        setModalEditReferralIsVisible(true);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => handleEditReferral(rowData)}
                />

                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => {
                        handleDeleteReferral(rowData);
                    }}
                />
            </React.Fragment>
        );
    };

    return (
        <DashboardLayout auth={auth.user}>
            <Toast ref={toast} />
            <ConfirmDialog />

            <HeaderModule title="Referral">
                <Button
                    label="Tambah"
                    className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                    icon={addButtonIcon}
                    onClick={() => {
                        setModalReferralIsVisible((prev) => (prev = true));
                        reset();
                    }}
                    aria-controls="popup_menu_right"
                    aria-haspopup
                />
            </HeaderModule>

            {/* Modal tambah referral */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Referral"
                    headerClassName="dark:glass shadow-md dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName=" dark:glass dark:text-white"
                    visible={modalReferralIsVisible}
                    onHide={() => setModalReferralIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitForm(e, "tambah")}>
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="name">Pilih Referral</label>
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
                                        }));
                                    }}
                                    options={userAsReferral}
                                    optionLabel="name"
                                    placeholder="Pilih User"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="institution">Lembaga</label>
                                <InputText
                                    value={data.institution}
                                    onChange={(e) =>
                                        setData("institution", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="institution"
                                    aria-describedby="institution-help"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="logo">Upload Logo</label>
                                <div className="App">
                                    {data.logo !== null &&
                                    typeof data.logo == "string" ? (
                                        <>
                                            <FilePond
                                                files={"/storage/" + data.logo}
                                                onaddfile={(
                                                    error,
                                                    fileItems
                                                ) => {
                                                    if (!error) {
                                                        setData(
                                                            "logo",
                                                            fileItems.file
                                                        );
                                                    }
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
                                                    if (!error) {
                                                        setData(
                                                            "logo",
                                                            fileItems.file
                                                        );
                                                    }
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
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="signature">
                                    Upload Tanda Tangan
                                </label>
                                <div className="App">
                                    {data.signature !== null &&
                                    typeof data.signature == "string" ? (
                                        <>
                                            <FilePond
                                                files={
                                                    "/storage/" + data.signature
                                                }
                                                onaddfile={(
                                                    error,
                                                    fileItems
                                                ) => {
                                                    if (!error) {
                                                        setData(
                                                            "signature",
                                                            fileItems.file
                                                        );
                                                    }
                                                }}
                                                onremovefile={() => {
                                                    setData("signature", null);
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
                                                            "signature",
                                                            fileItems.file
                                                        );
                                                    }
                                                }}
                                                onremovefile={() => {
                                                    setData("signature", null);
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

            {/* Modal edit referral */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Referral"
                    headerClassName="dark:glass shadow-md dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName=" dark:glass dark:text-white"
                    visible={modalEditReferralIsVisible}
                    onHide={() => setModalEditReferralIsVisible(false)}
                >
                    <form
                        encType="multipart-form"
                        onSubmit={(e) => handleSubmitForm(e, "update")}
                    >
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="referral">Pilih Referral</label>
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
                                        }));
                                    }}
                                    options={userAsReferral}
                                    optionLabel="name"
                                    placeholder="Pilih User"
                                    filter
                                    valueTemplate={selectedOptionTemplate}
                                    itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="institution">Lembaga</label>
                                <InputText
                                    value={data.institution}
                                    onChange={(e) =>
                                        setData("institution", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="institution"
                                    aria-describedby="institution-help"
                                />
                            </div>

                            {/* <div className="flex flex-col">
                                <label htmlFor="logo">Upload Logo</label>
                                <div className="App">
                                    {data.logo !== null &&
                                    typeof data.logo == "string" ? (
                                        <>
                                            <FilePond
                                                files={"/storage/" + data.logo}
                                                onaddfile={(
                                                    error,
                                                    fileItems
                                                ) => {
                                                    if (!error) {
                                                        setData(
                                                            "logo",
                                                            fileItems.file
                                                        );
                                                    }
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
                                                    if (!error) {
                                                        setData(
                                                            "logo",
                                                            fileItems.file
                                                        );
                                                    }
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
                            </div> */}

                            <div className="flex flex-col">
                                <label htmlFor="logo">Upload Logo</label>
                                <div className="App">
                                    {data.logo !== null &&
                                    typeof data.logo == "string" ? (
                                        <>
                                            <FilePond
                                                files={[
                                                    {
                                                        source:
                                                            "/storage" +
                                                            data.logo,
                                                        options: {
                                                            type: "remote",
                                                        },
                                                    },
                                                ]}
                                                onaddfile={(
                                                    error,
                                                    fileItems
                                                ) => {
                                                    if (!error) {
                                                        setData(
                                                            "logo",
                                                            fileItems.file
                                                        );
                                                    }
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
                                                    if (!error) {
                                                        setData(
                                                            "logo",
                                                            fileItems.file
                                                        );
                                                    }
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
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="signature">
                                    Upload Tanda Tangan
                                </label>
                                <div className="App">
                                    {data.signature !== null &&
                                    typeof data.signature == "string" ? (
                                        <>
                                            <FilePond
                                                files={[
                                                    {
                                                        source:
                                                            "/storage/" +
                                                            data.signature,
                                                        options: {
                                                            type: "remote",
                                                        },
                                                    },
                                                ]}
                                                onaddfile={(
                                                    error,
                                                    fileItems
                                                ) => {
                                                    if (!error) {
                                                        setData(
                                                            "signature",
                                                            fileItems.file
                                                        );
                                                    }
                                                }}
                                                onremovefile={() => {
                                                    setData("signature", null);
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
                                                            "signature",
                                                            fileItems.file
                                                        );
                                                    }
                                                }}
                                                onremovefile={() => {
                                                    setData("signature", null);
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
                        // filters={filters}
                        rows={5}
                        emptyMessage="Referral tidak ditemukan."
                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                        // header={header}
                        globalFilterFields={["name"]}
                        value={referral}
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
                            body={(rowData) => {
                                return rowData.user.name;
                            }}
                            header="Nama"
                            className="dark:border-none pl-6"
                            headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                            style={{ width: "10rem" }}
                        />
                        <Column
                            field="institution"
                            header="Lembaga"
                            className="dark:border-none pl-6"
                            headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                            style={{ width: "10rem" }}
                        />
                        <Column
                            field="logo"
                            header="Logo"
                            headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                            body={(rowData) => {
                                return rowData.logo ? (
                                    <div className="flex justify-center">
                                        <Image
                                            src={"/storage/" + rowData.logo}
                                            alt="Logo"
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
                            field="signature"
                            header="Tanda Tangan"
                            headerClassName="dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"
                            body={(rowData) => {
                                return rowData.signature ? (
                                    <div className="flex justify-center">
                                        <Image
                                            src={
                                                "/storage/" + rowData.signature
                                            }
                                            alt="signature"
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
                            header="Action"
                            body={actionBodyTemplate}
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                        ></Column>
                    </DataTable>
                </div>
            </div>
        </DashboardLayout>
    );
}
