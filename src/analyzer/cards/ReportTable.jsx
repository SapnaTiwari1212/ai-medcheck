import { CheckCircle2, TrendingUp, TrendingDown, MinusCircle } from 'lucide-react'
import { getCategoryColor } from '../../data/knowledge.js'

export default function ReportTable({ items, otherValues }) {
  return (
    <div className="glass-strong overflow-hidden rounded-3xl shadow-xl shadow-slate-900/5 dark:shadow-black/20">
      <div className="border-b border-slate-200/70 px-6 py-5 dark:border-white/10">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Analyzed values</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Each value compared against common adult reference ranges.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-slate-200/70 bg-slate-50/70 text-xs uppercase tracking-wider text-slate-400 dark:border-white/10 dark:bg-white/[0.02]">
              <th className="px-6 py-3 font-semibold">Test</th>
              <th className="px-6 py-3 font-semibold">Result</th>
              <th className="px-6 py-3 font-semibold">Reference range</th>
              <th className="px-6 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const cat = getCategoryColor(item.category)
              return (
                <tr
                  key={item.key}
                  className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/60 dark:border-white/5 dark:hover:bg-white/[0.03]"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {item.name}
                    </p>
                    <span
                      className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${cat.badge}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${cat.dot}`} />
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p
                      className={`text-base font-bold ${
                        item.status === 'high'
                          ? 'text-rose-600 dark:text-rose-400'
                          : item.status === 'low'
                            ? 'text-sky-600 dark:text-sky-400'
                            : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {item.displayValue}
                      {item.unit && (
                        <span className="ml-1 text-xs font-medium text-slate-400">{item.unit}</span>
                      )}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.rangeLabel}</p>
                  </td>
                  <td className="px-6 py-4">
                    {item.status === 'normal' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Normal
                      </span>
                    )}
                    {item.status === 'high' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                        <TrendingUp className="h-3.5 w-3.5" /> High
                      </span>
                    )}
                    {item.status === 'low' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-bold text-sky-600 dark:text-sky-400">
                        <TrendingDown className="h-3.5 w-3.5" /> Low
                      </span>
                    )}
                    {item.status === 'unknown' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <MinusCircle className="h-3.5 w-3.5" /> Not assessed
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {otherValues.length > 0 && (
        <div className="border-t border-slate-200/70 px-6 py-4 dark:border-white/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Other values detected (not in knowledge base)
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {otherValues.map((v, i) => (
              <span
                key={i}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 dark:bg-white/5 dark:text-slate-400"
              >
                {v.raw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
