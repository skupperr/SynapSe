import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { meetingIdSchema, meetingsDeleteSchema, meetingsGetPaginationSchema, meetingsInsertSchema, meetingsUpdateSchema } from "../schemas";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const meetingsRouter = createTRPCRouter({
    getMany: protectedProcedure
        .input(meetingsGetPaginationSchema)
        .query(async ({ ctx, input }) => {
            const { search, page, pageSize, agentId, status } = input;
            const data = await db
                .select({
                    ...getTableColumns(meetings),
                    agent: agents,
                    duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
                    // duration: sql<number>`5`.as("duration"),
                })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
                        status ? eq(meetings.status, status) : undefined,
                        agentId ? eq(meetings.agentId, agentId) : undefined,

                    )
                )
                .orderBy(desc(meetings.createdAt), desc(meetings.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize)

            const [total] = await db
                .select({ count: count() })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
                        status ? eq(meetings.status, status) : undefined,
                        agentId ? eq(meetings.agentId, agentId) : undefined,
                    )
                );

            const totalPages = Math.ceil(total.count / pageSize)

            return { items: data, total: total.count, totalPages }
        }),

    getOne: protectedProcedure
        .input(meetingIdSchema)
        .query(async ({ input, ctx }) => {
            const [existingMeeting] = await db
                .select({
                    ...getTableColumns(meetings),
                    agent: agents,
                    duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
                })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId, ctx.auth.user.id)
                    )
                )

            if (!existingMeeting) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" })
            }

            return existingMeeting
        }),
    create: protectedProcedure
        .input(meetingsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            const { name, agentId } = input;
            const { auth } = ctx;

            const [createdMeeting] = await db
                .insert(meetings)
                .values({ name: name, agentId: agentId, userId: auth.user.id })
                .returning()
            
            // TODO: create stream call, upsert stream users

            return createdMeeting;
        }),

    update: protectedProcedure
        .input(meetingsUpdateSchema)
        .mutation(async ({input, ctx}) => {
            const { id, ...updateData } = input;
            const [updatedMeeting] = await db
                .update(meetings)
                .set(updateData)
                .where(
                    and(
                        eq(meetings.id, id), eq(meetings.userId, ctx.auth.user.id)
                    )
                )
                .returning()
            
            if(!updatedMeeting){
                throw new TRPCError({code:"NOT_FOUND", message:"Meeting not found"})
            }
            return updatedMeeting;
        }),

    remove: protectedProcedure
        .input(meetingsDeleteSchema)
        .mutation(async ({input, ctx}) => {
            const { id } = input;
            const [removedMeeting] = await db
                .delete(meetings)
                .where(
                    and(
                        eq(meetings.id, id), eq(meetings.userId, ctx.auth.user.id)
                    )
                )
                .returning()
            
            if(!removedMeeting){
                throw new TRPCError({code:"NOT_FOUND", message:"Meeting not found"})
            }
            return removedMeeting;
        })
})