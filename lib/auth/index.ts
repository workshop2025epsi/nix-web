import { db } from "@/lib/db";
import { siteConfig } from "@/resources/site";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware } from "better-auth/plugins";
import ms from "ms";

export const auth = betterAuth({
    appName: siteConfig.name,
    rateLimit: {
        window: 60,
        max: 100,
    },
    database: prismaAdapter(db, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        minPasswordLength: 6,
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: ms("30min"),
        },
    },

    plugins: [
        nextCookies(),
    ],
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
        }),
    },

});
