"use client";

import { useState } from "react";
import { Printer } from "lucide-react";
import { CustomerDetail } from "@/types";
import { generateReceipt, ReceiptType } from "@/lib/receipt";

export default function ReceiptButtons({ customer }: { customer: CustomerDetail }) {
  const [busy, setBusy] = useState<ReceiptType | null>(null);

  const dueJobs = customer.jobs.filter((j) => j.paymentStatus === "DR");
  const paidJobs = customer.jobs.filter((j) => j.paymentStatus === "CR");
  const dueTotal = dueJobs.reduce((s, j) => s + j.amount, 0);
  const paidTotal = paidJobs.reduce((s, j) => s + j.amount, 0);

  async function print(type: ReceiptType) {
    setBusy(type);
    try {
      await generateReceipt(type, customer, customer.jobs);
    } catch (err) {
      console.error(err);
      alert("Receipt generate nahi ho payi.");
    } finally {
      setBusy(null);
    }
  }

  const base =
    "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => print("PENDING")}
        disabled={dueJobs.length === 0 || busy !== null}
        title={dueJobs.length === 0 ? "Koi pending amount nahi hai" : "Pending amount receipt (PDF)"}
        className={`${base} border-red-200 bg-red-50 text-red-600 hover:bg-red-100`}
      >
        <Printer size={14} />
        {busy === "PENDING" ? "Creating..." : "Pending Amount"}
        <span className="rounded-full bg-red-200/70 px-1.5 text-[10px]">
          ₹{dueTotal.toLocaleString("en-IN")}
        </span>
      </button>

      <button
        onClick={() => print("PAID")}
        disabled={paidJobs.length === 0 || busy !== null}
        title={paidJobs.length === 0 ? "Koi paid amount nahi hai" : "Paid amount receipt (PDF)"}
        className={`${base} border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}
      >
        <Printer size={14} />
        {busy === "PAID" ? "Creating..." : "Paid Amount"}
        <span className="rounded-full bg-emerald-200/70 px-1.5 text-[10px]">
          ₹{paidTotal.toLocaleString("en-IN")}
        </span>
      </button>
    </div>
  );
}