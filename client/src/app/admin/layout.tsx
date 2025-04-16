import React from "react";
import Header from "./components/nav/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import ModeratorSidebar from "./components/nav/SideBar";
const nonVisiblePaths = ["/moderator/problems/*"]

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <SidebarProvider>
        <ModeratorSidebar nonVisiblePaths={nonVisiblePaths} />
        <div className="flex flex-col w-full">
          <Header nonVisiblePaths={nonVisiblePaths} />
          <div className="w-full h-full">{children}</div>
        </div>
      </SidebarProvider>
    </main>
  );
}
