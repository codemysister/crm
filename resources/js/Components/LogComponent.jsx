import HeaderDatatable from "@/Components/HeaderDatatable";
import InputError from "@/Components/InputError";
import SkeletonDatatable from "@/Components/SkeletonDatatable";
import { formateDate } from "@/Utils/formatDate";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { FilterMatchMode } from "primereact/api";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import {
    ConfirmDialog,
    ConfirmDialog as ConfirmDialog2,
    confirmDialog,
} from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { OverlayPanel } from "primereact/overlaypanel";
import { Sidebar } from "primereact/sidebar";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

const LogComponent = ({
    auth,
    users,
    showError,
    showSuccess,
    fetchUrl,
    filterUrl,
    deleteUrl,
    objectKeyToIndo,
}) => {
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [selectedLog, setselectedLog] = useState(null);
    const [selectedLogDelete, setSelectedLogDelete] = useState(null);
    const [confirmIsVisible, setConfirmIsVisible] = useState(false);
    const [sidebarFilter, setSidebarFilter] = useState(null);
    const btnFilterRef = useRef(null);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [logs, setLogs] = useState(null);
    const op = useRef();
    const { roles, permissions, data: currentUser } = auth.user;

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
        date: { start: null, end: null },
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

    const getLog = async () => {
        setIsLoadingData(true);
        let response = await fetch(fetchUrl);
        // let response = await fetch("/api/leads/logs");
        let data = await response.json();
        setLogs((prev) => (prev = data));

        setIsLoadingData(false);
    };

    const confirmDeleteLog = () => {
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

    useEffect(() => {
        const fetchData = async () => {
            setPreRenderLoad((prev) => (prev = false));
            await getLog();
        };

        fetchData();
    }, []);

    const filterButtonIcon = () => {
        return (
            <i
                className="pi pi-filter"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };

    const headerStatus = () => {
        return (
            <HeaderDatatable filters={filters} setFilters={setFilters}>
                <Button
                    className="shadow-md border border-slate-600 bg-transparent text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-md"
                    onClick={() => setSidebarFilter(true)}
                >
                    <span className="w-full flex justify-center items-center gap-1">
                        <i
                            className="pi pi-filter"
                            style={{ fontSize: "0.7rem" }}
                        ></i>{" "}
                        <span>filter</span>
                    </span>
                </Button>

                {permissions.includes("hapus log") && (
                    <Button
                        severity="danger"
                        className="rounded-md shadow-md text-sm"
                        onClick={confirmDeleteLog}
                        disabled={
                            !selectedLogDelete || !selectedLogDelete.length
                        }
                    >
                        <span className="w-full flex justify-center items-center gap-1">
                            <i
                                className="pi pi-trash"
                                style={{ fontSize: "0.7rem" }}
                            ></i>{" "}
                            <span>hapus</span>
                        </span>
                    </Button>
                )}
            </HeaderDatatable>
        );
    };

    const handleFilter = async (e) => {
        e.preventDefault();
        setIsLoadingData(true);
        const formData = {
            user: dataFilter.user,
            date: dataFilter.date,
        };

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");

        const response = await axios.post(filterUrl, formData, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
        });
        const data = response.data;
        setLogs(data);
        setSidebarFilter(false);
        setIsLoadingData(false);
    };

    const handleDeleteLogs = async () => {
        setIsLoadingData(true);
        const ids = selectedLogDelete.map((data) => data.id);
        const response = await axios

            .delete(`${deleteUrl}?ids=` + ids, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(() => {
                getLog();
                showSuccess("Hapus");
                setTimeout(() => {
                    setIsLoadingData(false);
                }, 1000);
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

    if (preRenderLoad) {
        return <SkeletonDatatable auth={auth} />;
    }
    return (
        <div className="flex mx-auto flex-col justify-center mt-5 gap-5">
            <ConfirmDialog />
            <ConfirmDialog2
                group="declarative"
                visible={confirmIsVisible}
                onHide={() => setConfirmIsVisible(false)}
                message="Konfirmasi kembali jika anda yakin!"
                header="Konfirmasi kembali"
                icon="pi pi-info-circle"
                accept={handleDeleteLogs}
            />

            {/* Sidebar filter */}
            <Sidebar
                header="Filter"
                visible={sidebarFilter}
                className="w-full md:w-[30%] px-3 dark:glass dark:text-white"
                position="right"
                onHide={() => setSidebarFilter(false)}
            >
                <form onSubmit={handleFilter}>
                    <div className="flex flex-col mt-3">
                        <label htmlFor="name">Berdasarkan user</label>
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
                        <label htmlFor="">Tanggal</label>
                        <div className="flex items-center gap-2">
                            <Calendar
                                value={
                                    dataFilter.date.start
                                        ? new Date(dataFilter.date.start)
                                        : null
                                }
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setDataFilter("date", {
                                        ...dataFilter.date,
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
                                    dataFilter.date.end
                                        ? new Date(dataFilter.date.end)
                                        : null
                                }
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setDataFilter("date", {
                                        ...dataFilter.date,
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
                            className="outline-purple-600 outline-1 outline-dotted bg-transparent text-slate-700 dark:text-slate-300  text-sm shadow-md rounded-lg mr-2"
                        />
                    </div>
                </form>
            </Sidebar>

            <div className="card p-fluid w-full h-full flex justify-center rounded-lg">
                <DataTable
                    id="tablelog"
                    loading={isLoadingData}
                    className="table-log w-full h-auto rounded-lg dark:glass border-none text-center shadow-md"
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
                    rows={10}
                    filters={filters}
                    emptyMessage="Log tidak ditemukan."
                    paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                    header={headerStatus}
                    globalFilterFields={[
                        "name",
                        "category",
                        "causer.name",
                        "subject.name",
                        "subject.partner_name",
                        "subject.institution_name",
                        "subject.npwp",
                        "subject.code",
                    ]}
                    value={logs}
                    dataKey="id"
                    selection={selectedLogDelete}
                    onSelectionChange={(e) => setSelectedLogDelete(e.value)}
                >
                    {permissions.includes("hapus log") && (
                        <Column
                            selectionMode="multiple"
                            exportable={false}
                            className="w-[1%]"
                        ></Column>
                    )}

                    <Column
                        field="causer"
                        hidden
                        className="dark:border-none"
                        headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                        align="left"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        body={(rowData) => {
                            return rowData.causer.name;
                        }}
                    ></Column>
                    <Column
                        field="uuid"
                        hidden
                        className="dark:border-none"
                        headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                        align="left"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                    ></Column>
                    <Column
                        className="dark:border-none"
                        headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                        header="Aktivitas"
                        align="left"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        body={(rowData) => {
                            let causer = rowData.causer
                                ? rowData.causer.name
                                : "";
                            let event = "";
                            let color = "";
                            let severity = "";
                            if (rowData.event == "created") {
                                event = "tambah";
                                color = "green";
                                severity = "success";
                            } else if (rowData.event == "restored") {
                                event = "pulihkan";
                                color = "green";
                                severity = "success";
                            } else if (rowData.event == "payment") {
                                event = "Pembayaran";
                                color = "green";
                                severity = "success";
                            } else if (rowData.event == "deleted") {
                                event = "hapus";
                                color = "red";
                                severity = "error";
                            } else if (rowData.event == "updated") {
                                event = "edit";
                                color = "blue";
                                severity = "info";
                            } else if (rowData.event == "onboarding") {
                                event = "onboarding";
                                color = "blue";
                                severity = "info";
                            } else if (rowData.event == "force") {
                                event = "hapus permanent";
                                color = "red";
                                severity = "error";
                            }
                            return (
                                <div className="flex justify-between w-full">
                                    <div className="flex gap-4">
                                        <Badge
                                            value={event}
                                            severity={
                                                severity == "error"
                                                    ? "danger"
                                                    : severity
                                            }
                                            className="w-28"
                                        ></Badge>
                                        <p>
                                            {formateDate(rowData.created_at) +
                                                ", " +
                                                causer +
                                                " " +
                                                rowData.description}
                                        </p>
                                    </div>

                                    <div>
                                        <Button
                                            label="detail"
                                            className="p-0 underline bg-transparent text-blue-700 text-left"
                                            onClick={(e) => {
                                                op.current.toggle(e);
                                                setselectedLog(
                                                    (prev) =>
                                                        (prev = {
                                                            properties:
                                                                rowData.properties,
                                                            event: rowData.event,
                                                        })
                                                );
                                            }}
                                            aria-controls="popup_menu_right"
                                            aria-haspopup
                                        />
                                    </div>
                                </div>
                            );
                        }}
                    ></Column>
                </DataTable>
            </div>

            <OverlayPanel
                className="w-[80%] md:max-w-[60%] shadow-md dark:bg-slate-900 dark:text-gray-300"
                ref={op}
                showCloseIcon
            >
                <div className="flex flex-wrap gap-2">
                    {selectedLog?.event == "created" ||
                    selectedLog?.event == "onboarding" ||
                    selectedLog?.event == "updated" ||
                    selectedLog?.event == "payment" ||
                    selectedLog?.event == "restored" ? (
                        <div className="flex-1 w-1/2">
                            <Message
                                className={`bg-green-300 text-green-800 rounded-md w-full`}
                                severity={"success"}
                                content={
                                    <div className="flex justify-between w-full max-h-[250px] overflow-y-scroll">
                                        <div className="flex w-full flex-col gap-2">
                                            {(selectedLog?.event ===
                                                "created" ||
                                                selectedLog?.event ===
                                                    "onboarding" ||
                                                selectedLog?.event ===
                                                    "payment" ||
                                                selectedLog?.event ===
                                                    "restored") &&
                                            selectedLog !== null
                                                ? Object.keys(
                                                      selectedLog.properties
                                                          .attributes
                                                  ).map((key) => {
                                                      if (
                                                          key === "status.color"
                                                      ) {
                                                          return null;
                                                      }

                                                      if (
                                                          selectedLog.properties
                                                              .attributes[
                                                              key
                                                          ] === null
                                                      ) {
                                                          return null;
                                                      }
                                                      return (
                                                          <>
                                                              {selectedLog
                                                                  .properties
                                                                  .attributes[
                                                                  key
                                                              ] !== null && (
                                                                  <p>
                                                                      {objectKeyToIndo(
                                                                          key
                                                                      )}{" "}
                                                                      :{" "}
                                                                      {key ===
                                                                          "province" ||
                                                                      key ===
                                                                          "regency"
                                                                          ? JSON.parse(
                                                                                selectedLog
                                                                                    .properties
                                                                                    .attributes[
                                                                                    key
                                                                                ]
                                                                            )
                                                                                .name
                                                                          : selectedLog
                                                                                .properties
                                                                                .attributes[
                                                                                key
                                                                            ]}
                                                                  </p>
                                                              )}
                                                              <hr className="w-full bg-slate-300" />
                                                          </>
                                                      );
                                                  })
                                                : null}

                                            {selectedLog?.event === "updated" &&
                                            selectedLog !== null
                                                ? Object.keys(
                                                      selectedLog.properties
                                                          .attributes
                                                  ).map((key) => {
                                                      if (
                                                          selectedLog.properties
                                                              .attributes[
                                                              key
                                                          ] === null
                                                      ) {
                                                          return null;
                                                      }
                                                      return (
                                                          selectedLog.properties
                                                              .attributes[
                                                              key
                                                          ] !==
                                                              selectedLog
                                                                  .properties
                                                                  .old[key] && (
                                                              <>
                                                                  <p>
                                                                      {objectKeyToIndo(
                                                                          key
                                                                      )}{" "}
                                                                      :{" "}
                                                                      {key ===
                                                                          "province" ||
                                                                      key ===
                                                                          "regency"
                                                                          ? JSON.parse(
                                                                                selectedLog
                                                                                    .properties
                                                                                    .attributes[
                                                                                    key
                                                                                ]
                                                                            )
                                                                                .name
                                                                          : selectedLog
                                                                                .properties
                                                                                .attributes[
                                                                                key
                                                                            ]}
                                                                  </p>
                                                                  <hr className="w-full bg-slate-300" />
                                                              </>
                                                          )
                                                      );
                                                  })
                                                : null}
                                        </div>
                                    </div>
                                }
                            />
                        </div>
                    ) : null}

                    {selectedLog?.event == "updated" ? (
                        <div className="flex-1 w-1/2">
                            <Message
                                className={`bg-red-300 text-red-800 rounded-md w-full`}
                                severity={"success"}
                                content={
                                    <div className="flex justify-between w-full max-h-[250px] overflow-y-scroll">
                                        <div className="flex w-full flex-col gap-2">
                                            {selectedLog !== null
                                                ? Object.keys(
                                                      selectedLog.properties.old
                                                  ).map((key) => {
                                                      if (
                                                          key === "status.color"
                                                      ) {
                                                          return null;
                                                      }
                                                      if (
                                                          selectedLog.properties
                                                              .attributes[
                                                              key
                                                          ] === null
                                                      ) {
                                                          return null;
                                                      }
                                                      return (
                                                          selectedLog.properties
                                                              .attributes[
                                                              key
                                                          ] !==
                                                              selectedLog
                                                                  .properties
                                                                  .old[key] && (
                                                              <>
                                                                  <p>
                                                                      {objectKeyToIndo(
                                                                          key
                                                                      )}{" "}
                                                                      :{" "}
                                                                      {key ===
                                                                          "province" ||
                                                                      key ===
                                                                          "regency"
                                                                          ? JSON.parse(
                                                                                selectedLog
                                                                                    .properties
                                                                                    .old[
                                                                                    key
                                                                                ]
                                                                            )
                                                                                .name
                                                                          : selectedLog
                                                                                .properties
                                                                                .old[
                                                                                key
                                                                            ]}
                                                                  </p>
                                                                  <hr className=" w-full bg-slate-300" />
                                                              </>
                                                          )
                                                      );
                                                  })
                                                : null}
                                        </div>
                                    </div>
                                }
                            />
                        </div>
                    ) : null}

                    {selectedLog?.event == "deleted" ||
                    selectedLog?.event == "force" ? (
                        <div className="flex-1 ">
                            <Message
                                className={`bg-red-300 text-red-800 rounded-md w-full`}
                                severity={"success"}
                                content={
                                    <div className="flex justify-between w-full max-h-[250px] overflow-y-scroll">
                                        <div className="flex w-full flex-col gap-2">
                                            {Object.keys(
                                                selectedLog.properties.old
                                            ).map((key) => {
                                                if (key === "status.color") {
                                                    return null;
                                                }
                                                if (
                                                    selectedLog.properties.old[
                                                        key
                                                    ] === null
                                                ) {
                                                    return null;
                                                }
                                                return (
                                                    <>
                                                        <p>
                                                            {objectKeyToIndo(
                                                                key
                                                            )}{" "}
                                                            :{" "}
                                                            {key ===
                                                                "province" ||
                                                            key === "regency"
                                                                ? JSON.parse(
                                                                      selectedLog
                                                                          .properties
                                                                          .old[
                                                                          key
                                                                      ]
                                                                  ).name
                                                                : selectedLog
                                                                      .properties
                                                                      .old[key]}
                                                        </p>
                                                        <hr className=" w-full bg-slate-300" />
                                                    </>
                                                );
                                            })}
                                        </div>
                                    </div>
                                }
                            />
                        </div>
                    ) : null}
                </div>
            </OverlayPanel>
        </div>
    );
};

export default LogComponent;
