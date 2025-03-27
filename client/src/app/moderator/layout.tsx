import React from "react";
import Header from "./components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import ModeratorSidebar from "./components/SideBar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <SidebarProvider>
        <ModeratorSidebar />
        <div className="flex flex-col w-full">
          <Header />
          <div>{children}</div>
        </div>
      </SidebarProvider>
    </main>
  );
}
