import { db } from "@/db";
import { meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { meetingIdSchema, agentsGetPaginationAchema } from "../schemas";
import { and, count, desc, eq, getTableColumns, ilike } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const meetingsRouter = createTRPCRouter({
    getMany: protectedProcedure
        .input(agentsGetPaginationAchema)
        .query(async ({ ctx, input }) => {
            const { search, page, pageSize } = input;
            const data = await db
                .select({
                    ...getTableColumns(meetings)
                })
                .from(meetings)
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${search}%`) : undefined
                    )
                )
                .orderBy(desc(meetings.createdAt), desc(meetings.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize)
            
            const [total] = await db
                .select({ count: count()})
                .from(meetings)
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${search}%`) : undefined
                    )
                );
            
            const totalPages = Math.ceil(total.count / pageSize)
                
            return { items: data, total: total.count, totalPages}
        }),

    getOne: protectedProcedure
        .input(meetingIdSchema)
        .query(async ({ input, ctx }) => {
        const [existingMeeting] = await db
            .select({
                ...getTableColumns(meetings)
            })
            .from(meetings)
            .where(
                and(
                    eq(meetings.id, input.id),
                    eq(meetings.userId, ctx.auth.user.id)
                )
            )
        
        if(!existingMeeting){
            throw new TRPCError ({code: "NOT_FOUND", message: "Meeting not found"})
        }
            
        return existingMeeting
    }),

    
})