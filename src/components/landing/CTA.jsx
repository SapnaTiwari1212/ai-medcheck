import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import Reveal from '../ui/Reveal.jsx'

export default function CTA() {
  return (
    <section className="pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 px-6 py-16 text-center shadow-2xl shadow-brand-500/30 sm:px-16">
            <div
              aria-hidden
              className="absolute inset-0 bg-grid opacity-20 dark:bg-grid-dark"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)',
              }}
            />
            <div
              aria-hidden
              className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-accent-300/30 blur-3xl"
            />

            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Understand your medical report — in plain language
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-brand-50/90 sm:text-lg">
                Turn confusing lab values into clear, educational insights. Free to try, no signup
                needed.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/analyze"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-brand-700 shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl"
                >
                  Upload your report
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-white/90">
                  <ShieldCheck className="h-5 w-5" />
                  100% private — runs in your browser
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
