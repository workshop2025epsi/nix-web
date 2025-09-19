import { db } from "@/lib/db";
import { siteConfig } from "@/resources/site";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { apiKey, createAuthMiddleware } from "better-auth/plugins";
import ms from "ms";

export const auth = betterAuth({
    user: {
        changeEmail: {
            enabled: true,
        }
    },
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

        apiKey(

            {
                disableKeyHashing: true,
                //customKeyGenerator: (options: {
                //    prefix: string | undefined;
                //}) => {
                //    const apiKey = APIKeyGenerator(
                //        options.prefix
                //    );
                //    return apiKey;
                //},
            }
        ),
        nextCookies(),
    ],
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
        }),
    },

});