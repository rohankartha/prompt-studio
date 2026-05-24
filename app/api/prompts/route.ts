import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {

    

    const body = await req.json();
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401}
        );
    }

    // console.log(body);
    // console.log(userId);

    const prompt = await prisma.prompt.create({
        data: {
            promptName: body["promptName"],
            systemPrompt: body["systemPrompt"],
            testInput: body["testInput"],
            model: body["model"],
            userId: userId
        }
    });

    console.log(prompt);

    

    return NextResponse.json({
        success: true
    });

}