"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { Customer } from "@/types";

export default function AddCustomerForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiRequest<Customer>("/admin/customer", { method: "POST", body: form });
      setForm({ name: "", phone: "", email: "", address: "" });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to add customer");
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
        <label className={labelClass}>Full Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className={inputClass}
          placeholder="Ramesh Kumar"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass}
            placeholder="9876543210"
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
            placeholder="ramesh@example.com"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Address</label>
        <textarea
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          rows={2}
          className={inputClass}
          placeholder="Lucknow, UP"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#0a1e4e] py-2.5 text-sm font-semibold text-white shadow-md shadow-[#0a1e4e]/20 transition hover:bg-[#0d2563] disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Customer"}
      </button>
    </form>
  );
}