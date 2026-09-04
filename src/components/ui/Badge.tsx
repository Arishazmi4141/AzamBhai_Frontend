export function WorkBadge({ status }: { status: "PENDING" | "DONE" }) {
  const isDone = status === "DONE";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isDone ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isDone ? "bg-emerald-500" : "bg-amber-500"}`} />
      {isDone ? "Done" : "Pending"}
    </span>
  );
}

export function PaymentBadge({ status }: { status: "DR" | "CR" }) {
  const isCR = status === "CR";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isCR ? "bg-[#0a1e4e]/5 text-[#0a1e4e]" : "bg-red-50 text-red-600"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isCR ? "bg-[#0a1e4e]" : "bg-red-500"}`} />
      {isCR ? "Paid (CR)" : "Due (DR)"}
    </span>
  );
}