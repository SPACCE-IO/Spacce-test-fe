"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { setUser, logout } from '@/app/store/slices/authSlice';
import { getAuthToken, validateToken, clearAuthData, setCookie } from '@/utils/auth';

export function useAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  
  const { userRole, userName, userId, orgCode, workspaceId } = useSelector(
    (state: RootState) => state.auth
  );

  const isAuthenticated = !!(userRole && userName && userId);

  useEffect(() => {
    // Check for token using the utility function
    const token = getAuthToken();
    
    if (token) {
      // Validate token and set user data
      validateTokenAndSetUser(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateTokenAndSetUser = async (token: string) => {
    try {
      const isValid = await validateToken(token);
      
      if (isValid) {
        // Here you would typically make an API call to get user data
        // For now, we'll simulate a successful validation
        const userData = {
          role: 'S', // or get from API response
          userName: 'Test User', // or get from API response
          userId: 1, // or get from API response
          orgCode: 'ORG001', // or get from API response
        };
        
        dispatch(setUser(userData));
      } else {
        handleLogout();
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Token validation failed:', error);
      handleLogout();
    }
  };

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      
      // Here you would make an API call to login
      // For now, we'll simulate a successful login
      const response = {
        token: 'mock-jwt-token',
        user: {
          role: 'S',
          userName: credentials.email,
          userId: 1,
          orgCode: 'ORG001',
        },
      };

      // Store token using utility function
      setCookie('userToken', response.token, 30); // 30 days
      localStorage.setItem('userToken', response.token);
      
      // Set user data in Redux
      dispatch(setUser(response.user));

      // Redirect to dashboard or intended page
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      router.push(redirectTo);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const handleLogout = () => {
    // Clear auth data using utility function
    clearAuthData();
    
    // Clear Redux state
    dispatch(logout());
    
    // Redirect to login
    router.push('/login');
  };

  const requireAuth = (callback?: () => void) => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
      return false;
    }
    
    if (callback && isAuthenticated) {
      callback();
    }
    
    return true;
  };

  return {
    isAuthenticated,
    isLoading,
    user: {
      role: userRole,
      userName,
      userId,
      orgCode,
      workspaceId,
    },
    login: handleLogin,
    logout: handleLogout,
    requireAuth,
  };
} 