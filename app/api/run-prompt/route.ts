import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {

    const body = await req.json();
    const { userId } = await auth();

    console.log(body)

    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    };

    // Check if prompt has been saved
    let prompt = await prisma.prompt.findFirst({
        where: {
            name: body.prompt.name,
            version: body.prompt.version
        }
    })

    // Save prompt if not already saved
    if (!prompt) {

        prompt = await prisma.prompt.create({
            data: {
                name: body.prompt.name,
                content: body.prompt.content,
                version: body.prompt.version,
                userId: userId
            }
        });
    }

    if (!prompt) {
        return NextResponse.json(
            { error: "Error creating prompt" },
            { status: 404 }
        );
    }

    // Retrieve dataset
    const dataset = await prisma.dataset.findUnique({
        where: {
            id: body.datasetId
        }
    });

    if (!dataset) {
        return NextResponse.json(
            { error: "Dataset does not exist." },
            { status: 404 }
        );
    }

    if (!dataset.rows) {
        return NextResponse.json(
            { error: "Dataset contains no rows" },
            { status: 400 }
        );
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    type DatasetRow = {
        input: string;
        expectedOutput?: string;
        category?: string;
    };

    const rows = dataset.rows as DatasetRow[];


    const results = [];
    let totalPromptTokens: number = 0;
    let totalCompletionTokens: number = 0;

    const expectedOutputs: string[] = [];
    const actualOutputs: string[] = [];

    const start = performance.now();

    for (const row of rows) {
        const response =
            await openai.chat.completions.create({
                model: body.model,
                messages: [
                    {
                        role: "system",
                        content: body.prompt.content,
                    },
                    {
                        role: "user",
                        content: row.input,
                    },
                ],
            });

        totalPromptTokens += response.usage?.prompt_tokens ?? 0;
        totalCompletionTokens += response.usage?.completion_tokens ?? 0;

        const actualOutput = response.choices[0].message.content ?? "";
        const expectedOutput = row.expectedOutput ?? "";

        results.push({
            input: row.input,
            expectedOutput: expectedOutput,
            actualOutput: actualOutput,
        });

        expectedOutputs.push(expectedOutput);
        actualOutputs.push(actualOutput);
    }

    const latencyMs = performance.now() - start;

    const run = await prisma.run.create({
        data: {
            promptId: prompt.id,
            datasetId: dataset.id,
            output: actualOutputs,
            latencyMs: latencyMs,
            tokensIn: totalPromptTokens,
            tokensOut: totalCompletionTokens,
        },
    });

    return NextResponse.json(actualOutputs);
}