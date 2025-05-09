import Link from "next/link";

const GroupCard = ({ $id, name, members }: GroupCardProps) => {
  return (
    <Link href={`/groups/${$id}`} className="hover:bg-gray-100 rounded-xl">
      <div className="flex w-full items-center gap-4 rounded-xl border border-gray-200 p-4 shadow-chart sm:gap-6 sm:p-6">
        <p>{name}</p>
        <p className="text-sm text-neutral-500 ml-auto">
          {members.length} members
        </p>
      </div>
    </Link>
  );
};

export default GroupCard;
