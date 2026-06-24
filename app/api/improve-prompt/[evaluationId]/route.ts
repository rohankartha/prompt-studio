// app/api/agents/improve-prompt/route.ts

import { NextResponse } from "next/server";
import { improvePromptGraph } from "@/lib/agents/improvePromptGraph";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";


type DatasetRow = {
    input: string,
    expectedOutput: string
};


export async function POST(
    request: Request,
    { params }: { params: Promise<{ evaluationId: string }> }
) {
    const { userId } = await auth();

    // Return error if unauthorized user
    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    };

    const { evaluationId } = await params;
    const evaluation = await prisma.evaluation.findUnique({
        where: {
            id: evaluationId,
            userId: userId
        },
        select: {
            run: true,
            judgeScore: true,
            passed: true,
            passedCount: true,
            failedCount: true,
            judgeReasoning: true,
        }
    });

    if (!evaluation) {
        return NextResponse.json(
            { error: "Evaluation not found" },
            { status: 404 }
        );
    };





    // get run 
    // get prompt

    const prompt = await prisma.prompt.findUnique({
        where: {
            id: evaluation.run.promptId,
            userId: userId
        },
        select: {
            content: true
        }
    });

    if (!prompt) {
        return NextResponse.json(
            { error: "Prompt not found" },
            { status: 404 }
        );
    };

    const dataset = await prisma.dataset.findUnique({
        where: {
            id: evaluation.run.datasetId,
            userId: userId
        },
        select: {
            rows: true
        }
    });

    if (!dataset) {
        return NextResponse.json(
            { error: "Dataset not found" },
            { status: 404 }
        );
    };

    const datasetRows = dataset.rows as DatasetRow[];

    const rows = evaluation.run.output.map((output, i) => ({
        input: datasetRows[i]["input"],
        expectedOutput: datasetRows[i]["expectedOutput"],
        output,
    }));

    const inputs = []
    const expectedOutputs = []

    for (const row of rows) {
        inputs.push(row.input)
        expectedOutputs.push(row.expectedOutput)
    }


    const result = await improvePromptGraph.invoke({
        prompt: prompt.content,
        inputs: inputs,
        expectedOutputs: expectedOutputs,
        actualOutputs: evaluation.run.output,
        judgeScores: evaluation.judgeScore,
        judgeReasoning: evaluation.judgeReasoning,
    });

    console.log(result)

    return NextResponse.json(result);
}