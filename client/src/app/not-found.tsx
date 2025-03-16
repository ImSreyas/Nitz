"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex gap-4 justify-center items-center flex-col text-center p-4">
      <div className="text-3xl sm:text-4xl font-bold">404 Page not found</div>
      <div className="text-muted-foreground max-w-[600px]">
        Oops! The page you&apos;re looking for seems to have wandered off.
      </div>
      <div className="py-3">
        <Button onClick={() => router.back()}>Go back to previous page</Button>
      </div>
    </div>
  );
};

export default Page;
