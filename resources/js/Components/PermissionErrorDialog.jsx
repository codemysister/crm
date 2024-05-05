import { Dialog } from "primereact/dialog";
import { useEffect } from "react";
import { useState } from "react";

const PermissionErrorDialog = ({ dialogIsVisible, setDialogVisible }) => {
    return (
        <>
            <Dialog
                header="Aksi Ditolak"
                visible={dialogIsVisible}
                className="shadow-md w-[90vw] lg:w-[30vw]"
                onHide={() => {
                    setDialogVisible(false);
                }}
            >
                <p className="pt-5 pb-2 px-1">
                    Anda tidak memiliki izin untuk melanjutkan aksi ini!
                </p>
            </Dialog>
        </>
    );
};

export default PermissionErrorDialog;
