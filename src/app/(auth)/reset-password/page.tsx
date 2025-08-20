"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  useLazyGetProfileQuery,
  useResetPasswordMutation,
} from "@/store/services/userManagement";
import { setToken } from "@/store/slices/tokenSlice";
import { setProfile } from "@/store/slices/profileSlice";
import { getAuthToken, setCookie } from "@/src/utils/auth";
import { Card, CardContent } from "@/src/components/ui/card";
import Navbar from "@/src/components/navbar";
import Footer from "@/src/components/spacce-footer";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [orgCode, setOrgCode] = useState("");
  const [resetError, setResetError] = useState("");

  const [resetPassword, resetPasswordProps] = useResetPasswordMutation();
  const [getProfile, getProfileProps] = useLazyGetProfileQuery();

  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const token = searchParams.get("t");

  // Extract email and orgCode from search params
  useEffect(() => {
    const emailParam = searchParams.get("e");
    const orgCodeParam = searchParams.get("o");

    if (emailParam) {
      setEmail(emailParam);
    }

    if (orgCodeParam) {
      setOrgCode(orgCodeParam);
    }
  }, [searchParams]);

  // Handle reset password API response
  useEffect(() => {
    if (resetPasswordProps.isSuccess && resetPasswordProps.data) {
      if (token) {
        // Fetch user profile
        getProfile(token);
      }
    }
  }, [
    resetPasswordProps.isSuccess,
    resetPasswordProps.data,
    dispatch,
    getProfile,
  ]);

  // Handle reset password error
  useEffect(() => {
    if (resetPasswordProps.isError) {
      setResetError(
        "Password reset failed. Please check your passcode and try again."
      );
    }
  }, [resetPasswordProps.isError]);

  // Handle profile API response
  useEffect(() => {
    if (getProfileProps.isSuccess && getProfileProps.data) {
      const profileData = getProfileProps.data;

      // Store profile data in Redux
      dispatch(setProfile(profileData));

      // Set user info
      dispatch(setProfile(profileData));

      // Store token in Redux
      dispatch(setToken(token));

      // Navigate to dashboard or intended page
      const redirectTo = searchParams.get("redirect") || "/dashboard";
      router.push(redirectTo);
    }
  }, [
    getProfileProps.isSuccess,
    getProfileProps.data,
    dispatch,
    router,
    orgCode,
    searchParams,
  ]);

  // Handle profile fetch error
  useEffect(() => {
    if (getProfileProps.isError) {
      setResetError("Failed to fetch user profile. Please try again.");
    }
  }, [getProfileProps.isError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");

    // Validate form
    if (!email || !newPassword || !confirmPassword) {
      setResetError("Please fill in all fields.");
      return;
    }

    if (!orgCode) {
      setResetError("Missing organization code from URL.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setResetError("Password must be at least 8 characters long.");
      return;
    }

    // Call reset password API
    try {
      await resetPassword({
        body: {
          password: newPassword,
        },
        authToken: token, // You might need to adjust this based on your API requirements
      });
    } catch (error) {
      setResetError("Password reset failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-custom flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-md bg-black bg-opacity-10 border border-neutral-700 rounded-[16px]  w-[580px]">
          <CardContent className="p-6">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-800 rounded-full p-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C12.55 7 13 7.45 13 8V12C13 12.55 12.55 13 12 13S11 12.55 11 12V8C11 7.45 11.45 7 12 7ZM11 15H13V17H11V15Z" />
                </svg>
              </div>
            </div>

            {/* Reset Password Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold text-white">
                  Reset Your Password
                </h1>
                <p className="text-gray-400 text-base">
                  Enter your details to reset your password.
                </p>
              </div>

              <hr className="border-gray-700" />

              {/* Error Message */}
              {resetError && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{resetError}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* <div className="space-y-2">
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
                    disabled={true} // Always disabled since it comes from URL
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
                    disabled={true} // Always disabled since it comes from URL
                  />
                </div> */}

                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-gray-300 text-base"
                  >
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-[#5C5C5F] rounded-[6px] border-gray-500 text-white h-[40px] text-[16px]"
                    placeholder="Enter your new password"
                    required
                    disabled={
                      resetPasswordProps.isLoading || getProfileProps.isLoading
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-gray-300 text-base"
                  >
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-[#5C5C5F] rounded-[6px] border-gray-500 text-white h-[40px] text-[16px]"
                    placeholder="Confirm your new password"
                    required
                    disabled={
                      resetPasswordProps.isLoading || getProfileProps.isLoading
                    }
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant={"primary"}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={
                  resetPasswordProps.isLoading || getProfileProps.isLoading
                }
              >
                {resetPasswordProps.isLoading || getProfileProps.isLoading
                  ? "Resetting Password..."
                  : "Reset Password"}
              </Button>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-4"
                  >
                    Back to Login
                  </Link>
                </p>
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
