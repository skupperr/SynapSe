import { LoadingState } from '@/components/loading-state';
import { AgentsView } from '@/modules/agents/ui/views/agents-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from 'react';
import { ErrorState } from '@/components/error-state';

const page = async () => {

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.agents.getMany.queryOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={
        <LoadingState title='Loading Agents' description='This may take a while' />
      }>
        <ErrorBoundary fallback={
          <ErrorState title="Error loading agents" description="Something went wrong. Please try again later."/>
        }>
          <AgentsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>

  )
}

export default page

