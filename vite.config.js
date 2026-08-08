import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const FONTS_SOURCE = join('node_modules', 'pdfjs-dist', 'standard_fonts')
const FONTS_BASE = '/standard_fonts/'

function pdfStandardFonts() {
  return {
    name: 'pdf-standard-fonts',
    configureServer(server) {
      server.middlewares.use(FONTS_BASE, (req, res, next) => {
        const name = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '')
        if (!name || name.includes('..')) return next()
        try {
          const data = readFileSync(join(FONTS_SOURCE, name))
          const ext = name.split('.').pop().toLowerCase()
          res.setHeader('Content-Type', ext === 'ttf' ? 'font/ttf' : 'application/octet-stream')
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
          res.end(data)
        } catch {
          next()
        }
      })
    },
    generateBundle() {
      for (const name of readdirSync(FONTS_SOURCE)) {
        this.emitFile({
          type: 'asset',
          fileName: `standard_fonts/${name}`,
          source: readFileSync(join(FONTS_SOURCE, name)),
        })
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), pdfStandardFonts()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
  },
})
