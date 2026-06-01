import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ promptId: string }> }
) {

    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    };

    const { promptId } = await params;

    const prompt = await prisma.prompt.findUnique({
        where: {
            id: promptId,
            userId: userId
        },
        select: {
            id: true,
            name: true,
            content: true,
            version: true
        },
    });
    return NextResponse.json(prompt);
}

