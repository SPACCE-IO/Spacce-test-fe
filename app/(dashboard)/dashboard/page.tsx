"use client";

import DashboardClient from "@/components/dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardClient />
      </Suspense>
    </ProtectedRoute>
  );
}