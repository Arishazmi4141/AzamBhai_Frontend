"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Topbar from "@/components/layout/Topbar";
import Modal from "@/components/ui/Modal";
import StatCard from "@/components/ui/StatCard";
import AddExpenseForm from "@/components/AddExpenseForm";
import EditExpenseForm from "@/components/EditExpenseForm";
import ExpenseSearchBar, { ExpenseSearchParams } from "@/components/ExpenseSearchBar";
import { Expense } from "@/types";
import { Pencil, Wallet, Receipt } from "lucide-react";

type Totals = Record<string, number>;

const EMPTY: ExpenseSearchParams = { keyword: "", fromDate: "", toDate: "" };

function SummaryList({ title, data }: { title: string; data: Totals }) {
  const rows = Object.entries(data).sort((a, b) => b[1] - a[1]);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-[#0a1e4e]">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-400">No data.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map(([name, total]) => (
            <li key={name} className="flex items-center justify-between text-sm">
              <span className="capitalize text-slate-600">{name}</span>
              <span className="font-semibold text-slate-800">₹{total.toLocaleString("en-IN")}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [byPaidTo, setByPaidTo] = useState<Totals>({});
  const [byPurpose, setByPurpose] = useState<Totals>({});
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [filters, setFilters] = useState<ExpenseSearchParams>(EMPTY);

  useEffect(() => {
    load(EMPTY);
  }, []);

  async function load(params: ExpenseSearchParams) {
    setLoading(true);
    setFilters(params);
    try {
      const q = new URLSearchParams();
      if (params.keyword) q.set("keyword", params.keyword);
      if (params.fromDate) q.set("fromDate", params.fromDate);
      if (params.toDate) q.set("toDate", params.toDate);

      const dq = new URLSearchParams();
      if (params.fromDate) dq.set("fromDate", params.fromDate);
      if (params.toDate) dq.set("toDate", params.toDate);

      const [list, paidTo, purpose] = await Promise.all([
        apiRequest<Expense[]>(`/admin/expense?${q.toString()}`),
        apiRequest<Totals>(`/admin/expense/summary/paid-to?${dq.toString()}`),
        apiRequest<Totals>(`/admin/expense/summary/purpose?${dq.toString()}`),
      ]);
      setExpenses(list);
      setByPaidTo(paidTo);
      setByPurpose(purpose);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <DashboardLayout>
      <Topbar
        title="Expenses"
        subtitle="Track kisko aur kis cheez pe kitna kharcha hua"
        actionLabel="Add Expense"
        onAction={() => setAddOpen(true)}
      />

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <StatCard label="Total (current list)" value={total} icon={Wallet} accent="amber" />
        <StatCard label="Entries" value={expenses.length} icon={Receipt} accent="navy" prefix="" />
      </div>

      <ExpenseSearchBar onSearch={load} onClear={() => load(EMPTY)} />

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <>
          <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  {["Date", "Paid To", "Purpose", "Amount", "Note", ""].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                      No expenses found.
                    </td>
                  </tr>
                ) : (
                  expenses.map((e) => (
                    <tr key={e.id} className="border-t border-slate-100 transition hover:bg-slate-50">
                      <td className="px-5 py-3.5 text-slate-500">
                        {new Date(e.expenseDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800">{e.paidTo}</td>
                      <td className="px-5 py-3.5 text-slate-600">{e.purpose}</td>
                      <td className="px-5 py-3.5 font-semibold text-amber-700">
                        ₹{e.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">{e.note || "—"}</td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setEditExpense(e)}
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-[#0a1e4e] hover:text-white"
                        >
                          <Pencil size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <SummaryList title="Kisko kitna diya (Paid To)" data={byPaidTo} />
            <SummaryList title="Kis cheez pe kitna kharcha (Purpose)" data={byPurpose} />
          </div>
        </>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Expense">
        <AddExpenseForm
          onSuccess={() => {
            setAddOpen(false);
            load(filters);
          }}
        />
      </Modal>

      <Modal open={!!editExpense} onClose={() => setEditExpense(null)} title="Update Expense">
        {editExpense && (
          <EditExpenseForm
            expense={editExpense}
            onSuccess={() => {
              setEditExpense(null);
              load(filters);
            }}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
}