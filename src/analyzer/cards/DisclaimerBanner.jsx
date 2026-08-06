import { AlertTriangle, ShieldAlert } from 'lucide-react'

export default function DisclaimerBanner({ compact = false }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-amber-300/50 bg-amber-50/80 p-5 dark:border-amber-500/25 dark:bg-amber-500/[0.07] ${
        compact ? 'text-xs' : 'text-sm'
      }`}
    >
      {compact ? (
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
      ) : (
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
      )}
      <p className="leading-relaxed text-amber-900 dark:text-amber-200/85">
        <strong>Important disclaimer:</strong> AI MedCheck provides <strong>educational information
        only</strong> and is <strong>not a diagnostic tool</strong>. It cannot replace professional
        medical advice, diagnosis, or treatment. Reference ranges vary by lab, age, and sex. Always
        discuss your results with a qualified healthcare professional.
      </p>
    </div>
  )
}
