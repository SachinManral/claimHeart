"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Github,
  Globe,
  Heart,
  Linkedin,
  Mail,
  MapPin,
  PhoneCall,
  Play,
  Star,
  Twitter,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { agents, differentiators, faqs, footerLinks, impacts, problems, stats, steps, testimonials, trustedBy } from "@/components/pages/landingContent";

const testimonialLoop = [...testimonials, ...testimonials];
const trustedLoop = [...trustedBy, ...trustedBy];

const heroContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const previewItem: Variants = {
  hidden: { opacity: 0, x: 28, scale: 0.98 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.18 },
  },
};

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: delay / 1000, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CountUp({ value, prefix = "", suffix = "", className = "" }: { value: number; prefix?: string; suffix?: string; className?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const duration = 1200;
    const start = performance.now();

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return (
    <span className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="overflow-x-hidden bg-[var(--ch-surface)] text-[var(--ch-text)]">
      <Navbar />

      <section className="relative isolate overflow-hidden border-b border-[var(--ch-blue-border)] px-4 pb-20 pt-28 sm:px-6 md:px-12 lg:px-20 lg:pt-32">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/assets/bg.jpg"
            alt="ClaimHeart healthcare claims background"
            fill
            priority
            className="object-cover object-[74%_center] lg:object-[82%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#EEF4FB]/82 via-white/64 to-transparent" />
          <div className="absolute left-[10%] top-16 h-40 w-40 rounded-full bg-[var(--ch-blue)]/8 blur-xl" />
          <div className="absolute bottom-10 right-[8%] h-52 w-52 rounded-full bg-sky-200/18 blur-xl" />
        </div>

        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:justify-between">
          <motion.div
            className="max-w-2xl flex-1"
            variants={heroContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={heroItem} className="inline-flex items-center gap-2 rounded-full border border-[var(--ch-blue-border)] bg-white/80 px-4 py-2 text-[11px] font-semibold text-[var(--ch-blue-dark)] shadow-[0_12px_30px_rgba(74,142,219,0.08)] backdrop-blur">
              <Activity className="h-3.5 w-3.5 text-[var(--ch-blue)]" />
              AI-Powered Multi-Agent Claims Orchestration
            </motion.div>

            <motion.h1 variants={heroItem} className="mt-6 max-w-[14ch] text-[2.35rem] font-bold leading-[1.04] tracking-[-0.055em] text-slate-900 sm:max-w-[15ch] sm:text-[3rem] lg:max-w-[16ch] lg:text-[4.1rem]">
              <span className="block">AI That Understands</span>
              <span className="block text-[var(--ch-blue-dark)]">Insurance Claims Like</span>
              <span className="mt-2 block text-slate-800">a Doctor, Auditor, and Investigator</span>
            </motion.h1>

            <motion.p variants={heroItem} className="mt-7 max-w-[38rem] text-sm leading-7 text-[var(--ch-muted)] sm:text-base sm:leading-8 lg:text-lg">
              ClaimHeart automates claim processing, detects fraud in real-time, and explains every decision with full transparency.
            </motion.p>
            <motion.p variants={heroItem} className="mt-4 text-sm font-medium italic text-[var(--ch-subtle)]">
              "Smart enough to decide. Human enough to explain why."
            </motion.p>

            <motion.div variants={heroItem} className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <motion.div whileHover={{ y: -1, scale: 1.01 }} whileTap={{ scale: 0.985 }}>
                <Link href="/dashboard" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--ch-blue-dark)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(47,111,178,0.22)] transition-all hover:bg-[var(--ch-blue)] hover:shadow-[0_22px_44px_rgba(47,111,178,0.28)]">
                  <Play className="h-4 w-4 fill-white" />
                  View Demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -1, scale: 1.01 }} whileTap={{ scale: 0.985 }}>
                <Link href="#how-it-works" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--ch-blue-border)] bg-white/80 px-6 py-3 text-sm font-semibold text-[var(--ch-blue-dark)] shadow-[0_10px_24px_rgba(148,163,184,0.12)] backdrop-blur transition-all hover:bg-white">
                  See How It Works
                </Link>
              </motion.div>
            </motion.div>

            <motion.div variants={heroItem} className="mt-10 flex flex-wrap items-center gap-4 rounded-3xl border border-white/60 bg-white/65 px-5 py-4 shadow-[0_12px_34px_rgba(15,23,42,0.06)] backdrop-blur">
              <div className="flex">
                {["AM", "PN", "RS", "KV"].map((avatar, index) => (
                  <div key={avatar} className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white ${["bg-[var(--ch-blue)]", "bg-green-500", "bg-amber-500", "bg-violet-500"][index]}`} style={{ marginLeft: index > 0 ? -10 : 0 }}>
                    {avatar}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="mt-1 text-xs text-[var(--ch-subtle)]">Trusted by 50+ insurers across India</p>
              </div>
            </motion.div>
          </motion.div>

          <div className="relative flex w-full flex-1 justify-center lg:justify-end">
            <motion.div
              className="relative w-full max-w-lg rounded-[1.75rem] border border-white/60 bg-white/70 p-3.5 shadow-[0_24px_72px_rgba(15,23,42,0.14)] backdrop-blur-md sm:p-4"
              variants={previewItem}
              initial="hidden"
              animate="show"
            >
              <div className="absolute -right-4 -top-4 hidden rounded-2xl border border-emerald-100 bg-white/90 px-4 py-3 shadow-[0_12px_24px_rgba(15,23,42,0.08)] backdrop-blur md:block">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">Live adjudication</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">Decision confidence: 94%</p>
              </div>
              <div className="overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-white">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3.5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ch-subtle)]">Claim preview</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">Transparent review snapshot</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </div>
                </div>

                <div className="space-y-4 p-4 sm:p-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ch-subtle)]">Claim ID</p>
                      <p className="mt-2 text-lg font-bold text-slate-900">CLM-2026-01246</p>
                    </div>
                    <div className="rounded-2xl border border-red-100 bg-red-50 p-3.5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-400">Fraud Score</p>
                      <p className="mt-2 text-lg font-bold text-red-500">0.94</p>
                    </div>
                  </div>

                  <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                    <div className="flex flex-col gap-3.5 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ch-subtle)]">Patient</p>
                        <p className="mt-2 text-xl font-bold tracking-[-0.03em] text-slate-900">Priya Sharma</p>
                        <p className="mt-2 text-sm text-[var(--ch-muted)]">Apollo Hospital Delhi</p>
                      </div>
                      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
                        <AlertTriangle className="h-4 w-4" />
                        Under review
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-[var(--ch-blue-light)] p-3.5">
                        <p className="text-xs font-semibold text-[var(--ch-blue-dark)]">Hospital</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">Apollo</p>
                      </div>
                      <div className="rounded-2xl bg-green-50 p-3.5">
                        <p className="text-xs font-semibold text-green-600">Policy</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">Clause cited</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3.5">
                        <p className="text-xs font-semibold text-slate-500">Decision</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">Escalated to SIU</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-3.5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900">Pipeline status</p>
                      <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-600">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-dot" />
                        Live
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {["Extractor", "Policy", "Fraud", "Mediator"].map((item, index) => (
                        <div key={item} className="flex items-center gap-2">
                          <div className={`rounded-2xl border px-4 py-2 text-center ${index < 3 ? "border-[var(--ch-blue-border)] bg-white" : "border-slate-200 bg-white/70"}`}>
                            <span className={`block text-xs font-medium ${index < 3 ? "text-[var(--ch-blue-dark)]" : "text-slate-400"}`}>{item}</span>
                            <span className={`mx-auto mt-2 block h-2.5 w-2.5 rounded-full ${index < 3 ? "bg-emerald-500" : "bg-slate-300"}`} />
                          </div>
                          {index < 3 ? <ChevronRight className="h-4 w-4 text-slate-300" /> : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white/90 px-4 py-5 backdrop-blur sm:px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-full border border-slate-200/80 bg-slate-50/80 px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur">
          <div className="flex items-center gap-4 whitespace-nowrap text-sm text-slate-600">
            <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ch-subtle)]">Trusted by</span>
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="flex min-w-max items-center gap-3"
            >
              {trustedLoop.map((name, index) => (
                <div key={`${name}-${index}`} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-600 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
                  {name}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      <section className="relative border-b border-slate-200 bg-white px-4 py-14 sm:px-6 md:px-12 lg:px-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--ch-blue-border)] to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item, index) => (
            <Reveal key={item.label} delay={index * 80}>
              <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(15,23,42,0.08)]">
                <p className={`text-[2.4rem] font-bold tracking-[-0.05em] ${item.tone}`}>
                  <CountUp value={item.value} prefix={item.prefix} suffix={item.suffix} />
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="mt-2 text-sm text-[var(--ch-subtle)]">{item.sub}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="features" className="relative bg-[var(--ch-surface)] px-4 py-24 sm:px-6 md:px-12 lg:px-20">
        <div className="absolute left-0 top-20 h-48 w-48 rounded-full bg-red-100/40 blur-3xl" />
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-[2rem] font-bold tracking-[-0.03em] text-slate-900 md:text-[2.2rem]">The Healthcare Claims System is Broken</h2>
            <p className="mt-5 text-base leading-8 text-[var(--ch-muted)] md:text-lg">A broken system costs patients, hospitals, and insurers billions annually and nobody has visibility into why.</p>
          </Reveal>
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
            {problems.map((card, index) => (
              <Reveal key={card.label} delay={index * 90}>
                <article className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(15,23,42,0.08)]">
                  <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ${card.bg}`}>
                    <card.icon className={`h-5 w-5 ${card.tone}`} />
                  </div>
                  <p className={`text-3xl font-bold tracking-[-0.04em] ${card.tone}`}>{card.stat}</p>
                  <h3 className="mt-4 text-xl font-bold tracking-[-0.03em] text-slate-900">{card.label}</h3>
                  <p className="mt-4 text-base leading-8 text-[var(--ch-muted)]">{card.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-24 sm:px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-[2rem] font-bold tracking-[-0.03em] text-slate-900 md:text-[2.2rem]">Meet ClaimHeart</h2>
            <p className="mt-5 text-base leading-8 text-[var(--ch-muted)] md:text-lg">Four specialized AI agents working in parallel, each an expert, together unstoppable.</p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {agents.map((agent, index) => (
              <Reveal key={agent.name} delay={index * 90}>
                <article className={`rounded-[1.75rem] border p-7 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] ${agent.card}`}>
                  <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${agent.iconWrap}`}>
                    <agent.icon className={`h-6 w-6 ${agent.tone}`} />
                  </div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${agent.iconWrap} ${agent.tone}`}>{agent.tag}</span>
                  <h3 className="mt-4 text-lg font-bold tracking-[-0.03em] text-slate-900">{agent.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--ch-muted)] md:text-base">{agent.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-[linear-gradient(180deg,#eef4fb_0%,#f8fafc_100%)] px-4 py-24 sm:px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-[2rem] font-bold tracking-[-0.03em] text-slate-900 md:text-[2.2rem]">How It Works</h2>
            <p className="mt-5 text-base leading-8 text-[var(--ch-muted)] md:text-lg">From PDF upload to decision in under 18 seconds.</p>
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-5">
            {steps.map((step, index) => (
              <Reveal key={step.step} delay={index * 110}>
                <div className="relative rounded-[1.5rem] border border-white/70 bg-white/80 p-6 text-center shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur">
                  {index < steps.length - 1 ? (
                    <div className="landing-line-grow absolute left-[calc(100%-1rem)] top-12 hidden h-[2px] w-[calc(100%-0.5rem)] origin-left bg-gradient-to-r from-[var(--ch-blue)]/70 to-[var(--ch-blue-border)] lg:block" style={{ animationDelay: `${0.25 + index * 0.15}s` }} />
                  ) : null}
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--ch-blue)] text-white shadow-[0_0_0_6px_rgba(199,219,244,0.8)]">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <p className="mt-6 text-xs font-bold tracking-[0.18em] text-[var(--ch-blue-dark)]">STEP {step.step}</p>
                  <h3 className="mt-3 text-lg font-bold tracking-[-0.03em] text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--ch-muted)]">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-24 sm:px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-[2rem] font-bold tracking-[-0.03em] text-slate-900 md:text-[2.2rem]">Why ClaimHeart Wins</h2>
            <p className="mt-5 text-base leading-8 text-[var(--ch-muted)] md:text-lg">Built differently - from architecture to audit trail.</p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {differentiators.map((item, index) => (
              <Reveal key={item.title} delay={index * 80}>
                <article className="rounded-[1.75rem] border border-[var(--ch-blue-border)] bg-[var(--ch-blue-light)] p-7 transition-all hover:-translate-y-1">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--ch-blue)] text-white">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold tracking-[-0.03em] text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--ch-muted)] md:text-base">{item.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--ch-surface)] px-4 py-24 sm:px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-[2rem] font-bold tracking-[-0.03em] text-slate-900 md:text-[2.2rem]">Real-World Impact</h2>
            <p className="mt-5 text-base leading-8 text-[var(--ch-muted)] md:text-lg">Numbers that matter - from production deployments.</p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {impacts.map((item, index) => (
              <Reveal key={item.label} delay={index * 90}>
                <article className={`rounded-[1.75rem] border p-8 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-1 ${item.card}`}>
                  <item.icon className={`mx-auto h-9 w-9 ${item.tone}`} />
                  <p className={`mt-4 text-3xl font-bold tracking-[-0.04em] ${item.tone}`}>{item.value}</p>
                  <h3 className="mt-4 text-lg font-bold tracking-[-0.03em] text-slate-900">{item.label}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--ch-muted)] md:text-base">{item.sub}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white px-4 py-24 sm:px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-[2rem] font-bold tracking-[-0.03em] text-slate-900 md:text-[2.2rem]">What Insurers Are Saying</h2>
            <p className="mt-5 text-base leading-8 text-[var(--ch-muted)] md:text-lg">From TPA desks to C-suite - real voices, real results.</p>
          </Reveal>

          <div className="overflow-hidden lg:hidden">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
              className="flex min-w-max gap-6"
            >
              {testimonialLoop.map((t, index) => (
                <article key={`${t.name}-${index}`} className="w-[20rem] rounded-[1.75rem] border border-slate-200 bg-[var(--ch-surface)] p-7 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                  <div className="mb-4 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-sm italic leading-7 text-[var(--ch-muted)]">"{t.text}"</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white ${t.avatarBg}`}>{t.avatar}</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{t.name}</p>
                      <p className="text-xs text-[var(--ch-subtle)]">{t.role} - {t.company}</p>
                    </div>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>

          <div className="hidden gap-6 lg:grid lg:grid-cols-3">
            {testimonials.map((t, index) => (
              <Reveal key={t.name} delay={index * 90}>
                <article className="rounded-[1.75rem] border border-slate-200 bg-[var(--ch-surface)] p-7 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-1">
                  <div className="mb-4 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-sm italic leading-7 text-[var(--ch-muted)]">"{t.text}"</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white ${t.avatarBg}`}>{t.avatar}</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{t.name}</p>
                      <p className="text-xs text-[var(--ch-subtle)]">{t.role} - {t.company}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-24 sm:px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <Reveal className="mb-14 text-center">
            <h2 className="text-[2rem] font-bold tracking-[-0.03em] text-slate-900 md:text-[2.2rem]">Frequently Asked Questions</h2>
            <p className="mt-5 text-base leading-8 text-[var(--ch-muted)] md:text-lg">Everything you need to know before getting started.</p>
          </Reveal>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <Reveal key={faq.q} delay={index * 60}>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className={`flex w-full items-center justify-between px-6 py-5 text-left transition-all ${openFaq === index ? "bg-[var(--ch-blue-light)]" : "bg-white hover:bg-slate-50"}`}>
                    <span className="text-[15px] font-semibold text-slate-800">{faq.q}</span>
                    <span className={`ml-4 shrink-0 text-2xl font-light text-[var(--ch-blue)] transition-transform duration-200 ${openFaq === index ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {openFaq === index ? <div className="bg-[var(--ch-blue-light)] px-6 pb-5"><p className="text-sm leading-7 text-[var(--ch-muted)]">{faq.a}</p></div> : null}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#2f6fb2_0%,#4a8edb_100%)] px-4 py-24 text-center sm:px-6 md:px-12">
        <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-[10%] h-40 w-40 rounded-full bg-sky-200/20 blur-3xl" />
        <Reveal className="mx-auto max-w-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-white backdrop-blur">
            <Heart className="h-8 w-8 fill-white text-white" />
          </div>
          <h2 className="text-[2rem] font-bold tracking-[-0.03em] text-white md:text-[2.2rem]">Ready to Transform Healthcare Claims?</h2>
          <p className="mt-6 text-base leading-7 text-white/80 md:text-lg">Join leading health insurers using ClaimHeart to process faster, detect fraud earlier, and explain every decision transparently.</p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
            <Link href="/dashboard" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-[var(--ch-blue-dark)] shadow-[0_16px_36px_rgba(15,23,42,0.18)] transition-all hover:-translate-y-px hover:shadow-[0_20px_44px_rgba(255,255,255,0.2)]">
              <Play className="h-4 w-4 fill-current" />
              View Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/dashboard" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/60 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-white/10 hover:shadow-[0_0_24px_rgba(255,255,255,0.12)]">
              Open Dashboard
            </Link>
          </div>
        </Reveal>
      </section>
      <footer className="bg-slate-900 px-4 pt-16 sm:px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 border-b border-slate-800 pb-12 md:grid-cols-2 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--ch-blue)]">
                  <Heart className="h-5 w-5 fill-white text-white" />
                </div>
                <span className="text-lg font-bold text-white">ClaimHeart</span>
              </div>
              <p className="mb-6 max-w-[260px] text-sm leading-7 text-slate-400">AI-powered claims orchestration helping Indian health insurers process faster, detect fraud in real-time, and maintain full audit transparency.</p>
              <div className="mb-6 flex gap-3">
                {[Twitter, Linkedin, Github, Globe].map((Icon, index) => (
                  <a key={index} href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-all hover:bg-slate-700 hover:text-white">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  { Icon: Mail, text: "hello@claimheart.in" },
                  { Icon: PhoneCall, text: "+91 80 4567 8900" },
                  { Icon: MapPin, text: "Bengaluru, Karnataka" },
                ].map(({ Icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--ch-blue)]" />
                    <span className="text-xs text-slate-500">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-white">{heading}</p>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-sm text-slate-500 transition-all hover:text-slate-300">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 fill-[var(--ch-blue)] text-[var(--ch-blue)]" />
              <span className="text-sm font-bold text-white">ClaimHeart</span>
              <span className="text-xs text-slate-600">- Smart enough to decide. Human enough to explain why.</span>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              {["Privacy Policy", "Terms of Service", "Security"].map((link) => (
                <Link key={link} href="#" className="text-xs text-slate-600 transition-all hover:text-slate-400">{link}</Link>
              ))}
              <span className="text-xs text-slate-600">Copyright 2026 ClaimHeart. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}








