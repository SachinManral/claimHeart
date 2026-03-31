"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, Heart, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Demo", href: "/dashboard" },
  { label: "Docs", href: "#" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur md:px-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--ch-blue)]">
            <Heart className="h-4 w-4 fill-white text-white" />
          </div>
          <div>
            <p className="text-base font-bold leading-none tracking-[-0.02em] text-slate-800">ClaimHeart</p>
            <div className="mt-1 flex items-center gap-1">
              <Activity className="h-2.5 w-2.5 text-[var(--ch-blue)]" />
              <span className="text-[10px] text-[var(--ch-muted)]">AI Claims Platform</span>
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
          >
            Login
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl bg-[var(--ch-blue)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 hover:shadow-lg"
          >
            Get Started
          </Link>
        </div>

        <button
          className="rounded-lg p-1.5 md:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5 text-slate-600" /> : <Menu className="h-5 w-5 text-slate-600" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-x-0 top-16 z-40 space-y-1 border-b border-slate-200 bg-white px-6 py-4 shadow-xl">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="block py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="space-y-2 pt-2">
            <Link
              href="/login"
              className="block w-full rounded-xl border border-slate-200 py-2.5 text-center text-sm font-medium text-slate-700"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/dashboard"
              className="block w-full rounded-xl bg-[var(--ch-blue)] py-2.5 text-center text-sm font-semibold text-white"
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
