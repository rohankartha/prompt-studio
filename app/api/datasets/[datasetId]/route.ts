import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";


// Retrieve a single dataset
export async function GET (
    request: Request,
    { params }: { params: Promise<{ datasetId: string }> }
){
    // Return error if unauthorized user
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    };

    const { datasetId } = await params;
    const dataset = await prisma.dataset.findUnique({
        select: {
            id: true,
            name: true,
            rows: true,
        },
        where: {
            userId: userId,
            id: datasetId
        }
    });
    return NextResponse.json(dataset);
}