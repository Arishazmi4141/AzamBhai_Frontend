import type { CustomerDetail, Job } from "@/types";

export type ReceiptType = "PENDING" | "PAID";

const FIRM_NAME = "IRFAN WAKEEL";

const NAVY: [number, number, number] = [10, 30, 78];
const AMBER: [number, number, number] = [180, 83, 9];
const GREEN: [number, number, number] = [4, 120, 87];
const SLATE_BG: [number, number, number] = [241, 245, 249];
const GREY: [number, number, number] = [100, 116, 139];
const LINE: [number, number, number] = [226, 232, 240];

const PAGE_W = 210;
const HALF_H = 148.5; // A4 ka aadha hissa (297 / 2)
const M = 12;
const ROW_H = 9.5;
const ROWS_PER_PAGE = 6;

const fmtDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

// jsPDF ke default font mein ₹ nahi hota, isliye "Rs." use kiya hai
const fmtAmt = (n: number) => `Rs. ${n.toLocaleString("en-IN")}`;

export async function generateReceipt(
  type: ReceiptType,
  customer: Pick<CustomerDetail, "name" | "phone">,
  allJobs: Job[]
) {
  const { jsPDF } = await import("jspdf");

  const isPaid = type === "PAID";
  const accent = isPaid ? GREEN : AMBER;
  const title = isPaid ? "PAID AMOUNT RECEIPT" : "PENDING AMOUNT RECEIPT";
  const dateHeader = isPaid ? "Paid Date" : "Date";

  // Pending = DR (baaki), Paid = CR (mil gaya)
  const jobs = allJobs
    .filter((j) => j.paymentStatus === (isPaid ? "CR" : "DR"))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const total = jobs.reduce((s, j) => s + j.amount, 0);
  const pageCount = Math.max(1, Math.ceil(jobs.length / ROWS_PER_PAGE));
  const printedOn = fmtDate(new Date());

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  const clip = (text: string, width: number, size: number) => {
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, width) as string[];
    if (lines.length <= 1) return lines[0] ?? "";
    return lines[0].replace(/\s+$/, "").slice(0, -1) + "...";
  };

  for (let p = 0; p < pageCount; p++) {
    if (p > 0) doc.addPage();
    const isLast = p === pageCount - 1;
    const rows = jobs.slice(p * ROWS_PER_PAGE, (p + 1) * ROWS_PER_PAGE);

    // ---- Header band ----
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, PAGE_W, 24, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(21);
    doc.text(FIRM_NAME, PAGE_W / 2, 13, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(190, 205, 235);
    doc.text("PAYMENT RECEIPT", PAGE_W / 2, 19.5, { align: "center" });

    // ---- Title ----
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...accent);
    doc.text(title, PAGE_W / 2, 32, { align: "center" });
    doc.setDrawColor(...accent);
    doc.setLineWidth(0.6);
    doc.line(PAGE_W / 2 - 30, 34, PAGE_W / 2 + 30, 34);

    // ---- Customer info ----
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GREY);
    doc.text("CUSTOMER", M, 42);
    doc.text("DATE", PAGE_W - M, 42, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(clip(customer.name, 120, 11), M, 47.5);
    doc.text(printedOn, PAGE_W - M, 47.5, { align: "right" });

    if (customer.phone) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...GREY);
      doc.text(`Ph: ${customer.phone}`, M, 52);
    }

    // ---- Table header ----
    const tableY = 55;
    const xNo = M + 2;
    const xWork = M + 11;
    const xDate = 122;
    const xPay = 152;
    const xAmt = PAGE_W - M - 2;

    doc.setFillColor(...SLATE_BG);
    doc.rect(M, tableY, PAGE_W - 2 * M, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...NAVY);
    doc.text("#", xNo, tableY + 4.7);
    doc.text("WORK", xWork, tableY + 4.7);
    doc.text(dateHeader.toUpperCase(), xDate, tableY + 4.7);
    doc.text("WORK", xPay, tableY + 4.7);
    doc.text("AMOUNT", xAmt, tableY + 4.7, { align: "right" });

    // ---- Rows ----
    let y = tableY + 7;
    if (rows.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(...GREY);
      doc.text("No works found.", PAGE_W / 2, y + 14, { align: "center" });
    }

    rows.forEach((job, i) => {
      const idx = p * ROWS_PER_PAGE + i + 1;
      const dateStr = fmtDate(isPaid ? job.updatedAt ?? job.createdAt : job.createdAt);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...GREY);
      doc.text(String(idx), xNo, y + 5);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(clip(job.title, 100, 9.5), xWork, y + 4.3);

      if (job.description) {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...GREY);
        doc.text(clip(job.description, 100, 7.5), xWork, y + 7.7);
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text(dateStr, xDate, y + 5);

      const workDone = job.workStatus === "DONE";
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...(workDone ? GREEN : AMBER));
      doc.text(workDone ? "Done" : "Pending", xPay, y + 5);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(fmtAmt(job.amount), xAmt, y + 5, { align: "right" });

      y += ROW_H;
      doc.setDrawColor(...LINE);
      doc.setLineWidth(0.2);
      doc.line(M, y, PAGE_W - M, y);
    });

    // ---- Total / continued ----
    const totalY = tableY + 7 + ROWS_PER_PAGE * ROW_H + 4;
    if (isLast) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...GREY);
      doc.text(`Total works: ${jobs.length}`, M + 2, totalY + 5.3);

      doc.setFillColor(...NAVY);
      doc.roundedRect(PAGE_W - M - 72, totalY, 72, 8, 1.5, 1.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(`${isPaid ? "TOTAL PAID" : "TOTAL PENDING"}: ${fmtAmt(total)}`, PAGE_W - M - 3, totalY + 5.4, { align: "right" });
    } else {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(...GREY);
      doc.text("Continued on next page...", PAGE_W - M, totalY + 5.3, { align: "right" });
    }

    // ---- Footer ----
    const footY = HALF_H - 9;
    doc.setDrawColor(100, 116, 139);
    doc.setLineWidth(0.3);
    doc.line(PAGE_W - M - 50, footY, PAGE_W - M, footY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...GREY);
    doc.text("Authorized Signature", PAGE_W - M - 25, footY + 3.5, { align: "center" });

    doc.setFontSize(7.5);
    doc.text(
      pageCount > 1 ? `Thank you!   |   Page ${p + 1} of ${pageCount}` : "Thank you for your business!",
      M,
      footY + 3.5
    );

    // ---- Cut line (A4 ka half) ----
    doc.setDrawColor(180, 190, 205);
    doc.setLineWidth(0.2);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(0, HALF_H, PAGE_W, HALF_H);
    doc.setLineDashPattern([], 0);
  }

  const safeName = customer.name.replace(/[^a-z0-9]+/gi, "_");
  const stamp = new Date().toISOString().slice(0, 10);
  doc.save(`${isPaid ? "paid" : "pending"}_amount_receipt_${safeName}_${stamp}.pdf`);
}