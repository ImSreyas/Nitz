import React from "react";
import LoginForm from "./LoginForm";
import { House } from "lucide-react";
import Link from "next/link";

export default function page() {
  return (
    <div className="grid grid-cols-[65%_35%]">
      <Link
        href="/"
        className="fixed top-6 left-6 p-3 rounded-2xl border border-muted"
      >
        <House size={20} />
      </Link>
      <div className="border-r border-muted"></div>
      <LoginForm />
    </div>
  );
}
