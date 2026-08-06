import { motion } from 'framer-motion'
import { UploadCloud, ScanSearch, BrainCircuit, Sparkles } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'
import GlassCard from '../ui/GlassCard.jsx'

const steps = [
  {
    icon: UploadCloud,
    step: '01',
    title: 'Upload your report',
    text: 'Drag and drop a PDF or image of any medical report — blood tests, imaging, pathology, ECGs and more.',
    gradient: 'from-sky-500 to-blue-600',
  },
  {
    icon: ScanSearch,
    step: '02',
    title: 'AI & OCR extract the data',
    text: 'Text is read directly from digital PDFs, and scanned pages are converted with OCR. Nothing leaves your device.',
    gradient: 'from-cyan-400 to-sky-500',
  },
  {
    icon: BrainCircuit,
    step: '03',
    title: 'Results analyzed',
    text: 'Every test is matched against a knowledge base, with values compared to reference ranges and abnormals flagged.',
    gradient: 'from-brand-500 to-indigo-600',
  },
  {
    icon: Sparkles,
    step: '04',
    title: 'Educational insights',
    text: 'Receive simple explanations, possible symptoms, prevention and lifestyle tips, and consultation guidance.',
    gradient: 'from-teal-400 to-emerald-500',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-slate-50/60 py-24 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="From upload to understanding in seconds"
          subtitle="A simple four-step flow designed for everyone — no medical or technical knowledge required."
        />

        <div className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-brand-300/60 to-transparent lg:block dark:via-brand-500/40"
          />
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
            >
              <GlassCard className="relative h-full p-6">
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} text-white shadow-lg`}
                  >
                    <s.icon className="h-7 w-7" />
                  </span>
                  <span className="text-4xl font-extrabold text-slate-200 dark:text-slate-700">
                    {s.step}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {s.text}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
