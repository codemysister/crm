import HeaderDatatable from "@/Components/HeaderDatatable";
import { useForm } from "@inertiajs/react";
import { FilterMatchMode } from "primereact/api";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { formateDate } from "@/Utils/formatDate";
const DetailLog = ({
    lead,
    handleSelectedDetailPartner,
    showSuccess,
    showError,
}) => {
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [logs, setLogs] = useState(null);
    const op = useRef();
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
        let response = await fetch("/api/leads/logs?lead=" + lead.id);
        let data = await response.json();

        setLogs((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            await getLog();
        };

        fetchData();
    }, []);

    const objectKeyToIndo = (key) => {
        let keyIndo;
        const keySplit = key.split(".");
        const firstKey = keySplit[0];
        if (firstKey == "name") {
            keyIndo = "Nama";
        } else if (firstKey == "total_members") {
            keyIndo = "Jumlah member";
        } else if (firstKey == "status") {
            keyIndo = "Status";
        } else if (firstKey == "pic") {
            keyIndo = "PIC";
        } else {
            keyIndo = "Alamat";
        }

        return keyIndo;
    };
    return (
        <>
            <div className="flex mx-auto flex-col justify-center gap-5">
                <div className="card p-fluid w-full h-full flex justify-center rounded-lg">
                    <DataTable
                        id="tablelog"
                        loading={isLoadingData}
                        className="w-full h-full rounded-lg border-none text-center"
                        pt={{
                            bodyRow:
                                "dark:bg-transparent bg-transparent dark:text-gray-300 h-full",
                            table: "dark:bg-transparent bg-white dark:text-gray-300 h-full",
                            header: "",
                            thead: "hidden",
                        }}
                        style={{ height: "300px" }}
                        showGridlines
                        paginator
                        filters={filters}
                        rows={10}
                        emptyMessage="Log tidak ditemukan."
                        paginatorClassName="dark:bg-transparent paginator-status-log dark:text-gray-300 rounded-b-lg"
                        globalFilterFields={["name", "category", "causer.name"]}
                        value={logs}
                        dataKey="id"
                    >
                        <Column
                            field="causer"
                            hidden
                            className="border-none"
                            headerClassName="border-none bg-transparent dark:bg-transparent dark:text-gray-300"
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
                            className="border-none"
                            headerClassName="border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                            align="left"
                            style={{
                                width: "max-content",
                                whiteSpace: "nowrap",
                            }}
                        ></Column>
                        <Column
                            className="border-none"
                            headerClassName="border-none bg-transparent dark:bg-transparent dark:text-gray-300"
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
                                } else if (rowData.event == "deleted") {
                                    event = "hapus";
                                    color = "red";
                                    severity = "error";
                                } else if (rowData.event == "updated") {
                                    event = "edit";
                                    color = "blue";
                                    severity = "info";
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
                                                className="w-20"
                                            ></Badge>
                                            <p>
                                                {formateDate(
                                                    rowData.created_at
                                                ) +
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
                                                    setSelectedLog(
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
                    className="w-[40%] shadow-md md:max-w-[50%] dark:bg-slate-900 dark:text-gray-300"
                    ref={op}
                    showCloseIcon
                >
                    <div className="flex flex-wrap gap-2">
                        {selectedLog?.event == "created" ||
                        selectedLog?.event == "updated" ||
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
                                                        "restored") &&
                                                selectedLog !== null
                                                    ? Object.keys(
                                                          selectedLog.properties
                                                              .attributes
                                                      ).map((key) => {
                                                          if (
                                                              key ==
                                                              "status.color"
                                                          ) {
                                                              return;
                                                          }
                                                          return (
                                                              <>
                                                                  <p>
                                                                      {objectKeyToIndo(
                                                                          key
                                                                      )}{" "}
                                                                      :{" "}
                                                                      {
                                                                          selectedLog
                                                                              .properties
                                                                              .attributes[
                                                                              key
                                                                          ]
                                                                      }
                                                                  </p>
                                                                  <hr className=" w-full bg-slate-300" />
                                                              </>
                                                          );
                                                      })
                                                    : null}

                                                {selectedLog?.event ==
                                                    "updated" &&
                                                    (selectedLog !== null
                                                        ? Object.keys(
                                                              selectedLog
                                                                  .properties
                                                                  .attributes
                                                          ).map((key) => {
                                                              if (
                                                                  key ==
                                                                  "status.color"
                                                              ) {
                                                                  return;
                                                              }
                                                              return (
                                                                  selectedLog
                                                                      .properties
                                                                      .attributes[
                                                                      key
                                                                  ] !==
                                                                      selectedLog
                                                                          .properties
                                                                          .old[
                                                                          key
                                                                      ] && (
                                                                      <>
                                                                          <p>
                                                                              {objectKeyToIndo(
                                                                                  key
                                                                              )}{" "}
                                                                              :{" "}
                                                                              {
                                                                                  selectedLog
                                                                                      .properties
                                                                                      .attributes[
                                                                                      key
                                                                                  ]
                                                                              }
                                                                          </p>
                                                                          <hr className=" w-full bg-slate-300" />
                                                                      </>
                                                                  )
                                                              );
                                                          })
                                                        : null)}
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
                                                          selectedLog.properties
                                                              .old
                                                      ).map((key) => {
                                                          if (
                                                              key ==
                                                              "status.color"
                                                          ) {
                                                              return;
                                                          }
                                                          return (
                                                              selectedLog
                                                                  .properties
                                                                  .attributes[
                                                                  key
                                                              ] !==
                                                                  selectedLog
                                                                      .properties
                                                                      .old[
                                                                      key
                                                                  ] && (
                                                                  <>
                                                                      <p>
                                                                          {objectKeyToIndo(
                                                                              key
                                                                          )}{" "}
                                                                          :{" "}
                                                                          {
                                                                              selectedLog
                                                                                  .properties
                                                                                  .old[
                                                                                  key
                                                                              ]
                                                                          }
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
                        {selectedLog?.event == "deleted" ? (
                            <div className="flex-1 ">
                                <Message
                                    className={`bg-red-300 text-red-800 rounded-md w-full`}
                                    severity={"success"}
                                    content={
                                        <div className="flex justify-between w-full max-h-[250px] overflow-y-scroll">
                                            <div className="flex w-full flex-col gap-2">
                                                {Object.keys(
                                                    selectedLog.properties.old
                                                ).map((key) => (
                                                    <>
                                                        <p>
                                                            {objectKeyToIndo(
                                                                key
                                                            )}{" "}
                                                            :{" "}
                                                            {
                                                                selectedLog
                                                                    .properties
                                                                    .old[key]
                                                            }
                                                        </p>
                                                        <hr className=" w-full bg-slate-300" />
                                                    </>
                                                ))}
                                            </div>
                                        </div>
                                    }
                                />
                            </div>
                        ) : null}
                    </div>
                </OverlayPanel>
            </div>
        </>
    );
};

export default DetailLog;
