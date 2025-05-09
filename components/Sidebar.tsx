"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { signOut } from "@/lib/actions/user.actions";

const Sidebar = ({ user }: SidebarProps) => {
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
          />
          <h1 className="text-main font-bold text-[26px] text-black-1 max-xl:hidden 2xl:text-26">
            uomi
          </h1>
        </Link>
        <Link href="/groups/Roomates">Roomates</Link>
        <Link href="/groups/Cottage">Cottage Trip</Link>
      </nav>
      <Button variant="outline" onClick={() => signOut()}>
        Logout
      </Button>
    </section>
  );
};

export default Sidebar;
