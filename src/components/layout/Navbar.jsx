import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Menu, X, Moon, Sun, LogIn, ArrowRight } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext.jsx'

const links = [
  { label: 'Home', href: '/#home' },
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Demo', href: '/#demo' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location])

  const goTo = (href) => {
    setOpen(false)
    const id = href.replace('/#', '')
    if (window.location.pathname !== '/' && !window.location.hash.startsWith('#/')) {
      window.location.hash = '#/'
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-strong shadow-lg shadow-slate-900/5'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-lg shadow-brand-500/30">
            <Activity className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            AI&nbsp;<span className="text-gradient">MedCheck</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.label}>
              <button
                onClick={() => goTo(l.href)}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:text-brand-700 dark:text-slate-200 dark:hover:text-brand-300"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-500/40"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="glass-strong overflow-hidden border-t border-slate-200/60 lg:hidden dark:border-white/10"
          >
            <ul className="space-y-1 px-4 py-4">
              {links.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => goTo(l.href)}
                    className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-brand-50 dark:text-slate-200 dark:hover:bg-white/5"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
              <li className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-slate-200"
                >
                  <LogIn className="h-4 w-4" /> Login
                </Link>
                <Link
                  to="/analyze"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30"
                >
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
