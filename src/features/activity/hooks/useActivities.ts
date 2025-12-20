"use client";

import { useQuery } from "@tanstack/react-query";
import { getGroupActivities } from "../queries/getGroupActivities";

export function useActivities(groupId: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["groupActivities", groupId],
    queryFn: () => getGroupActivities(groupId),
    enabled: !!groupId,
  });

  return {
    activities: data ?? [],
    isLoading,
    isError,
  };
}
