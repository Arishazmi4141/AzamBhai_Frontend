"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Modal from "@/components/ui/Modal";
import AddJobForm from "@/components/AddJobForm";
import EditJobForm from "@/components/EditJobForm";
import JobSearchBar, { JobSearchParams } from "@/components/JobSearchBar";
import ReceiptButtons from "@/components/ReceiptButtons";
import { WorkBadge, PaymentBadge } from "@/components/ui/Badge";
import { CustomerDetail, Job } from "@/types";
import { ArrowLeft, Plus, Pencil, Phone, Mail, MapPin } from "lucide-react";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [addJobOpen, setAddJobOpen] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);

  useEffect(() => {
    loadCustomer();
  }, [id]);

  async function loadCustomer() {
    setLoading(true);
    try {
      const res = await apiRequest<CustomerDetail>(`/admin/customer/${id}`);
      setCustomer(res);
      setJobs(res.jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleJobSearch(params: JobSearchParams) {
    try {
      const query = new URLSearchParams();
      if (params.keyword) query.set("keyword", params.keyword);
      if (params.workStatus) query.set("workStatus", params.workStatus);
      if (params.paymentStatus) query.set("paymentStatus", params.paymentStatus);
      if (params.fromDate) query.set("fromDate", params.fromDate);
      if (params.toDate) query.set("toDate", params.toDate);

      const res = await apiRequest<Job[]>(`/admin/job/customer/${id}/search?${query.toString()}`);
      setJobs(res);
    } catch (err) {
      console.error(err);
    }
  }

  function handleJobSearchClear() {
    if (customer) setJobs(customer.jobs);
  }

  if (loading || !customer) {
    return (
      <DashboardLayout>
        <p className="text-slate-500">Loading...</p>
      </DashboardLayout>
    );
  }

  const totalDR = customer.jobs.filter((j) => j.paymentStatus === "DR").reduce((s, j) => s + j.amount, 0);
  const totalCR = customer.jobs.filter((j) => j.paymentStatus === "CR").reduce((s, j) => s + j.amount, 0);

  return (
    <DashboardLayout>
      <button
        onClick={() => router.push("/customers")}
        className="mb-5 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#0a1e4e]"
      >
        <ArrowLeft size={16} />
        Back to Customers
      </button>

      {/* Customer Info Card */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0a1e4e]">{customer.name}</h1>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-slate-500">
              {customer.phone && <span className="flex items-center gap-1.5"><Phone size={14} /> {customer.phone}</span>}
              {customer.email && <span className="flex items-center gap-1.5"><Mail size={14} /> {customer.email}</span>}
              {customer.address && <span className="flex items-center gap-1.5"><MapPin size={14} /> {customer.address}</span>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ReceiptButtons customer={customer} />
            <button
              onClick={() => setAddJobOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-[#0a1e4e] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#0a1e4e]/20 hover:bg-[#0d2563]"
            >
              <Plus size={16} />
              Add Job
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">Total Jobs</p>
            <p className="text-xl font-bold text-slate-800">{customer.jobs.length}</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-4">
            <p className="text-xs font-medium text-amber-700">Pending</p>
            <p className="text-xl font-bold text-amber-700">
              {customer.jobs.filter((j) => j.workStatus === "PENDING").length}
            </p>
          </div>
          <div className="rounded-xl bg-red-50 p-4">
            <p className="text-xs font-medium text-red-600">Total DR</p>
            <p className="text-xl font-bold text-red-600">₹{totalDR.toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-xl bg-[#0a1e4e]/5 p-4">
            <p className="text-xs font-medium text-[#0a1e4e]">Total CR</p>
            <p className="text-xl font-bold text-[#0a1e4e]">₹{totalCR.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>

      {/* Job Search */}
      <h2 className="mb-3 text-lg font-semibold text-[#0a1e4e]">Job History</h2>
      <JobSearchBar onSearch={handleJobSearch} onClear={handleJobSearchClear} />

      <div className="space-y-3">
        {jobs.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400">
            No jobs found.
          </p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div>
                <p className="font-semibold text-slate-800">{job.title}</p>
                {job.description && <p className="mt-0.5 text-sm text-slate-500">{job.description}</p>}
                <p className="mt-2 text-xs text-slate-400">{new Date(job.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-lg font-bold text-slate-800">₹{job.amount.toLocaleString("en-IN")}</p>
                <WorkBadge status={job.workStatus} />
                <PaymentBadge status={job.paymentStatus} />
                <button
                  onClick={() => setEditJob(job)}
                  className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-[#0a1e4e] hover:text-white"
                >
                  <Pencil size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={addJobOpen} onClose={() => setAddJobOpen(false)} title="Add New Job">
        <AddJobForm
          customerId={id as string}
          onSuccess={() => {
            setAddJobOpen(false);
            loadCustomer();
          }}
        />
      </Modal>

      <Modal open={!!editJob} onClose={() => setEditJob(null)} title="Update Job">
        {editJob && (
          <EditJobForm
            job={editJob}
            onSuccess={() => {
              setEditJob(null);
              loadCustomer();
            }}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
}