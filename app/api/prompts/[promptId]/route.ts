import { prisma } from "@/lib/prisma";
import { Next } from "@hugeicons/core-free-icons";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ promptId: string }> }
) {
    const { promptId } = await params;

    const prompt = await prisma.prompt.findUnique({
        where: {
            id: promptId
        },
        select: {
            id: true,
            name: true,
            content: true,
            version: true
        },
    });

    console.log(prompt)

    return NextResponse.json(prompt);
}

