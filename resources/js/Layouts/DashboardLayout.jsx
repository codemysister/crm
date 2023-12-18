import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage} from '@inertiajs/react';
import React, { useEffect, useRef, useState } from "react";

export default function DashboardLayout({user, children}) {
    
    const [theme, setTheme] = useState(localStorage.theme);
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const [isPagesMenuOpen, setIsPagesMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);
    const profileMenuBtnRef = useRef(null);
    const currentPath = window.location.pathname;
    const { roles, permissions } = usePage().props.auth.user

    useEffect(()=>{
        
        theme ? localStorage.theme = 'dark' : localStorage.removeItem('theme');
        
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    

    }, [theme])


    function toggleSideMenu() {
        setIsSideMenuOpen(prev => !prev);
    }

    function closeSideMenu(){
        setIsSideMenuOpen(prev => false);
    }

    function togglePagesMenu() {
        setIsPagesMenuOpen(prev => !prev);
    }

    function toggleProfileMenu(){
        setIsProfileMenuOpen(prev => !prev);
    }

    function toggleTheme(){
        setTheme(prev=>!prev);
    }

    const handleClickAway = (event) => {

        if(profileMenuBtnRef.current?.contains(event.target)){
            return null;
        }else{
            if (!profileMenuRef.current?.contains(event.target) && profileMenuBtnRef.current) {
                setIsProfileMenuOpen(prev => false);
            }
        }
      };

      useEffect(() => {

        document.addEventListener('click', handleClickAway);
        return () => {
          document.removeEventListener('click', handleClickAway);
        };
      }, []);


    return (

        <AuthenticatedLayout
            user={user}
        >
        <Head title="Dashboard">
                                                 
        </Head>

        <div className={`flex h-screen ${isSideMenuOpen ? 'overflow-hidden' : ''}`}>

            {/* Desktop sidebar*/}
            <aside className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-transparent dark:shadow-[rgba(0,0,15,0.5)_1px_1px_5px_0px] md:block flex-shrink-0">
            <div className="py-4 text-gray-500 dark:text-gray-400">
                <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
                Cazh CRM
                </a>
                <ul className="mt-6">
                <li className="relative px-6 py-3">
                    
                    {currentPath == "/dashboard" && (
                    <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    ></span>
                    )}
                    
                    <Link
                    className={`inline-flex items-center font-semibold ${currentPath == "/dashboard" ? 'text-gray-800 dark:text-gray-100' : ''} w-full text-sm transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200`}
                    href={route('dashboard')}
                    >
                    <svg
                        className="w-5 h-5"

                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        ></path>
                    </svg>
                    <span className="ml-4">Dashboard</span>
                    </Link>
                </li>
                </ul>
                <ul>
               
                {roles[0] === 'super admin' && (
                    <li className="relative px-6 py-3">
                    {currentPath == "/users" && (
                        <span
                        className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                        ></span>
                        )}
                    <Link
                        className={`inline-flex items-center ${currentPath == "/users" ? 'text-gray-800 dark:text-gray-100' : ''} w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 `}
                        href={route('users.view')}
                    >
                    

                        <svg 
                        className="w-5 h-5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"></path>
                        </svg>
                        <span className="ml-4">Users</span>
                    </Link>
                    </li>
                )}

                {roles[0] === 'super admin' && (
                    <li className="relative px-6 py-3">
                    {currentPath == "/role-permission" && (
                        <span
                        className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                        ></span>
                        )}
                    <Link
                        className={`inline-flex items-center ${currentPath == "/role-permission" ? 'text-gray-800 dark:text-gray-100' : ''} w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 `}
                        href={route('role-permission.view')}
                    >
                        <svg
                        className="w-5 h-5"

                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        <path
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        ></path>
                        </svg>
                        <span className="ml-4">Role dan Permission</span>
                    </Link>
                    </li>
                )}
                <li className="relative px-6 py-3">
                {currentPath == "/partners" && (
                    <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    ></span>
                    )}
                <Link
                    className={`inline-flex items-center ${currentPath == "/partners" ? 'text-gray-800 dark:text-gray-100' : ''} w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 `}
                    href={route('partners.view')}
                >
    
                    <svg 
                    className="w-5 h-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"></path>
                    </svg>
                    <span className="ml-4">Partner</span>
                </Link>
                </li>
                <li className="relative px-6 py-3">
                {currentPath == "/products" && (
                    <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    ></span>
                    )}
                <Link
                    className={`inline-flex items-center ${currentPath == "/products" ? 'text-gray-800 dark:text-gray-100' : ''} w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 `}
                    href={route('products.view')}
                >
                

                    <svg 
                    className="w-5 h-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"></path>
                    </svg>
                    <span className="ml-4">Produk</span>
                </Link>
                </li>
                <li className="relative px-6 py-3">
                {currentPath == "/spd" && (
                    <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    ></span>
                    )}
                <Link
                    className={`inline-flex items-center ${currentPath == "/spd" ? 'text-gray-800 dark:text-gray-100' : ''} w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 `}
                    href={route('spd.view')}
                >
                
                    <svg 
                    className="w-5 h-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"></path>
                    </svg>
                    <span className="ml-4">Surat Perjalanan Dinas</span>
                </Link>
                </li>
                
                </ul>
                <div className="px-6 my-6">
                <button
                    className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                    onClick={togglePagesMenu}
                    aria-haspopup="true"
                >
                    <span className="ml-4">Pages</span>
                    <svg
                    className="w-4 h-4"

                    fill="currentColor"
                    viewBox="0 0 20 20"
                    >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    ></path>
                    </svg>
                </button>
                {isPagesMenuOpen && (
                    <ul
                    className="p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900"
                    aria-label="submenu"
                    >
                    <li className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                        <a className="w-full" href="pages/login.html">
                        Login
                        </a>
                    </li>
                    <li className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                        <a className="w-full" href="pages/create-account.html">
                        Create account
                        </a>
                    </li>
                    <li className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                        <a className="w-full" href="pages/forgot-password.html">
                        Forgot password
                        </a>
                    </li>
                    <li className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                        <a className="w-full" href="pages/404.html">
                        404
                        </a>
                    </li>
                    <li className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                        <a className="w-full" href="pages/blank.html">
                        Blank
                        </a>
                    </li>
                    </ul>
                )}
                </div>
            </div>
            </aside>


            {/* Mobile sidebar */}
            {/* Backdrop */}
            {isSideMenuOpen && (
            <div onClick={closeSideMenu} className="fixed transition ease-in-out duration-150 inset-0 z-10 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center">
            </div>
            )}

            {isSideMenuOpen && (
                <aside
                    className="fixed inset-y-0 z-20 flex-shrink-0 w-64 mt-16 overflow-y-auto transition ease-in-out duration-150 bg-white dark:bg-gray-800 md:hidden"

        >
                    <div className="py-4 text-gray-500 dark:text-gray-400">
                    <a
                        className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200"
                        href="#"
                    >
                        Windmill
                    </a>
                    <ul className="mt-6">
                        <li className="relative px-6 py-3">
                        <span
                            className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"

                        ></span>
                        <a
                            className="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100"
                            href="index.html"
                        >
                            <svg
                            className="w-5 h-5"

                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            >
                            <path
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            ></path>
                            </svg>
                            <span className="ml-4">Dashboard</span>
                        </a>
                        </li>
                    </ul>
                    <ul>
                        <li className="relative px-6 py-3">
                        <a
                            className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                            href="forms.html"
                        >
                            <svg
                            className="w-5 h-5"

                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            >
                            <path
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            ></path>
                            </svg>
                            <span className="ml-4">Forms</span>
                        </a>
                        </li>
                        <li className="relative px-6 py-3">
                        <a
                            className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                            href="cards.html"
                        >
                            <svg
                            className="w-5 h-5"

                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            >
                            <path
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            ></path>
                            </svg>
                            <span className="ml-4">Cards</span>
                        </a>
                        </li>
                        <li className="relative px-6 py-3">
                        <a
                            className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                            href="charts.html"
                        >
                            <svg
                            className="w-5 h-5"

                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            >
                            <path
                                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                            ></path>
                            <path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                            </svg>
                            <span className="ml-4">Charts</span>
                        </a>
                        </li>
                        <li className="relative px-6 py-3">
                        <a
                            className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                            href="buttons.html"
                        >
                            <svg
                            className="w-5 h-5"

                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            >
                            <path
                                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                            ></path>
                            </svg>
                            <span className="ml-4">Buttons</span>
                        </a>
                        </li>
                        <li className="relative px-6 py-3">
                        <a
                            className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                            href="modals.html"
                        >
                            <svg
                            className="w-5 h-5"

                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            >
                            <path
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            ></path>
                            </svg>
                            <span className="ml-4">Modals</span>
                        </a>
                        </li>
                        <li className="relative px-6 py-3">
                        <a
                            className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                            href="tables.html"
                        >
                            <svg
                            className="w-5 h-5"

                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            >
                            <path d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                            </svg>
                            <span className="ml-4">Tables</span>
                        </a>
                        </li>
                        <li className="relative px-6 py-3">
                        <button
                            className="inline-flex items-center justify-between w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                            onClick={togglePagesMenu}
                            aria-haspopup="true"
                        >
                            <span className="inline-flex items-center">
                            <svg
                                className="w-5 h-5"

                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                                ></path>
                            </svg>
                            <span className="ml-4">Pages</span>
                            </span>
                            <svg
                            className="w-4 h-4"

                            fill="currentColor"
                            viewBox="0 0 20 20"
                            >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            ></path>
                            </svg>
                        </button>
                        {isPagesMenuOpen && (
                            <ul
                            className="transition-all ease-in-out duration-300 p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900"
                            aria-label="submenu">
                            <li
                                className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                            >
                                <a className="w-full" href="pages/login.html">Login</a>
                            </li>
                            <li
                                className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                            >
                                <a className="w-full" href="pages/create-account.html">
                                Create account
                                </a>
                            </li>
                            <li
                                className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                            >
                                <a className="w-full" href="pages/forgot-password.html">
                                Forgot password
                                </a>
                            </li>
                            <li
                                className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                            >
                                <a className="w-full" href="pages/404.html">404</a>
                            </li>
                            <li
                                className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                            >
                                <a className="w-full" href="pages/blank.html">Blank</a>
                            </li>
                            </ul>
                        )}

                        </li>
                    </ul>
                    <div className="px-6 my-6">
                        <button
                        className="flex items-center justify-between px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                        >
                        Create account
                        <span className="ml-2" >+</span>
                        </button>
                    </div>
                    </div>
                </aside>
            )}
            {/* End Mobile sidebar */}


            <div className="flex flex-col flex-1 w-full md:w-3/5">
                <header className="z-10 py-4 bg-white shadow-lg dark:bg-transparent">
                    <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">

                        <button
                        className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
                        onClick={toggleSideMenu}
                        aria-label="Menu"
                        >
                        <svg
                            className="w-6 h-6"

                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                            fillRule="evenodd"
                            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                            ></path>
                        </svg>
                        </button>

                        <div className="flex justify-center flex-1 lg:mr-32">
                        {/* <div
                            className="relative w-full max-w-xl mr-6 focus-within:text-purple-500"
                        >
                            <div className="absolute inset-y-0 flex items-center pl-2">
                            <svg
                                className="w-4 h-4"

                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                                ></path>
                            </svg>
                            </div>
                            <input
                            className="w-full pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
                            type="text"
                            placeholder="Search for projects"
                            aria-label="Search"
                            />
                        </div> */}
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
                                <path
                                    d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                                ></path>
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
                            <button
                            className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
                            onClick={()=>{}}
                            aria-label="Notifications"
                            aria-haspopup="true"
                            >
                            <svg
                                className="w-5 h-5"

                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
                                ></path>
                            </svg>

                            <span

                                className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"
                            ></span>
                            </button>
                            {/* <template x-if="isNotificationsMenuOpen">
                            <ul
                                x-transition:leave="transition ease-in duration-150"
                                x-transition:leave-start="opacity-100"
                                x-transition:leave-end="opacity-0"
                                @click.away="closeNotificationsMenu"
                                @keydown.escape="closeNotificationsMenu"
                                className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:text-gray-300 dark:border-gray-700 dark:bg-gray-700"
                            >
                                <li className="flex">
                                <a
                                    className="inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                                    href="#"
                                >
                                    <span>Messages</span>
                                    <span
                                    className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-600 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-600"
                                    >
                                    13
                                    </span>
                                </a>
                                </li>
                                <li className="flex">
                                <a
                                    className="inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                                    href="#"
                                >
                                    <span>Sales</span>
                                    <span
                                    className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-600 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-600"
                                    >
                                    2
                                    </span>
                                </a>
                                </li>
                                <li className="flex">
                                <a
                                    className="inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                                    href="#"
                                >
                                    <span>Alerts</span>
                                </a>
                                </li>
                            </ul>
                            </template> */}
                        </li>
                        {/* Profile menu */}
                        <li className="relative">
                        <button
                            className="align-middle rounded-full focus:shadow-outline-purple focus:outline-none"
                            onClick={toggleProfileMenu}
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
                                    aria-label="submenu">
                                    <li className="flex">
                                    <a
                                        className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                                        href="#"
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
                                        <path
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        ></path>
                                        </svg>
                                        <span>Profile</span>
                                    </a>
                                    </li>
                                    <li className="flex">
                                    <a
                                        className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                                        href="#"
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
                                        <path
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        ></path>
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        <span>Settings</span>
                                    </a>
                                    </li>
                                    <li className="flex">

                                    <Link href={route('logout')} method="post" as="button" className="inline-flex items-center w-full px-2.5 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                                             <svg
                                                className="w-4 h-4 mr-3"

                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                >
                                                <path
                                                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                                ></path>
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
                <main className="h-full overflow-y-auto w-full p-5">
                    {children}
                </main>
            </div>


        </div>



        </AuthenticatedLayout>

    );
}
