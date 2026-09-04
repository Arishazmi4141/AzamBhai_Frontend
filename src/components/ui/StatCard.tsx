import { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = "navy",
  prefix = "₹",
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "navy" | "red" | "green" | "amber";
  prefix?: string;
}) {
  const accentMap = {
    navy: { bg: "bg-[#0a1e4e]/5", text: "text-[#0a1e4e]", icon: "text-[#0a1e4e]" },
    red: { bg: "bg-red-50", text: "text-red-600", icon: "text-red-500" },
    green: { bg: "bg-emerald-50", text: "text-emerald-600", icon: "text-emerald-500" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", icon: "text-amber-500" },
  }[accent];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${accentMap.bg}`}>
          <Icon size={18} className={accentMap.icon} />
        </div>
      </div>
      <p className={`text-2xl font-bold ${accentMap.text}`}>
        {typeof value === "number" ? `${prefix}${value.toLocaleString("en-IN")}` : value}
      </p>
    </div>
  );
}