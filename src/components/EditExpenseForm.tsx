"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { Expense } from "@/types";

export default function EditExpenseForm({
  expense,
  onSuccess,
}: {
  expense: Expense;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    paidTo: expense.paidTo,
    purpose: expense.purpose,
    amount: String(expense.amount),
    expenseDate: expense.expenseDate,
    note: expense.note ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiRequest<Expense>(`/admin/expense/${expense.id}`, {
        method: "PUT",
        body: {
          paidTo: form.paidTo,
          purpose: form.purpose,
          amount: Number(form.amount),
          expenseDate: form.expenseDate,
          note: form.note,
        },
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to update expense");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this expense permanently?")) return;
    try {
      await apiRequest(`/admin/expense/${expense.id}`, { method: "DELETE" });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to delete expense");
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-[#0a1e4e] focus:ring-1 focus:ring-[#0a1e4e]";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Paid To (Kisko)</label>
          <input
            value={form.paidTo}
            onChange={(e) => setForm({ ...form, paidTo: e.target.value })}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Purpose (Kis pe)</label>
          <input
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Amount (₹)</label>
          <input
            type="number"
            min="1"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Date</label>
          <input
            type="date"
            value={form.expenseDate}
            onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Note</label>
        <textarea
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          rows={2}
          className={inputClass}
        />
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