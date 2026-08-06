import { Link } from 'react-router-dom'
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react'

const columns = [
  {
    title: 'Platform',
    links: [
      { label: 'Home', to: '/#home' },
      { label: 'Features', to: '/#features' },
      { label: 'How It Works', to: '/#how-it-works' },
      { label: 'FAQ', to: '/#faq' },
    ],
  },
  {
    title: 'Product',
    links: [
      { label: 'Analyzer', to: '/analyze' },
      { label: 'Login', to: '/login' },
      { label: 'Contact', to: '/#contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/login' },
      { label: 'Terms of Service', to: '/login' },
      { label: 'Medical Disclaimer', to: '/#faq' },
    ],
  },
]

export default function Footer() {
  const goTo = (to) => {
    if (to.startsWith('/#')) {
      const id = to.replace('/#', '')
      if (window.location.hash.startsWith('#/')) {
        window.location.hash = '#/'
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60)
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer className="relative border-t border-slate-200/70 bg-slate-50/80 dark:border-white/10 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white">
                <Activity className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                AI&nbsp;<span className="text-gradient">MedCheck</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Understand your medical reports in minutes. AI-powered explanations, abnormal value
              detection, and educational health insights — in your language.
            </p>
            <div className="mt-5 flex items-center gap-4 text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                <ShieldCheck className="h-4 w-4 text-accent-500" /> Secure
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                <HeartPulse className="h-4 w-4 text-brand-500" /> Not a diagnostic tool
              </span>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to.startsWith('/#') ? (
                      <button
                        onClick={() => goTo(l.to)}
                        className="text-sm text-slate-600 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300"
                      >
                        {l.label}
                      </button>
                    ) : (
                      <Link
                        to={l.to}
                        className="text-sm text-slate-600 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-amber-300/40 bg-amber-50/70 px-5 py-4 text-center dark:border-amber-500/20 dark:bg-amber-500/5">
          <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200/80">
            <strong>Medical Disclaimer:</strong> AI MedCheck provides educational information only
            and is not a diagnostic tool. Its outputs must not replace professional medical advice,
            diagnosis, or treatment. Always consult a qualified healthcare professional regarding
            your health.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-200/70 pt-6 text-xs text-slate-500 sm:flex-row dark:border-white/10 dark:text-slate-500">
          <p>© {new Date().getFullYear()} AI MedCheck. All rights reserved.</p>
          <p>Made for better health understanding.</p>
        </div>
      </div>
    </footer>
  )
}
