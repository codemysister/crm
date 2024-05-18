import ElearningLayout from "@/Layouts/ElearningLayout";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React from "react";
import Lottie from "react-lottie";
import animationData from "@/Source/lottie/video";
import Playlist from "./Component/Playlist";
import { useState } from "react";
const Index = ({ playlistsProp }) => {
    const [playlists, setPlaylists] = useState(playlistsProp);
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };
    return (
        <ElearningLayout>
            <div className="w-full p-10 flex justify-between items-center h-[600px]">
                <div className="w-full  md:w-[50%] ">
                    <h1 className="text-4xl text-left font-bold ">
                        Selamat Datang di Platform E-Learning Kami.
                    </h1>
                    <h2 className="text-lg mt-4 text-left">
                        Jelajahi berbagai modul video pembelajaran yang akan
                        membantu Anda menggunakan produk kami.
                    </h2>
                    <div className="mt-4 w-full">
                        <Button
                            label="Mulai Belajar"
                            className="shadow-md rounded-md"
                            severity="help"
                        />
                    </div>
                </div>
                <div className="w-full  md:w-[50%]  text-4xl text-left font-bold ">
                    <Lottie
                        options={defaultOptions}
                        height={"100%"}
                        width={"100%"}
                    />
                </div>
            </div>

            <div className="w-full p-10 h-[600px] ">
                <div className="w-full h-[35px] flex justify-between items-center ">
                    <h1 className="text-xl font-bold">List Playlist</h1>
                </div>
                <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-3 gap-10">
                    {playlists.map((playlist) => {
                        if (playlist.videos.length < 1) {
                            return null;
                        }
                        return (
                            <Playlist
                                title={playlist.title}
                                thumbnail={playlist.thumbnail}
                                description={playlist.description}
                                slug={playlist.slug}
                            />
                        );
                    })}
                </div>
            </div>
        </ElearningLayout>
    );
};

export default Index;
