"use client"
import { SelectItem } from "@/db/schema";
import { useState } from "react";

import TagEditor from "@/components/tagEditor";
import ImageCapture from "./imageCapture";

interface Props {
    itemData: SelectItem;
    allTags: string[];
    updateItem: (formData: FormData) => void;
}

export default function ItemEdit({ itemData, allTags, updateItem }: Props) {
    const oldImageUrl = itemData.imageUrl || "";
    const [imageUrl, setImageUrl] = useState(oldImageUrl);

    return (
        <form className="w-full h-full flex flex-col gap-3"
            action={updateItem}>
            <input className="text-gray-950 text-2xl rounded-lg border border-amber-400 font-light pl-3 pr-3 py-3 focus:placeholder-gray-800 focus:outline-none"
                name="name"
                defaultValue={itemData.name}
                placeholder="Name" />

            <input className="text-gray-950 text-2xl rounded-lg border border-amber-400 font-light pl-3 pr-3 py-3 focus:placeholder-gray-800 focus:outline-none"
                name="category"
                defaultValue={itemData.category || ""}
                placeholder="Category" />

            <TagEditor itemId={itemData.id} tags={allTags} initialTags={itemData.tags} />

            <textarea
                className="text-gray-950 rounded-lg border border-amber-400 font-light pl-3 pr-3 py-3 focus:placeholder-gray-800 focus:outline-none"
                name="description"
                defaultValue={itemData.desc}
                placeholder="Description"
                // onChange={(e) => props.setDescription(e.target.value)}
                style={{
                    maxHeight: "200px",
                    height: "200px",
                    width: "100%",
                }}
            />

            <input type="hidden" name="imageUrl" value={imageUrl} />

            <div className={`flex justify-start`}>
                <ImageCapture oldImageUrl={oldImageUrl} setNewImageUrl={setImageUrl} ></ImageCapture>
            </div>

            <div className="flex justify-end py-10">
                <a href={`/item/${itemData.id}`}>
                    <button
                        className="whitespace-nowrap py-1 px-4 h-10 w-22 bg-white rounded-md text-gray-950 text-base border-2 border-solid border-gray-300 mr-4 hover:bg-gray-300 hover: duration-300"
                        type="button"
                    >
                        Cancel
                    </button>
                </a>


                <button
                    className="whitespace-nowrap py-1 px-4 h-10 w-[80px] bg-teal-800 rounded-xl font-medium text-white text-base hover:bg-gray-800 hover: duration-300"
                    type="submit"
                >
                    Save
                </button>
            </div>
        </form>
    );
}
