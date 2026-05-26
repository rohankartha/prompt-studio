import { prisma } from "@/lib/prisma";
import { Next } from "@hugeicons/core-free-icons";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ datasetId: string }> }
) {
    const { datasetId } = await params;

    const dataset = await prisma.dataset.findUnique({
        where: {
            id: datasetId,
        },
        select: {
            id: true,
            name: true,
            rows: true,
        },
    });

    // console.log(datasetId); // "123"

    return NextResponse.json(dataset);
}