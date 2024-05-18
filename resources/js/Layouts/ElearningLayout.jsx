import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Transition } from "@headlessui/react";
import { Head, Link, usePage } from "@inertiajs/react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";

export default function ElearningLayout({ user, children }) {
    const [theme, setTheme] = useState(localStorage.theme);
    const userLoggin = usePage().props.auth.user;
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);
    const profileMenuBtnRef = useRef(null);
    const currentPath = window.location.pathname;
    const [isMobile, setIsMobile] = useState(false);
    const { roles, permissions } = usePage().props.auth.user;

    useEffect(() => {
        theme
            ? (localStorage.theme = "dark")
            : localStorage.removeItem("theme");

        if (
            localStorage.theme === "dark" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    function toggleTheme() {
        setTheme((prev) => !prev);
    }

    return (
        <>
            <Head title="Dashboard"></Head>

            <header className="z-10 fixed py-5 px-10 top-0 h-[70px] w-full bg-white shadow-md dark:shadow-black/90 dark:bg-transparent">
                <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
                    <h1 className="font-bold text-lg">Cazh - Learning</h1>
                    <div className="p-inputgroup w-[50%] md:w-[30%] h-full">
                        <InputText
                            placeholder="Video..."
                            style={{ height: "100%", borderRight: "none" }}
                            className="rounded-l-full"
                        />
                        <Button
                            icon="pi pi-search"
                            style={{
                                borderTop: "1px solid rgba(0,0,0,0.38)",
                                borderRight: "1px solid rgba(0,0,0,0.38)",
                                borderBottom: "1px solid rgba(0,0,0,0.38)",
                                borderCollapse: "collapse",
                                color: "rgba(0,0,0,0.38)",
                            }}
                            className="bg-transparent border-collapse border font-bold rounded-r-full"
                        />
                    </div>
                    <ul className="flex items-center flex-shrink-0 space-x-6">
                        <li className="flex">
                            <button
                                className="rounded-md focus:outline-none focus:shadow-outline-purple"
                                onClick={toggleTheme}
                                aria-label="Toggle color mode"
                            >
                                {theme ? (
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                )}
                            </button>
                        </li>

                        <li className="relative">
                            <p className="font-sm">{userLoggin.data.name}</p>
                        </li>
                        {/* Profile menu */}
                        <li className="relative">
                            <button
                                className="align-middle rounded-full focus:shadow-outline-purple focus:outline-none"
                                onClick={() => {
                                    setIsProfileMenuOpen((prev) => !prev);
                                }}
                                ref={profileMenuBtnRef}
                                aria-label="Account"
                                aria-haspopup="true"
                                on
                            >
                                <img
                                    className="object-cover w-8 h-8 rounded-full"
                                    src="https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=aa3a807e1bbdfd4364d1f449eaa96d82"
                                    alt=""
                                />
                            </button>

                            {isProfileMenuOpen && (
                                <div>
                                    <ul
                                        ref={profileMenuRef}
                                        className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700"
                                        aria-label="submenu"
                                    >
                                        <li className="flex">
                                            <Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className="inline-flex items-center w-full px-2.5 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                                            >
                                                <svg
                                                    className="w-4 h-4 mr-3"
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                                                </svg>
                                                <span>Log out</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            </header>
            <main
                style={{ overflow: "hidden" }}
                className="pt-[70px] overflow-hidden"
            >
                {children}
            </main>
        </>
    );
}
