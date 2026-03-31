"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  ChevronsLeft,
  ChevronsRight,
  ChevronRight,
  FileText,
  Heart,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Claims Queue", href: "/claims", icon: FileText },
  { label: "Fraud Alerts", href: "/fraud", icon: AlertTriangle },
  { label: "Policy Library", href: "/policies", icon: BookOpen },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const pageTitle =
    NAV_ITEMS.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label ?? "ClaimHeart";

  const desktopSidebarWidth = collapsed ? "lg:pl-[4.75rem]" : "lg:pl-[17rem]";
  const sidebarWidth = collapsed ? "w-[4.75rem]" : "w-[17rem]";
  const togglePosition = collapsed ? "left-[4.75rem]" : "left-[17rem]";

  return (
    <div className="h-screen overflow-hidden bg-[var(--ch-surface)]">
      <aside
        className={`fixed inset-y-0 left-0 z-50 hidden flex-col bg-[var(--ch-blue-dark)] shadow-[2px_0_16px_rgba(47,111,178,0.16)] transition-[width] duration-200 lg:flex ${sidebarWidth}`}
      >
        <div className={`flex h-[72px] items-center border-b border-white/10 ${collapsed ? "justify-center px-3" : "gap-3 px-5"}`}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
            <Heart className="h-4 w-4 fill-white text-white" />
          </div>
          <div className={`overflow-hidden transition-all duration-200 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
            <p className="whitespace-nowrap text-lg font-bold tracking-[-0.03em] text-white">ClaimHeart</p>
            <p className="whitespace-nowrap text-[11px] text-white/65">AI Claims Platform</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-5">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-2xl py-3 text-[15px] font-semibold transition ${
                  collapsed ? "justify-center px-3" : "gap-3 px-4"
                } ${
                  active ? "bg-white/18 text-white" : "text-white/72 hover:bg-white/10 hover:text-white"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className={`flex items-center rounded-2xl bg-white/10 py-3 ${collapsed ? "justify-center px-2" : "gap-3 px-4"}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ch-blue)] text-white">
              <User className="h-4 w-4" />
            </div>
            <div className={`overflow-hidden transition-all duration-200 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
              <p className="whitespace-nowrap text-sm font-semibold text-white">Admin User</p>
              <p className="whitespace-nowrap text-[11px] text-white/60">Care Health Insurance</p>
            </div>
          </div>
        </div>
      </aside>

      <button
        className={`fixed top-[78px] z-[60] hidden h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-[0_8px_24px_rgba(15,23,42,0.14)] transition-all duration-200 hover:bg-slate-50 lg:flex ${togglePosition}`}
        onClick={() => setCollapsed((value) => !value)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
      </button>

      <div className={`flex h-screen min-w-0 flex-col transition-[padding] duration-200 ${desktopSidebarWidth}`}>
        <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <button className="rounded-xl p-2 text-slate-500 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <span className="hidden text-slate-400 lg:inline-flex">
              <X className="h-4 w-4" />
            </span>
            <ChevronRight className="h-4 w-4 text-slate-300" />
            <span className="text-[1.45rem] font-bold tracking-[-0.03em] text-slate-800 md:text-[1.6rem]">{pageTitle}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 md:flex">
              <Search className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-400">Search claims, patients...</span>
            </div>
            <button className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
            </button>
            <Link
              href="/claims"
              className="rounded-2xl bg-[var(--ch-blue)] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(74,142,219,0.18)] transition hover:opacity-95"
            >
              New Claim
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
