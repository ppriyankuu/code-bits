import { Navbar } from "@/components/navbar";
import { Share } from "@/components/share";

export default function DocumentPage({ params }: {params: {documentId: string}}) {
    return (
        <div className="bg-slate-800 flex flex-col items-center h-screen p-5">
            <Navbar />
            <Share documentId={params.documentId} />
        </div>
    )
}