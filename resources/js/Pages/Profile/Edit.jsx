import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import HeaderModule from "@/Components/HeaderModule";
import { useRef } from "react";
import { Toast } from "primereact/toast";

export default function Edit({ auth, mustVerifyEmail, status }) {
    const toast = useRef(null);

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

    return (
        <DashboardLayout auth={auth.user}>
            <Head title="Profile" />
            <HeaderModule title="Profile"></HeaderModule>
            <Toast ref={toast} />

            <div className="mt-4">
                <div className="flex flex-col md:flex-row items-center gap-4 ">
                    <div className="w-full lg:w-1/2 p-4 sm:p-6 bg-white shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            showSuccess={showSuccess}
                            showError={showError}
                            className="max-w-xl h-fit lg:h-[63vh] overflow-y-scroll pr-4"
                        />
                    </div>

                    <div className="w-full lg:w-1/2 p-4 sm:p-6 bg-white shadow sm:rounded-lg">
                        <UpdatePasswordForm
                            showSuccess={showSuccess}
                            showError={showError}
                            className="max-w-xl h-fit lg:h-[63vh]"
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
