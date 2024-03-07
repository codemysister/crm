const OptionSignatureTemplate = ({ item }) => {
    return (
        <div className="flex flex-wrap p-2 align-items-center items-center gap-3">
            <img
                className="w-[6rem] shadow-2 flex-shrink-0 border-round"
                src={"/storage/" + item.image}
                alt={item.name}
            />
            <div className="flex-1 flex flex-col gap-2 xl:mr-8">
                <span className="font-bold">{item.name}</span>
                <div className="flex align-items-center gap-2">
                    <span>{item.position}</span>
                </div>
            </div>
            {/* <span className="font-bold text-900">${item.price}</span> */}
        </div>
    );
};

export default OptionSignatureTemplate;
