import { Routes, Route, Link } from 'react-router-dom'
import { Activity, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder-slate-500'

export default function LoginPage() {
  return (
    <div className="relative min-h-screen pb-24 pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-grid dark:bg-grid-dark [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)]" />
        <div className="absolute -top-24 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-400/20 to-accent-400/20 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-4xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-lg shadow-brand-500/30">
            <Activity className="h-6 w-6" strokeWidth={2.5} />
          </span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Welcome to AI <span className="text-gradient">MedCheck</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            The analyzer is free and requires no account — just open it and upload a report.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-400">
            {[
              'No signup needed to analyze reports',
              'Private, in-browser processing',
              'Educational insights, not diagnoses',
            ].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 shrink-0 text-accent-500" />
                {t}
              </li>
            ))}
          </ul>
          <Link
            to="/analyze"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5"
          >
            Open the analyzer
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="glass-strong rounded-3xl p-8 shadow-2xl shadow-brand-500/10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Early access — account features are coming soon.
          </p>
          <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input type="email" placeholder="you@example.com" className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <input type="password" placeholder="••••••••" className={inputCls} />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5"
            >
              Sign in
            </button>
            <p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-accent-500" />
              Demo build — authentication is not yet active
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
