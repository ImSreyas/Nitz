import React from "react";
import LoginForm from "./LoginForm";
import { House } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function page() {
  return (
    <div className="grid grid-cols-[65%_35%]">
      <Link
        href="/"
        className="bg-background fixed top-6 left-6 p-3 rounded-2xl border border-muted"
      >
        <House size={20} />
      </Link>
      <div className="border-r border-muted">
        <Image className="object-cover w-full h-full" alt="" width={1800} height={1080} src="https://wallpapercat.com/w/full/4/6/f/1228445-2309x1299-desktop-hd-good-luck-background-photo.jpg" />
      </div>
      <LoginForm />
    </div>
  );
}
