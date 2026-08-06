import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, PlayCircle, UploadCloud, Stethoscope } from 'lucide-react'
import HeroIllustration from './HeroIllustration.jsx'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  const viewDemo = () =>
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="home" className="relative overflow-hidden pb-20 pt-32 sm:pt-36 lg:pb-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid dark:bg-grid-dark [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)]" />
        <div className="absolute -top-32 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-400/25 via-sky-400/20 to-accent-400/25 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-xl"
        >
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-400/40 bg-accent-500/10 px-4 py-1.5 text-sm font-semibold text-accent-600 dark:text-accent-300">
              <Stethoscope className="h-4 w-4" />
              AI-powered medical report understanding
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white"
          >
            Understand Your <span className="text-gradient">Medical Reports</span> with AI
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400"
          >
            Upload blood tests, MRI, CT scans, pathology reports, X-rays, ECGs, and other medical
            PDFs. AI extracts your report, explains every result in simple language, highlights
            abnormal values, and provides educational health insights in seconds.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/analyze"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-brand-500/30 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-brand-500/40"
            >
              <UploadCloud className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
              Upload Report
            </Link>
            <button
              onClick={viewDemo}
              className="inline-flex items-center gap-2.5 rounded-full border border-slate-300 bg-white/70 px-7 py-3.5 text-base font-semibold text-slate-700 backdrop-blur transition-all hover:border-brand-400 hover:text-brand-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:text-brand-300"
            >
              <PlayCircle className="h-5 w-5 text-accent-500" />
              View Demo
            </button>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-slate-500 dark:text-slate-400"
          >
            {[
              ['No signup required', 'Try the analyzer instantly'],
              ['100% private', 'Processed in your browser'],
              ['Supports 6 languages', 'OCR across scripts'],
            ].map(([a, b]) => (
              <div key={a}>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{a}</p>
                <p className="text-xs">{b}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={item} className="mt-8">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
            >
              Open the analyzer <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <HeroIllustration />
        </motion.div>
      </div>
    </section>
  )
}
