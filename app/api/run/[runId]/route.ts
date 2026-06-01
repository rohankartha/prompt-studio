import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ runId: string }> }
){

    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    };

    const { runId } = await params;
    const run = await prisma.run.findUnique({
        select: {
            promptId: true,
            datasetId: true
        },
        where: {
            id: runId,
            userId: userId
        }
    });

    return NextResponse.json(run);
}