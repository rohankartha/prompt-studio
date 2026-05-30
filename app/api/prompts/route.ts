import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {

    const body = await req.json();
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    };

    const checkExistingPrompt = await prisma.prompt.findFirst({
        where: {
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









export async function GET() {

    const prompts = await prisma.prompt.findMany({
        select: {
            id: true,
            name: true,
            version: true
        }
    });

    return NextResponse.json(prompts);



}