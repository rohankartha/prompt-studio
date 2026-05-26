import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const body = await req.json();

    // console.log(body);

    const dataset = await prisma.dataset.create({
        data: {
            name: body["newDatasetName"]
        },
    });

    return Response.json({
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
            rows: body["tableData"],
        },
    });

    return NextResponse.json(dataset.id);


}

export async function GET() {
    
    const datasets = await prisma.dataset.findMany({
        select: {
            id: true,
            name: true
        }
    });
    return NextResponse.json(datasets);
}