"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch } from "react-redux"
import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/spacce-footer"
import { useUserLoginMutation } from "@/app/store/services/authManagement"
import { useLazyGetProfileQuery } from "@/app/store/services/userManagement"
import { setUser } from "@/app/store/slices/authSlice"
import { setToken } from "@/app/store/slices/tokenSlice"
import { setProfile } from "@/app/store/slices/profileSlice"
import { useAuth } from "@/hooks/useAuth"
import { setCookie } from "@/utils/auth"
import { Card, CardContent } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [orgCode, setOrgCode] = useState("")
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)
  const [loginError, setLoginError] = useState("")

  const [userLogin, userLoginProps] = useUserLoginMutation()
  const [getProfile, getProfileProps] = useLazyGetProfileQuery()
console.log("LoginPage rendered",userLoginProps)
console.log("Profile rendered", getProfileProps)
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const { isAuthenticated } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = searchParams.get('redirect') || '/dashboard'
      router.push(redirectTo)
    }
  }, [isAuthenticated, router, searchParams])

  // Handle login API response
  useEffect(() => {
    if (userLoginProps.isSuccess && userLoginProps.data) {
      const { token, passwordExpired } = userLoginProps.data
      
      // Store token in Redux
      dispatch(setToken(token))
      
      // Store token using utility function
      if (keepLoggedIn) {
        setCookie('userToken', token, 30) // 30 days
        localStorage.setItem("userToken", token)
      } else {
        setCookie('userToken', token) // Session cookie
        localStorage.setItem("userToken", token)
      }
      
      // Check if password is expired
      if (passwordExpired === "1") {
        // Redirect to password change page or handle password expiration
        router.push("/change-password")
        return
      }
      
      // Fetch user profile
      getProfile(token)
    }
  }, [userLoginProps.isSuccess, userLoginProps.data, keepLoggedIn, dispatch, getProfile, router])

  // Handle login error
  useEffect(() => {
    if (userLoginProps.isError) {
      setLoginError("Invalid credentials or login failed. Please try again.")
    }
  }, [userLoginProps.isError])

  // Handle profile API response
  useEffect(() => {
    if (getProfileProps.isSuccess && getProfileProps.data) {
      const profileData = getProfileProps.data
      console.log("profileData", profileData)
      // Store profile data in Redux
      dispatch(setProfile(profileData))
      
      // You might need to extract user info from the token or profile for auth slice
      // For now, setting basic user info - you may need to decode JWT token for userId, role etc.
      dispatch(setUser({
        userName: profileData.userName,
        role: "R", // Extract from token if needed
        orgCode: orgCode, // Use the orgCode from form
      }))
      
      // Navigate to dashboard or intended page
      const redirectTo = searchParams.get('redirect') || '/dashboard'
      router.push(redirectTo)
    }
  }, [getProfileProps.isSuccess, getProfileProps.data, dispatch, router, orgCode, searchParams])

  // Handle profile fetch error
  useEffect(() => {
    if (getProfileProps.isError) {
      setLoginError("Failed to fetch user profile. Please try again.")
    }
  }, [getProfileProps.isError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    
    // Validate form
    if (!email || !password) {
      setLoginError("Please enter both email and password.")
      return
    }

    if (!orgCode) {
      setLoginError("Please enter organization code.")
      return
    }

    // Call login API
    try {
      await userLogin({
        userName: email,
        password: password,
        orgCode: orgCode
      })
    } catch (error) {
      setLoginError("Login failed. Please try again.")
    }
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
                <h1 className="text-2xl font-semibold text-white">Login to your account</h1>
                <p className="text-gray-400 text-base">Enter your details to login.</p>
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
                variant={'primary'}
                className="w-full bg-purple-600 hover:bg-purple-700 "
                disabled={userLoginProps.isLoading || getProfileProps.isLoading}
              >
                {userLoginProps.isLoading || getProfileProps.isLoading ? "Logging in..." : "Login"}
              </Button>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="keep-logged-in"
                    checked={keepLoggedIn}
                    onCheckedChange={(checked) => setKeepLoggedIn(checked as boolean)}
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
      <Footer/>
    </div>
  )
}