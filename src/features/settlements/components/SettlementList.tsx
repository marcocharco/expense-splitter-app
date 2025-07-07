"use client";
import { useCurrentGroup } from "@/features/groups/context/CurrentGroupContext";
import { getGroupSettlements } from "@/features/settlements/queries/getGroupSettlements";
import { useQuery } from "@tanstack/react-query";

const SettlementList = () => {
  const group = useCurrentGroup();
  if (!group) {
    throw new Error();
  }
  const { data: settlements } = useQuery({
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

export default SettlementList;
