import Reveal from './Reveal'

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  const alignCls =
    align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'

  return (
    <div className={`flex max-w-3xl flex-col gap-4 ${alignCls}`}>
      {eyebrow && (
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300">
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.16}>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">{subtitle}</p>
        </Reveal>
      )}
    </div>
  )
}
