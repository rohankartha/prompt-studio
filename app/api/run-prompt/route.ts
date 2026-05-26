import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const body = await req.json();
    const { userId } = await auth();

    const dataset = await prisma.dataset.findUnique({
        where: {
            id: body.datasetId
        }
    });

    if (!dataset) {
        return NextResponse.json(
            { error: "Dataset does not exist." },
            { status: 404}
        );
    }

    if (!dataset.rows) {
        return NextResponse.json(
            { error: "Dataset contains no rows" },
            { status: 400 }
        );
    }


    

    for (const row of dataset.rows) {
    const response =
        await openai.chat.completions.create({
            model: body.model,
            messages: [
                {
                    role: "system",
                    content: body.systemPrompt,
                },
                {
                    role: "user",
                    content: row.input,
                },
            ],
        });

    console.log(response.choices[0].message.content);
}


}