"use client";
import React from "react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/src/components/ui/card";
import Navbar from "@/src/components/navbar";
import Footer from "@/src/components/spacce-footer";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgCode, setOrgCode] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (session) {
      const redirectTo = searchParams.get("redirect") || "/dashboard";
      router.push(redirectTo);
    }
  }, [session, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    // Validate form
    if (!email || !password) {
      setLoginError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    if (!orgCode) {
      setLoginError("Please enter organization code.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        userName: email,
        password: password,
        orgCode: orgCode,
        redirect: false,
      });

      if (result?.error) {
        setLoginError("Invalid credentials or login failed. Please try again.");
      } else if (result?.ok) {
        // Success - NextAuth will handle the redirect
        const redirectTo = searchParams.get("redirect") || "/dashboard";
        router.push(redirectTo);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-custom flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className=" max-w-md bg-black bg-opacity-10 border border-neutral-700 rounded-[16px] w-[580px]">
          <CardContent className="p-6">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-800 rounded-full p-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold text-white">
                  Login to your account
                </h1>
                <p className="text-gray-400 text-base">
                  Enter your details to login.
                </p>
              </div>

              <hr className="border-gray-700" />

              {/* Error Message */}
              {loginError && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{loginError}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 text-base">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#5C5C5F] rounded-[6px] border-gray-500 text-white h-[40px] text-[16px]"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300 text-base">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#5C5C5F] rounded-[6px] border-gray-500 text-white h-[40px] text-[16px]"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orgCode" className="text-gray-300 text-base">
                    Organization Code
                  </Label>
                  <Input
                    id="orgCode"
                    type="text"
                    value={orgCode}
                    onChange={(e) => setOrgCode(e.target.value)}
                    className="bg-[#5C5C5F] rounded-[6px] border-gray-500 text-white h-[40px] text-[16px]"
                    placeholder="Enter organization code"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant={"primary"}
                className="w-full bg-purple-600 hover:bg-purple-700 "
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="keep-logged-in"
                    checked={keepLoggedIn}
                    onCheckedChange={(checked) =>
                      setKeepLoggedIn(checked as boolean)
                    }
                    className="border-gray-600 rounded-[4px] bg-white data-[state=checked]:bg-purple-600"
                  />
                  <Label
                    htmlFor="keep-logged-in"
                    className="text-sm text-gray-300 cursor-pointer"
                  >
                    Keep me logged in
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-purple-400 text-sm hover:text-purple-300 transition-colors underline underline-offset-4"
                >
                  Forgot your password?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
