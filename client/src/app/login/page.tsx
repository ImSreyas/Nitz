"use client";

import React, { useEffect } from "react";
import LoginForm from "./LoginForm";
import { House } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  useEffect(() => {
    loginManager();
  }, []);

  return (
    <div className="grid grid-cols-[65%_35%]">
      <Link
        href="/"
        className="bg-background fixed top-6 left-6 p-3 rounded-2xl border border-muted"
      >
        <House size={20} />
      </Link>
      <div className="border-r border-muted">
        <Image
          className="object-cover w-full h-full"
          alt=""
          width={1800}
          height={1080}
          src="https://wallpapercat.com/w/full/4/6/f/1228445-2309x1299-desktop-hd-good-luck-background-photo.jpg"
        />
      </div>
      <LoginForm />
    </div>
  );
}

const loginManager = () => {
  for (let i = 0; i < 50; i++) {
    window.history.pushState(null, "", "/login");
  }
};
