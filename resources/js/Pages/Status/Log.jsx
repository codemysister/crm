import HeaderDatatable from "@/Components/HeaderDatatable";
import SkeletonDatatable from "@/Components/SkeletonDatatable";
import { FilterMatchMode } from "primereact/api";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Message } from "primereact/message";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

const Log = ({ auth, showSuccess, showError }) => {
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
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
        let response = await fetch("/api/status/log");
        let data = await response.json();

        setLogs((prev) => data);

        setIsLoadingData(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            setPreRenderLoad((prev) => (prev = false));
            await getLog();
        };

        fetchData();
    }, []);

    const headerStatus = () => {
        return (
            <HeaderDatatable
                globalFilterValue={globalFilterValue}
                onGlobalFilterChange={onGlobalFilterChange}
            ></HeaderDatatable>
        );
    };

    if (preRenderLoad) {
        return <SkeletonDatatable auth={auth} />;
    }
    return (
        <div className="flex mx-auto flex-col justify-center mt-5 gap-5">
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
                    emptyMessage="Status tidak ditemukan."
                    paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                    header={headerStatus}
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
                    {console.log(logs)}
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
                                            {causer + " " + rowData.description}
                                        </p>
                                    </div>

                                    <div>
                                        <Button
                                            label="detail"
                                            className="p-0 underline bg-transparent text-blue-700 text-left"
                                            onClick={(e) => {
                                                op.current.toggle(e);
                                                setSelectedStatus(
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
                className="w-[40%] md:max-w-[50%] dark:bg-slate-900 dark:text-gray-300"
                ref={op}
                showCloseIcon
            >
                <div className="flex flex-wrap gap-2">
                    {selectedStatus?.event == "created" ||
                    selectedStatus?.event == "updated" ||
                    selectedStatus?.event == "restored" ? (
                        <div className="flex-1 w-1/2">
                            <Message
                                className={`bg-green-300 text-green-800 rounded-md w-full`}
                                severity={"success"}
                                content={
                                    <div className="flex justify-between w-full">
                                        <div className="flex flex-col gap-2">
                                            {(selectedStatus?.event ===
                                                "created" ||
                                                selectedStatus?.event ===
                                                    "restored") &&
                                            selectedStatus !== null
                                                ? Object.keys(
                                                      selectedStatus.properties
                                                          .attributes
                                                  ).map((key) => (
                                                      <p>
                                                          {key} :{" "}
                                                          {
                                                              selectedStatus
                                                                  .properties
                                                                  .attributes[
                                                                  key
                                                              ]
                                                          }
                                                      </p>
                                                  ))
                                                : null}

                                            {selectedStatus?.event ==
                                                "updated" &&
                                                (selectedStatus !== null
                                                    ? Object.keys(
                                                          selectedStatus
                                                              .properties
                                                              .attributes
                                                      ).map((key) => {
                                                          return (
                                                              selectedStatus
                                                                  .properties
                                                                  .attributes[
                                                                  key
                                                              ] !==
                                                                  selectedStatus
                                                                      .properties
                                                                      .old[
                                                                      key
                                                                  ] && (
                                                                  <p>
                                                                      {key} :{" "}
                                                                      {
                                                                          selectedStatus
                                                                              .properties
                                                                              .attributes[
                                                                              key
                                                                          ]
                                                                      }
                                                                  </p>
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

                    {selectedStatus?.event == "updated" ? (
                        <div className="flex-1 w-1/2">
                            <Message
                                className={`bg-red-300 text-red-800 rounded-md w-full`}
                                severity={"success"}
                                content={
                                    <div className="flex justify-between w-full">
                                        <div className="flex flex-col gap-2">
                                            {selectedStatus !== null
                                                ? Object.keys(
                                                      selectedStatus.properties
                                                          .old
                                                  ).map((key) => {
                                                      return (
                                                          selectedStatus
                                                              .properties
                                                              .attributes[
                                                              key
                                                          ] !==
                                                              selectedStatus
                                                                  .properties
                                                                  .old[key] && (
                                                              <p>
                                                                  {key} :{" "}
                                                                  {
                                                                      selectedStatus
                                                                          .properties
                                                                          .old[
                                                                          key
                                                                      ]
                                                                  }
                                                              </p>
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
                    {selectedStatus?.event == "deleted" ? (
                        <div className="flex-1 ">
                            <Message
                                className={`bg-red-300 text-red-800 rounded-md w-full`}
                                severity={"success"}
                                content={
                                    <div className="flex justify-between w-full">
                                        <div className="flex flex-col gap-2">
                                            {Object.keys(
                                                selectedStatus.properties.old
                                            ).map((key) => (
                                                <p>
                                                    {key} :{" "}
                                                    {
                                                        selectedStatus
                                                            .properties.old[key]
                                                    }
                                                </p>
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
    );
};

export default Log;
