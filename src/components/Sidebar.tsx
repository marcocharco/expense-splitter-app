"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "@/features/auth/server/auth.actions";
import { useUserGroups } from "@/features/groups/contexts/UserGroupsContext";
import { useUser } from "@/features/users/context/UserContext";

const Sidebar = () => {
  const { groups } = useUserGroups();
  const { user, setUser } = useUser();
  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4 w-full">
        <Link
          href="/"
          className="mb-12 cursor-pointer flex items-center justify-center gap-2 h-12"
        >
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Logo"
            className="size-[24px] max-xl:size-14"
            priority={true}
          />
          <h1 className="text-main font-bold text-[26px] text-black-1 max-xl:hidden 2xl:text-26">
            uomi
          </h1>
        </Link>

        {groups?.map((group) => (
          <Link
            key={group.id}
            href={`/groups/${group.slug}`}
            className="hover:underline"
          >
            {group.name}
          </Link>
        ))}
      </nav>

      <div className="gap-2 flex flex-col">
        <p className="flex justify-center">{user?.email}</p>
        <Button
          variant="outline"
          onClick={() => {
            setUser(null);
            signOut();
          }}
        >
          Logout
        </Button>
      </div>
    </section>
  );
};

export default Sidebar;
