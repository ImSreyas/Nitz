import React from "react";
import Header from "./components/nav/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import ModeratorSidebar from "./components/nav/SideBar";
import NavBar from "./components/nav/NavBar";

const nonVisiblePaths = ["/admin/problems/*"];

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <SidebarProvider>
        <ModeratorSidebar nonVisiblePaths={nonVisiblePaths} />
        <div className="flex flex-col w-full">
          <Header nonVisiblePaths={nonVisiblePaths} />
          <NavBar nonVisiblePaths={nonVisiblePaths} />
          <div className="w-full h-full">
            {children}
          </div>
        </div>
      </SidebarProvider>
    </main>
  );
}
