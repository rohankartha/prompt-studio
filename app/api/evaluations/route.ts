import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { inngest } from "@/lib/inngest/client";




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

    // Restrict access for demo accounts
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
        evaluationType,
        judgeModel,
        metric
    } = body;

    const evaluation = await prisma.evaluation.create({
        data: {
            userId,
            runId,
            judgeId: "cmq3a3jeg000kuwp0yld0qm7q",
            judgeScore: [],
            passed: [],
            judgeReasoning: []
        },
    });

    if (evaluationType == "LLM_AS_A_JUDGE") {
        await inngest.send({
            name: "evaluation/requested",
            data: {
                evaluationId: evaluation.id,
                runId,
                datasetId,
                userId,
                judgeModel
            },
        });
    }

    return NextResponse.json(
        { error: "Feature not implemented" },
        { status: 501 }
    );
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