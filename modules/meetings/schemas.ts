import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from '@/constants'
import { z } from 'zod'
import { MeetingStatus } from './types'

export const meetingsInsertSchema = z.object({
    name: z.string().min(1, {message: "Name is required"}),
    agentId: z.string().min(1, {message: "Agent is required"})
})

export const meetingIdSchema = z.object({
    id: z.string().min(1, { message: "ID is required" })
})

export const meetingsGetPaginationAchema = z.object({
    page: z.number().default(DEFAULT_PAGE),
    pageSize: z
        .number()
        .min(MIN_PAGE_SIZE)
        .max(MAX_PAGE_SIZE)
        .default(DEFAULT_PAGE_SIZE),
    search: z.string().nullish(),
    agentId: z.string().nullish(),
    status: z.enum([
        MeetingStatus.Upcoming,
        MeetingStatus.Active,
        MeetingStatus.Cancelled,
        MeetingStatus.Completed,
        MeetingStatus.Processing,
    ]).nullish(),
})

export const meetingsUpdateSchema = meetingsInsertSchema.extend({
    id: z.string().min(1, {message: "ID is required"})
})