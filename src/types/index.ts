export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
}

export type WorkStatus = "PENDING" | "DONE";
export type PaymentStatus = "DR" | "CR";

export interface Job {
  id: number;
  title: string;
  description: string;
  amount: number;
  workStatus: WorkStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerSummary {
  id: number;
  name: string;
  phone: string;
  email: string;
  totalJobs: number;
  pendingJobs: number;
  doneJobs: number;
  totalDR: number;
  totalCR: number;
}

export interface CustomerDetail {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  jobs: Job[];
}

// ===== Apni existing "@/types" file mein ye add karo =====

export interface Expense {
  id: string;
  paidTo: string;
  purpose: string;
  amount: number;
  expenseDate: string; // "yyyy-MM-dd"
  note?: string;
  createdAt: string;
}

// DashboardResponse ko is se REPLACE karo (purane fields + naye fields)
export interface DashboardResponse {
  totalDRRemaining: number;
  totalCRPaid: number;
  totalJobAmount: number;

  weeklyRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;

  totalExpenses: number;
  weeklyExpenses: number;
  monthlyExpenses: number;
  yearlyExpenses: number;

  netBalance: number;
  weeklyNet: number;
  monthlyNet: number;
  yearlyNet: number;

  pendingJobsCount: number;
  doneJobsCount: number;
}