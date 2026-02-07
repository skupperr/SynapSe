import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema, agentsIdSchema } from "../schemas";
import { eq } from "drizzle-orm";

export const agentsRouter = createTRPCRouter({
    getMany: protectedProcedure.query(async () => {
        const data = await db
            .select()
            .from(agents)
            
        return data
    }),

    getOne: protectedProcedure
        .input(agentsIdSchema)
        .query(async ({ input }) => {
        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, input.id))
            
        return existingAgent
    }),

    create: protectedProcedure
        .input(agentsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            const {name, instruction} = input;
            const {auth} = ctx;

            const [createdAgent] = await db
                .insert(agents)
                .values({name: name, instructions: instruction, userId: auth.user.id})
                .returning()

            return createdAgent;
        })
})