"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { saveToken } from "@/lib/auth";
import { Briefcase } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiRequest<{ token: string }>("/user/login", {
        method: "POST",
        body: { email, password },
        authRequired: false,
      });
      saveToken(data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Branding Panel — Navy */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#0a1e4e] p-12 lg:flex">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
            <Briefcase size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">AzamBhai CRM</span>
        </div>

        <div className="relative z-10">
          <h1 className="mb-4 text-4xl font-bold leading-tight text-white">
            Manage every customer, <br /> job and payment in one place.
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-blue-100/70">
            Track pending work, DR/CR balances, and revenue trends — a
            complete CRM built for your business.
          </p>
        </div>

        <div className="relative z-10 flex gap-10 text-sm text-blue-100/60">
          <div>
            <p className="text-2xl font-bold text-white">100%</p>
            <p>Secure JWT Auth</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">Live</p>
            <p>Dashboard Sync</p>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div className="mb-2 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0a1e4e]">
              <Briefcase size={18} className="text-white" />
            </div>
            <span className="font-bold text-[#0a1e4e]">AzamBhai CRM</span>
          </div>

          <h2 className="mb-1 text-2xl font-bold text-[#0a1e4e]">Welcome back</h2>
          <p className="mb-8 text-sm text-slate-500">Sign in to access your admin dashboard</p>

          {error && (
            <p className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
              {error}
            </p>
          )}

          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-5 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#0a1e4e] focus:ring-1 focus:ring-[#0a1e4e]"
            placeholder="admin@company.com"
          />

          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-8 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#0a1e4e] focus:ring-1 focus:ring-[#0a1e4e]"
            placeholder="••••••••"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#0a1e4e] py-3 text-sm font-semibold text-white shadow-lg shadow-[#0a1e4e]/20 transition hover:bg-[#0d2563] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}