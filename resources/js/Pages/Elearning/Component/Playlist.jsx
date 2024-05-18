import { router } from "@inertiajs/react";
import { Image } from "primereact/image";

const Playlist = ({ title, thumbnail, slug, description }) => {
    const selectPlaylist = (slug) => {
        router.get(`/e-learning/${slug}`);
    };
    return (
        <div
            className="rounded-xl cursor-pointer shadow-md w-full h-[250px]"
            onClick={() => selectPlaylist(slug)}
        >
            <div
                className="w-full h-[150px] bg-no-repeat bg-cover rounded-t-xl"
                style={{
                    backgroundImage: `url(${thumbnail})`,
                }}
            ></div>
            <div className="p-3 flex flex-col h-[120px] ">
                <h1 className="font-bold text-left self-start">{title}</h1>
                <p className="text-left">{description}</p>
            </div>
        </div>
    );
};

export default Playlist;
