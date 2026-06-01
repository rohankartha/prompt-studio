import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import type { Judge } from "@prisma/client";
import { auth, clerkClient } from "@clerk/nextjs/server";

type JudgeResult = {
    score: number;
    passed: boolean;
    reasoning: string;
};

type DatasetRow = {
    input: string,
    expectedOutput: string
};

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});


// Run a new evaluation
export async function POST(req: Request) {

    // Extracting parameters
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

    const {
        runId,
        datasetId,
        judgeModel,
        judgeType
    } = body;

    // Load run result, dataset, and judge
    const run = await prisma.run.findUnique({
        where: { id: runId, userId: userId },
    });
    const dataset = await prisma.dataset.findUnique({
        where: { id: datasetId, userId: userId },
    });
    const judge = await prisma.judge.findFirst({
        where: { type: judgeType },
    });

    if (!run || !dataset || !judge) {
        return NextResponse.json(
            { error: "Missing prompt version, dataset, or judge" },
            { status: 404 }
        );
    }

    const datasetRows = dataset.rows as DatasetRow[];

    const rows = run.output.map((output, i) => ({
        input: datasetRows[i]["input"],
        expectedOutput: datasetRows[i]["expectedOutput"],
        output,
    }));

    let passedCount = 0;
    let failedCount = 0;


    const inputs: string[] = [];
    const expectedOutputs: string[] = [];
    const actualOutputs: string[] = [];
    const judgeScores: number[] = [];
    const passedArray: boolean[] = [];
    const judgeReasonings: string[] = [];

    for (const row of rows) {

        const judgeResult = await runJudge(
            judge,
            row.input ?? "",
            row.expectedOutput ?? "",
            row.output ?? "",
        );

        if (judgeResult.passed) {
            passedCount++;
        }
        else {
            failedCount++;
        }

        inputs.push(row.input ?? "");
        expectedOutputs.push(row.expectedOutput ?? "");
        actualOutputs.push(row.output ?? "");
        judgeScores.push(judgeResult.score);
        passedArray.push(judgeResult.passed);
        judgeReasonings.push(judgeResult.reasoning);
    }

    await prisma.evaluation.create({
        data: {
            userId: userId,
            runId: runId,
            judgeId: judge.id,
            judgeScore: judgeScores,
            passed: passedArray,
            passedCount: passedCount,
            failedCount: failedCount,
            judgeReasoning: judgeReasonings,
        },
    });

    return NextResponse.json({
        success: true
    });
}








async function runJudge(
    judge: Judge,
    input: string,
    expectedOutput: string,
    actualOutput: string,
): Promise<JudgeResult> {


    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0,
        messages: [
            {
                role: "system",
                content:
                    `Evaluate the expected output against the actual output.
                    Return only valid JSON in this exact format:
                    {
                        "score": number,
                        "passed": boolean,
                        "reasoning": string
                    }

                    Scoring:
                    - score should be between 0 and 1
                    - passed should be true if score >= 0.7
                    - reasoning should briefly explain the judgment`
            },
            {
                role: "user",
                content:
                    `Evaluate the model output.

                    Input:
                    ${input}

                    Expected output:
                    ${expectedOutput}

                    Actual output:
                    ${actualOutput}`,
            },
        ],
        response_format: {
            type: "json_object",
        },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
        return {
            score: 0,
            passed: false,
            reasoning: "Judge returned no response.",
        };
    }

    try {
        const parsed = JSON.parse(content);

        const score =
            typeof parsed.score === "number"
                ? Math.max(0, Math.min(1, parsed.score))
                : 0;

        return {
            score,
            passed:
                typeof parsed.passed === "boolean"
                    ? parsed.passed
                    : score >= 0.7,
            reasoning:
                typeof parsed.reasoning === "string"
                    ? parsed.reasoning
                    : "No reasoning provided.",
        };
    } catch {
        return {
            score: 0,
            passed: false,
            reasoning: content,
        };
    }
}
















export async function GET() {

    const { userId } = await auth();

    // Return error if unauthorized user
    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    };

    const evaluations = await prisma.evaluation.findMany({
        select: {
            id: true
        },
        where: {
            userId: userId
        }
    });
    return NextResponse.json(evaluations);
}