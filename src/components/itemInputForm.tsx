"use client";
import { Dispatch, SetStateAction } from "react";

interface Props {
    category: string;
    setCategory: Dispatch<SetStateAction<string>>;
    productName: string;
    setProductName: Dispatch<SetStateAction<string>>;
    description: string;
    setDescription: Dispatch<SetStateAction<string>>;
}

export default function ItemInput(props: Props) {
    const categories = [
        "Accessories",
        "Costumes",
        "Fabric",
        "Halloween",
        "Hats&Wigs",
        "Jewelry",
        "Kitchen",
        "Living Room",
        "PersonalProps",
        "SetDressing",
        "Shoes",
        "Supplies",
        "Uncategorized",
        "Weapons",
    ]
    const CategorySelect = () => 
        <select
            defaultValue="Uncategorized"
            onChange={(e) => props.setCategory(e.target.value)}
            className="bg-white text-gray-950 rounded-lg border border-amber-400 text-xs font-light pl-3 pr-3 py-3 focus:placeholder-white-800"
        >{
            categories.map( (x,y) => <option key={y} value={x}>{x}</option> )
        }</select>;

    return (
        <div className="bg-orange-50 rounded-xl">
            <form className="m-5">
                <div className="text-amber-700 font-bold mb-3 text-sm">
                    Name
                </div>
                <input
                    className="text-gray-950 rounded-lg border border-amber-400 text-xs font-light pl-3 pr-3 py-3 focus:placeholder-gray-800 focus:outline-none"
                    style={{ width: "100%" }}
                    placeholder="Enter Text Here..."
                    value={props.productName}
                    onChange={(e) => props.setProductName(e.target.value)}
                />
                <div className="text-amber-700 font-bold mt-4 mb-3 text-sm">
                    Category
                </div>
                { CategorySelect() }
                <div className="mt-4 text-amber-700 font-bold mb-3 text-sm">
                    Description
                </div>

                <textarea
                    className="text-gray-950 rounded-lg border border-amber-400 text-xs font-light pl-3 pr-3 py-3 focus:placeholder-gray-800 focus:outline-none"
                    value={props.description}
                    onChange={(e) => props.setDescription(e.target.value)}
                    style={{
                        maxHeight: "200px",
                        height: "200px",
                        width: "100%",
                    }}
                    placeholder="Enter Text Here..."
                />
            </form>
        </div>
    );
}
