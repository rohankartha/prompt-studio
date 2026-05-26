import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { encryptApiKey } from "@/lib/crypto";

export async function POST(req: Request) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const body = await req.json();
    const { provider, newApiKeyName } = body;

    console.log(provider);
    console.log(newApiKeyName);

    if (!provider || !newApiKeyName) {
        return NextResponse.json(
            { error: "Missing provider or API key" },
            { status: 400 }
        );
    }

    const encryptedApiKey = encryptApiKey(newApiKeyName);

    const newKey = await prisma.userApiKey.upsert({
        where: {
            userId_provider: {
                userId,
                provider,
            },
        },
        update: {
            encryptedApiKey,
        },
        create: {
            userId,
            provider,
            encryptedApiKey,
        },
    });

    return NextResponse.json(newKey);
}


export async function GET() {
    const keys = await prisma.userApiKey.findMany({
        select: {
            id: true,
            provider: true
        }
    });

    return NextResponse.json(keys)
    
}


export async function PUT(req: Request) {
    const body = await req.json();

    // console.log(body);

    const apiKey = await prisma.userApiKey.update({
        where: {
            id: body["id"],
        },
        data: {
            provider: body["provider"],
        },
    });

    return NextResponse.json(apiKey.id);
}