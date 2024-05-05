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

const LogDetailPartnerComponents = ({
    objectKeyToIndo,
    fetchUrl,
    selectedData,
}) => {
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [selectedLog, setselectedLog] = useState(null);
    const [selectedLogDelete, setSelectedLogDelete] = useState(null);
    const [confirmIsVisible, setConfirmIsVisible] = useState(false);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [logs, setLogs] = useState(null);
    const op = useRef();

    const getLog = async () => {
        setIsLoadingData(true);
        let url = fetchUrl.replace("{partner:id}", selectedData.partner_id);
        let response = await fetch(url);
        let data = await response.json();
        setLogs((prev) => (prev = data));

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            await getLog();
        };

        fetchData();
    }, []);

    return (
        <div className="flex mx-auto flex-col justify-center mt-5 gap-5">
            <div className="card p-fluid w-full h-full flex justify-center rounded-lg">
                <DataTable
                    id="tablelog"
                    loading={isLoadingData}
                    className="table-log w-full h-auto rounded-lg dark:glass border-none text-center "
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
                    emptyMessage="Log tidak ditemukan."
                    paginatorClassName="dark:bg-transparent shadow-none paginator-custome dark:text-gray-300 rounded-b-lg"
                    globalFilterFields={["name", "category", "causer.name"]}
                    value={logs}
                    dataKey="id"
                >
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
                                    <div className="flex gap-10">
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
                className="w-[80%] md:max-w-[60%]  dark:bg-slate-900 dark:text-gray-300"
                ref={op}
                showCloseIcon
            >
                <div className="flex flex-wrap gap-2">
                    {selectedLog?.event == "created" ||
                    selectedLog?.event == "onboarding" ||
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
                                                    "onboarding" ||
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
                                                                      {
                                                                          selectedLog
                                                                              .properties
                                                                              .attributes[
                                                                              key
                                                                          ]
                                                                      }
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
                                                                      {
                                                                          selectedLog
                                                                              .properties
                                                                              .attributes[
                                                                              key
                                                                          ]
                                                                      }
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
                                                                    .old[key]
                                                            }
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

export default LogDetailPartnerComponents;
