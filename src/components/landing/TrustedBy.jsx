import { Building2, Hospital, FlaskConical, HeartPulse } from 'lucide-react'
import Reveal from '../ui/Reveal.jsx'

const logos = [
  { icon: Hospital, name: 'CityCare Hospitals' },
  { icon: FlaskConical, name: 'LabPro Diagnostics' },
  { icon: Building2, name: 'MediClinic Group' },
  { icon: HeartPulse, name: 'HealthCore Systems' },
]

export default function TrustedBy() {
  return (
    <section className="border-y border-slate-200/70 bg-slate-50/60 py-12 dark:border-white/10 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Trusted by hospitals, clinics & diagnostic labs
          </p>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {logos.map((l, i) => (
            <Reveal key={l.name} delay={i * 0.08}>
              <div className="group flex flex-col items-center gap-2 opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0">
                <l.icon className="h-8 w-8 text-slate-400 transition-colors group-hover:text-brand-500 dark:text-slate-500" />
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {l.name}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
