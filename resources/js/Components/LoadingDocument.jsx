import { ProgressSpinner } from "primereact/progressspinner";

const LoadingDocument = () => {
    return (
        <div className="bg-white flex-col shadow-md justify-center align-middle rounded-md p-10">
            <ProgressSpinner
                style={{ width: "50px", height: "50px" }}
                strokeWidth="8"
                fill="var(--surface-ground)"
                animationDuration=".5s"
                className="flex justify-center"
            />
            <p className="font-bold mt-5">Dokumen sedang dibuat...</p>
        </div>
    );
};

export default LoadingDocument;
