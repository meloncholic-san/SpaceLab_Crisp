import { defineConfig, type Plugin } from 'vite'
import handlebars from 'vite-plugin-handlebars'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getHtmlEntries(dir: string): Record<string, string> {
  const entries: Record<string, string> = {}

  fs.readdirSync(dir).forEach((file: string) => {
    if (file.endsWith('.html')) {
      const name = file.replace('.html', '')
      entries[name] = path.resolve(dir, file)
    }
  })

  return entries
}

const watchHandlebarsPlugin = (): Plugin => ({
  name: 'watch-handlebars',
  handleHotUpdate({ file, server }) {
    if (file.endsWith('.hbs')) {
      server.ws.send({ type: 'full-reload' })
    }
  }
})

export default defineConfig({
  base: './',
  root: './src',
  publicDir: '../public',

  resolve: {
    alias: {
      '@scss': path.resolve(__dirname, 'src/scss'),
      '@html': path.resolve(__dirname, 'src/html'),
      '@fonts': path.resolve(__dirname, 'src/fonts'),
    }
  },

  plugins: [
    handlebars({
      partialDirectory: path.resolve(__dirname, 'src/html')
    }),
    watchHandlebarsPlugin(),
    viteStaticCopy({
      targets: [
        {
          src: './img/**/*',
          dest: '',
        }
      ],
      structured: true,
    })
  ],

  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: getHtmlEntries(path.resolve(__dirname, 'src'))
    }
  },

  server: {
    open: true
  }
})