import { betterAuth } from "better-auth";
import { polar, checkout, portal, webhooks } from "@polar-sh/better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/index";
import * as schema from "@/db/schema";
import { polarClient } from "./polar";
import { syncUserPlanFromSubscription } from "@/modules/premium/server/billing";


export const auth = betterAuth({
    plugins: [
        polar({
            client: polarClient,
            webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    successUrl: "/upgrade",
                    authenticatedUsersOnly: true,
                }),

                portal(),

                webhooks({
                    secret: process.env.POLAR_WEBHOOK_SECRET!,
                    onSubscriptionCreated: async (payload) => {
                        await syncUserPlanFromSubscription(payload.data);
                    },
                    onSubscriptionUpdated: async (payload) => {
                        await syncUserPlanFromSubscription(payload.data);
                    },
                    onSubscriptionActive: async (payload) => {
                        await syncUserPlanFromSubscription(payload.data);
                    },
                    onSubscriptionCanceled: async (payload) => {
                        await syncUserPlanFromSubscription(payload.data);
                    },
                    onSubscriptionRevoked: async (payload) => {
                        await syncUserPlanFromSubscription(payload.data);
                    },
                }),
            ],
        }),
    ],

    emailAndPassword: {
        enabled: true,
    },

    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },

    database: drizzleAdapter(db, {
        provider: "pg",
        schema: { ...schema },
    }),
});