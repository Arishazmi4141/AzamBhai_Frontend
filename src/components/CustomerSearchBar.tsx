"use client";

import { useState } from "react";
import { Search, X, Filter } from "lucide-react";

export interface CustomerSearchParams {
  name: string;
  phone: string;
  fromDate: string;
  toDate: string;
}

export default function CustomerSearchBar({
  onSearch,
  onClear,
}: {
  onSearch: (params: CustomerSearchParams) => void;
  onClear: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [params, setParams] = useState<CustomerSearchParams>({
    name: "",
    phone: "",
    fromDate: "",
    toDate: "",
  });

  const hasActiveFilters = params.name || params.phone || params.fromDate || params.toDate;

  function handleSearch() {
    onSearch(params);
  }

  function handleClear() {
    setParams({ name: "", phone: "", fromDate: "", toDate: "" });
    onClear();
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-[#0a1e4e] focus:ring-1 focus:ring-[#0a1e4e]";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Search bar row */}
      <div className="flex items-center gap-3 p-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={params.name}
            onChange={(e) => setParams({ ...params, name: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by customer name..."
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

      {/* Expanded filters */}
      {expanded && (
        <div className="grid grid-cols-1 gap-4 border-t border-slate-100 p-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Phone Number</label>
            <input
              value={params.phone}
              onChange={(e) => setParams({ ...params, phone: e.target.value })}
              placeholder="9876543210"
              className={inputClass}
            />
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