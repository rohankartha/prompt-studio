import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import OpenAI from "openai";


// Create a new run
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

    // Check if prompt has been saved
    let prompt = await prisma.prompt.findFirst({
        where: {
            name: body.prompt.name,
            version: body.prompt.version,
            userId: userId
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
            id: body.datasetId,
            userId: userId
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
    const latencies = [];

    for (const row of rows) {

        const start = performance.now();

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

        const latency = performance.now() - start;
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
        latencies.push(latency)
    }

    const run = await prisma.run.create({
        data: {
            userId: userId,
            promptId: prompt.id,
            datasetId: dataset.id,
            output: actualOutputs,
            latencies: latencies,
            tokensIn: totalPromptTokens,
            tokensOut: totalCompletionTokens,
        },
    });

    return NextResponse.json(results);
}


export async function GET() {

    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    };

    const runs = await prisma.run.findMany({
        select: {
            id: true,
            prompt: {
                select: {
                    name: true
                }
            },
            dataset: {
                select: {
                    name: true
                }
            },
            latencies: true,
            tokensIn: true,
            tokensOut: true
        },
        where: {
            userId: userId
        }
    });

    const runResults = runs.map((run) => ({
        id: run.id,
        promptName: run.prompt.name,
        datasetName: run.dataset.name,
        avgLatency: run.latencies.reduce((sum, n) => sum + n, 0) / run.latencies.length,
        tokensIn: run.tokensIn,
        tokensOut: run.tokensOut,
    }));

    return NextResponse.json(runResults);
}