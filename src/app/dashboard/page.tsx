"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GreetingHeader from "@/components/ui/GreetingHeader";
import StatCard from "@/components/ui/StatCard";
import { DashboardResponse } from "@/types";
import {
  TrendingDown,
  TrendingUp,
  Calendar,
  CalendarDays,
  CalendarRange,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<DashboardResponse>("/admin/dashboard")
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <GreetingHeader adminName="Admin" />

      {loading || !data ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <StatCard label="Total DR Remaining" value={data.totalDRRemaining} icon={TrendingDown} accent="red" />
            <StatCard label="Total CR Paid" value={data.totalCRPaid} icon={TrendingUp} accent="green" />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <StatCard label="Pending Jobs" value={data.pendingJobsCount} icon={Clock} accent="amber" prefix="" />
            <StatCard label="Completed Jobs" value={data.doneJobsCount} icon={CheckCircle2} accent="navy" prefix="" />
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Revenue Breakdown
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <StatCard label="Weekly Revenue" value={data.weeklyRevenue} icon={Calendar} accent="navy" />
            <StatCard label="Monthly Revenue" value={data.monthlyRevenue} icon={CalendarDays} accent="navy" />
            <StatCard label="Yearly Revenue" value={data.yearlyRevenue} icon={CalendarRange} accent="navy" />
          </div>
        </>
      )}
    </DashboardLayout>
  );
}