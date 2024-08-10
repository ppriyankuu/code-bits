import { reqSchema } from "@/lib";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, {params}: {params:{id: string}}){
    try {
        const document = await prisma.document.findUnique({
            where: {
                id: params.id
            },
        });

       if(!document) return NextResponse.json({message: "Document NOT FOUND"}, {status: 404});
       return NextResponse.json({data: document}, {status: 200});
    } catch (error: any) {
        console.log('document fetch failed!!!', error.message);
        return NextResponse.json({message: 'INTERNAL SERVER ERROR'}, {status: 500});
    }
}

export async function POST(req: NextRequest, {params}: {params:{id: string}}) {
    const body = await req.json();
    const { success, data } = reqSchema.safeParse(body);

    if (!success)
       return NextResponse.json({message: 'invalid input'}, {status: 400});
       
    const content = data.content;

    try {
        const document = await prisma.document.update({
            where: { id: params.id },
            data: { content },
        });

        return NextResponse.json({data: document}, {status: 200});
    } catch (error: any) {
        console.log('document updation failed!!!', error.message);
        return NextResponse.json({message: 'Document not found or update failed'}, {status: 404});
    }
}
