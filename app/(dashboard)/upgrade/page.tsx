import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { auth } from "@/lib/auth";
import { UpgradeView } from "@/modules/premium/ui/view/upgrade-view";
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const page = async () => {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(!session){
        redirect("/sign-in");
    }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.premium.getCurrentSubscription.queryOptions(),
    )
    void queryClient.prefetchQuery(
        trpc.premium.getProducts.queryOptions(),
    )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={
            <LoadingState title='Loading' description='This may take a while' />
        }>
            <ErrorBoundary fallback={
                <ErrorState title="Error loading meetings" description="Something went wrong. Please try again later." />
            }>
                <UpgradeView />
            </ErrorBoundary>
        </Suspense>
    </HydrationBoundary>
  )
}

export default page