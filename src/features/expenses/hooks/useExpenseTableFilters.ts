"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCurrentGroup } from "@/features/groups/contexts/CurrentGroupContext";
import { getExpenseCategories } from "@/features/expenses/queries/getExpenseCategories";

export interface FilterOption {
  value: string;
  label: string;
}

export function useExpenseTableFilters() {
  const groupData = useCurrentGroup();
  const groupMembers = groupData.members;

  const members = useMemo(
    () =>
      groupMembers.map((member) => ({
        value: member.id,
        label: member.name,
      })),
    [groupMembers]
  );

  const statuses: FilterOption[] = useMemo(
    () => [
      {
        value: "paid",
        label: "Paid",
      },
      {
        value: "unpaid",
        label: "Unpaid",
      },
      {
        value: "in settlement",
        label: "In Settlement",
      },
    ],
    []
  );

  const { data: categoriesDB } = useQuery({
    queryKey: ["categories", groupData.id],
    queryFn: () => getExpenseCategories(groupData.id),
  });

  const categories = useMemo(
    () =>
      categoriesDB?.map((category) => ({
        value: category.id,
        label: `${category.icon} ${category.name}`,
      })) ?? [],
    [categoriesDB]
  );

  return {
    members,
    statuses,
    categories,
  };
}
