"use client";
import {
    useRef,
    useCallback,
    MutableRefObject,
    useEffect,
    useState,
    ChangeEventHandler,
} from "react";
import Webcam from "react-webcam";
import { Camera } from "./buttonGraphics";

interface ImageCaptureButtonsProps {
    imageCallback: (imageBlob: Blob) => void;
    setUrlCallback?: (url: string) => void;
    oldImageUrl?: string;
}

export default function ImageCaptureButtons({ imageCallback, setUrlCallback, oldImageUrl }: ImageCaptureButtonsProps) {
    const [hasPermission, setHasPermission] = useState(true);
    const [takePhoto, setTakePhoto] = useState(false);
    const [uploadPhoto, setUploadPhoto] = useState(false);
    const [manuallyEnterPhotoUrl, setManuallyEnterPhotoUrl] = useState(false);
    const [manualPhotoUrl, setManualPhotoUrl] = useState(oldImageUrl || "");

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .catch((error: Error) => {
                if (error.name === "NotAllowedError") {
                    setHasPermission(false);
                }
            });
    }, []);

    const videoConstraints = {
        width: 1080,
        height: 1920,
        facingMode: "environment",
    };

    const webcamRef: MutableRefObject<Webcam | null> = useRef(null);
    const capture = useCallback(() => {
        const base64 = webcamRef.current?.getScreenshot()!;

        // Decode the base64 string to a binary string
        const binaryStr = atob(base64.split(",")[1]);
        let length = binaryStr.length;
        const uint8Array = new Uint8Array(length);

        // Convert the binary string to a typed array
        while (length--) {
            uint8Array[length] = binaryStr.charCodeAt(length);
        }

        const imgBlob = new Blob([uint8Array], { type: "image/jpeg" });
        imageCallback(imgBlob);
    }, [webcamRef, imageCallback]);

    const fileUpload: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
        const files = event.target.files;
        if (!files) return;
        if (files.length == 0) return;

        const file = files[0];
        file.arrayBuffer().then(arrBuf => {
            const imgBlob = new Blob([arrBuf], { type: "image/jpeg" });
            imageCallback(imgBlob);
        });
    }, [imageCallback]);

    if (!hasPermission) {
        return (
            <p>
                Please allow camera access for this website to use this feature.
            </p>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full flex flex-row gap-2 mb-3">
                <button
                    className="px-3 py-1 border border-amber-500 rounded-lg"
                    type="button"
                    onClick={() => {
                        setTakePhoto(true);
                        setUploadPhoto(false);
                        setManuallyEnterPhotoUrl(false);
                    }}
                >Take Photo</button>
                <button
                    className="px-3 py-1 border border-amber-500 rounded-lg"
                    type="button"
                    onClick={() => {
                        setTakePhoto(false);
                        setUploadPhoto(true);
                        setManuallyEnterPhotoUrl(false);
                    }}
                >Upload Photo</button>
                {process.env.NODE_ENV === "development" && setUrlCallback !== undefined && <>
                    <button
                        className="px-3 py-1 border border-amber-500 rounded-lg"
                        type="button"
                        onClick={() => {
                            setTakePhoto(false);
                            setUploadPhoto(false);
                            setManuallyEnterPhotoUrl(true);
                        }}
                    >Set Photo URL</button>
                </>}
            </div>
            {takePhoto && <><Webcam
                audio={false}
                ref={webcamRef}
                height={1920}
                screenshotFormat="image/jpeg"
                width={1080}
                videoConstraints={videoConstraints}
                className="rounded-xl"
            />
                <button
                    type="button"
                    onClick={capture}
                    className="mt-2 py-3 pr-3 pl-3 rounded-3xl text-gray-600 bg-gray-100 border-4 border-amber-700 hover:bg-gray-600 hover:text-gray-100"
                >
                    <Camera />
                </button></>}
            {uploadPhoto && <>
                <p>Image uploads must be jpegs.</p>
                <input type="file" placeholder="Upload file" onChange={fileUpload} />
            </>}
            {manuallyEnterPhotoUrl && setUrlCallback !== undefined && <>
                <div className="flex flex-col gap-2 w-full">
                    <p>Set the photo URL.</p>
                    <input
                        className="text-gray-950 rounded-lg border border-amber-400 text-xs font-light pl-3 pr-3 py-3 focus:placeholder-gray-800 focus:outline-none"
                        style={{ width: "100%" }}
                        placeholder="Enter URL Here..."
                        value={manualPhotoUrl}
                        onChange={(e) => setManualPhotoUrl(e.target.value)}
                    />
                    <button
                        className="px-3 py-1 border border-amber-500 rounded-lg"
                        type="button"
                        onClick={() => { setUrlCallback(manualPhotoUrl); }}
                    >Set URL</button>
                </div>
            </>}
        </div>
    );
}
