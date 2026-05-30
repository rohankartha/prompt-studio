import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
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
            latencyMs: true,
            tokensIn: true,
            tokensOut: true
        }
    });

    const runResults = runs.map((run) => ({
        id: run.id,
        promptName: run.prompt.name,
        datasetName: run.dataset.name,
        latencyMs: run.latencyMs,
        tokensIn: run.tokensIn,
        tokensOut: run.tokensOut,
    }));

    return NextResponse.json(runResults);
}