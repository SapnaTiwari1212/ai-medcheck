import { BookOpenText, Lightbulb, Stethoscope, Salad, TrendingDown, TrendingUp } from 'lucide-react'
import { getCategoryColor } from '../../data/knowledge.js'

function Card({ icon, title, accent, children, wide }) {
  return (
    <div
      className={`glass-strong rounded-3xl p-6 shadow-xl shadow-slate-900/5 dark:shadow-black/20 ${
        wide ? 'lg:col-span-2' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-lg ${accent}`}
        >
          <icon className="h-5 w-5" />
        </span>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{icon.title}</h3>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  )
}

const accentMap = {
  explanation: 'bg-gradient-to-br from-brand-500 to-indigo-600 shadow-brand-500/25',
  insight: 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/25',
  symptoms: 'bg-gradient-to-br from-rose-400 to-pink-500 shadow-rose-500/25',
  prevention: 'bg-gradient-to-br from-lime-500 to-green-600 shadow-lime-500/25',
  consult: 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/25',
}

export function ExplanationCard({ items }) {
  const abnormal = items.filter((i) => i.direction)
  if (abnormal.length === 0) return null
  return (
    <Card icon={BookOpenText} title="Simple explanations" accent={accentMap.explanation}>
      <div className="space-y-4">
        {abnormal.map((item) => {
          const cat = getCategoryColor(item.category)
          return (
            <div key={item.key} className="rounded-2xl border border-slate-200/70 p-4 dark:border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${item.status === 'high' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-sky-500/10 text-sky-600 dark:text-sky-400'}`}>
                    {item.status === 'high' ? (
                      <>
                        <TrendingUp className="h-3.5 w-3.5" /> High
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-3.5 w-3.5" /> Low
                      </>
                    )}
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {item.name}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${cat.badge}`}>
                    {item.category}
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {item.displayValue} {item.unit || ''} · {item.rangeLabel}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {item.explanation}
              </p>
              {item.insight && (
                <p className="mt-3 rounded-xl bg-brand-500/[0.06] p-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-brand-700 dark:text-brand-300">What this may mean: </span>
                  {item.insight}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export function HealthInsightsCard({ insights }) {
  if (!insights.length) return null
  return (
    <Card icon={Lightbulb} title="Health insights" accent={accentMap.insight}>
      <ul className="space-y-3">
        {insights.map((ins) => (
          <li
            key={`${ins.id}-${ins.test}`}
            className="flex items-start gap-3 rounded-2xl border border-slate-200/70 p-3.5 dark:border-white/10"
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Lightbulb className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{ins.test}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {ins.insight}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export function SymptomsCard({ symptoms }) {
  if (!symptoms.length) return null
  return (
    <Card icon={Stethoscope} title="Symptoms guide" accent={accentMap.symptoms}>
      <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        Common symptoms that may be associated with your abnormal findings. Their presence (or
        absence) does not confirm or exclude any condition.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {symptoms.map((s) => (
          <span
            key={s}
            className="rounded-full border border-rose-300/40 bg-rose-500/[0.06] px-3.5 py-1.5 text-sm font-medium text-rose-700 dark:border-rose-500/20 dark:text-rose-300"
          >
            {s}
          </span>
        ))}
      </div>
    </Card>
  )
}

export function PreventionCard({ prevention }) {
  if (!prevention.length) return null
  return (
    <Card icon={Salad} title="Prevention & lifestyle" accent={accentMap.prevention}>
      <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        General habits that support better health and may help address the areas flagged in your
        report.
      </p>
      <ul className="mt-4 space-y-2.5">
        {prevention.map((p) => (
          <li key={p} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-lime-500 to-green-500" />
            {p}
          </li>
        ))}
      </ul>
    </Card>
  )
}

export function ConsultCard({ consult }) {
  if (!consult.length) return null
  return (
    <Card icon={Stethoscope} title="Doctor consultation guidance" accent={accentMap.consult}>
      <ul className="space-y-3">
        {consult.map((c) => (
          <li
            key={c.test}
            className="rounded-2xl border border-slate-200/70 p-4 dark:border-white/10"
          >
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{c.test}</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {c.advice}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-4 rounded-xl bg-violet-500/[0.07] p-3.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        <strong className="text-violet-700 dark:text-violet-300">Urgent care:</strong> if you
        experience chest pain, severe shortness of breath, sudden weakness, fainting, severe
        abdominal pain, or unusual bleeding, seek emergency medical care immediately.
      </p>
    </Card>
  )
}
