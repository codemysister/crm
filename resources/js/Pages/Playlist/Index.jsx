import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { InputText } from "primereact/inputtext";
import { useForm } from "@inertiajs/react";
import {
    ConfirmDialog,
    ConfirmDialog as ConfirmDialog2,
    confirmDialog,
    confirmDialog as confirmDialog2,
} from "primereact/confirmdialog";
import { TabPanel, TabView } from "primereact/tabview";
import SkeletonDatatable from "@/Components/SkeletonDatatable";
import HeaderDatatable from "@/Components/HeaderDatatable";
import Modal from "@/Components/Modal";
import { Toast } from "primereact/toast";
import InputError from "@/Components/InputError";
import HeaderModule from "@/Components/HeaderModule";
import { OverlayPanel } from "primereact/overlaypanel";
import getViewportSize from "@/Utils/getViewportSize";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
import { formateDate } from "@/Utils/formatDate";
import ReactPlayer from "react-player";
import LogComponent from "@/Components/LogComponent";
import ArsipComponent from "@/Components/ArsipComponent";
registerPlugin(FilePondPluginFileValidateSize);

const Index = ({ auth, usersProp }) => {
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const [playlists, setPlaylists] = useState(null);
    const [users, setUsers] = useState(usersProp);
    const [confirmIsVisible, setConfirmIsVisible] = useState(false);
    const [selectedPlaylist, setSelectedStatus] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const toast = useRef(null);
    const action = useRef(null);
    const viewportSize = getViewportSize();
    const isMobile = viewportSize.width < 992;
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [modalPlaylistIsVisible, setModalPlaylistIsVisible] = useState(false);
    const [modalEditPlaylistIsVisible, setModalEditPlaylistIsVisible] =
        useState(false);
    const [modalVideoIsVisible, setModalVideoIsVisible] = useState(false);
    const [modalEditVideoIsVisible, setModalEditVideoIsVisible] =
        useState(false);
    const { roles, permissions } = auth.user;
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [expandedRows, setExpandedRows] = useState(null);

    const {
        data,
        setData,
        post,
        put,
        patch,
        delete: destroy,
        reset,
        processing,
        errors,
        clearErrors,
    } = useForm({
        id: null,
        uuid: null,
        title: null,
        description: null,
        thumbnail: null,
    });

    const {
        data: dataVideo,
        setData: setDataVideo,
        post: postVideo,
        put: putVideo,
        patch: patchVideo,
        delete: destroyVideo,
        reset: resetVideo,
        processing: processingVideo,
        errors: errorsVideo,
        clearErrors: clearErrorsVideo,
    } = useForm({
        id: null,
        uuid: null,
        playlist_id: null,
        title: null,
        video: null,
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
        if (activeIndexTab == 0) {
            fetchData(getPlaylists);
        }
    }, [activeIndexTab]);

    const getPlaylists = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/playlists");
        let data = await response.json();

        setPlaylists((prev) => data);

        setIsLoadingData(false);
    };

    const fetchData = async (fnc) => {
        try {
            await Promise.all([fnc()]);
            setIsLoadingData(false);
            setPreRenderLoad((prev) => (prev = false));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData(getPlaylists);
    }, []);

    let categories = [{ name: "lead" }, { name: "partner" }];

    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <i
                    className="pi pi-ellipsis-h pointer cursor-pointer"
                    onClick={(event) => {
                        setSelectedStatus(rowData);
                        action.current.toggle(event);
                    }}
                ></i>
            </React.Fragment>
        );
    };

    const handleEditPlaylist = (playlist) => {
        setData({
            ...data,
            uuid: playlist.uuid,
            title: playlist.title,
            description: playlist.description,
            thumbnail: playlist.thumbnail,
        });
        clearErrors();
        setModalEditPlaylistIsVisible(true);
    };

    const handleDeletePlaylist = () => {
        destroy("playlists/" + selectedPlaylist.uuid, {
            onSuccess: () => {
                getPlaylists();
                showSuccess("Hapus");
                reset();
            },
            onError: () => {
                showError("Hapus");
            },
        });
    };

    const confirmDeleteStatus = () => {
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

    const headerStatus = () => {
        return (
            <HeaderDatatable
                filters={filters}
                setFilters={setFilters}
            ></HeaderDatatable>
        );
    };

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

    const handleSubmitForm = (e, type) => {
        e.preventDefault();
        if (type === "tambah") {
            post("/playlists", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalPlaylistIsVisible((prev) => false);
                    getPlaylists();
                    reset();
                    setActiveIndexTab((prev) => (prev = 0));
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            post("/playlists/" + data.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditPlaylistIsVisible((prev) => false);
                    getPlaylists();
                    reset();
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
    };
    const handleSubmitVideoForm = (e, type) => {
        e.preventDefault();
        if (type === "tambah") {
            postVideo("/videos", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    setModalVideoIsVisible((prev) => false);
                    getPlaylists();
                    resetVideo("title", "video");
                    setActiveIndexTab((prev) => (prev = 0));
                },
                onError: () => {
                    showError("Tambah");
                },
            });
        } else {
            postVideo("/videos/" + dataVideo.uuid, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditVideoIsVisible((prev) => false);
                    getPlaylists();
                    resetVideo("title", "video");
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
    };

    const columns = [
        {
            field: "title",
            header: "Judul",
            frozen: !isMobile,
            style: !isMobile
                ? {
                      width: "max-content",
                      whiteSpace: "nowrap",
                  }
                : null,
        },
        {
            field: "slug",
            header: "Slug",
            frozen: !isMobile,
            style: !isMobile
                ? {
                      width: "max-content",
                      whiteSpace: "nowrap",
                  }
                : null,
        },
        {
            field: "thumbnail",
            header: "Thumbnail",
            frozen: !isMobile,
            style: !isMobile
                ? {
                      width: "max-content",
                      whiteSpace: "nowrap",
                  }
                : null,
            body: (rowData) => {
                return (
                    <div
                        className="w-full h-[100px] bg-no-repeat bg-cover rounded-t-xl"
                        style={{
                            backgroundImage: `url(${rowData.thumbnail})`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                    ></div>
                );
            },
        },
    ];

    const allowExpansion = (rowData) => {
        return rowData.videos.length >= 0;
    };

    const headerVideo = (
        <div className="flex flex-row gap-2 bg-gray-50 dark:bg-transparent p-2 rounded-lg align-items-center items-center justify-between justify-content-between">
            <div className="w-[30%]">
                {permissions.includes("tambah video") && (
                    <Button
                        label="Input Video"
                        className="bg-purple-600 w-[100px] max-w-[100px] text-xs shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalVideoIsVisible((prev) => (prev = true));
                            resetVideo("title", "video");
                        }}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                )}
            </div>
        </div>
    );

    const handleEditVideo = (video) => {
        setDataVideo({
            ...data,
            uuid: video.uuid,
            title: video.title,
            video: video.video,
        });
    };

    const handleDeleteVideo = (video) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                axios
                    .delete(
                        "videos/" + video.uuid,

                        {
                            headers: {
                                "X-CSRF-TOKEN": document.head.querySelector(
                                    'meta[name="csrf-token"]'
                                ).content,
                            },
                        }
                    )
                    .then((response) => {
                        if (response.data.error) {
                            showError(response.data.error);
                        } else {
                            showSuccess("Tambah");
                            getPlaylists();
                            resetVideo("title", "video");
                        }
                    });
            },
        });
    };

    const actionVideoBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {permissions.includes("edit video") && (
                    <Button
                        icon="pi pi-pencil"
                        rounded
                        outlined
                        className="mr-2"
                        onClick={() => {
                            setModalEditVideoIsVisible(true);
                            handleEditVideo(rowData);
                        }}
                    />
                )}
                {permissions.includes("hapus video") && (
                    <Button
                        icon="pi pi-trash"
                        rounded
                        outlined
                        severity="danger"
                        onClick={() => {
                            handleDeleteVideo(rowData);
                        }}
                    />
                )}
            </React.Fragment>
        );
    };

    const objectKeyToIndo = (key) => {
        let keyIndo;
        if (key == "title") {
            keyIndo = "Judul";
        } else if (key == "description") {
            keyIndo = "Deskripsi Singkat";
        } else if (key == "playlist.title") {
            keyIndo = "Playlist";
        }

        return keyIndo;
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="md:px-14">
                <div className="flex">
                    <DataTable
                        headerClassName="bg-red-500"
                        value={data.videos}
                        className=""
                        header={headerVideo}
                        emptyMessage="Video belum ditambahkan."
                    >
                        <Column
                            header="No"
                            body={(_, { rowIndex }) => rowIndex + 1}
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        />
                        <Column
                            field="title"
                            header="Judul"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        ></Column>
                        <Column
                            field="video"
                            header="Video"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                            body={(rowData) => {
                                return (
                                    <ReactPlayer
                                        width={"100%"}
                                        height={"100px"}
                                        playIcon={null}
                                        playing={false}
                                        controls
                                        url={rowData.video}
                                    />
                                );
                            }}
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        ></Column>

                        <Column
                            field="created_by"
                            header="Diinput Oleh"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                            body={(rowData) => {
                                return rowData.created_by.name;
                            }}
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        ></Column>

                        <Column
                            header="Aksi"
                            body={actionVideoBodyTemplate}
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        ></Column>
                    </DataTable>
                </div>
            </div>
        );
    };

    const globalFilterFields = ["title"];

    const onRowExpand = (event) => {
        setDataVideo((prev) => ({
            ...prev,
            playlist_id: event.data.id,
            title: event.data.title,
        }));
    };

    if (preRenderLoad) {
        return <SkeletonDatatable auth={auth} />;
    }

    return (
        <DashboardLayout auth={auth.user} className="">
            {/* Tombol Aksi */}
            <OverlayPanel
                className=" shadow-md p-1 dark:bg-slate-900 dark:text-gray-300"
                ref={action}
            >
                <div className="flex flex-col flex-wrap w-full">
                    <Button
                        icon="pi pi-pencil"
                        label="edit"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            handleEditPlaylist(selectedPlaylist);
                        }}
                    />
                    <Button
                        icon="pi pi-trash"
                        label="hapus"
                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                        onClick={() => {
                            confirmDeleteStatus();
                        }}
                    />
                </div>
            </OverlayPanel>

            <HeaderModule title="Playlist">
                {permissions.includes("tambah video") && (
                    <Button
                        label="Tambah"
                        className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalPlaylistIsVisible((prev) => (prev = true));
                            reset();
                            clearErrors();
                        }}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                )}
            </HeaderModule>

            <Toast ref={toast} />

            <TabView
                activeIndex={activeIndexTab}
                onTabChange={(e) => {
                    setActiveIndexTab(e.index);
                }}
                className="mt-2"
            >
                <TabPanel header="Semua Playlist">
                    {activeIndexTab == 0 && (
                        <>
                            <ConfirmDialog />
                            <ConfirmDialog2
                                group="declarative"
                                visible={confirmIsVisible}
                                onHide={() => setConfirmIsVisible(false)}
                                message="Konfirmasi kembali jika anda yakin!"
                                header="Konfirmasi kembali"
                                icon="pi pi-info-circle"
                                accept={handleDeletePlaylist}
                            />

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
                                        rowsPerPageOptions={[5, 10, 25, 50]}
                                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                        currentPageReportTemplate="{first} - {last} dari {totalRecords}"
                                        filters={filters}
                                        rows={10}
                                        emptyMessage="Playlist tidak ditemukan."
                                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                                        header={headerStatus}
                                        globalFilterFields={globalFilterFields}
                                        value={playlists}
                                        dataKey="id"
                                        expandedRows={expandedRows}
                                        onRowToggle={(e) => {
                                            setExpandedRows(e.data);
                                        }}
                                        rowExpansionTemplate={
                                            rowExpansionTemplate
                                        }
                                        onRowExpand={onRowExpand}
                                    >
                                        <Column
                                            align="center"
                                            expander={allowExpansion}
                                            style={{
                                                width: "fit-content",
                                                whiteSpace: "nowrap",
                                            }}
                                            frozen
                                            headerClassName="dark:border-none bg-white pl-6 dark:bg-slate-900 dark:text-gray-300"
                                        />

                                        <Column
                                            header="Aksi"
                                            body={actionBodyTemplate}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                            frozen
                                            align="center"
                                            className="dark:border-none bg-white"
                                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                        ></Column>
                                        {columns.map((col) => {
                                            return (
                                                <Column
                                                    field={col.field}
                                                    header={col.header}
                                                    body={col.body}
                                                    style={col.style}
                                                    frozen={col.frozen}
                                                    align="left"
                                                    className="dark:border-none bg-white"
                                                    headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                                ></Column>
                                            );
                                        })}
                                        <Column
                                            field="created_at"
                                            className="dark:border-none bg-white lg:whitespace-nowrap lg:w-max"
                                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                            header="Tanggal Input"
                                            align="left"
                                            body={(rowData) => {
                                                return formateDate(
                                                    rowData.created_at
                                                );
                                            }}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>
                                        <Column
                                            field="created_by"
                                            className="dark:border-none bg-white lg:whitespace-nowrap lg:w-max"
                                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                            header="Diinput Oleh"
                                            align="left"
                                            body={(rowData) => {
                                                return rowData.created_by.name;
                                            }}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>
                                    </DataTable>
                                </div>
                            </div>
                        </>
                    )}
                </TabPanel>

                <TabPanel header="Log">
                    {activeIndexTab == 1 && (
                        <LogComponent
                            auth={auth}
                            fetchUrl={"/api/playlists/logs"}
                            filterUrl={"/playlists/logs/filter"}
                            deleteUrl={"/playlists/logs"}
                            objectKeyToIndo={objectKeyToIndo}
                            users={users}
                            showSuccess={showSuccess}
                            showError={showError}
                        />
                    )}
                </TabPanel>

                <TabPanel header="Arsip">
                    {activeIndexTab == 2 && (
                        <ArsipComponent
                            auth={auth}
                            users={users}
                            fetchUrl={"/api/playlists/arsip"}
                            forceDeleteUrl={"/playlists/{id}/force"}
                            restoreUrl={"/playlists/{id}/restore"}
                            filterUrl={"/playlists/arsip/filter"}
                            columns={columns}
                            showSuccess={showSuccess}
                            showError={showError}
                            globalFilterFields={globalFilterFields}
                        />
                    )}
                </TabPanel>
            </TabView>

            {/* Modal tambah playlist*/}
            <Modal
                header="Playlist"
                modalVisible={modalPlaylistIsVisible}
                setModalVisible={setModalPlaylistIsVisible}
            >
                <form onSubmit={(e) => handleSubmitForm(e, "tambah")}>
                    <div className="flex flex-col justify-around gap-4 mt-4">
                        <div className="flex flex-col">
                            <label htmlFor="title">Judul *</label>
                            <InputText
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                className="dark:bg-gray-300"
                                id="title"
                                aria-describedby="title-help"
                            />
                            <InputError
                                message={errors.title}
                                className="mt-2"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="title">Deskripsi Singkat *</label>
                            <InputText
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                className="dark:bg-gray-300"
                                id="description"
                                aria-describedby="description-help"
                            />
                            <InputError
                                message={errors.description}
                                className="mt-2"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="category">Thumbnail *</label>
                            <div className="App">
                                <FilePond
                                    onaddfile={(error, fileItems) => {
                                        setData("thumbnail", fileItems.file);
                                    }}
                                    maxFileSize="2mb"
                                    labelMaxFileSizeExceeded="File terlalu besar"
                                    name="files"
                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                />
                            </div>
                            <InputError
                                message={errors.thumbnail}
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
            </Modal>

            {/* Modal edit playlist */}
            <Modal
                header="Edit Playlist"
                modalVisible={modalEditPlaylistIsVisible}
                setModalVisible={setModalEditPlaylistIsVisible}
            >
                <form onSubmit={(e) => handleSubmitForm(e, "update")}>
                    <div className="flex flex-col justify-around gap-4 mt-4">
                        <div className="flex flex-col">
                            <label htmlFor="title">Judul *</label>
                            <InputText
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                className="dark:bg-gray-300"
                                id="title"
                                aria-describedby="title-help"
                            />
                            <InputError
                                message={errors.title}
                                className="mt-2"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="title">Deskripsi Singkat *</label>
                            <InputText
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                className="dark:bg-gray-300"
                                id="description"
                                aria-describedby="description-help"
                            />
                            <InputError
                                message={errors.description}
                                className="mt-2"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="category">Thumbnail *</label>

                            <div className="App">
                                {data.thumbnail !== null &&
                                typeof data.thumbnail == "string" ? (
                                    <>
                                        <FilePond
                                            files={data.thumbnail}
                                            onaddfile={(error, fileItems) => {
                                                if (!error) {
                                                    setData(
                                                        "thumbnail",
                                                        fileItems.file
                                                    );
                                                }
                                            }}
                                            onremovefile={() => {
                                                setData("thumbnail", null);
                                            }}
                                            maxFileSize="2mb"
                                            labelMaxFileSizeExceeded="File terlalu besar"
                                            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                        />
                                    </>
                                ) : (
                                    <>
                                        <FilePond
                                            onaddfile={(error, fileItems) => {
                                                if (!error) {
                                                    setData(
                                                        "thumbnail",
                                                        fileItems.file
                                                    );
                                                }
                                            }}
                                            onremovefile={() => {
                                                setData("thumbnail", null);
                                            }}
                                            maxFileSize="2mb"
                                            labelMaxFileSizeExceeded="File terlalu besar"
                                            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                        />
                                    </>
                                )}
                            </div>

                            <InputError
                                message={errors.thumbnail}
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
            </Modal>

            {/* Modal tambah video*/}
            <Modal
                header="Video"
                modalVisible={modalVideoIsVisible}
                setModalVisible={setModalVideoIsVisible}
            >
                <form onSubmit={(e) => handleSubmitVideoForm(e, "tambah")}>
                    <div className="flex flex-col justify-around gap-4 mt-4">
                        <div className="flex flex-col">
                            <label htmlFor="title">Judul *</label>
                            <InputText
                                value={dataVideo.title}
                                onChange={(e) =>
                                    setDataVideo("title", e.target.value)
                                }
                                className="dark:bg-gray-300"
                                id="title"
                                aria-describedby="title-help"
                            />
                            <InputError
                                message={errorsVideo.title}
                                className="mt-2"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="category">Video *</label>
                            <div className="App">
                                <FilePond
                                    onaddfile={(error, fileItems) => {
                                        setDataVideo("video", fileItems.file);
                                    }}
                                    maxFileSize="500mb"
                                    labelMaxFileSizeExceeded="File terlalu besar"
                                    name="files"
                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                />
                            </div>
                            <InputError
                                message={errorsVideo.video}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className="flex justify-center mt-5">
                        <Button
                            label="Submit"
                            disabled={processingVideo}
                            className="bg-purple-600 text-sm shadow-md rounded-lg"
                        />
                    </div>
                </form>
            </Modal>

            {/* Modal edit video*/}
            <Modal
                header="Video"
                modalVisible={modalEditVideoIsVisible}
                setModalVisible={setModalEditVideoIsVisible}
            >
                <form onSubmit={(e) => handleSubmitVideoForm(e, "update")}>
                    <div className="flex flex-col justify-around gap-4 mt-4">
                        <div className="flex flex-col">
                            <label htmlFor="title">Judul *</label>
                            <InputText
                                value={dataVideo.title}
                                onChange={(e) =>
                                    setDataVideo("title", e.target.value)
                                }
                                className="dark:bg-gray-300"
                                id="title"
                                aria-describedby="title-help"
                            />
                            <InputError
                                message={errorsVideo.title}
                                className="mt-2"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="category">Video *</label>

                            <div className="App">
                                {dataVideo.video !== null &&
                                typeof dataVideo.video == "string" ? (
                                    <>
                                        <FilePond
                                            files={dataVideo.video}
                                            onaddfile={(error, fileItems) => {
                                                if (!error) {
                                                    setDataVideo(
                                                        "video",
                                                        fileItems.file
                                                    );
                                                }
                                            }}
                                            onremovefile={() => {
                                                setDataVideo("video", null);
                                            }}
                                            maxFileSize="500mb"
                                            labelMaxFileSizeExceeded="File terlalu besar"
                                            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                        />
                                    </>
                                ) : (
                                    <>
                                        <FilePond
                                            onaddfile={(error, fileItems) => {
                                                if (!error) {
                                                    setDataVideo(
                                                        "video",
                                                        fileItems.file
                                                    );
                                                }
                                            }}
                                            onremovefile={() => {
                                                setDataVideo("video", null);
                                            }}
                                            maxFileSize="500mb"
                                            labelMaxFileSizeExceeded="File terlalu besar"
                                            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                        />
                                    </>
                                )}
                            </div>
                            <InputError
                                message={errorsVideo.video}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className="flex justify-center mt-5">
                        <Button
                            label="Submit"
                            disabled={processingVideo}
                            className="bg-purple-600 text-sm shadow-md rounded-lg"
                        />
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
};

export default Index;
