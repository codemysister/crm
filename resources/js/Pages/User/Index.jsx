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
import { Password } from "primereact/password";
import { Skeleton } from "primereact/skeleton";
import { FilterMatchMode } from "primereact/api";

export default function Index({ auth }) {
    const [users, setUsers] = useState("");
    const [roles, setRoles] = useState("");
    const { roles: roleAuth, permissions: permissionAuth } = auth.user;

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
        id: "",
        name: "",
        email: "",
        number: "",
        role: "",
        role_id: "",
        password: "",
        password_confirmation: "",
        new_password: null,
    });

    const dummyArray = Array.from({ length: 5 }, (v, i) => i);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [modalUserIsVisible, setModalUserIsVisible] = useState(false);
    const [modalEditUserIsVisible, setModalEditUserIsVisible] = useState(false);
    const toast = useRef(null);
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

    const getUsers = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/users");
        let data = await response.json();

        setUsers((prev) => (prev = data.users));
        setRoles((prev) => (prev = data.roles));

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([getUsers()]);
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
                {permissionAuth.includes("edit user") && (
                    <Button
                        icon="pi pi-pencil"
                        rounded
                        outlined
                        className="mr-2"
                        onClick={() => handleEditProduct(rowData)}
                    />
                )}

                {permissionAuth.includes("hapus user") && (
                    <Button
                        icon="pi pi-trash"
                        rounded
                        outlined
                        severity="danger"
                        onClick={() => {
                            handleDeleteProduct(rowData);
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

    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };

    const handleEditProduct = (user) => {
        setData((data) => ({
            ...data,
            id: user.id,
            name: user.name,
            email: user.email,
            number: user.number,
            role: user.role,
            role_id: user.role_id,
        }));
        setModalEditUserIsVisible(true);
    };

    const handleDeleteProduct = (user) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroy("users/" + user.id, {
                    onSuccess: () => {
                        getUsers();
                        showSuccess("Hapus");
                    },
                    onError: () => {
                        showError("Hapus");
                    },
                });
            },
        });
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

    const handleSubmitForm = (e, type) => {
        e.preventDefault();

        if (type === "tambah") {
            post("/users", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalUserIsVisible((prev) => false);
                    getUsers();
                    reset();
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            put("/users/" + data.id, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditUserIsVisible((prev) => false);
                    getUsers();
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
                            className="p-datatable-striped"
                        >
                            <Column
                                style={{ width: "25%" }}
                                body={<Skeleton />}
                            ></Column>
                            <Column
                                style={{ width: "25%" }}
                                body={<Skeleton />}
                            ></Column>
                            <Column
                                style={{ width: "25%" }}
                                body={<Skeleton />}
                            ></Column>
                            <Column
                                style={{ width: "25%" }}
                                body={<Skeleton />}
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

            <HeaderModule title="User">
                {permissionAuth.includes("tambah user") && (
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalUserIsVisible((prev) => (prev = true));
                            reset();
                        }}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                )}
            </HeaderModule>

            {/* Modal tambah user */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="User"
                    headerClassName="dark:glass shadow-md dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName=" dark:glass dark:text-white"
                    visible={modalUserIsVisible}
                    onHide={() => setModalUserIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitForm(e, "tambah")}>
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="name">Nama</label>
                                <InputText
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="name"
                                    aria-describedby="name-help"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="email">Email</label>
                                <InputText
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="email"
                                    aria-describedby="email-help"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="number">Whatsapp</label>
                                <InputText
                                    value={data.number}
                                    onChange={(e) =>
                                        setData("number", e.target.value)
                                    }
                                    keyfilter="int"
                                    className="dark:bg-gray-300"
                                    id="number"
                                    aria-describedby="number-help"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="password">Password</label>
                                <Password
                                    inputClassName="w-full dark:bg-gray-300"
                                    className="flex justify-center items-center align-middle justify-items-center"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    toggleMask
                                    feedback={false}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="password_confirmation">
                                    Konfirmasi Password
                                </label>
                                <Password
                                    inputClassName="w-full dark:bg-gray-300"
                                    feedback={false}
                                    className="flex justify-center  items-center align-middle justify-items-center"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    toggleMask
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="role">Role</label>
                                <Dropdown
                                    value={data.role}
                                    onChange={(e) =>
                                        setData("role", e.target.value)
                                    }
                                    options={roles}
                                    optionLabel="name"
                                    placeholder="Pilih Role"
                                    className="w-full md:w-14rem dark:bg-gray-300"
                                />
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

            {/* Modal edit produk */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Produk"
                    headerClassName="dark:glass shadow-md dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName="dark:glass dark:text-white"
                    visible={modalEditUserIsVisible}
                    onHide={() => setModalEditUserIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitForm(e, "update")}>
                        <div className="flex flex-col justify-around gap-4 mt-4">
                            <div className="flex flex-col">
                                <label htmlFor="name">Nama</label>
                                <InputText
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="name"
                                    aria-describedby="name-help"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="email">Email</label>
                                <InputText
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="dark:bg-gray-300"
                                    id="email"
                                    aria-describedby="email-help"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="number">Whatsapp</label>
                                <InputText
                                    value={data.number}
                                    onChange={(e) =>
                                        setData("number", e.target.value)
                                    }
                                    keyfilter="int"
                                    className="dark:bg-gray-300"
                                    id="number"
                                    aria-describedby="number-help"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="role">Role</label>
                                <Dropdown
                                    value={data.role}
                                    onChange={(e) =>
                                        setData("role", e.target.value)
                                    }
                                    options={roles}
                                    optionValue="name"
                                    optionLabel="name"
                                    placeholder="Pilih Role"
                                    className="w-full md:w-14rem dark:bg-gray-300"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="new_password">
                                    Password Baru
                                </label>
                                <Password
                                    inputClassName="w-full dark:bg-gray-300"
                                    className="flex justify-center items-center align-middle justify-items-center"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("new_password", e.target.value)
                                    }
                                    toggleMask
                                    feedback={false}
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

            <div className="flex mx-auto flex-col justify-center mt-5 gap-5">
                <div className="card p-fluid w-full h-full flex justify-center rounded-lg">
                    <DataTable
                        className="w-full h-auto rounded-lg dark:glass border-none text-center shadow-md"
                        pt={{
                            bodyRow:
                                "dark:bg-transparent bg-transparent dark:text-gray-300",
                            table: " dark:bg-transparent bg-white rounded-lg dark:text-gray-300",
                            header: "",
                        }}
                        paginator
                        rows={5}
                        loading={isLoadingData}
                        filters={filters}
                        header={header}
                        globalFilterFields={["name", "role", "email"]}
                        emptyMessage="User tidak ditemukan."
                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                        value={users}
                        dataKey="id"
                    >
                        <Column
                            header="No"
                            body={(_, { rowIndex }) => rowIndex + 1}
                            className="dark:border-none pl-6"
                            headerClassName="pl-6 dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                        />
                        <Column
                            field="name"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Nama"
                            align="left"
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        <Column
                            field="number"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Whatsapp"
                            align="left"
                            body={(rowData) => {
                                return rowData.number
                                    ? rowData.number
                                    : "belum diisi";
                            }}
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        <Column
                            field="role"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Divisi"
                            align="left"
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        <Column
                            field="email"
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            header="Email"
                            align="left"
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        {(permissionAuth.includes("edit user") ||
                            permissionAuth.includes("hapus user")) && (
                            <Column
                                header="Aksi"
                                body={actionBodyTemplate}
                                style={{ minWidth: "12rem" }}
                                className="dark:border-none"
                                headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                            ></Column>
                        )}
                    </DataTable>
                </div>
            </div>
        </DashboardLayout>
    );
}
