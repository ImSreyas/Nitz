import { create } from "zustand";
import { persist } from "zustand/middleware";

type ContextState = {
  context: "user" | "admin" | "moderator";
  setContext: (context: "user" | "admin" | "moderator") => void;
};

export const useRoleStore = create<ContextState>()(
  persist(
    (set) => ({
      context: "user",
      setContext: (context: ContextState["context"]) => set({ context }),
    }),
    { name: "role-store" }
  )
);
