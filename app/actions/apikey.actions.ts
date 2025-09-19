"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { authorizeThisAction } from "./auth.actions";

export async function createApiKey(name: string, expiresIn: number, prefix: string, metadata: any | null = null, remaining: any | null = null, permissions: Record<string, string[]> = {}) {
    const authSession = await authorizeThisAction();
    if (!authSession) {
        return {
            success: false,
            message: "Authentication required",
        };
    }

    try {
        const data = await auth.api.createApiKey({
            body: {
                name: name,
                expiresIn: expiresIn,
                userId: authSession.user.id,
                prefix: prefix,
                metadata: metadata,
                remaining: remaining,
                rateLimitTimeWindow: 1000,
                rateLimitMax: 100,
                rateLimitEnabled: true,
                permissions: permissions,
            },
        });

        console.log(data);

        return {
            success: true,
            data: data,
        };
    } catch (error) {
        console.error("Error creating API key:", error);
        return {
            success: false,
            message: "Failed to create API key",
        };
    }
}

// Ajoutez cette fonction dans vos actions
export async function getApiKeys() {
    const authSession = await authorizeThisAction();
    if (!authSession) {
        return {
            success: false,
            message: "Authentication required",
        };
    }

    try {
        const apiKeys = await auth.api.listApiKeys({
            headers: await headers(),
        });

        return {
            success: true,
            data: apiKeys,
        };
    } catch (error) {
        console.error("Error retrieving API keys:", error);
        return {
            success: false,
            message: "Failed to retrieve API keys",
        };
    }
}

export async function verifyApiKey(apiKey: string) {
    try {
        const data = await auth.api.verifyApiKey({
            body: {
                key: apiKey,
            },
        });
        return data
    } catch (error) {
        console.error("Error verifying API key:", error);
        return {
            success: false,
            message: "Failed to verify API key",
        };
    }
}

export async function deleteApiKey(apiKeyId: string) {
    const authSession = await authorizeThisAction();
    if (!authSession) {
        return {
            success: false,
            message: "Authentication required",
        };
    }

    try {
        await auth.api.deleteApiKey({
            body: {
                keyId: apiKeyId,
            },
            headers: await headers(),
        });
        return {
            success: true,
            message: "API key deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting API key:", error);
        return {
            success: false,
            message: "Failed to delete API key",
        };
    }
}
