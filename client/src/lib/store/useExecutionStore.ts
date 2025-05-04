import { create } from "zustand";
import { persist } from "zustand/middleware";

type ExecutionState = {
  isExecutingComplete: boolean;
  setIsExecutingComplete: (isExecutingComplete: boolean) => void;
};

export const useExecutionStore = create<ExecutionState>()(
  persist(
    (set) => ({
      isExecutingComplete: false,
      setIsExecutingComplete: (isExecutingComplete: boolean) =>
        set({ isExecutingComplete }),
    }),
    {
      name: "execution-store",
    }
  )
);
