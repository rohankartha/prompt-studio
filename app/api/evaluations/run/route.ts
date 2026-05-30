// app/api/evaluations/run/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { OutputRow } from "@/lib/client-side-types";
import { Prisma } from "@/generated/prisma/client";
import type { Judge, PromptRunResult } from "@/generated/prisma/client";

type JudgeResult = {
    score: number;
    passed: boolean;
    reasoning: string;
};


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {

    // Extracting parameters
    const body = await req.json();
    const {
        runId,
        datasetId,
        judgeModel,
        judgeType
    } = body;

    // Load run result, dataset, and judge
    const promptRunResult = await prisma.promptRunResult.findUnique({
        where: { id: runId },
    });

    const dataset = await prisma.dataset.findUnique({
        where: { id: datasetId },
    });

    const judge = await prisma.judge.findFirst({
        where: { type: judgeType },
    });

    if (!promptRunResult || !dataset || !judge) {
        return NextResponse.json(
            { error: "Missing prompt version, dataset, or judge" },
            { status: 404 }
        );
    }

    console.log(promptRunResult)
    console.log(dataset)
    console.log(judge)


    const evaluationSummary = await prisma.evaluationSummary.create({
        data: {
            status: "Started",
            runId: runId,
            datasetId: datasetId,
            judgeId: judge.id,
            model: judgeModel
        }
    })

    const datasetRows = dataset.rows as OutputRow[];



    const rows = promptRunResult.actualOutputs.map((actualOutput, i) => ({
        input: datasetRows[i]["expectedOutput"],
        expectedOutput: promptRunResult.expectedOutputs[i],
        actualOutput,
    }));


    let passedCount = 0;


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
            row.actualOutput ?? "",
        );

        if (judgeResult.passed) {
            passedCount++;
        }

        console.log()

        inputs.push(row.input ?? "");
        expectedOutputs.push(row.expectedOutput ?? "");
        actualOutputs.push(row.actualOutput ?? "");
        judgeScores.push(judgeResult.score);
        passedArray.push(judgeResult.passed);
        judgeReasonings.push(judgeResult.reasoning);
    }

    const overallScore = rows.length === 0 ? 0 : passedCount / rows.length;

    await prisma.evaluationResult.create({
        data: {
            runId: runId,
            datasetId: datasetId,
            input: inputs,
            expectedOutput: expectedOutputs,
            actualOutput: actualOutputs,
            judgeScore: judgeScores,
            passed: passedArray,
            judgeReasoning: judgeReasonings,
        },
    });

    await prisma.evaluationSummary.update({
        where: {
            id: evaluationSummary.id
        },
        data: {
            status: "COMPLETED",
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

