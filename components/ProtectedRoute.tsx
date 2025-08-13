"use client";

import useToken from "@/hooks/useToken";
import { logout } from "@/store/slices/tokenSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

interface DecodedToken {
  exp: number;
  iat: number;
  sub: string;
  [key: string]: any;
}

// Helper function to decode JWT token
const decodeToken = (token: string): DecodedToken | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Invalid token format:', error);
    return null;
  }
};

// Helper function to check if JWT token is valid and not expired
const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  
  const decoded = decodeToken(token);
  if (!decoded) return false;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp > currentTime;
};

export default function ProtectedRoute({ 
  children, 
  fallback = <div>Loading...</div>,
  redirectTo = '/login'
}: ProtectedRouteProps) {
    const dispatch = useDispatch()

  const router = useRouter();
  const token = useToken();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      setIsChecking(true);
      
      if (!token) {
        console.log("No token found, redirecting to login");
        dispatch(logout())
        router.push(redirectTo);
        setIsChecking(false);
        return;
      }

      // Check if token is valid and not expired
      if (!isTokenValid(token)) {
        console.log("Token is invalid or expired");
        dispatch(logout())
        setIsChecking(false);
        return;
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [token, router, redirectTo, logout]);

  // Show loading state while checking authentication
  if (isChecking) {
    return fallback;
  }

  // User is authenticated, render children
  return <>{children}</>;
}