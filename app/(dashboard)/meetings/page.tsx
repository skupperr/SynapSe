import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { MeetingsView } from '@/modules/meetings/ui/views/meetings-view'
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary';

const page = async () => {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({}))

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={
                <LoadingState title='Loading Meetings' description='This may take a while' />
            }>
                <ErrorBoundary fallback={
                    <ErrorState title="Error loading meetings" description="Something went wrong. Please try again later." />
                }>
                    <MeetingsView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}

export default page