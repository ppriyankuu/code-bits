import { reqSchema } from "@/lib";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { success, data } = reqSchema.safeParse(body);

    if(!success)
       return NextResponse.json({message: 'invalid input'}, {status: 400});
    const content = data.content;

    try {
       const document = await prisma.document.create({
        data: { content }
       });

       if(!document) return NextResponse.json({message: "REQUEST failed!!!"}, {status: 500});
       return NextResponse.json({data: document}, {status: 200});
    } catch (error: any) {
        console.log('document creation failed!!!', error.message);
        return NextResponse.json({message: 'INTERNAL SERVER ERROR'}, {status: 500});
    }
}