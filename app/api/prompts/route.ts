import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";


// Create a new prompt
export async function POST(req: Request) {

    const body = await req.json();
    const { userId } = await auth();

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

    const checkExistingPrompt = await prisma.prompt.findFirst({
        where: {
            userId: userId,
            name: body["name"],
        },
    });

    if (checkExistingPrompt) {
        return NextResponse.json(
            { error: "Prompt with name already exists" },
            { status: 409 }
        );
    }

    const prompt = await prisma.prompt.create({
        data: {
            name: body["name"],
            content: body["content"],
            userId: userId,
            version: body["version"]
        }
    });

    return NextResponse.json(prompt);
}


// Retrieve list of prompts
export async function GET() {

    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    };

    const prompts = await prisma.prompt.findMany({
        select: {
            id: true,
            name: true,
            version: true
        },
        where: {
            userId: userId
        }
    });

    return NextResponse.json(prompts);



}