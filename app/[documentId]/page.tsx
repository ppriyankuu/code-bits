import { Share } from "@/components/share";

export default function DocumentPage({ params }: {params: {documentId: string}}) {
    return <Share documentId={params.documentId} />
}