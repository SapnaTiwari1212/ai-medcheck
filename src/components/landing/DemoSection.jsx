import { Link } from 'react-router-dom'
import { ArrowRight, TrendingDown, TrendingUp, CheckCircle2 } from 'lucide-react'
import { analyzeReport } from '../../lib/analysis.js'
import { SAMPLE_REPORT_TEXT } from '../../data/sampleReport.js'
import { getCategoryColor } from '../../data/knowledge.js'
import SectionHeading from '../ui/SectionHeading.jsx'
import Reveal from '../ui/Reveal.jsx'

const result = analyzeReport(SAMPLE_REPORT_TEXT)
const previewItems = result.items.slice(0, 6)

function StatusPill({ status }) {
  if (status === 'normal')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-3 w-3" /> Normal
      </span>
    )
  if (status === 'high')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
        <TrendingUp className="h-3 w-3" /> High
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2.5 py-1 text-[11px] font-bold text-sky-600 dark:text-sky-400">
      <TrendingDown className="h-3 w-3" /> Low
    </span>
  )
}

export default function DemoSection() {
  return (
    <section id="demo" className="relative overflow-hidden py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-brand-400/10 to-accent-400/10 blur-3xl"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Live demo"
          title="See what your report could look like"
          subtitle="This is a real analysis run through the same engine that powers the analyzer, using a bundled sample blood test."
        />

        <div className="mx-auto mt-14 max-w-4xl">
          <Reveal>
            <div className="glass-strong overflow-hidden rounded-3xl shadow-2xl shadow-brand-500/10">
              <div className="flex items-center justify-between border-b border-slate-200/70 px-6 py-4 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span className="hidden rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 sm:block dark:text-emerald-400">
                  {result.summary.abnormal} abnormal of {result.summary.total} tests
                </span>
                <span className="text-xs font-medium text-slate-400">Sample: Health Check Panel</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left">
                  <thead>
                    <tr className="border-b border-slate-200/70 text-xs uppercase tracking-wider text-slate-400 dark:border-white/10">
                      <th className="px-6 py-3 font-semibold">Test</th>
                      <th className="px-6 py-3 font-semibold">Result</th>
                      <th className="px-6 py-3 font-semibold">Reference</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewItems.map((item) => {
                      const cat = getCategoryColor(item.category)
                      return (
                        <tr
                          key={item.key}
                          className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70 dark:border-white/5 dark:hover:bg-white/[0.03]"
                        >
                          <td className="px-6 py-3.5">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              {item.name}
                            </p>
                            <span
                              className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${cat.badge}`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${cat.dot}`} />
                              {item.category}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-sm font-bold text-slate-900 dark:text-white">
                            {item.displayValue}
                            {item.unit && (
                              <span className="ml-1 text-xs font-medium text-slate-400">
                                {item.unit}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-3.5 text-sm text-slate-500 dark:text-slate-400">
                            {item.rangeLabel}
                          </td>
                          <td className="px-6 py-3.5">
                            <StatusPill status={item.status} />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200/70 bg-slate-50/60 px-6 py-4 sm:flex-row dark:border-white/10 dark:bg-white/[0.02]">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Plus explanations, symptoms, prevention tips &amp; doctor guidance.
                </p>
                <Link
                  to="/analyze"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5"
                >
                  Try it with your report
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
