import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";


// Add a new dataset
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

    const client = await clerkClient();

    const user = await client.users.getUser(userId);

    if (user.publicMetadata.readOnly) {
        return NextResponse.json(
            {error: "Demo accounts cannot perform this action."},
            {status: 403}
        );
    }

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


// Update an existing dataset
export async function PUT(req: Request) {

    const body = await req.json();
    const { userId } = await auth();

    // Return error if unauthorized user
    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    };

    const client = await clerkClient();

    const user = await client.users.getUser(userId);

    if (user.publicMetadata.readOnly) {
        return NextResponse.json(
            {error: "Demo accounts cannot perform this action."},
            {status: 403}
        );
    }

    const dataset = await prisma.dataset.update({
        where: {
            id: body["datasetId"],
            userId: userId
        },
        data: {
            rows: body["tableData"]
        },
    });
    return NextResponse.json(dataset.id);
}


// Retrieve a list of dataset metadata
export async function GET() {

    const { userId } = await auth();

    // Return error if unauthorized user
    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    };

    const datasets = await prisma.dataset.findMany({
        select: {
            id: true,
            name: true,
            numberOfEntries: true,
            createdAt: true,
            updatedAt: true,
        },
        where: {
            userId: userId
        }
    });
    return NextResponse.json(datasets);
}