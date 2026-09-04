"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Good night";
}

export default function GreetingHeader({ adminName }: { adminName: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) return null; // hydration mismatch avoid karne ke liye

  const greeting = getGreeting(now.getHours());

  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const dayStr = now.toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="relative mb-8 flex items-center justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white py-6 pl-8 pr-6 shadow-sm">
      {/* Navy accent bar */}
      <div className="absolute left-0 top-0 h-full w-1.5 bg-[#0a1e4e]" />

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Admin Dashboard · Live Synchronization Active
        </p>
        <h1 className="text-3xl font-bold text-slate-900">
          {greeting}, <span className="text-[#0a1e4e]">{adminName}</span>
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Secure token verified · entry session logged into core parameters architecture.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3">
        <Clock size={18} className="text-[#0a1e4e]" />
        <div>
          <p className="font-mono text-sm font-semibold text-slate-800">
            {dateStr}, {timeStr}
          </p>
          <p className="text-xs text-slate-500">
            Roster Day: <span className="font-semibold text-slate-700">{dayStr.toUpperCase()}</span>
          </p>
        </div>
        <span className="ml-1 h-2 w-2 rounded-full bg-emerald-500" />
      </div>
    </div>
  );
}