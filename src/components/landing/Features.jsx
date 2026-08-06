import { motion } from 'framer-motion'
import {
  FileText,
  BrainCircuit,
  ScanSearch,
  BookOpenText,
  Activity,
  Stethoscope,
  Salad,
  UserRoundPlus,
} from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'
import GlassCard from '../ui/GlassCard.jsx'

const features = [
  {
    icon: FileText,
    title: 'Medical Report Upload',
    text: 'Upload your reports in seconds — PDF, JPG, PNG, and JPEG are all supported with drag-and-drop.',
    chips: ['PDF', 'JPG', 'PNG', 'JPEG'],
    gradient: 'from-sky-500 to-blue-600',
    glow: 'group-hover:shadow-brand-500/20',
  },
  {
    icon: BrainCircuit,
    title: 'AI Report Analysis',
    text: 'Our AI automatically identifies test names, results, reference ranges, and abnormal findings.',
    chips: ['Test names', 'Results', 'Ranges', 'Abnormals'],
    gradient: 'from-brand-500 to-indigo-600',
    glow: 'group-hover:shadow-brand-500/20',
  },
  {
    icon: ScanSearch,
    title: 'OCR Scanner',
    text: 'Scanned and handwritten-style reports are converted to text with in-browser OCR technology.',
    chips: ['Scanned PDFs', 'Images'],
    gradient: 'from-cyan-400 to-sky-500',
    glow: 'group-hover:shadow-cyan-500/20',
  },
  {
    icon: BookOpenText,
    title: 'Simple Explanation',
    text: 'Complex medical language is translated into clear, easy-to-understand everyday terms.',
    chips: ['Plain language'],
    gradient: 'from-teal-400 to-emerald-500',
    glow: 'group-hover:shadow-teal-500/20',
  },
  {
    icon: Activity,
    title: 'Health Insights',
    text: 'Get educational information about possible health conditions related to abnormal findings.',
    chips: ['Educational insights'],
    gradient: 'from-amber-400 to-orange-500',
    glow: 'group-hover:shadow-amber-500/20',
  },
  {
    icon: Stethoscope,
    title: 'Symptoms Guide',
    text: 'See common symptoms that may be associated with your report findings.',
    chips: ['Fatigue', 'Dizziness', 'Headaches', 'Weakness', 'Weight changes', 'Hair loss', 'Frequent urination'],
    gradient: 'from-rose-400 to-pink-500',
    glow: 'group-hover:shadow-rose-500/20',
  },
  {
    icon: Salad,
    title: 'Prevention & Lifestyle',
    text: 'Practical habits to support your health: balanced diet, exercise, hydration, sleep, and more.',
    chips: ['Balanced diet', 'Exercise', 'Hydration', 'Better sleep', 'Stress management', 'Avoid smoking', 'Limit alcohol'],
    gradient: 'from-lime-400 to-green-500',
    glow: 'group-hover:shadow-lime-500/20',
  },
  {
    icon: UserRoundPlus,
    title: 'Doctor Consultation Guidance',
    text: 'Clear guidance on when to see a professional or seek urgent care — based on educational guidelines.',
    chips: ['When to consult', 'Urgent care'],
    gradient: 'from-violet-500 to-purple-600',
    glow: 'group-hover:shadow-violet-500/20',
  },
]

export default function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to understand your results"
          subtitle="From upload to insights — a complete toolkit that turns complex medical reports into clear, actionable education."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.1 }}
            >
              <GlassCard className="group flex h-full flex-col p-6">
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.gradient} text-white shadow-lg transition-shadow duration-300 ${f.glow}`}
                >
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {f.text}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {f.chips.map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-white/5 dark:text-slate-300"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
