import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_req: NextRequest) => {
    const response = await prisma.document.deleteMany({});
    if(!response) return NextResponse.json({message: 'could not delete data'});
    return NextResponse.json({message: 'data deleted!!!'});
}