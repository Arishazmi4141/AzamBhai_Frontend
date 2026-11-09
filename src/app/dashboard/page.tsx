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
  Wallet,
  Landmark,
  Coins,
  PiggyBank,
} from "lucide-react";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{children}</p>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<DashboardResponse>("/admin/dashboard")
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const netAccent = (v: number) => (v < 0 ? "red" : "green");

  return (
    <DashboardLayout>
      <GreetingHeader adminName="Admin" />

      {loading || !data ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <>
          {/* Job amounts */}
          <SectionTitle>Jobs Overview</SectionTitle>
          <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <StatCard label="Total DR Remaining" value={data.totalDRRemaining} icon={TrendingDown} accent="red" />
            <StatCard label="Total CR Paid" value={data.totalCRPaid} icon={TrendingUp} accent="green" />
            <StatCard label="Total Job Amount (DR + CR)" value={data.totalJobAmount} icon={Coins} accent="navy" />
          </div>

          {/* Expenses + Net */}
          <SectionTitle>Expenses & Balance</SectionTitle>
          <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <StatCard label="Total Expenses" value={data.totalExpenses} icon={Wallet} accent="amber" />
            <StatCard
              label="Net Balance (CR − Expenses)"
              value={data.netBalance}
              icon={Landmark}
              accent={netAccent(data.netBalance)}
            />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <StatCard label="Pending Jobs" value={data.pendingJobsCount} icon={Clock} accent="amber" prefix="" />
            <StatCard label="Completed Jobs" value={data.doneJobsCount} icon={CheckCircle2} accent="navy" prefix="" />
          </div>

          {/* Revenue */}
          <SectionTitle>Revenue Breakdown (CR)</SectionTitle>
          <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <StatCard label="Weekly Revenue" value={data.weeklyRevenue} icon={Calendar} accent="navy" />
            <StatCard label="Monthly Revenue" value={data.monthlyRevenue} icon={CalendarDays} accent="navy" />
            <StatCard label="Yearly Revenue" value={data.yearlyRevenue} icon={CalendarRange} accent="navy" />
          </div>

          {/* Expenses breakdown */}
          <SectionTitle>Expense Breakdown</SectionTitle>
          <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <StatCard label="Weekly Expenses" value={data.weeklyExpenses} icon={Calendar} accent="amber" />
            <StatCard label="Monthly Expenses" value={data.monthlyExpenses} icon={CalendarDays} accent="amber" />
            <StatCard label="Yearly Expenses" value={data.yearlyExpenses} icon={CalendarRange} accent="amber" />
          </div>

          {/* Net */}
          <SectionTitle>Net Profit (Revenue − Expenses)</SectionTitle>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <StatCard label="Weekly Net" value={data.weeklyNet} icon={PiggyBank} accent={netAccent(data.weeklyNet)} />
            <StatCard label="Monthly Net" value={data.monthlyNet} icon={PiggyBank} accent={netAccent(data.monthlyNet)} />
            <StatCard label="Yearly Net" value={data.yearlyNet} icon={PiggyBank} accent={netAccent(data.yearlyNet)} />
          </div>
        </>
      )}
    </DashboardLayout>
  );
}