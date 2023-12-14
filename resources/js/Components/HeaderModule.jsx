const HeaderModule = ({title, children}) => {
    return (
        <div className="flex justify-center">
        <div className="flex min-h-[55px] rounded-lg justify-between align-middle items-center dark:glass bg-white mt-5 shadow-md w-[95%] py-2 px-3">
            <div>
                <h1 className="font-bold text-gray-800 dark:text-gray-200">{title}</h1>
            </div>
            <div>
                {children}
            </div>
        </div>
        </div>
    );
}

export default HeaderModule;