import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { LoginRequest, LoginResponse, UserProfile } from "../types/api";

// Extend NextAuth types to include our custom user properties
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    orgCode: string;
    token: string;
    profilePic: {
      fileName: string;
      contentType: string;
      url: string;
    };
    gender: string;
    phone: string;
    tags: string[];
    attributes: Array<{ name: string; value: string }>;
    jobTitle?: string;
    managerName?: string;
    businessUnit?: string;
    onboardedBy?: string;
    onboardNote?: string;
  }

  interface Session {
    user: User;
    accessToken: string;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        userName: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        orgCode: { label: "Organization Code", type: "text" },
      },
      async authorize(credentials) {
        if (
          !credentials?.userName ||
          !credentials?.password ||
          !credentials?.orgCode
        ) {
          return null;
        }

        try {
          console.log("Attempting login with:", {
            userName: credentials.userName,
            orgCode: credentials.orgCode,
          });

          // Call the Spacce login API
          const response = await fetch(`${API_BASE_URL}/auth/api/v1/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userName: credentials.userName,
              password: credentials.password,
              orgCode: credentials.orgCode,
            } as LoginRequest),
          });

          if (!response.ok) {
            console.error("Login failed with status:", response.status);
            return null;
          }

          const loginData: LoginResponse = await response.json();
          console.log("Login response received:", {
            hasToken: !!loginData.token,
          });

          if (!loginData.token) {
            console.error("No token in login response");
            return null;
          }

          // Fetch user profile using the token
          const profileResponse = await fetch(
            `${API_BASE_URL}/user/api/v1/profile`,
            {
              headers: {
                Authorization: `Bearer ${loginData.token}`,
              },
            }
          );

          if (!profileResponse.ok) {
            console.error(
              "Profile fetch failed with status:",
              profileResponse.status
            );
            return null;
          }

          const profileData: UserProfile = await profileResponse.json();
          console.log("Profile data received:", {
            userName: profileData.userName,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            attributesCount: profileData.attributes.length,
          });

          // Return user object for NextAuth
          return {
            id: profileData.userName,
            email: profileData.userName,
            name: `${profileData.firstName} ${profileData.lastName}`,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            orgCode: credentials.orgCode as string, // Ensure orgCode is typed as string
            token: loginData.token,
            profilePic: profileData.profilePic,
            gender: profileData.gender,
            phone: profileData.phone,
            tags: profileData.tags,
            attributes: profileData.attributes,
            // Add additional useful fields
            jobTitle: profileData.attributes.find(
              (attr) => attr.name === "JOB_TITLE"
            )?.value,
            managerName: profileData.attributes.find(
              (attr) => attr.name === "MANAGER_NAME"
            )?.value,
            businessUnit: profileData.attributes.find(
              (attr) => attr.name === "BUSINESS_UNIT"
            )?.value,
            onboardedBy: profileData.attributes.find(
              (attr) => attr.name === "ONBOARDED_BY"
            )?.value,
            onboardNote: profileData.attributes.find(
              (attr) => attr.name === "ONBOARD_NOTE"
            )?.value,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persist user data and token in JWT
      if (user) {
        token.user = user;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.user = token.user as any;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/login", // Use the home page as login page
    error: "/login", // Redirect to home page on error
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 50, // 1 hour
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here",
});
