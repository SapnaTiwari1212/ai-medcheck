import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, FileUp, FileCheck2, ScanSearch, FlaskConical } from 'lucide-react'
import { extractText, getFileKind } from '../lib/ocr.js'
import { analyzeReport } from '../lib/analysis.js'
import { SAMPLE_REPORT_TEXT } from '../data/sampleReport.js'
import { formatBytes } from '../lib/utils.js'
import ProcessingView from './ProcessingView.jsx'
import ResultsView from './ResultsView.jsx'

const ACCEPTED = '.pdf,.jpg,.jpeg,.png'
const MAX_SIZE = 15 * 1024 * 1024

const stageMeta = [
  { icon: FileCheck2, label: 'Validating file' },
  { icon: ScanSearch, label: 'Extracting report data' },
  { icon: FlaskConical, label: 'Running OCR & AI analysis' },
]

export default function AnalyzerPage() {
  const [stage, setStage] = useState('upload')
  const [result, setResult] = useState(null)
  const [meta, setMeta] = useState(null)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  const reset = useCallback(() => {
    setStage('upload')
    setResult(null)
    setMeta(null)
    setProgress('')
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }, [])

  const runSample = useCallback(async () => {
    setError(null)
    setStage('processing')
    setMeta({ fileName: 'Sample — Health Check Panel.pdf', size: null, kind: 'sample' })
    setProgress('Loading bundled sample report…')
    await new Promise((r) => setTimeout(r, 1100))
    setProgress('Running AI analysis…')
    await new Promise((r) => setTimeout(r, 700))
    setResult(analyzeReport(SAMPLE_REPORT_TEXT))
    setStage('results')
  }, [])

  const processFile = useCallback(async (file) => {
    if (!file) return
    setError(null)
    const kind = getFileKind(file)
    if (kind === 'unknown') {
      setError('Unsupported file type. Please upload a PDF, JPG, PNG, or JPEG.')
      return
    }
    if (file.size > MAX_SIZE) {
      setError('File is too large. Please upload a report under 15 MB.')
      return
    }
    setStage('processing')
    setMeta({ fileName: file.name, size: formatBytes(file.size), kind })
    try {
      const { text } = await extractText(file, (msg) => setProgress(msg))
      setResult(analyzeReport(text))
      setStage('results')
    } catch (e) {
      setError(e?.message || 'Something went wrong while reading the file. Please try again.')
      setStage('upload')
    }
  }, [])

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragOver(false)
      processFile(e.dataTransfer?.files?.[0])
    },
    [processFile],
  )

  return (
    <div className="relative min-h-screen pb-24 pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-grid dark:bg-grid-dark [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)]" />
        <div className="absolute -top-24 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-400/20 to-accent-400/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
            AI Report <span className="text-gradient">Analyzer</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Upload a medical report and get simple explanations, abnormal value highlights, and
            educational health insights — all processed privately in your browser.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {stage === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`relative overflow-hidden rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-300 sm:p-14 ${
                  dragOver
                    ? 'border-brand-500 bg-brand-500/5 scale-[1.01]'
                    : 'border-slate-300 bg-white/70 dark:border-white/15 dark:bg-white/[0.03]'
                }`}
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-xl shadow-brand-500/30">
                  <UploadCloud className="h-10 w-10" />
                </div>
                <h2 className="mt-6 text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
                  Drag &amp; drop your medical report
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Blood tests, MRI, CT scans, pathology reports, X-rays, ECGs — PDF, JPG, PNG or
                  JPEG up to 15 MB
                </p>
                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPTED}
                  className="hidden"
                  onChange={(e) => processFile(e.target.files?.[0])}
                />
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => inputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <FileUp className="h-4 w-4" />
                    Choose a file
                  </button>
                  <button
                    onClick={runSample}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-7 py-3.5 text-sm font-semibold text-slate-700 backdrop-blur transition-all hover:border-brand-400 hover:text-brand-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:text-brand-300"
                  >
                    <FlaskConical className="h-4 w-4 text-accent-500" />
                    Try a sample report
                  </button>
                </div>
                {error && (
                  <p className="mx-auto mt-6 max-w-md rounded-xl border border-rose-300/50 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
                    {error}
                  </p>
                )}
                <p className="mx-auto mt-8 max-w-md text-xs leading-relaxed text-slate-400 dark:text-slate-500">
                  Your files stay on your device. Analysis happens locally with in-browser OCR — no
                  uploads to any server.
                </p>
              </div>
            </motion.div>
          )}

          {stage === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              <ProcessingView meta={meta} progress={progress} stages={stageMeta} />
            </motion.div>
          )}

          {stage === 'results' && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
            >
              <ResultsView result={result} meta={meta} onReset={reset} onSample={runSample} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
