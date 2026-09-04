"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Topbar from "@/components/layout/Topbar";
import Modal from "@/components/ui/Modal";
import AddCustomerForm from "@/components/AddCustomerForm";
import CustomerListTable from "@/components/CustomerListTable";
import CustomerSearchBar, { CustomerSearchParams } from "@/components/CustomerSearchBar";
import { CustomerSummary } from "@/types";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    setLoading(true);
    try {
      const res = await apiRequest<CustomerSummary[]>("/admin/customer");
      setCustomers(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(params: CustomerSearchParams) {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (params.name) query.set("name", params.name);
      if (params.phone) query.set("phone", params.phone);
      if (params.fromDate) query.set("fromDate", params.fromDate);
      if (params.toDate) query.set("toDate", params.toDate);

      const res = await apiRequest<CustomerSummary[]>(`/admin/customer/search?${query.toString()}`);
      setCustomers(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <Topbar
        title="Customers"
        subtitle="Manage customers, their jobs and payments"
        actionLabel="Add Customer"
        onAction={() => setModalOpen(true)}
      />

      <CustomerSearchBar onSearch={handleSearch} onClear={loadCustomers} />

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <CustomerListTable customers={customers} />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Customer">
        <AddCustomerForm
          onSuccess={() => {
            setModalOpen(false);
            loadCustomers();
          }}
        />
      </Modal>
    </DashboardLayout>
  );
}