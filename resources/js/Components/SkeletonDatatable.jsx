import DashboardLayout from "@/Layouts/DashboardLayout";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Skeleton } from "primereact/skeleton";

const SkeletonDatatable = ({ auth }) => {
    const dummyArray = Array.from({ length: 15 }, (v, i) => i);

    return (
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
                    size="small"
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
    );
};

export default SkeletonDatatable;
