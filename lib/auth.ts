import { betterAuth } from "better-auth";
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth"; 
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/index";
import * as schema from "@/db/schema"
import { polarClient } from "./polar";

export const auth = betterAuth({
    plugins: [
        polar({ 
            client: polarClient, 
            createCustomerOnSignUp: true, 
            use: [ 
                checkout({ 
                    successUrl: "/success?checkout_id={CHECKOUT_ID}", 
                    authenticatedUsersOnly: true
                }), 
                portal(), 
            ], 
        }) 
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
        schema: {...schema}
    }),
});