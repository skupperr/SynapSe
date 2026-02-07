import { LoadingState } from '@/components/loading-state';
import { AgentsView } from '@/modules/agents/ui/views/agents-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from 'react';
import { ErrorState } from '@/components/error-state';
import { AgentsListHeader } from '@/modules/agents/ui/components/agents-list-header';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const page = async () => {

  const session = await auth.api.getSession({
      headers: await headers(),
    });
  
    if(!session){
      redirect("/sign-in")
    }

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.agents.getMany.queryOptions())

  return (
    <>
      <AgentsListHeader/>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={
          <LoadingState title='Loading Agents' description='This may take a while' />
        }>
          <ErrorBoundary fallback={
            <ErrorState title="Error loading agents" description="Something went wrong. Please try again later." />
          }>
            <AgentsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  )
}

export default page

