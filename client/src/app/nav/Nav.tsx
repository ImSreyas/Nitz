"use client";

import Link from "next/link";
import { NavAllowedPaths } from "@/constants";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Flame, Sparkles } from "lucide-react";

const routes = [
  { href: "/problems", label: "Problems" },
  { href: "/contest", label: "Contest" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/groups", label: "Groups" },
  { href: "/discuss", label: "Discuss" },
];

export default function Nav() {
  const path = usePathname();

  return NavAllowedPaths.includes(path) ? (
    <div className="backdrop-blur-xl bg-background/20 z-10 sticky -top-2 flex justify-center w-full h-fit px-8 pb-8 pt-10 border-b">
      <div className="fixed top-8 left-16 flex items-center">
        <div className="doto text-[1.8rem]">
          <span className="text-primary">B</span>ITZ
        </div>
      </div>
      <div className="fixed top-8 right-16 flex items-center space-x-6">
        <button>
          <Sparkles size={22} />
        </button>
        <button className="flex space-x-1 items-center">
          <Flame size={22} />
          <div className="h-fit translate-y-[2px] text-sm">6</div>
        </button>
        <Button className="w-10 h-10 rounded-2xl bg-muted"></Button>
      </div>
      <div className="space-x-8">
        {routes.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`${path === href && "text-primary"}`}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
}
