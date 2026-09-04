"use client";

import { useRouter } from "next/navigation";
import { CustomerSummary } from "@/types";
import { Eye } from "lucide-react";

export default function CustomerListTable({ customers }: { customers: CustomerSummary[] }) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            {["Customer", "Jobs", "Pending", "Done", "DR (Due)", "CR (Paid)", ""].map((h) => (
              <th key={h} className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                No customers yet — add your first one.
              </td>
            </tr>
          ) : (
            customers.map((c) => (
              <tr key={c.id} className="border-t border-slate-100 transition hover:bg-slate-50">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-slate-800">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.phone || c.email || "—"}</p>
                </td>
                <td className="px-5 py-3.5 text-slate-600">{c.totalJobs}</td>
                <td className="px-5 py-3.5">
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    {c.pendingJobs}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    {c.doneJobs}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-medium text-red-600">
                  ₹{c.totalDR.toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-3.5 font-medium text-[#0a1e4e]">
                  ₹{c.totalCR.toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => router.push(`/customers/${c.id}`)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#0a1e4e] transition hover:bg-[#0a1e4e] hover:text-white"
                  >
                    <Eye size={14} />
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}