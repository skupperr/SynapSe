import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema, agentsIdSchema, agentsGetPaginationAchema } from "../schemas";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
    getMany: protectedProcedure
        .input(agentsGetPaginationAchema)
        .query(async ({ ctx, input }) => {

            const { search, page, pageSize } = input;
            const data = await db
                .select({
                    meetingCount: sql<number>`5`,
                    ...getTableColumns(agents)
                })
                .from(agents)
                .where(
                    and(
                        eq(agents.userId, ctx.auth.user.id),
                        search ? ilike(agents.name, `%${search}%`) : undefined
                    )
                )
                .orderBy(desc(agents.createdAt), desc(agents.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize)
            
            const [total] = await db
                .select({ count: count()})
                .from(agents)
                .where(
                    and(
                        eq(agents.userId, ctx.auth.user.id),
                        search ? ilike(agents.name, `%${search}%`) : undefined
                    )
                );
            
            const totalPages = Math.ceil(total.count / pageSize)
                
            return { items: data, total: total.count, totalPages}
        }),

    getOne: protectedProcedure
        .input(agentsIdSchema)
        .query(async ({ input, ctx }) => {
        const [existingAgent] = await db
            .select({
                meetingCount: sql<number>`5`,
                ...getTableColumns(agents)
            })
            .from(agents)
            .where(
                and(
                    eq(agents.id, input.id),
                    eq(agents.userId, ctx.auth.user.id)
                )
            )
        
        if(!existingAgent){
            throw new TRPCError ({code: "NOT_FOUND", message: "Agent not found"})
        }
            
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