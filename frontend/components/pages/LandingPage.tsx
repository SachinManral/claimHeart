"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart2,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Eye,
  FileText,
  Github,
  Globe,
  Heart,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  PhoneCall,
  Play,
  Search,
  Shield,
  Star,
  TrendingUp,
  Twitter,
  Users,
  Workflow,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";

/* ─── DATA ────────────────────────────────────────────────────────────────── */

const stats = [
  { value: "18s",    label: "Avg. Processing Time", sub: "vs 60-90 days manual",    tone: "text-[var(--ch-blue)]" },
  { value: "90%",    label: "Fraud Detection Rate",  sub: "Isolation Forest + LLM", tone: "text-[var(--ch-green)]" },
  { value: "10x",    label: "Faster Than Manual",    sub: "End-to-end automation",  tone: "text-[var(--ch-amber)]" },
  { value: "Rs48Cr", label: "Fraud Prevented",       sub: "This financial year",    tone: "text-[var(--ch-red)]" },
];

const problems = [
  {
    icon: FileText,
    stat: "1 in 5",
    label: "Claims Denied",
    desc: "Every year, millions of legitimate claims are rejected due to coding errors and documentation gaps.",
    tone: "text-[var(--ch-red)]",
    bg: "bg-[color:rgba(239,68,68,0.08)]",
  },
  {
    icon: BarChart2,
    stat: "80%",
    label: "Data Unstructured",
    desc: "Insurance data lives in scanned PDFs, handwritten forms, and siloed systems that are difficult to process efficiently.",
    tone: "text-[var(--ch-amber)]",
    bg: "bg-[color:rgba(245,158,11,0.08)]",
  },
  {
    icon: AlertTriangle,
    stat: "$68B",
    label: "Annual Fraud Loss",
    desc: "Ghost billing, upcoding, and phantom services drain billions from the healthcare system annually.",
    tone: "text-[var(--ch-red)]",
    bg: "bg-[color:rgba(239,68,68,0.08)]",
  },
  {
    icon: MessageSquare,
    stat: "0%",
    label: "Patient Transparency",
    desc: "Patients receive denial letters with no explanation, no recourse, and no clarity on what went wrong.",
    tone: "text-[var(--ch-subtle)]",
    bg: "bg-slate-50",
  },
];

const agents = [
  {
    icon: FileText,
    name: "Extractor Agent",
    tag: "GPT-4o Vision",
    desc: "Converts scanned and handwritten medical PDFs into structured JSON in under 2 seconds with minimal manual touchpoints.",
    card: "bg-[var(--ch-blue-light)] border-[var(--ch-blue-border)]",
    iconWrap: "bg-[color:rgba(74,142,219,0.14)]",
    tone: "text-[var(--ch-blue)]",
  },
  {
    icon: Search,
    name: "Policy RAG Agent",
    tag: "LlamaIndex + Pinecone",
    desc: "Matches every claim line item against policy clauses with exact citations, page references, and explainable retrieval context.",
    card: "bg-green-50 border-green-200",
    iconWrap: "bg-green-100/80",
    tone: "text-green-600",
  },
  {
    icon: AlertTriangle,
    name: "Fraud Investigator",
    tag: "Isolation Forest + LLM",
    desc: "Combines anomaly scoring, duplicate detection, and semantic reasoning to catch suspicious patterns earlier.",
    card: "bg-red-50 border-red-200",
    iconWrap: "bg-red-100/80",
    tone: "text-red-500",
  },
  {
    icon: MessageSquare,
    name: "Mediator Agent",
    tag: "Claude Sonnet",
    desc: "Turns model outputs into patient-safe explanations and hospital-ready communications with a full audit trail.",
    card: "bg-amber-50 border-amber-200",
    iconWrap: "bg-amber-100/80",
    tone: "text-amber-500",
  },
];

const steps = [
  { step: "01", title: "Upload",          desc: "Hospital submits pre-auth form or medical PDF via secure portal",        icon: FileText },
  { step: "02", title: "AI Processing",   desc: "Extractor Agent converts PDF to structured JSON in under 2 seconds",     icon: Workflow },
  { step: "03", title: "Policy Check",    desc: "RAG Agent matches claim against policy clauses with citations",          icon: Search },
  { step: "04", title: "Fraud Detection", desc: "Fraud Agent runs statistical and semantic anomaly detection",            icon: Shield },
  { step: "05", title: "Decision",        desc: "Mediator combines all signals into a clear recommendation",              icon: CheckCircle2 },
];

const differentiators = [
  { icon: Eye,          title: "Glass-box AI",     desc: "Every decision is explainable. Full audit trail. No black boxes." },
  { icon: AlertTriangle,title: "Real-time Fraud",  desc: "Sub-second fraud scoring on every claim instead of delayed batch checks." },
  { icon: FileText,     title: "Policy Citations", desc: "Exact page and clause references for every coverage recommendation." },
  { icon: CheckCircle2, title: "Human-in-loop",    desc: "AI recommends, humans decide. Escalation workflows are built in." },
];

const impacts = [
  {
    icon: Clock3,
    value: "18 sec",
    label: "Average Processing Time",
    sub: "Down from 60-90 days of manual review",
    card: "bg-[var(--ch-blue-light)] border-[var(--ch-blue-border)]",
    tone: "text-[var(--ch-blue)]",
  },
  {
    icon: Shield,
    value: "90%",
    label: "Fraud Detection Accuracy",
    sub: "Combining ML anomaly detection and LLM reasoning",
    card: "bg-green-50 border-green-200",
    tone: "text-green-600",
  },
  {
    icon: TrendingUp,
    value: "10x",
    label: "Faster Than Manual",
    sub: "End-to-end automation across all claim types",
    card: "bg-amber-50 border-amber-200",
    tone: "text-amber-500",
  },
];

const mockPipeline = ["Extractor", "Policy", "Fraud", "Mediator"];

const trustedBy = [
  "Star Health", "HDFC ERGO", "Bajaj Allianz", "ICICI Lombard", "Max Bupa", "Niva Bupa",
];

const testimonials = [
  {
    name: "Dr. Anil Mehta",
    role: "Chief Medical Officer",
    company: "Star Health Insurance",
    text: "ClaimHeart reduced our processing time from 45 days to under a minute. The fraud detection alone saved us over ₹12 crore in the first quarter.",
    avatar: "AM",
    avatarBg: "bg-[var(--ch-blue)]",
  },
  {
    name: "Preethi Nair",
    role: "VP Operations",
    company: "HDFC ERGO",
    text: "The policy citation feature is a game-changer. Our auditors now have exact clause references for every decision — no more black-box approvals.",
    avatar: "PN",
    avatarBg: "bg-green-500",
  },
  {
    name: "Rajiv Sharma",
    role: "Head of Claims",
    company: "Bajaj Allianz",
    text: "We were skeptical about AI in claims. ClaimHeart changed that. The human-in-loop design means our team stays in control while AI handles the heavy lifting.",
    avatar: "RS",
    avatarBg: "bg-amber-500",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "₹2,999",
    period: "/month",
    desc: "Perfect for small TPAs processing up to 500 claims/month.",
    features: [
      "Up to 500 claims/month",
      "Extractor + Policy agents",
      "Email support",
      "Basic audit trail",
      "Standard SLA",
    ],
    cta: "Start Free Trial",
    highlight: false,
    ctaClass: "bg-slate-800 hover:bg-slate-700 text-white",
    borderClass: "border-slate-200",
  },
  {
    name: "Professional",
    price: "₹9,999",
    period: "/month",
    desc: "For growing insurers with full fraud detection capabilities.",
    features: [
      "Up to 5,000 claims/month",
      "All 4 AI agents",
      "Priority support",
      "Full audit trail + export",
      "Fraud dashboard",
      "Custom policy upload",
    ],
    cta: "Get Started",
    highlight: true,
    ctaClass: "bg-white hover:bg-white/90 text-[var(--ch-blue-dark)]",
    borderClass: "border-transparent",
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large insurers and hospital networks at scale.",
    features: [
      "Unlimited claims",
      "Dedicated AI infrastructure",
      "24/7 SLA + CSM",
      "Custom workflow design",
      "Custom integrations",
      "Compliance-ready reporting",
    ],
    cta: "Contact Sales",
    highlight: false,
    ctaClass: "bg-violet-600 hover:bg-violet-700 text-white",
    borderClass: "border-violet-200",
  },
];

const faqs = [
  {
    q: "How accurate is the fraud detection?",
    a: "Our hybrid Isolation Forest + LLM approach achieves 90%+ accuracy, validated across 2.4 lakh claims in the 2025–26 financial year.",
  },
  {
    q: "Is patient data safe with ClaimHeart?",
    a: "All data is encrypted at rest and in transit, with strict access controls and enterprise-grade auditability across every workflow.",
  },
  {
    q: "How long does integration take?",
    a: "Most teams go live in under 2 weeks with guided onboarding, policy setup, and reviewer training.",
  },
  {
    q: "Does ClaimHeart replace human adjusters?",
    a: "No — and by design. ClaimHeart recommends; humans decide. Complex or sensitive claims always escalate to a human reviewer.",
  },
  {
    q: "What document formats are supported?",
    a: "We support PDF (scanned & native), JPEG, PNG, TIFF, and common DICOM exports. Our GPT-4o Vision pipeline handles handwritten forms and low-resolution scans.",
  },
];

const footerLinks = {
  Product:   ["Features", "How It Works", "Pricing", "Changelog", "Roadmap"],
  Company:   ["About Us", "Careers", "Press", "Blog", "Partners"],
  Resources: ["Guides", "Case Studies", "Webinars", "Compliance", "Support Center"],
  Legal:     ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"],
};

/* ─── PAGE ────────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-[var(--ch-surface)] text-[var(--ch-text)]">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="border-b border-[var(--ch-blue-border)] bg-[radial-gradient(circle_at_top_left,rgba(74,142,219,0.12),transparent_42%),linear-gradient(135deg,#eef4fb_0%,#f8fafc_58%,#eef4fb_100%)] px-6 pb-20 pt-28 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row">

          {/* Left */}
          <div className="max-w-2xl flex-1">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--ch-blue-border)] bg-white/70 px-4 py-2 text-[11px] font-semibold text-[var(--ch-blue-dark)] shadow-[0_8px_24px_rgba(74,142,219,0.08)] backdrop-blur">
              <Activity className="h-3.5 w-3.5 text-[var(--ch-blue)]" />
              AI-Powered Multi-Agent Claims Orchestration
            </div>

            {/* Heading — 4 lines as specified */}
            <h1 className="text-[2.1rem] font-bold leading-[1.05] tracking-[-0.045em] text-slate-800 md:text-[2.75rem] lg:text-[3.45rem]">
              <span className="block">AI That Understands</span>
              <span className="block">Insurance Claims —</span>
              <span className="block text-[var(--ch-blue)]">Like a Doctor,</span>
              <span className="block text-[var(--ch-blue)]">Auditor, and Investigator</span>
            </h1>

            <p className="mt-8 max-w-[35rem] text-[14px] leading-7 text-[var(--ch-muted)] md:text-[15px]">
              ClaimHeart automates claim processing, detects fraud in real-time, and explains every decision with full transparency.
            </p>
            <p className="mt-4 text-[13px] font-medium italic text-[var(--ch-subtle)]">
              "Smart enough to decide. Human enough to explain why."
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-2xl bg-[var(--ch-blue-dark)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(47,111,178,0.22)] transition hover:-translate-y-px hover:bg-[var(--ch-blue)]"
              >
                <Play className="h-4 w-4 fill-white" />
                View Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-[var(--ch-blue-border)] bg-white/80 px-6 py-3 text-sm font-semibold text-[var(--ch-blue-dark)] transition hover:bg-white"
              >
                <Workflow className="h-4 w-4" />
                See How It Works
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-3">
              <div className="flex">
                {["AM","PN","RS","KV"].map((av, i) => (
                  <div
                    key={av}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white ${["bg-[var(--ch-blue)]","bg-green-500","bg-amber-500","bg-violet-500"][i]}`}
                    style={{ marginLeft: i > 0 ? -10 : 0 }}
                  >
                    {av}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-[11px] text-[var(--ch-subtle)]">Trusted by 50+ insurers across India</p>
              </div>
            </div>
          </div>

          {/* Right — Dashboard preview */}
          <div className="relative w-full max-w-[42rem] flex-1">
            <div className="absolute inset-x-10 inset-y-8 -z-10 rounded-[2rem] bg-[radial-gradient(circle,rgba(74,142,219,0.18)_0%,transparent_70%)] blur-2xl" />
            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_32px_80px_rgba(15,23,42,0.16)]">
              <div className="flex items-center justify-between bg-[var(--ch-blue-dark)] px-6 py-4">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Heart className="h-4 w-4 fill-white text-white" />
                  ClaimHeart - Claim Detail
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                </div>
              </div>
              <div className="space-y-5 bg-slate-50 p-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-[var(--ch-muted)]">CLM-2026-01246</p>
                      <p className="mt-1 text-xl font-bold tracking-[-0.03em] text-slate-800 md:text-[1.3rem]">
                        Priya Sharma - Dengue Treatment
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-500 md:text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      Fraud Flag
                    </span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="rounded-full bg-[var(--ch-blue-light)] px-3 py-1 text-xs font-semibold text-[var(--ch-blue)] md:text-sm">Rs4,80,000</span>
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-500 md:text-sm">Apollo Hospital</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-red-200 bg-white p-4 text-center shadow-sm">
                    <p className="text-[1.9rem] font-bold text-red-500">0.94</p>
                    <p className="mt-1 text-sm text-[var(--ch-muted)]">Fraud Score</p>
                    <p className="mt-1 text-sm font-medium text-red-500">High</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--ch-blue-border)] bg-white p-4 text-center shadow-sm">
                    <p className="text-[1.9rem] font-bold text-[var(--ch-blue)]">Sec 4.2</p>
                    <p className="mt-1 text-sm text-[var(--ch-muted)]">Policy Match</p>
                    <p className="mt-1 text-sm font-medium text-green-500">Cited</p>
                  </div>
                  <div className="rounded-2xl border border-amber-200 bg-white p-4 text-center shadow-sm">
                    <p className="text-[1.9rem] font-bold text-amber-500">Escalated</p>
                    <p className="mt-1 text-sm text-[var(--ch-muted)]">Decision</p>
                    <p className="mt-1 text-sm font-medium text-amber-500">SIU</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-700">AI Pipeline</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {mockPipeline.map((item, index) => (
                      <div key={item} className="flex items-center gap-2">
                        <div className={`rounded-2xl border px-4 py-2 text-center ${index < 3 ? "border-[var(--ch-blue-border)] bg-[var(--ch-blue-light)]" : "border-slate-200 bg-slate-50"}`}>
                          <span className={`block text-xs font-medium ${index < 3 ? "text-[var(--ch-blue-dark)]" : "text-slate-400"}`}>{item}</span>
                          <span className={`mx-auto mt-2 block h-2.5 w-2.5 rounded-full ${index < 3 ? "bg-green-500" : "bg-slate-300"}`} />
                        </div>
                        {index < mockPipeline.length - 1 && <ChevronRight className="h-4 w-4 text-slate-300" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY ────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-white px-6 py-5 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4">
          <span className="text-[11px] font-700 uppercase tracking-widest text-[var(--ch-subtle)]">Trusted by</span>
          {trustedBy.map((name) => (
            <div
              key={name}
              className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-2 text-[13px] font-600 text-slate-500"
            >
              {name}
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-white px-6 py-12 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-100 p-6 text-center">
              <p className={`text-[2.2rem] font-bold tracking-[-0.03em] md:text-[2.25rem] ${item.tone}`}>{item.value}</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{item.label}</p>
              <p className="mt-1 text-xs text-[var(--ch-subtle)]">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLEM ───────────────────────────────────────────────────────── */}
      <section id="features" className="bg-[var(--ch-surface)] px-6 py-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-[2rem] font-bold tracking-[-0.03em] text-slate-900 md:text-[2.2rem]">
              The Healthcare Claims System is Broken
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--ch-muted)] md:text-lg">
              A broken system costs patients, hospitals, and insurers billions annually and nobody has visibility into why.
            </p>
          </div>
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
            {problems.map((card) => (
              <article
                key={card.label}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-1"
              >
                <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ${card.bg}`}>
                  <card.icon className={`h-5 w-5 ${card.tone}`} />
                </div>
                <p className={`text-3xl font-bold tracking-[-0.04em] ${card.tone}`}>{card.stat}</p>
                <h3 className="mt-4 text-xl font-bold tracking-[-0.03em] text-slate-900">{card.label}</h3>
                <p className="mt-4 text-base leading-8 text-[var(--ch-muted)]">{card.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGENTS ────────────────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-[2rem] font-bold tracking-[-0.03em] text-slate-900 md:text-[2.2rem]">Meet ClaimHeart</h2>
            <p className="mt-5 text-base leading-8 text-[var(--ch-muted)] md:text-lg">
              Four specialized AI agents working in parallel, each an expert, together unstoppable.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {agents.map((agent) => (
              <article key={agent.name} className={`rounded-[1.75rem] border p-7 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 ${agent.card}`}>
                <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${agent.iconWrap}`}>
                  <agent.icon className={`h-6 w-6 ${agent.tone}`} />
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${agent.iconWrap} ${agent.tone}`}>
                  {agent.tag}
                </span>
                <h3 className="mt-4 text-lg font-bold tracking-[-0.03em] text-slate-900">{agent.name}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--ch-muted)] md:text-base">{agent.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-[var(--ch-blue-light)] px-6 py-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-[2rem] font-bold tracking-[-0.03em] text-slate-900 md:text-[2.2rem]">How It Works</h2>
            <p className="mt-5 text-base leading-8 text-[var(--ch-muted)] md:text-lg">From PDF upload to decision in under 18 seconds.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-5">
            {steps.map((step, index) => (
              <div key={step.step} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--ch-blue)] text-white shadow-[0_0_0_6px_rgba(199,219,244,0.8)]">
                  <step.icon className="h-6 w-6" />
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+2.5rem)] top-7 hidden h-px w-[calc(100%-1rem)] bg-[var(--ch-blue-border)] md:block" />
                )}
                <p className="mt-6 text-xs font-bold tracking-[0.18em] text-[var(--ch-blue-dark)]">STEP {step.step}</p>
                <h3 className="mt-3 text-lg font-bold tracking-[-0.03em] text-slate-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--ch-muted)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFFERENTIATORS ───────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-[2rem] font-bold tracking-[-0.03em] text-slate-900 md:text-[2.2rem]">Why ClaimHeart Wins</h2>
            <p className="mt-5 text-base leading-8 text-[var(--ch-muted)] md:text-lg">
              Built differently — from architecture to audit trail.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {differentiators.map((item) => (
              <article key={item.title} className="rounded-[1.75rem] border border-[var(--ch-blue-border)] bg-[var(--ch-blue-light)] p-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--ch-blue)] text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold tracking-[-0.03em] text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--ch-muted)] md:text-base">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── REAL-WORLD IMPACT ─────────────────────────────────────────────── */}
      <section className="bg-[var(--ch-surface)] px-6 py-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-[2rem] font-bold tracking-[-0.03em] text-slate-900 md:text-[2.2rem]">Real-World Impact</h2>
            <p className="mt-5 text-base leading-8 text-[var(--ch-muted)] md:text-lg">
              Numbers that matter — from production deployments.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {impacts.map((item) => (
              <article key={item.label} className={`rounded-[1.75rem] border p-8 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)] ${item.card}`}>
                <item.icon className={`mx-auto h-9 w-9 ${item.tone}`} />
                <p className={`mt-4 text-3xl font-bold tracking-[-0.04em] ${item.tone}`}>{item.value}</p>
                <h3 className="mt-4 text-lg font-bold tracking-[-0.03em] text-slate-900">{item.label}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--ch-muted)] md:text-base">{item.sub}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-[2rem] font-bold tracking-[-0.03em] text-slate-900 md:text-[2.2rem]">
              What Insurers Are Saying
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--ch-muted)] md:text-lg">
              From TPA desks to C-suite — real voices, real results.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <article
                key={t.name}
                className="rounded-[1.75rem] border border-slate-200 bg-[var(--ch-surface)] p-7 shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
              >
                <div className="mb-4 flex gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm italic leading-7 text-[var(--ch-muted)]">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white ${t.avatarBg}`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{t.name}</p>
                    <p className="text-xs text-[var(--ch-subtle)]">{t.role} · {t.company}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <section id="pricing" className="bg-[var(--ch-surface)] px-6 py-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-[2rem] font-bold tracking-[-0.03em] text-slate-900 md:text-[2.2rem]">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--ch-muted)] md:text-lg">
              No hidden fees. No per-agent charges. Pay for claims processed.
            </p>
          </div>
          <div className="grid items-stretch gap-6 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <article
                key={plan.name}
                className={`relative rounded-[1.75rem] border p-8 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 ${
                  plan.highlight
                    ? "bg-[linear-gradient(135deg,#2f6fb2_0%,#4a8edb_100%)] border-transparent"
                    : `bg-white ${plan.borderClass}`
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-[11px] font-bold text-white shadow">
                    {plan.badge}
                  </span>
                )}
                <p className={`text-sm font-semibold ${plan.highlight ? "text-white/70" : "text-[var(--ch-subtle)]"}`}>
                  {plan.name}
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className={`text-4xl font-bold tracking-[-0.04em] ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlight ? "text-white/60" : "text-[var(--ch-subtle)]"}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`mt-3 text-sm leading-6 ${plan.highlight ? "text-white/70" : "text-[var(--ch-muted)]"}`}>
                  {plan.desc}
                </p>
                <div className={`my-6 h-px ${plan.highlight ? "bg-white/15" : "bg-slate-100"}`} />
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 ${plan.highlight ? "text-blue-200" : "text-green-500"}`} />
                      <span className={`text-sm ${plan.highlight ? "text-white/85" : "text-slate-600"}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-8 w-full rounded-2xl py-3 text-sm font-semibold transition hover:opacity-90 ${plan.ctaClass}`}
                >
                  {plan.cta}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-14 text-center">
            <h2 className="text-[2rem] font-bold tracking-[-0.03em] text-slate-900 md:text-[2.2rem]">
              Frequently Asked Questions
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--ch-muted)] md:text-lg">
              Everything you need to know before getting started.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-slate-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`flex w-full items-center justify-between px-6 py-5 text-left transition ${openFaq === i ? "bg-[var(--ch-blue-light)]" : "bg-white hover:bg-slate-50"}`}
                >
                  <span className="text-[15px] font-semibold text-slate-800">{faq.q}</span>
                  <span
                    className={`ml-4 shrink-0 text-2xl font-light text-[var(--ch-blue)] transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="bg-[var(--ch-blue-light)] px-6 pb-5">
                    <p className="text-sm leading-7 text-[var(--ch-muted)]">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <section className="bg-[linear-gradient(135deg,#2f6fb2_0%,#4a8edb_100%)] px-6 py-24 text-center md:px-12">
        <div className="mx-auto max-w-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-white">
            <Heart className="h-8 w-8 fill-white text-white" />
          </div>
          <h2 className="text-[2rem] font-bold tracking-[-0.03em] text-white md:text-[2.2rem]">
            Ready to Transform Healthcare Claims?
          </h2>
          <p className="mt-6 text-base leading-7 text-white/80 md:text-lg">
            Join leading health insurers using ClaimHeart to process faster, detect fraud earlier, and explain every decision transparently.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-[var(--ch-blue-dark)] transition hover:-translate-y-px hover:shadow-xl"
            >
              <Play className="h-4 w-4 fill-current" />
              View Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 px-6 pt-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">

          {/* Top grid */}
          <div className="grid gap-12 border-b border-slate-800 pb-12 md:grid-cols-2 lg:grid-cols-6">

            {/* Brand column — spans 2 */}
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--ch-blue)]">
                  <Heart className="h-5 w-5 fill-white text-white" />
                </div>
                <span className="text-lg font-bold text-white">ClaimHeart</span>
              </div>
              <p className="mb-6 max-w-[260px] text-sm leading-7 text-slate-400">
                AI-powered claims orchestration helping Indian health insurers process faster, detect fraud in real-time, and maintain full audit transparency.
              </p>
              {/* Socials */}
              <div className="mb-6 flex gap-3">
                {[Twitter, Linkedin, Github, Globe].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition hover:bg-slate-700 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
              {/* Contact */}
              <div className="space-y-2">
                {[
                  { Icon: Mail,      text: "hello@claimheart.in" },
                  { Icon: PhoneCall, text: "+91 80 4567 8900" },
                  { Icon: MapPin,    text: "Bengaluru, Karnataka" },
                ].map(({ Icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--ch-blue)]" />
                    <span className="text-xs text-slate-500">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-white">{heading}</p>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-sm text-slate-500 transition hover:text-slate-300"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 fill-[var(--ch-blue)] text-[var(--ch-blue)]" />
              <span className="text-sm font-bold text-white">ClaimHeart</span>
              <span className="text-xs text-slate-600">— Smart enough to decide. Human enough to explain why.</span>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              {["Privacy Policy", "Terms of Service", "Security"].map((link) => (
                <Link key={link} href="#" className="text-xs text-slate-600 transition hover:text-slate-400">
                  {link}
                </Link>
              ))}
              <span className="text-xs text-slate-600">© 2026 ClaimHeart. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}