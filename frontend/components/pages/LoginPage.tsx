import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <div className="w-full max-w-md rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <h1 className="text-3xl font-bold tracking-[-0.04em] text-slate-900">Welcome Back</h1>
        <p className="mt-3 text-lg text-[var(--ch-muted)]">Sign in to access the ClaimHeart workspace.</p>
        <div className="mt-6 space-y-4">
          <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Email" />
          <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Password" type="password" />
          <Link href="/dashboard" className="block rounded-2xl bg-[var(--ch-blue)] px-4 py-3 text-center text-sm font-semibold text-white">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
