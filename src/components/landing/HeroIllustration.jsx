import { motion } from 'framer-motion'
import {
  FileText,
  ScanSearch,
  Brain,
  LayoutDashboard,
  TrendingUp,
  FileCheck2,
  Lock,
  Zap,
  Languages,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

const pipelineSteps = [
  {
    icon: FileText,
    label: 'Upload report',
    sub: 'PDF · JPG · PNG',
    gradient: 'from-sky-500 to-blue-600',
    className: 'top-3 left-3',
  },
  {
    icon: ScanSearch,
    label: 'OCR scanning',
    sub: 'Text extraction',
    gradient: 'from-cyan-400 to-sky-500',
    className: 'top-20 left-6',
    delay: 0.35,
  },
  {
    icon: Brain,
    label: 'AI analysis',
    sub: 'Understanding results',
    gradient: 'from-brand-500 to-indigo-600',
    className: 'top-32 left-4',
    delay: 0.7,
  },
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    sub: 'Report breakdown',
    gradient: 'from-teal-400 to-emerald-500',
    className: 'top-[10.5rem] left-14',
    delay: 1.05,
  },
]

const badges = [
  { icon: Sparkles, label: 'AI Powered', pos: 'top-2 -right-3 sm:-right-8', delay: 0 },
  { icon: ScanSearch, label: 'OCR Enabled', pos: 'top-1/3 -left-4 sm:-left-10', delay: 1 },
  { icon: Lock, label: 'Secure', pos: '-bottom-4 -right-2 sm:-right-6', delay: 0.6 },
  { icon: Zap, label: 'Instant Analysis', pos: '-bottom-6 left-8 sm:left-16', delay: 1.4 },
  { icon: Languages, label: 'Multi-language', pos: 'top-16 -right-8 sm:-right-14', delay: 0.3 },
  { icon: ShieldCheck, label: 'Trusted By', pos: 'bottom-16 -left-6 sm:-left-14', delay: 1.8 },
]

export default function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: -1 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="glass-strong relative z-10 rounded-3xl p-5 shadow-2xl shadow-brand-500/20"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-[10px] font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
            Blood Test Report
          </span>
        </div>

        <div className="relative mt-4 overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-4 dark:border-white/10 dark:bg-slate-900/80">
          <div className="absolute inset-x-0 h-10 -translate-y-full bg-gradient-to-b from-transparent to-brand-400/40 animate-scan" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
                  <FileCheck2 className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                    Hemoglobin
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Reference 13.0 – 17.0 g/dL
                  </p>
                </div>
              </div>
              <span className="rounded-lg bg-emerald-500/10 px-2 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                14.2
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                  <TrendingUp className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                    Fasting Glucose
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Reference 70 – 99 mg/dL
                  </p>
                </div>
              </div>
              <span className="rounded-lg bg-amber-500/10 px-2 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                128 ↑
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
                  <TrendingUp className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                    LDL Cholesterol
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Reference &lt; 100 mg/dL
                  </p>
                </div>
              </div>
              <span className="rounded-lg bg-rose-500/10 px-2 py-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                158 ↑
              </span>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              AI insight
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              Fasting glucose above range — consider lifestyle review and follow-up with your
              doctor.
            </p>
          </div>

          <div className="mt-4 flex items-end justify-between gap-2 px-1">
            {[42, 68, 35, 82, 58, 90, 47].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 4 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.7, delay: 0.6 + i * 0.1, ease: 'easeOut' }}
                className="w-full rounded-t-md bg-gradient-to-t from-brand-500 to-accent-400"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[10px] font-medium text-slate-500 dark:text-slate-400">
          <span>4 / 4 steps complete</span>
          <span className="inline-flex items-center gap-1 text-accent-600 dark:text-accent-400">
            <Sparkles className="h-3 w-3" /> Ready
          </span>
        </div>
      </motion.div>

      {pipelineSteps.map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: -12, scale: 0.85 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 + i * 0.22 }}
          className={`absolute z-20 ${step.className}`}
        >
          <div className="glass-strong flex items-center gap-2.5 rounded-2xl px-3 py-2 shadow-lg shadow-slate-900/10 animate-float">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br text-white ${step.gradient}`}
            >
              <step.icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-bold text-slate-800 dark:text-white">{step.label}</p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400">{step.sub}</p>
            </div>
          </div>
        </motion.div>
      ))}

      {badges.map((b) => (
        <motion.div
          key={b.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 + b.delay * 0.2 }}
          className={`absolute z-20 ${b.pos}`}
        >
          <div className="glass-strong flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-lg shadow-slate-900/10 dark:text-slate-200 animate-float-slow">
            <b.icon className="h-3.5 w-3.5 text-accent-500" />
            {b.label}
          </div>
        </motion.div>
      ))}

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-brand-400/30 to-accent-400/30 blur-3xl"
      />
    </div>
  )
}
