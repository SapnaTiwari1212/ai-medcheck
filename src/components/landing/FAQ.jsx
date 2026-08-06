import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ChevronDown, AlertTriangle } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'
import Reveal from '../ui/Reveal.jsx'

const faqs = [
  {
    q: 'Is AI MedCheck a diagnostic tool?',
    a: 'No. AI MedCheck provides educational information only. It explains what your results may mean, highlights values outside reference ranges, and offers general health education. It is not a diagnostic tool and cannot replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.',
  },
  {
    q: 'Are my medical reports private and secure?',
    a: 'Yes. Analysis happens entirely in your browser — your files and extracted text never leave your device. Nothing is uploaded to a server, and nothing is stored by us.',
  },
  {
    q: 'Which file types can I upload?',
    a: 'PDF, JPG, PNG, and JPEG. For digital PDFs we read the embedded text directly; for scanned PDFs and images we use in-browser OCR to recognize the text.',
  },
  {
    q: 'How accurate is the OCR and analysis?',
    a: 'OCR accuracy depends on the quality of your scan. Clean, well-lit images and digital PDFs produce the best results. Reference ranges vary by lab, age, and sex, so treat comparisons as educational and confirm with your doctor.',
  },
  {
    q: 'Which tests does the knowledge base cover?',
    a: 'Common panels including CBC (hemoglobin, RBC, WBC, platelets), lipid profile, glucose and HbA1c, liver and kidney function, electrolytes, thyroid (TSH), vitamins (D, B12, ferritin, folate), and inflammation markers. Unknown tests are still shown with their extracted values.',
  },
  {
    q: 'Does AI MedCheck support languages other than English?',
    a: 'The interface and insights are in English today, with OCR built on multilingual recognition for future support. Reports containing numbers and test names in Latin script are handled well.',
  },
  {
    q: 'What should I do about an abnormal result?',
    a: 'Do not panic. A single out-of-range value is rarely a diagnosis. Review the educational insights provided, and discuss the result with your doctor, who can interpret it in the context of your full history.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="relative bg-slate-50/60 py-24 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          subtitle="Everything you need to know about how AI MedCheck works and how to use it safely."
        />

        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <Reveal key={f.q} delay={i * 0.05}>
                <div
                  className={`glass overflow-hidden rounded-2xl transition-all duration-300 ${
                    isOpen ? 'shadow-xl shadow-brand-500/10' : 'hover:shadow-lg'
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-semibold text-slate-800 dark:text-slate-100">
                      {f.q}
                    </span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 transition-all duration-300 dark:border-white/10 ${
                        isOpen
                          ? 'rotate-180 border-brand-400 bg-brand-500/10 text-brand-600 dark:text-brand-300'
                          : 'text-slate-400'
                      }`}
                    >
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-8">
          <div className="flex items-start gap-3 rounded-2xl border border-amber-300/40 bg-amber-50/70 p-5 text-sm text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-200/80">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <p>
              <strong>Remember:</strong> AI MedCheck is an educational assistant, not a doctor. If
              you experience severe symptoms or have concerns about urgent health matters, contact a
              healthcare professional or emergency services immediately.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
