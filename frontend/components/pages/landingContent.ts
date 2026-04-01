import {
  Activity,
  AlertTriangle,
  BarChart2,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  MessageSquare,
  Search,
  Shield,
  TrendingUp,
  Workflow,
} from "lucide-react";

export const stats = [
  { value: 18, prefix: "", suffix: "s", label: "Avg. Processing Time", sub: "vs 60-90 days manual", tone: "text-[var(--ch-blue)]" },
  { value: 90, prefix: "", suffix: "%", label: "Fraud Detection Rate", sub: "Isolation Forest + LLM", tone: "text-[var(--ch-green)]" },
  { value: 10, prefix: "", suffix: "x", label: "Faster Than Manual", sub: "End-to-end automation", tone: "text-[var(--ch-amber)]" },
  { value: 48, prefix: "Rs", suffix: "Cr", label: "Fraud Prevented", sub: "This financial year", tone: "text-[var(--ch-red)]" },
];

export const problems = [
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

export const agents = [
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

export const steps = [
  { step: "01", title: "Upload", desc: "Hospital submits pre-auth form or medical PDF via secure portal", icon: FileText },
  { step: "02", title: "AI Processing", desc: "Extractor Agent converts PDF to structured JSON in under 2 seconds", icon: Workflow },
  { step: "03", title: "Policy Check", desc: "RAG Agent matches claim against policy clauses with citations", icon: Search },
  { step: "04", title: "Fraud Detection", desc: "Fraud Agent runs statistical and semantic anomaly detection", icon: Shield },
  { step: "05", title: "Decision", desc: "Mediator combines all signals into a clear recommendation", icon: CheckCircle2 },
];

export const differentiators = [
  { icon: Eye, title: "Glass-box AI", desc: "Every decision is explainable. Full audit trail. No black boxes." },
  { icon: AlertTriangle, title: "Real-time Fraud", desc: "Sub-second fraud scoring on every claim instead of delayed batch checks." },
  { icon: FileText, title: "Policy Citations", desc: "Exact page and clause references for every coverage recommendation." },
  { icon: CheckCircle2, title: "Human-in-loop", desc: "AI recommends, humans decide. Escalation workflows are built in." },
];

export const impacts = [
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

export const trustedBy = ["Star Health", "HDFC ERGO", "Bajaj Allianz", "ICICI Lombard", "Niva Bupa"];

export const testimonials = [
  {
    name: "Dr. Anil Mehta",
    role: "Chief Medical Officer",
    company: "Star Health Insurance",
    text: "ClaimHeart reduced our processing time from 45 days to under a minute. The fraud detection alone saved us over Rs12 crore in the first quarter.",
    avatar: "AM",
    avatarBg: "bg-[var(--ch-blue)]",
  },
  {
    name: "Preethi Nair",
    role: "VP Operations",
    company: "HDFC ERGO",
    text: "The policy citation feature is a game-changer. Our auditors now have exact clause references for every decision - no more black-box approvals.",
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

export const pricingPlans = [
  {
    name: "Starter",
    price: "Rs2,999",
    period: "/month",
    desc: "Perfect for small TPAs processing up to 500 claims/month.",
    features: ["Up to 500 claims/month", "Extractor + Policy agents", "Email support", "Basic audit trail", "Standard SLA"],
    cta: "Start Free Trial",
    highlight: false,
    ctaClass: "bg-slate-800 text-white hover:bg-slate-700",
    borderClass: "border-slate-200",
  },
  {
    name: "Professional",
    price: "Rs9,999",
    period: "/month",
    desc: "For growing insurers with full fraud detection capabilities.",
    features: ["Up to 5,000 claims/month", "All 4 AI agents", "Priority support", "Full audit trail + export", "Fraud dashboard", "Custom policy upload"],
    cta: "Get Started",
    highlight: true,
    ctaClass: "bg-white text-[var(--ch-blue-dark)] hover:bg-white/90",
    borderClass: "border-transparent",
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large insurers and hospital networks at scale.",
    features: ["Unlimited claims", "Dedicated AI infrastructure", "24/7 SLA + CSM", "Custom workflow design", "Custom integrations", "Compliance-ready reporting"],
    cta: "Contact Sales",
    highlight: false,
    ctaClass: "bg-violet-600 text-white hover:bg-violet-700",
    borderClass: "border-violet-200",
  },
];

export const faqs = [
  {
    q: "How accurate is the fraud detection?",
    a: "Our hybrid Isolation Forest + LLM approach achieves 90%+ accuracy, validated across 2.4 lakh claims in the 2025-26 financial year.",
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
    a: "No - and by design. ClaimHeart recommends; humans decide. Complex or sensitive claims always escalate to a human reviewer.",
  },
  {
    q: "What document formats are supported?",
    a: "We support PDF (scanned and native), JPEG, PNG, TIFF, and common DICOM exports. Our GPT-4o Vision pipeline handles handwritten forms and low-resolution scans.",
  },
];

export const footerLinks = {
  Product: ["Features", "How It Works", "Pricing", "Changelog", "Roadmap"],
  Company: ["About Us", "Careers", "Press", "Blog", "Partners"],
  Resources: ["Guides", "Case Studies", "Webinars", "Compliance", "Support Center"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"],
};

