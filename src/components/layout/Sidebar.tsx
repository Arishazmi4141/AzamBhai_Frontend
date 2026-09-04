"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";
import { LayoutDashboard, Users, LogOut, Briefcase } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    removeToken();
    router.push("/login");
  }

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/customers", label: "Customers", icon: Users },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col bg-[#0a1e4e] px-4 py-6">
      {/* Logo */}
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
          <Briefcase size={20} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight text-white">AzamBhai</p>
          <p className="text-xs text-blue-200/60">CRM & Ledger</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-blue-200/40">
          Menu
        </p>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-white text-[#0a1e4e] shadow-sm"
                  : "text-blue-100/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-blue-100/70 transition hover:bg-red-500/10 hover:text-red-300"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}