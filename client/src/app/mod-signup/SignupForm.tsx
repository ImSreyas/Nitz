"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Github } from "lucide-react";
import GoogleIconSVG from "@/icons/GoogleIconSVG";
import { Info } from "lucide-react"; // Import the Info icon
import { createClient } from "@/utils/supabase/client";

const schema = z
  .object({
    email: z.string().email("Invalid email format"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(/^[A-Za-z_]{3,30}$/, "Only letters and '_' allowed."),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/\d/, "Must include at least one number")
      .regex(
        /[!@#$%^&*(),.?\":{}|<>]/,
        "Must include at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function errorComponent(message: string) {
  return <p className="text-red-500 text-sm">{message}</p>;
}

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false); // State for showing password info
  const router = useRouter();
  const infoButtonRef = useRef<HTMLButtonElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        infoRef.current &&
        !infoButtonRef?.current?.contains(event.target as Node) &&
        !infoRef.current.contains(event.target as Node)
      ) {
        setShowPasswordInfo(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [infoRef]);

  async function onSubmit(formData: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
  }) {
    setLoading(true);
    setError("email", { message: "" });
    setError("username", { message: "" });

    try {
      const { data: existingUserInUsers } = await supabase
        .from("tbl_users")
        .select("id")
        .eq("username", formData.username)
        .single();

      // Check username in tbl_moderators
      const { data: existingUserInModerators } = await supabase
        .from("tbl_moderators")
        .select("id")
        .eq("username", formData.username)
        .single();

      if (existingUserInUsers || existingUserInModerators) {
        setError("username", { message: "Username already taken" });
        setLoading(false);
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        // console.log("Error signing up:", authError);
        setError("email", { message: "Email already in use." });
        setLoading(false);
        return;
      }

      // console.log(authData.session);

      const newUserId = authData.user?.id;

      const { error } = await supabase.rpc("add_moderator_with_role", {
        p_id: newUserId,
        p_username: formData.username,
      });

      if (error) {
        // console.log("Error adding user role:", error);
        setError("email", { message: "Something went wrong." });
        console.log(error);
        setLoading(false);
        return;
      }

      alert("Sign-up successful");
      router.push("/moderator");
    } catch (error) {
      console.log("Unexpected error:", error);
      setError("email", { message: "Unexpected error occurred." });
      setLoading(false);
    }
  }

  return (
    <Card className="w-full px-20 py-6 rounded-none bg-background">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Moderator Sign Up
        </CardTitle>
        <CardDescription className="text-center">
          Create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button variant="outline" className="w-full">
            <GoogleIconSVG /> Continue with Google
          </Button>
          <Button variant="outline" className="w-full">
            <Github className="mr-2 h-4 w-4" /> Continue with GitHub
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...register("email")}
                placeholder="demo@example.com"
              />
              {errors.email && errorComponent(errors.email.message || "")}
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register("username")}
                placeholder="demo"
              />
              {errors.username && errorComponent(errors.username.message || "")}
            </div>
            <div className="space-y-2">
              <div className="flex relative items-center space-x-2">
                <Label htmlFor="password">Password</Label>
                <button
                  ref={infoButtonRef}
                  type="button"
                  onClick={() => {
                    setShowPasswordInfo((state) => !state);
                  }}
                  className="text-muted-foreground"
                >
                  <Info className="" size={14} />
                </button>
                {showPasswordInfo && (
                  <Card
                    ref={infoRef}
                    className="absolute w-full h-fit top-7 left-10 -translate-x-2 p-4"
                  >
                    <CardContent className="p-0">
                      <p className="text-sm">
                        Password must be at least 6 characters long, include at
                        least one uppercase letter, one number, and one special
                        character.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="******"
              />
              {errors.password && errorComponent(errors.password.message || "")}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword &&
                errorComponent(errors.confirmPassword.message || "")}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
          <div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="underline underline-offset-4 hover:text-primary"
              >
                Login
              </a>
            </div>
            <div className="text-center text-sm mt-2 text-muted-foreground">
              Become a new user?{" "}
              <a
                href="/signup"
                className="underline underline-offset-4 hover:text-primary"
              >
                Signup
              </a>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          By signing up, you agree to our{" "}
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
      </CardContent>
    </Card>
  );
}
