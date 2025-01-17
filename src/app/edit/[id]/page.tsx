import { items } from "@/db/schema";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ItemEdit from "@/components/itemEditForm";
import { ChevronLeft } from "@/components/buttonGraphics";

async function getAllTags() {
    let results = await db.query.items.findMany({
        columns: {
            tags: true,
        },
    });

    let allTags = [...new Set(results.flatMap((e) => e.tags))].sort();
    return allTags;
}

export default async function Page({ params }: { params: { id: number } }) {
    /* WHY AM I MAKING A DB QUERY DIRECTLY IN THE COMPONENT?
     *  This component is a server component. That means that none of the code
     *  in this file executes on the client -- it is all executed on the server
     *  the resulting markdown is all that is sent to the client. This means that
     *  we can safely make database requests (and perform other backend
     *  operations) here without a problem.
     *                                                                - Amitav
     */
    const itemData = await db.query.items.findFirst({
        where: eq(items.id, params.id),
    });

    if (!itemData) {
        // TODO: make a proper not found page
        // redirect("/");
        return (
            <main>
                <div className="w-screen h-screen flex flex-row justify-center items-center">
                    <h1 className="text-4xl font-serif">Item Not Found</h1>
                </div>
            </main>
        );
    }

    const tags = await getAllTags();

    let images: string[];
    if (itemData.imageUrl) {
        images = [itemData.imageUrl];
    } else {
        images = [];
    }

    async function updateItem(formData: FormData) {
        // https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
        "use server";
        if (!itemData) return;

        const name = (formData.get('name') || itemData.name).toString();
        const desc = (formData.get('description') || itemData.desc).toString();
        const category = (formData.get('category') || itemData.category || "").toString();
        const imageUrl = (formData.get('imageUrl') === "" ? "" : formData.get('imageUrl') || itemData.imageUrl || "").toString();

        let result = await db.update(items)
            .set({ name, desc, category, imageUrl })
            .where(eq(items.id, itemData.id))
            .returning();

        revalidatePath(`/item/${itemData.id}`);
        revalidatePath("/list-items");
        revalidatePath("list-categories");
        revalidatePath("list-tags");
        redirect(`/item/${itemData.id}`);
    }

    return (
        <main className="bg-white w-screen min-h-screen">
            <Header />
            <div className="p-8 w-full h-full flex flex-col lg:flex-row justify-center items-center">
                <div className="py-10 lg:px-10 bg-white lg:w-[50%] space-y-5 w-full h-full">
                    <div className={"pt-10 pb-5 grid grid-cols divide-y-2"}>
                        <div className="flex flex-col gap-2 justify-between">
                            <a href="/inventory" className="flex flex-row gap-2 text-black">
                                <ChevronLeft />
                                Back to inventory list
                            </a>
                            <div className="first:pt-0 text-left text-sm text-neutral-700">
                                <div className="first:pt-0 text-left text-4xl text-neutral-700 font-bold">
                                    Edit Item
                                </div>
                            </div>
                        </div>
                    </div>
                    <ItemEdit itemData={itemData} allTags={tags} updateItem={updateItem}></ItemEdit>
                </div>
            </div>
            <Footer />
        </main>
    );
}
