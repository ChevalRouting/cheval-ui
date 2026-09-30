import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const packageJson = JSON.parse(
  readFileSync(fileURLToPath(new URL('../package.json', import.meta.url)), 'utf8'),
) as { version: string }

export default defineConfig(({ command }) => ({
  plugins: [react()],
  define: {
    __CHEVAL_UI_VERSION__: JSON.stringify(packageJson.version),
  },
  resolve: {
    alias: command === 'serve'
      ? [
          { find: '@', replacement: fileURLToPath(new URL('../src', import.meta.url)) },
          { find: /^@chevalrouting\/cheval-ui$/, replacement: fileURLToPath(new URL('../src/index.ts', import.meta.url)) },
          { find: '@chevalrouting/cheval-ui/charts', replacement: fileURLToPath(new URL('../src/charts.ts', import.meta.url)) },
          { find: '@chevalrouting/cheval-ui/terminal', replacement: fileURLToPath(new URL('../src/terminal.ts', import.meta.url)) },
          { find: '@chevalrouting/cheval-ui/styles.css', replacement: fileURLToPath(new URL('../src/styles/tokens.css', import.meta.url)) },
        ]
      : [],
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
}))
