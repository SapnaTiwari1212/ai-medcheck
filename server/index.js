import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'
import mongoose from 'mongoose'
import { authRouter } from './auth.js'
import { initStore } from './store.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT) || 4000
const DIST_DIR = path.join(__dirname, '..', 'dist')

const app = express()

app.use(cors())
app.use(express.json({ limit: '1mb' }))

const dbStates = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }

app.get('/api/health', (_req, res) => {
  res.json({
    data: {
      status: 'ok',
      uptime: Math.round(process.uptime()),
      db: dbStates[mongoose.connection.readyState] ?? 'unknown',
      timestamp: new Date().toISOString(),
    },
  })
})

app.use('/api/auth', authRouter)

if (existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR))
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/')) return next()
    return res.sendFile(path.join(DIST_DIR, 'index.html'))
  })
}

app.use('/api', (_req, res) => {
  res.status(404).json({ message: 'API endpoint not found.' })
})

app.use((err, _req, res, _next) => {
  if (err?.type === 'entity.parse.failed' || err?.type === 'entity.too.large') {
    return res.status(400).json({ message: 'Invalid or too large request body.' })
  }
  console.error(err)
  return res.status(500).json({ message: 'Something went wrong on the server.' })
})

async function start() {
  await initStore()
  app.listen(PORT, () => {
    console.log(`AI MedCheck API running at http://localhost:${PORT} (MongoDB connected)`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
