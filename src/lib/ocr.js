import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

let pdfjsPromise = null

async function getPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import('pdfjs-dist').then((mod) => {
      mod.GlobalWorkerOptions.workerSrc = pdfWorkerUrl
      return mod
    })
  }
  return pdfjsPromise
}

let tesseractPromise = null

function getTesseract() {
  if (!tesseractPromise) {
    tesseractPromise = import('tesseract.js')
  }
  return tesseractPromise
}

const MAX_PAGES = 5
const MAX_OCR_CHARS = 60000

export function getFileKind(file) {
  const name = (file?.name || '').toLowerCase()
  if (name.endsWith('.pdf')) return 'pdf'
  if (/\.(jpe?g|png|webp|bmp|tiff?)$/.test(name)) return 'image'
  return 'unknown'
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function pageToDataUrl(pdfjs, page, scale = 2) {
  const viewport = page.getViewport({ scale })
  const canvas = document.createElement('canvas')
  canvas.width = Math.min(viewport.width, 2600)
  canvas.height = Math.min(viewport.height, 3400)
  const ctx = canvas.getContext('2d')
  const renderViewport = page.getViewport({ scale: canvas.width / viewport.width })
  await page.render({ canvasContext: ctx, viewport: renderViewport }).promise
  return canvas.toDataURL('image/jpeg', 0.85)
}

async function extractPdfText(file, onProgress) {
  const pdfjs = await getPdfjs()
  onProgress?.('Reading PDF document…')
  const data = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({
    data,
    standardFontDataUrl: '/standard_fonts/',
  }).promise

  const pageCount = Math.min(pdf.numPages, MAX_PAGES)
  const pageTexts = []

  for (let i = 1; i <= pageCount; i += 1) {
    onProgress?.(`Extracting page ${i} of ${pageCount}…`)
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const lineText = content.items
      .map((it) => (typeof it.str === 'string' ? it.str : ''))
      .join(' ')
    pageTexts.push(lineText.replace(/\s+/g, ' ').trim())
  }

  const joined = pageTexts.filter(Boolean).join('\n')
  const meaningful = (joined.match(/[a-zA-Z]/g) || []).length > 80

  if (meaningful) {
    return { text: joined.slice(0, MAX_OCR_CHARS), source: 'pdf-text', pageCount }
  }

  const tesseract = await getTesseract()
  onProgress?.('No embedded text found — running OCR on scanned pages…')
  const worker = await tesseract.createWorker('eng')
  const chunks = []
  try {
    for (let i = 1; i <= pageCount; i += 1) {
      onProgress?.(`Recognizing scanned page ${i} of ${pageCount}…`)
      const page = await pdf.getPage(i)
      const dataUrl = await pageToDataUrl(pdfjs, page)
      const { data } = await worker.recognize(dataUrl)
      chunks.push(data.text)
    }
  } finally {
    await worker.terminate()
  }
  return { text: chunks.join('\n').slice(0, MAX_OCR_CHARS), source: 'ocr', pageCount }
}

async function extractImageText(file, onProgress) {
  const tesseract = await getTesseract()
  onProgress?.('Preparing image…')
  const dataUrl = await fileToDataUrl(file)
  const worker = await tesseract.createWorker('eng')
  try {
    onProgress?.('Running OCR — recognizing text…')
    const { data } = await worker.recognize(dataUrl)
    return { text: data.text.slice(0, MAX_OCR_CHARS), source: 'ocr', pageCount: 1 }
  } finally {
    await worker.terminate()
  }
}

export async function extractText(file, onProgress) {
  const kind = getFileKind(file)
  if (kind === 'pdf') return extractPdfText(file, onProgress)
  if (kind === 'image') return extractImageText(file, onProgress)
  throw new Error('Unsupported file type. Please upload a PDF, JPG, PNG, or JPEG.')
}
