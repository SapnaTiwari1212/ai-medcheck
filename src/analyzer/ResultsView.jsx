import { motion } from 'framer-motion'
import {
  Download,
  RotateCcw,
  FlaskConical,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Layers,
  FileText,
} from 'lucide-react'
import DisclaimerBanner from './cards/DisclaimerBanner.jsx'
import ReportTable from './cards/ReportTable.jsx'
import {
  ExplanationCard,
  HealthInsightsCard,
  SymptomsCard,
  PreventionCard,
  ConsultCard,
} from './cards/InfoCards.jsx'
import { buildSummaryText } from '../lib/utils.js'
import { Link } from 'react-router-dom'

function Stat({ icon: Icon, label, value, tone }) {
  return (
    <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3.5">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-2xl font-extrabold leading-none text-slate-900 dark:text-white">
          {value}
        </p>
        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  )
}

export default function ResultsView({ result, meta, onReset, onSample }) {
  const fileName = meta?.fileName || 'report'
  const ext = fileName.split('.').pop()

  const download = () => {
    const text = buildSummaryText(result, fileName)
    downloadText(text)
  }

  const downloadText = (text) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `medcheck-summary-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!result.matched) {
    return (
      <div className="glass-strong rounded-3xl p-8 text-center sm:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500">
          <FileText className="h-8 w-8" />
        </span>
        <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
          No recognized tests found
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          We could not confidently match any known tests in the extracted text. This can happen with
          poor scan quality, handwriting, or unusual report layouts. Try a clearer upload, or use
          the sample report to see the full experience.
        </p>
        {result.rawText && (
          <p className="mx-auto mt-4 max-w-xl truncate rounded-xl bg-slate-100 px-4 py-3 text-xs text-slate-500 dark:bg-white/5 dark:text-slate-400">
            Extracted text preview: {result.rawText.slice(0, 220)}…
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30"
          >
            <RotateCcw className="h-4 w-4" /> Try another file
          </button>
          <button
            onClick={onSample}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-200"
          >
            <FlaskConical className="h-4 w-4 text-accent-500" /> Load sample report
          </button>
        </div>
      </div>
    )
  }

  const summary = result.summary

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      <div className="glass-strong flex flex-col gap-5 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/30">
            <FileText className="h-7 w-7" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Analysis complete
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {fileName}
              {meta?.size ? ` · ${meta.size}` : ''} · {ext.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-400 hover:text-brand-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:text-brand-300"
          >
            <RotateCcw className="h-4 w-4" /> New upload
          </button>
          <button
            onClick={download}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" /> Download summary
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <Stat icon={Layers} label="Tests identified" value={summary.total} tone="bg-brand-500/10 text-brand-500" />
        <Stat icon={CheckCircle2} label="Within range" value={summary.normal} tone="bg-emerald-500/10 text-emerald-500" />
        <Stat icon={TrendingUp} label="High" value={summary.high} tone="bg-rose-500/10 text-rose-500" />
        <Stat icon={TrendingDown} label="Low" value={summary.low} tone="bg-sky-500/10 text-sky-500" />
        <Stat
          icon={FlaskConical}
          label="Categories"
          value={summary.categories.length}
          tone="bg-violet-500/10 text-violet-500"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <ReportTable items={result.items} otherValues={result.otherValues} />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ExplanationCard items={result.items} />
        <div className="space-y-6">
          <HealthInsightsCard insights={result.insights} />
          <SymptomsCard symptoms={result.symptoms} />
        </div>
        <PreventionCard prevention={result.prevention} />
        <ConsultCard consult={result.consult} />
      </div>

      <div className="flex justify-center">
        <Link
          to="/"
          className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
        >
          ← Back to homepage
        </Link>
      </div>
    </div>
  )
}
