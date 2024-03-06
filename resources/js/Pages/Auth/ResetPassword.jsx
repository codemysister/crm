import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

const ResetPassword = ({ token, email }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'));
    };

    return (
        <>
            <Head title="Forgot Password" />
            <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
                <div
                className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800"
                >
                    <div className="flex flex-col overflow-y-auto md:flex-row">
                    <div className="h-32 md:h-auto md:w-1/2">
                        <img
                        aria-hidden="true"
                        className="object-cover w-full h-full dark:hidden"
                        src="../assets/img/forgot-password-office.jpeg"
                        alt="Office"
                        />
                        <img
                        aria-hidden="true"
                        className="hidden object-cover w-full h-full dark:block"
                        src="../assets/img/forgot-password-office-dark.jpeg"
                        alt="Office"
                        />
                    </div>
                    <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
                        <div className="w-full">
                        <h1
                            className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200"
                        >
                            Create New Password
                        </h1>

                        <form onSubmit={submit}>
                            <div className="mb-2">
                                <label className="block text-sm">
                                    <span className="text-gray-700 dark:text-gray-400">Email</span>

                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        placeholder="Jane Doe"
                                        className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                                        isFocused={true}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />

                                    <InputError message={errors.email} className="mt-2" />
                                </label>
                            </div>

                            <div className="mb-2">
                                <label className="block text-sm">
                                    <span className="text-gray-700 dark:text-gray-400">Password</span>

                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        autoComplete="new-password"
                                        className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                                        isFocused={true}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />

                                    <InputError message={errors.password} className="mt-2" />
                                </label>
                            </div>

                            <div className="mb-2">
                                <label className="block text-sm">
                                    <span className="text-gray-700 dark:text-gray-400">Password Confirmation</span>

                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        autoComplete="new-password"
                                        className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                                        isFocused={true}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                    />

                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                </label>
                            </div>

                            <button
                            className="iblock w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                                Submit
                            </button>
                        </form>

                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ResetPassword;
