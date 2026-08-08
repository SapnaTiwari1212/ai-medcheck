import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from 'lucide-react'
import { apiPost } from '../lib/api.js'

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder-slate-500'

const errorInputCls = 'border-red-400 focus:border-red-400 focus:ring-red-500/10 dark:border-red-500/60'

function validate(fullName, email, password, confirm) {
  const errors = {}
  if (fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters long'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Please provide a valid email address'
  }
  if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters long'
  } else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    errors.password = 'Password must contain at least one uppercase letter, one lowercase letter and one number'
  }
  if (confirm !== password) {
    errors.confirm = 'Passwords do not match'
  }
  return errors
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(false)

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
    setServerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validation = validate(form.fullName, form.email, form.password, form.confirm)
    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    setLoading(true)
    setServerError('')
    try {
      await apiPost('/api/auth/register', {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        preferredLanguage: 'en',
      })
      setCreated(true)
    } catch (err) {
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen pb-24 pt-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid dark:bg-grid-dark [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)]" />
        <div className="absolute -top-24 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-400/20 to-accent-400/20 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-4xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-lg shadow-brand-500/30">
            <Activity className="h-6 w-6" strokeWidth={2.5} />
          </span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Create your <span className="text-gradient">MedCheck</span> account
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Register once, then sign in to manage your reports and analysis history.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-400">
            {[
              'Free account with secure sign in',
              'Keep your uploaded reports organized',
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
          {created ? (
            <div className="flex flex-col items-center py-6 text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                <CheckCircle2 className="h-8 w-8" />
              </span>
              <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                Account created
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Your account is ready. Sign in to get started.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5"
              >
                Sign in now
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Register</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Create an account to sign in later.
              </p>

              {serverError && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Full name
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={form.fullName}
                    onChange={set('fullName')}
                    className={`${inputCls} ${errors.fullName ? errorInputCls : ''}`}
                  />
                  {errors.fullName && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={set('email')}
                    className={`${inputCls} ${errors.email ? errorInputCls : ''}`}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={set('password')}
                    className={`${inputCls} ${errors.password ? errorInputCls : ''}`}
                  />
                  {errors.password ? (
                    <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
                  ) : (
                    <p className="mt-1.5 text-xs text-slate-400">
                      At least 8 characters with an uppercase, lowercase and number
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={set('confirm')}
                    className={`${inputCls} ${errors.confirm ? errorInputCls : ''}`}
                  />
                  {errors.confirm && <p className="mt-1.5 text-xs text-red-500">{errors.confirm}</p>}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Create account
                    </>
                  )}
                </button>
                <p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent-500" />
                  Your data is stored securely
                </p>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
