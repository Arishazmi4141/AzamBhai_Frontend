"use client";

import { Plus } from "lucide-react";
import { ReactNode } from "react";

export default function Topbar({
  title,
  subtitle,
  actionLabel,
  onAction,
  extra,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  extra?: ReactNode;
}) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#0a1e4e]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {extra}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="flex items-center gap-2 rounded-xl bg-[#0a1e4e] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#0a1e4e]/20 transition hover:bg-[#0d2563]"
          >
            <Plus size={16} />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}