"use client";
import {
  Dispatch,
  SetStateAction,
  useState,
} from "react";

import ImageCaptureButtons from "./imageCaptureButtons";

interface ImageCaptureProps {
  oldImageUrl: string;
  setNewImageUrl: Dispatch<SetStateAction<string>>;
}

export default function ImageCapture({ oldImageUrl, setNewImageUrl }: ImageCaptureProps) {
  const [imageUrl, setImageUrl] = useState(oldImageUrl || "");

  const handleImageCapture = async (blob: Blob) => {
    const { presignedUrl, imageUrl } = await (
      await fetch("/upload-presigned-url", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
        }
      })
    ).json();

    await fetch(presignedUrl, {
      method: "PUT",
      body: blob,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": blob.type,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          alert("Upload failed: " + (await response.text()));
        }

        setImageUrl(imageUrl);
        setNewImageUrl(imageUrl);
      })
      .catch((error: Error) => {
        alert(`Upload error: ${error}`);
      });
  };

  const handleSetUrl = (url: string) => {
    setImageUrl(url);
    setNewImageUrl(url);
  }

  return (
    <div>
      {imageUrl ? (
        <div>
          <div className="border border-amber-500 p-2 bg-orange-50 rounded-xl">
            <img src={imageUrl} alt="" className="rounded-lg" />
          </div>
          <button
            className="block border border-amber-500 bg-orange-50 text-sm font-medium px-2 py-1 rounded-xl mx-auto mt-3 text-orange-700"
            onClick={() => handleSetUrl("")}
            type="button"
          >
            Delete Photo
          </button>
        </div>
      ) : (
        <ImageCaptureButtons imageCallback={handleImageCapture} setUrlCallback={handleSetUrl} oldImageUrl={oldImageUrl} />
      )}
    </div>
  )
}