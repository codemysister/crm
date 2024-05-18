import ReactPlayer from "react-player";

const Video = ({ title, video, data, setSelectedVideo }) => {
    return (
        <div
            className="cursor-pointer shadow-md w-full h-[200px]"
            onClick={() => setSelectedVideo((prev) => data)}
        >
            <ReactPlayer
                width={"100%"}
                height={"200px"}
                playIcon={null}
                playing={false}
                url={"/" + video}
            />
        </div>
    );
};

export default Video;
