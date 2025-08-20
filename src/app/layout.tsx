import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PageTransition from "@/src/components/PageTransition";
import NextAuthProvider from "@/src/components/providers/NextAuthProvider";
import { Provider } from "react-redux";
import { store } from "../store/store";
import ReduxProvider from "../components/providers/ReduxProvider";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Spacce",
  description: "Everbording platform for Employees",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <ReduxProvider>
            <PageTransition>{children}</PageTransition>
          </ReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
