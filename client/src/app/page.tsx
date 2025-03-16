import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-medium">
      <Button
        variant="outline"
        className="p-0 fixed right-16 top-6"
      >
        <Link href="/login" className="px-6 py-2">
          Login
        </Link>
      </Button>
    </div>
  );
}
