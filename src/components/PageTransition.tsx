"use client";

// import { useNavigationCleanup } from "@/hooks/useNavigationCleanup";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  
  // Use the navigation cleanup hook
  // useNavigationCleanup();

  return (
    <div className="page-transition-wrapper" key={pathname}>
      {children}
    </div>
  );
} 