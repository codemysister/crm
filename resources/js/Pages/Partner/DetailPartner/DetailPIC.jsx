import LogDetailPartnerComponents from "@/Components/LogDetailPartnerComponent";
import { useForm } from "@inertiajs/react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

const DetailPIC = ({
    partner,
    handleSelectedDetailPartner,
    showSuccess,
    showError,
    currentUser,
    permissionErrorIsVisible,
    setPermissionErrorIsVisible,
}) => {
    const [modalEditPicIsVisible, setModalEditPicIsVisible] = useState(false);
    const [modalLogIsVisible, setModalLogIsVisible] = useState(false);

    const {
        data: dataPIC,
        setData: setDataPIC,
        post: postPIC,
        put: putPIC,
        delete: destroyPIC,
        reset: resetPIC,
        processing: processingPIC,
        errors: errorPIC,
    } = useForm({
        uuid: "",
        partner: {},
        name: "",
        number: "",
        position: "",
        email: "",
    });

    const handleEditPIC = (pic) => {
        setDataPIC((data) => ({
            ...data,
            uuid: pic.uuid,
            partner: partner,
            name: pic.name,
            number: pic.number,
            position: pic.position,
            address: pic.address,
            email: pic.email,
        }));

        setModalEditPicIsVisible(true);
    };

    const handleSubmitFormPIC = (e) => {
        e.preventDefault();

        putPIC("/pics/" + dataPIC.uuid, {
            onSuccess: () => {
                showSuccess("Update");
                setModalEditPicIsVisible((prev) => false);
                handleSelectedDetailPartner(dataPIC.partner);
                resetPIC("partner", "name", "number", "position", "address");
            },
            onError: () => {
                showError("Update");
            },
        });
    };

    const objectKeyToIndo = (key) => {
        let keyIndo;
        if (key == "partner.name") {
            keyIndo = "Lembaga";
        } else if (key == "name") {
            keyIndo = "Nama";
        } else if (key == "number") {
            keyIndo = "Nomor Telepon";
        } else if (key == "email") {
            keyIndo = "Email";
        } else if (key == "position") {
            keyIndo = "Posisi";
        }

        return keyIndo;
    };

    return (
        <>
            {partner.pic !== undefined ? (
                <>
                    <table class="w-full dark:text-slate-300 dark:bg-slate-700">
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Nama
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.pic.name}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Jabatan
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.pic.position ?? "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                No. Telp
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.pic.number ?? "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Email
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                {partner.pic.email ?? "-"}
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Log
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                <Button
                                    onClick={() => {
                                        setModalLogIsVisible(true);
                                    }}
                                    className="bg-transparent p-0 cursor-pointer text-blue-700 underline "
                                >
                                    logs
                                </Button>
                            </td>
                        </tr>
                        <tr class="border-b">
                            <td class="pt-2 pb-1  text-base font-bold w-1/5">
                                Aksi
                            </td>
                            <td class="pt-2 pb-1  text-base w-[2%]">:</td>
                            <td class="pt-2 pb-1  text-base w-7/12">
                                <Button
                                    label="edit"
                                    className="p-0 underline bg-transparent text-blue-700 text-left"
                                    onClick={() => {
                                        if (
                                            partner.created_by.id ==
                                            currentUser.id
                                        ) {
                                            handleEditPIC(partner.pic);
                                        } else {
                                            setPermissionErrorIsVisible(
                                                (prev) => (prev = true)
                                            );
                                        }
                                    }}
                                />
                            </td>
                        </tr>
                    </table>

                    {/* Modal edit pic */}
                    <div className="card flex justify-content-center">
                        <Dialog
                            header="Edit PIC"
                            headerClassName="dark:glass shadow-md z-20 dark:text-white"
                            className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                            contentClassName=" dark:glass dark:text-white"
                            visible={modalEditPicIsVisible}
                            onHide={() => setModalEditPicIsVisible(false)}
                        >
                            <form
                                onSubmit={(e) =>
                                    handleSubmitFormPIC(e, "update")
                                }
                            >
                                <div className="flex flex-col justify-around gap-4 mt-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="name">Nama</label>
                                        <InputText
                                            value={dataPIC.name}
                                            onChange={(e) =>
                                                setDataPIC(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            className="dark:bg-gray-300"
                                            id="name"
                                            aria-describedby="name-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="number">Email *</label>
                                        <InputText
                                            value={dataPIC.email}
                                            onChange={(e) =>
                                                setDataPIC(
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                            className="dark:bg-gray-300"
                                            id="email"
                                            aria-describedby="email-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="number">No.Hp</label>
                                        <InputText
                                            keyfilter="int"
                                            min={0}
                                            value={dataPIC.number}
                                            onChange={(e) =>
                                                setDataPIC(
                                                    "number",
                                                    e.target.value
                                                )
                                            }
                                            className="dark:bg-gray-300"
                                            id="number"
                                            aria-describedby="number-help"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="position">
                                            Jabatan
                                        </label>
                                        <InputText
                                            value={dataPIC.position}
                                            onChange={(e) =>
                                                setDataPIC(
                                                    "position",
                                                    e.target.value
                                                )
                                            }
                                            className="dark:bg-gray-300"
                                            id="position"
                                            aria-describedby="position-help"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center mt-5">
                                    <Button
                                        label="Submit"
                                        disabled={processingPIC}
                                        className="bg-purple-600 text-sm shadow-md rounded-lg"
                                    />
                                </div>
                            </form>
                        </Dialog>
                    </div>
                </>
            ) : (
                <div class="w-full h-full min-h-[300px] -mt-4 flex items-center justify-center">
                    <p class="text-center">Tidak ada data PIC</p>
                </div>
            )}

            <Dialog
                header="Log PIC"
                visible={modalLogIsVisible}
                maximizable
                className="w-[90vw] lg:w-[50vw]"
                onHide={() => {
                    setModalLogIsVisible(false);
                }}
            >
                {modalLogIsVisible && (
                    <LogDetailPartnerComponents
                        selectedData={partner.pic}
                        fetchUrl={"/api/pics/{partner:id}/logs"}
                        objectKeyToIndo={objectKeyToIndo}
                    />
                )}
            </Dialog>
        </>
    );
};

export default DetailPIC;
