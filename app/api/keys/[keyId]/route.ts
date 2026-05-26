import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ keyId: string }> }
) {

    const { keyId } = await params;
    const apiKey = await prisma.userApiKey.findUnique({
        where: {
            id: keyId,
        },
    });

    if (!apiKey) {
        return Response.json(
            { error: "API key not found" },
            { status: 404 }
        );
    }

    await prisma.userApiKey.delete({
        where: {
            id: keyId,
        },
    });

    return NextResponse.json({ success: true });
}