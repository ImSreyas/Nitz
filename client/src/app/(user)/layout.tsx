import React from "react";
import Nav from "./components/nav/Nav";

export default function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Nav />
      {children}
    </div>
  );
}
