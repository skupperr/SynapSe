import { db } from "@/db";
import * as schema from "@/db/schema";
import { polarClient } from "@/lib/polar";
import { eq } from "drizzle-orm";

// const PRODUCT_MAP: Record<string, "monthly" | "yearly" | "enterprise"> = {
//     [process.env.MONTHLY_PRODUCT_ID!]: "monthly",
//     [process.env.YEARLY_PRODUCT_ID!]: "yearly",
//     [process.env.ENTERPRISE_PRODUCT_ID!]: "enterprise",
// };

export async function syncUserPlanFromSubscription(subscription: any) {

    const userId = subscription.customer.externalId;

    const now = new Date();
    const expiresAt = subscription.currentPeriodEnd
        ? new Date(subscription.currentPeriodEnd)
        : null;

    const stillActive = expiresAt && expiresAt > now;

    let plan: "free" | "monthly" | "yearly" | "enterprise" = "free";

    if (stillActive) {
        plan =
            subscription.product.metadata?.planKey ??
            "free";
    }

    await db.update(schema.user)
        .set({
            tier: plan,
            tierExpiresAt: expiresAt
        })
        .where(eq(schema.user.id, userId));
}