"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/spacce-footer"
import { useForgotPasswordMutation, useVerifyPasscodeMutation } from "@/app/store/services/authManagement"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent } from "@/components/ui/card"
import { setToken } from "@/app/store/slices/tokenSlice"
import { useDispatch } from "react-redux"
import { setCookie } from "@/utils/auth"

export default function ForgotPasswordPage() {
  // Step 1: Email and OrgCode form
  const [email, setEmail] = useState("")
  const [orgCode, setOrgCode] = useState("")
  
  // Step 2: Passcode verification form
  const [passcode, setPasscode] = useState("")
  
  // UI States
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [currentStep, setCurrentStep] = useState(1) // 1: email/orgCode, 2: passcode verification

  const [forgotPassword, forgotPasswordProps] = useForgotPasswordMutation()
  const [verifyPasscode, verifyPasscodeProps] = useVerifyPasscodeMutation()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const dispatch = useDispatch()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  // Handle forgot password API response (Step 1)
  useEffect(() => {
    if (forgotPasswordProps.isSuccess && forgotPasswordProps.data) {
      const { message } = forgotPasswordProps.data
      setSuccessMessage(message || "Passcode has been sent to your registered email !!")
      setError("")
      setCurrentStep(2) // Move to passcode verification step
    }
  }, [forgotPasswordProps.isSuccess, forgotPasswordProps.data])

  // Handle forgot password error (Step 1)
  useEffect(() => {
    if (forgotPasswordProps.isError) {
      setError("Failed to send reset code. Please check your email and organization code.")
      setSuccessMessage("")
    }
  }, [forgotPasswordProps.isError])

  // Handle verify passcode API response (Step 2)
  useEffect(() => {
    if (verifyPasscodeProps.isSuccess && verifyPasscodeProps.data) {
      const { token } = verifyPasscodeProps.data
      
      if (token) {
        // Redirect to reset password page with email and orgCode
        router.push(`/reset-password?e=${encodeURIComponent(email)}&o=${encodeURIComponent(orgCode)}&t=${token}`)
      }
    }
  }, [verifyPasscodeProps.isSuccess, verifyPasscodeProps.data, email, orgCode, dispatch, router])

  // Handle verify passcode error (Step 2)
  useEffect(() => {
    if (verifyPasscodeProps.isError) {
      setError("Invalid passcode. Please check the code and try again.")
    }
  }, [verifyPasscodeProps.isError])

  // Handle Step 1: Send passcode to email
  const handleSendPasscode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    
    // Validate form
    if (!email) {
      setError("Please enter your email address.")
      return
    }

    if (!orgCode) {
      setError("Please enter your organization code.")
      return
    }

    // Call forgot password API
    try {
      await forgotPassword({
        userName: email,
        orgCode: orgCode
      })
    } catch (error) {
      setError("Failed to send reset code. Please try again.")
    }
  }

  // Handle Step 2: Verify passcode
  const handleVerifyPasscode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validate passcode
    if (!passcode) {
      setError("Please enter the passcode from your email.")
      return
    }

    // Call verify passcode API
    try {
      await verifyPasscode({
        userName: email,
        password: passcode, // The API expects passcode in 'password' field
        orgCode: orgCode
      })
    } catch (error) {
      setError("Failed to verify passcode. Please try again.")
    }
  }

  // Go back to step 1
  const handleBackToStep1 = () => {
    setCurrentStep(1)
    setPasscode("")
    setError("")
    setSuccessMessage("")
  }

  // Don't render if already authenticated
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-custom flex flex-col">
      {/* Header */}
      <Navbar/>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-md bg-black bg-opacity-10 border border-neutral-700 rounded-[16px] w-[580px]">
          <CardContent className="p-6">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-800 rounded-full p-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H11V21H5V3H13V9H21ZM23 15V13H17V15H19V17H17V19H23V17H21V15H23ZM15 21V19H13V21H15Z" />
                </svg>
              </div>
            </div>

            {/* Step 1: Email and Organization Code */}
            {currentStep === 1 && (
              <form onSubmit={handleSendPasscode} className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-semibold text-white">Forgot Password</h1>
                  <p className="text-gray-400 text-base">
                    Enter your email and organization code to receive a reset passcode.
                  </p>
                </div>

                <hr className="border-gray-700" />

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{error}</p>
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
                      disabled={forgotPasswordProps.isLoading}
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
                      disabled={forgotPasswordProps.isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant={'primary'}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={forgotPasswordProps.isLoading}
                >
                  {forgotPasswordProps.isLoading ? "Sending..." : "Send Reset Code"}
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
            )}

            {/* Step 2: Passcode Verification */}
            {currentStep === 2 && (
              <form onSubmit={handleVerifyPasscode} className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-semibold text-white">Verify Passcode</h1>
                  <p className="text-gray-400 text-base">
                    Enter the passcode sent to your email address.
                  </p>
                </div>

                <hr className="border-gray-700" />

                {/* Success Message from Step 1 */}
                {successMessage && (
                  <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3">
                    <p className="text-green-400 text-sm text-center">{successMessage}</p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Show email for reference */}
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-gray-300 text-sm">
                    <span className="text-gray-400">Passcode sent to:</span> {email}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="passcode" className="text-gray-300 text-base">
                      Passcode
                    </Label>
                    <Input
                      id="passcode"
                      type="text"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="bg-[#5C5C5F] rounded-[6px] border-gray-500 text-white h-[40px] text-[16px]"
                      placeholder="Enter the passcode from your email"
                      required
                      disabled={verifyPasscodeProps.isLoading}
                      autoFocus
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant={'primary'}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={verifyPasscodeProps.isLoading}
                >
                  {verifyPasscodeProps.isLoading ? "Verifying..." : "Verify Passcode"}
                </Button>

                <div className="flex justify-between items-center text-sm">
                  <button
                    type="button"
                    onClick={handleBackToStep1}
                    className="text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-4"
                  >
                    ← Change Email/Org Code
                  </button>
                  <Link
                    href="/login"
                    className="text-gray-400 hover:text-gray-300 transition-colors underline underline-offset-4"
                  >
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <Footer/>
    </div>
  )
}