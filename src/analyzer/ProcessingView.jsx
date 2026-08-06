import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BrainCircuit } from 'lucide-react'

export default function ProcessingView({ meta, progress, stages }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setActive((a) => Math.min(a + 1, stages.length - 1)), 900)
    return () => clearTimeout(t)
  }, [active, stages.length])

  return (
    <div className="glass-strong rounded-3xl p-8 sm:p-12">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-2xl shadow-brand-500/40 animate-pulse-ring"
          >
            <BrainCircuit className="h-12 w-12" />
          </motion.div>
        </div>

        <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
          Analyzing your report
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {meta?.fileName} {meta?.size ? `· ${meta.size}` : ''}
        </p>
        <p className="mt-1 text-sm font-medium text-brand-600 dark:text-brand-300">{progress}</p>

        <div className="mt-10 w-full max-w-md space-y-3">
          {stages.map((s, i) => {
            const done = i < active
            const isActive = i === active
            return (
              <div
                key={s.label}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-300 ${
                  isActive
                    ? 'border-brand-400/60 bg-brand-500/5 shadow-lg shadow-brand-500/10'
                    : done
                      ? 'border-emerald-300/50 bg-emerald-500/5'
                      : 'border-slate-200/70 opacity-50 dark:border-white/10'
                }`}
              >
                <motion.span
                  animate={isActive ? { rotate: 360 } : { rotate: 0 }}
                  transition={
                    isActive ? { duration: 1.2, repeat: Infinity, ease: 'linear' } : {}
                  }
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    done
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : isActive
                        ? 'bg-brand-500/10 text-brand-500'
                        : 'bg-slate-100 text-slate-400 dark:bg-white/5'
                  }`}
                >
                  <s.icon className="h-4.5 w-4.5" />
                </motion.span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {s.label}
                  </p>
                  <p className="text-xs text-slate-400">
                    {done ? 'Complete' : isActive ? progress : 'Waiting'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-10 h-2 w-full max-w-md overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
          <motion.div
            animate={{ width: ['8%', '90%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-400"
          />
        </div>
      </div>
    </div>
  )
}
