import ReactPlayer from "react-player";

const Video = ({ title, video, data, selectedVideos, setSelectedVideo }) => {
    return (
        <div
            className={`cursor-pointer ${
                selectedVideos.title == title ? "border shadow-lg" : ""
            }  w-full  h-[220px] p-1 pt-3 rounded-lg`}
            onClick={() => setSelectedVideo((prev) => data)}
        >
            <ReactPlayer
                width={"100%"}
                height={"180px"}
                playIcon={null}
                playing={false}
                url={"/" + video}
            />
            <h1 className="text-center">{title}</h1>
        </div>
    );
};

export default Video;
