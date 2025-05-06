"use client";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import GoogleIconSVG from "@/icons/GoogleIconSVG";
// import { Github } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { googleAuthLogin } from "../auth/googleAuth";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

function errorComponent(message: string) {
  return <p className="text-red-500 text-sm">{message}</p>;
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsLoading(true); // Set loading state to true
    const { email, password } = data;

    try {
      // Check if the email exists in tbl_users or tbl_moderators
      const { error: userEmailError } = await supabase
        .from("tbl_users")
        .select("email")
        .eq("email", email)
        .single();

      const { error: moderatorEmailError } = await supabase
        .from("tbl_moderators")
        .select("email")
        .eq("email", email)
        .single();

      const { error: adminEmailError } = await supabase
        .from("tbl_admins")
        .select("email")
        .eq("email", email)
        .single();

      if (userEmailError && moderatorEmailError && adminEmailError) {
        setError("email", {
          type: "manual",
          message: "Invalid email.",
        });
        setIsLoading(false); // Reset loading state
        return;
      }

      // Attempt to sign in
      const { data: user, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        setError("password", {
          type: "manual",
          message: "Invalid password.",
        });
        setIsLoading(false); // Reset loading state
        return;
      }

      // Redirect based on user role
      const { data: userData } = await supabase
        .from("tbl_user_roles")
        .select("role")
        .eq("id", user.user?.id)
        .single();

      if (userData) {
        if (userData.role === "moderator") {
          router.push("/moderator");
        } else if (userData.role === "user") {
          router.push("/problems");
        } else if (userData.role === "admin") {
          router.push("/admin");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

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
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              googleAuthLogin();
            }}
          >
            <GoogleIconSVG />
            Continue with Google
          </Button>

          {/* <Button variant="outline" className="w-full">
            <Github className="w-5 h-5 mr-2" />
            Continue with GitHub
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="demo@example.com"
                  {...register("email")}
                />
                {errors.email && errorComponent(errors.email.message || "")}
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
                <Input
                  id="password"
                  type="password"
                  placeholder="******"
                  {...register("password")}
                />
                {errors.password &&
                  errorComponent(errors.password.message || "")}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Spinner size="small" className="text-black"></Spinner> : "Login"}
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
