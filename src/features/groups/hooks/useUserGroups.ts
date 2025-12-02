"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserGroups } from "../queries/getUserGroups";

export function useUserGroups() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userGroups"],
    queryFn: getUserGroups,
  });

  return {
    groups: data ?? [],
    isLoading,
    isError,
  };
}
