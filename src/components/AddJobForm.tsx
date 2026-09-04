"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { Job } from "@/types";

export default function AddJobForm({
  customerId,
  onSuccess,
}: {
  customerId: string;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({ title: "", description: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiRequest<Job>("/admin/job", {
        method: "POST",
        body: {
          customerId,
          title: form.title,
          description: form.description,
          amount: Number(form.amount),
        },
      });
      setForm({ title: "", description: "", amount: "" });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to add job");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-[#0a1e4e] focus:ring-1 focus:ring-[#0a1e4e]";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div>
        <label className={labelClass}>Job Title</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className={inputClass}
          placeholder="Website Design"
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className={inputClass}
          placeholder="Homepage + 3 inner pages"
        />
      </div>

      <div>
        <label className={labelClass}>Amount (₹)</label>
        <input
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
          className={inputClass}
          placeholder="15000"
        />
      </div>

      <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
        New jobs start as <b>Pending</b> work with <b>DR</b> (due) payment by default.
      </p>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#0a1e4e] py-2.5 text-sm font-semibold text-white shadow-md shadow-[#0a1e4e]/20 transition hover:bg-[#0d2563] disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Job"}
      </button>
    </form>
  );
}