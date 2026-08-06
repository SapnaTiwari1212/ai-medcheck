export default function GlassCard({ children, className = '', hover = true }) {
  return (
    <div
      className={`glass rounded-2xl shadow-xl shadow-slate-900/[0.05] dark:shadow-black/20 ${
        hover
          ? 'transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-500/10 dark:hover:shadow-brand-500/10'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
