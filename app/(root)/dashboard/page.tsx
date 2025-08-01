"use client";

import DashboardClient from "@/app/components/dashboard";
import { Suspense } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardClient />
      </Suspense>
    </ProtectedRoute>
  );
}