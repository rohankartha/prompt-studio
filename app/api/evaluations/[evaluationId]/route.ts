import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ evaluationId: string }> }
){

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
    }

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
    }

    const summaryStatistics = {
        overallScore: ((evaluation.passedCount)/(evaluation.passedCount + evaluation.failedCount)) * 100,
        passed: evaluation.passedCount,
        failed: evaluation.failedCount,
        avgLatency: (evaluation.run.latencies.reduce((sum, n) => sum + n, 0) / (evaluation.run.latencies.length*1000)).toFixed(2)
    }

    type DatasetRow = {
        input: string;
        expectedOutput: string;
    };

    const rows = Array.isArray(dataset.rows)
        ? dataset.rows as DatasetRow[]
        : [];

    const inputs = [];
    const expectedOutputs = [];
    const outputs = [];
    const judgeScores = [];
    const judgeReasoning = [];
    const latencies = [];

    for (let i = 0; i < rows.length; i++) {
        inputs.push(rows[i].input);
        expectedOutputs.push(rows[i].expectedOutput);
        outputs.push(evaluation.run.output[i]);
        judgeScores.push(evaluation.judgeScore[i]);
        judgeReasoning.push(evaluation.judgeReasoning[i]);
        latencies.push(evaluation.run.latencies[i]);
    }

    const table = {
        id: evaluationId,
        inputs: inputs,
        expectedOutputs: expectedOutputs,
        outputs: outputs,
        judgeScores: judgeScores,
        judgeReasoning: judgeReasoning,
        latencies: latencies
    }

    return NextResponse.json({
        table: table,
        summaryStatistics: summaryStatistics
    });
}