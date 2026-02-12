import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from '@/constants'
import { z } from 'zod'

export const meetingsInsertSchema = z.object({
    name: z.string().min(1, {message: "Name is required"}),
    agentId: z.string().min(1, {message: "Agent is required"})
})

export const meetingIdSchema = z.object({
    id: z.string().min(1, { message: "ID is required" })
})

export const agentsGetPaginationAchema = z.object({
    page: z.number().default(DEFAULT_PAGE),
    pageSize: z
        .number()
        .min(MIN_PAGE_SIZE)
        .max(MAX_PAGE_SIZE)
        .default(DEFAULT_PAGE_SIZE),
    search: z.string().nullish()
})

export const meetingsUpdateSchema = meetingsInsertSchema.extend({
    id: z.string().min(1, {message: "ID is required"})
})