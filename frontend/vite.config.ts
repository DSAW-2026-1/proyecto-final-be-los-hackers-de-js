import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Allow Vite to serve files when workspace is a symlink/shortcut
  // or when the resolved real path is different (e.g. mounted drive with spaces).
  server: {
    fs: {
      // Include both the current working directory and its real path
      // to handle drive shortcuts, symlinks, or mounted paths with spaces.
      allow: [path.resolve(__dirname), process.cwd(), fs.realpathSync(process.cwd())],
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
