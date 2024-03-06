const HeaderModule = ({ title, children }) => {
    return (
        <div className="flex justify-center">
            <div className="flex min-h-[55px] rounded-lg justify-between align-middle items-center bg-white dark:bg-slate-900 dark:text-gray-400 shadow-md w-full py-2 px-3">
                <div>
                    <h1 className="font-bold text-gray-800 dark:text-gray-200">
                        {title}
                    </h1>
                </div>
                {children}
            </div>
        </div>
    );
};

export default HeaderModule;
