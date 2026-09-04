"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { Job, PaymentStatus, WorkStatus } from "@/types";

export default function EditJobForm({
  job,
  onSuccess,
}: {
  job: Job;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    title: job.title,
    amount: String(job.amount),
    workStatus: job.workStatus,
    paymentStatus: job.paymentStatus,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiRequest<Job>(`/admin/job/${job.id}`, {
        method: "PUT",
        body: {
          title: form.title,
          amount: Number(form.amount),
          workStatus: form.workStatus,
          paymentStatus: form.paymentStatus,
        },
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to update job");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this job permanently?")) return;
    await apiRequest(`/admin/job/${job.id}`, { method: "DELETE" });
    onSuccess();
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
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Amount (₹)</label>
        <input
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Work Status</label>
          <select
            value={form.workStatus}
            onChange={(e) => setForm({ ...form, workStatus: e.target.value as WorkStatus })}
            className={inputClass}
          >
            <option value="PENDING">Pending</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Payment Status</label>
          <select
            value={form.paymentStatus}
            onChange={(e) => setForm({ ...form, paymentStatus: e.target.value as PaymentStatus })}
            className={inputClass}
          >
            <option value="DR">DR (Due)</option>
            <option value="CR">CR (Paid)</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-[#0a1e4e] py-2.5 text-sm font-semibold text-white shadow-md shadow-[#0a1e4e]/20 transition hover:bg-[#0d2563] disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </form>
  );
}