import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";


export async function POST(req: Request) {

    const body = await req.json();
    const { userId } = await auth();

    // Return error if unauthorized user
    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    };

    const dataset = await prisma.dataset.create({
        data: {
            name: body["newDatasetName"],
            userId: userId
        },
    });

    return NextResponse.json({
        dataset: dataset
    });
}


export async function PUT(req: Request) {
    const body = await req.json();

    console.log(body);

    const dataset = await prisma.dataset.update({
        where: {
            id: body["datasetId"],
        },
        data: {
            rows: body["tableData"]
        },
    });

    return NextResponse.json(dataset.id);


}

export async function GET() {
    
    const datasets = await prisma.dataset.findMany({
        select: {
            id: true,
            name: true,
            numberOfEntries: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    return NextResponse.json(datasets);
}