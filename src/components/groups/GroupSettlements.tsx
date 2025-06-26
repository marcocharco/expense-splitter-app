"use client";
import { useCurrentGroup } from "@/context/CurrentGroupContext";
import { getGroupSettlements } from "@/lib/queries/getGroupSettlements";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const GroupSettlements = () => {
  const group = useCurrentGroup();
  if (!group) {
    throw new Error();
  }
  const queryClient = useQueryClient();
  const {
    data: settlements,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["groupSettlements", group.id],
    queryFn: () => getGroupSettlements(group.id),
  });

  // console.log(settlements);

  return (
    <>
      {settlements?.map((settlement) => {
        return (
          <div key={settlement.id}>
            {settlement.title}, {settlement.status}
          </div>
        );
      })}
    </>
  );
};

export default GroupSettlements;
