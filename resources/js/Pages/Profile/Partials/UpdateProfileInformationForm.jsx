import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { Image } from "primereact/image";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
import { useState } from "react";
import { Toast } from "primereact/toast";
registerPlugin(FilePondPluginFileValidateSize);

export default function UpdateProfileInformation({
    className = "",
    showSuccess,
    showError,
}) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.data.name,
            email: user.data.email,
            number: user.data.number,
            profile_picture: user.data.profile_picture,
            signature: user.data.signature,
        });

    const [tempImageProfile, setTempImageProfile] = useState(
        data.profile_picture ?? "/assets/img/user_profile_img.png"
    );
    const [tempImageSignature, setTempImageSignature] = useState(
        data.signature ?? "/assets/img/user_profile_img.png"
    );

    const submit = (e) => {
        e.preventDefault();
        post(route("profile.update"), {
            onSuccess: () => {
                router.get("/profile");
                showSuccess("update");
            },
            onError: (errors) => {
                showError("update");
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Biodata</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Perbarui profil Anda untuk memastikan semua informasi tetap
                    akurat dan terupdate.
                </p>
            </header>

            <form onSubmit={submit} className="mt-3 space-y-3">
                <div className="flex items-center gap-3">
                    <div
                        className="rounded-lg bg-no-repeat w-[120px] bg-contain bg-center h-[80px]"
                        style={{
                            backgroundImage: `url(${tempImageProfile})`,
                        }}
                    ></div>
                    <div className="w-full h-full">
                        <InputLabel htmlFor="name" value="Foto" />
                        <FilePond
                            onaddfile={(error, fileItems) => {
                                if (!error) {
                                    const file = fileItems.file;
                                    const tempUrl = URL.createObjectURL(file);
                                    setTempImageProfile(tempUrl);
                                    setData("profile_picture", file);
                                }
                            }}
                            className="h-full"
                            onremovefile={() => {
                                setData("profile_picture", null);
                            }}
                            maxFileSize="2mb"
                            labelMaxFileSizeExceeded="File terlalu besar"
                            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                        />
                    </div>
                </div>

                {(user.data.roles[0].name === "account executive" ||
                    user.data.roles[0].name === "account manager") && (
                    <div className="flex items-center gap-3">
                        <div
                            className="rounded-lg bg-no-repeat w-[120px] bg-contain bg-center h-[80px]"
                            style={{
                                backgroundImage: `url(${tempImageSignature})`,
                            }}
                        ></div>
                        <div className="w-full h-full">
                            <InputLabel
                                htmlFor="signature"
                                value="Tanda tangan"
                            />
                            <FilePond
                                onaddfile={(error, fileItems) => {
                                    if (!error) {
                                        const file = fileItems.file;
                                        const tempUrl =
                                            URL.createObjectURL(file);
                                        setTempImageSignature(tempUrl);
                                        setData("signature", file);
                                    }
                                }}
                                className="h-full"
                                onremovefile={() => {
                                    setData("signature", null);
                                }}
                                maxFileSize="2mb"
                                labelMaxFileSizeExceeded="File terlalu besar"
                                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                            />
                        </div>
                    </div>
                )}

                <div>
                    <InputLabel htmlFor="name" value="Nama" />

                    <TextInput
                        id="name"
                        className="mt-1 text-sm h-[35px] block w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 text-sm h-[35px] block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="number" value="Nomor Telepon" />

                    <TextInput
                        id="number"
                        className="mt-1 text-sm h-[35px] block w-full"
                        value={data.number}
                        onChange={(e) => setData("number", e.target.value)}
                        type="number"
                        required
                        isFocused
                        autoComplete="number"
                    />

                    <InputError
                        className="mt-2"
                        message={errors.phone_number}
                    />
                </div>

                {/* {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )} */}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Submit</PrimaryButton>
                </div>
            </form>
        </section>
    );
}
