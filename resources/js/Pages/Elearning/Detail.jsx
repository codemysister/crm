import ElearningLayout from "@/Layouts/ElearningLayout";
import ReactPlayer from "react-player";
import { useEffect } from "react";
import Video from "./Component/Video";
import { useState } from "react";
const Detail = ({ playlistProp }) => {
    const [videos, setVideos] = useState(playlistProp.videos);
    const [selectedVideos, setSelectedVideos] = useState(videos[0]);
    useEffect(() => {
        document.querySelector("body").style.overflow = "hidden";
    }, []);

    return (
        <ElearningLayout>
            <div className="flex overflow-y-hidden">
                <div
                    className="w-full md:w-[70%] h-[89vh]"
                    style={{ overflowY: "hidden" }}
                >
                    <ReactPlayer
                        width={"100%"}
                        height={"90%"}
                        url={"/" + selectedVideos.video}
                        style={{ borderRadius: "50%" }}
                        controls
                    />
                    <h1 className="text-2xl px-2 mt-2 font-bold">
                        {selectedVideos.title}
                    </h1>
                </div>
                <div className="hidden p-5 md:flex md:w-[30%] flex-col gap-4 h-[89vh] overflow-y-scroll">
                    {videos.map((video) => {
                        return (
                            <Video
                                data={video}
                                title={video.title}
                                video={video.video}
                                setSelectedVideo={setSelectedVideos}
                            />
                        );
                    })}
                </div>
            </div>
        </ElearningLayout>
    );
};

export default Detail;
