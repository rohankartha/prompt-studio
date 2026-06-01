import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ keyId: string }> }
) {
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