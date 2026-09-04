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

export interface DashboardResponse {
  totalDRRemaining: number;
  totalCRPaid: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  yearlyRevenue: number;
  pendingJobsCount: number;
  doneJobsCount: number;
}