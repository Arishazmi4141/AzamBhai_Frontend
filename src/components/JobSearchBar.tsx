"use client";

import { useState } from "react";
import { Search, X, Filter } from "lucide-react";
import { PaymentStatus, WorkStatus } from "@/types";

export interface JobSearchParams {
  keyword: string;
  workStatus: WorkStatus | "";
  paymentStatus: PaymentStatus | "";
  fromDate: string;
  toDate: string;
}

export default function JobSearchBar({
  onSearch,
  onClear,
}: {
  onSearch: (params: JobSearchParams) => void;
  onClear: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [params, setParams] = useState<JobSearchParams>({
    keyword: "",
    workStatus: "",
    paymentStatus: "",
    fromDate: "",
    toDate: "",
  });

  const hasActiveFilters =
    params.keyword || params.workStatus || params.paymentStatus || params.fromDate || params.toDate;

  function handleSearch() {
    onSearch(params);
  }

  function handleClear() {
    setParams({ keyword: "", workStatus: "", paymentStatus: "", fromDate: "", toDate: "" });
    onClear();
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-[#0a1e4e] focus:ring-1 focus:ring-[#0a1e4e]";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";

  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 p-3.5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={params.keyword}
            onChange={(e) => setParams({ ...params, keyword: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search jobs by title or description..."
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-[#0a1e4e] focus:ring-1 focus:ring-[#0a1e4e]"
          />
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition ${
            expanded || hasActiveFilters
              ? "border-[#0a1e4e] bg-[#0a1e4e]/5 text-[#0a1e4e]"
              : "border-slate-300 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Filter size={15} />
          Filters
        </button>

        <button
          onClick={handleSearch}
          className="rounded-lg bg-[#0a1e4e] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0d2563]"
        >
          Search
        </button>

        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:text-red-600"
          >
            <X size={15} />
            Clear
          </button>
        )}
      </div>

      {expanded && (
        <div className="grid grid-cols-1 gap-4 border-t border-slate-100 p-4 sm:grid-cols-4">
          <div>
            <label className={labelClass}>Work Status</label>
            <select
              value={params.workStatus}
              onChange={(e) => setParams({ ...params, workStatus: e.target.value as WorkStatus | "" })}
              className={inputClass}
            >
              <option value="">All</option>
              <option value="PENDING">Pending</option>
              <option value="DONE">Done</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Payment Status</label>
            <select
              value={params.paymentStatus}
              onChange={(e) => setParams({ ...params, paymentStatus: e.target.value as PaymentStatus | "" })}
              className={inputClass}
            >
              <option value="">All</option>
              <option value="DR">DR (Due)</option>
              <option value="CR">CR (Paid)</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>From Date</label>
            <input
              type="date"
              value={params.fromDate}
              onChange={(e) => setParams({ ...params, fromDate: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>To Date</label>
            <input
              type="date"
              value={params.toDate}
              onChange={(e) => setParams({ ...params, toDate: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      )}
    </div>
  );
}