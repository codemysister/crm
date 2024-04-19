const ShowError = ({ message }) => {
    return toast.current.show({
        severity: "error",
        summary: "Error",
        detail: message,
        content: (props) => {
            return (
                <div className="flex w-full flex-col">
                    <div className="flex align-items-center gap-2">
                        <span className="font-bold text-900">Error</span>
                    </div>
                    <div className="w-[90%] my-3 text-900">
                        <ul className="text-base list-inside list-disc">
                            {Object.values(props.message.detail).map(
                                (error) => {
                                    return <li className="my-2">{error}</li>;
                                }
                            )}
                        </ul>
                    </div>
                </div>
            );
        },
        life: 3000,
    });
};

export default ShowError;
