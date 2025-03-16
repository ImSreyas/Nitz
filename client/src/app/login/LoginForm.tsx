import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import GoogleIconSVG from "@/icons/GoogleIconSVG";
import { Github } from "lucide-react";

export default function LoginForm() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-28 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight py-1">Login</h2>
          <p className="text-sm text-muted-foreground">
            Please sign in to your account
          </p>
        </div>

        <div className="space-y-4">
          <Button variant="outline" className="w-full">
            <GoogleIconSVG />
            Continue with Google
          </Button>

          <Button variant="outline" className="w-full">
            <Github className="w-5 h-5 mr-2" />
            Continue with GitHub
          </Button>

          {/* <Button variant="outline" className="w-full">
            <Mail className="w-5 h-5 mr-2" />
            Sign in with Email
          </Button> */}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              OR CONTINUE WITH
            </span>
          </div>
        </div>

        <div>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="demo@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-xs underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign up
              </a>
            </div>
          </form>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          By signing in, you agree to our{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
}
