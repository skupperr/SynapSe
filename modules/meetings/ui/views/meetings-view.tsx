"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";

export const MeetingsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));
  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">

      {data.items.length === 0 ? (
        <EmptyState
          title="Create your first meeting"
          description="Schedule a meeting to connect with others."
        />
      ) : (
        <DataTable data={data.items} columns={columns} />
      )}
    </div>
  )
}
