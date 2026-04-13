import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import type {Plugin} from 'vite';

// Трансформирует barrel-импорты lucide в прямые импорты из отдельных файлов
// Это позволяет tree-shaking работать правильно (860 KB → ~30 KB)
function lucideTreeShakePlugin(): Plugin {
  const toKebab = (name: string) =>
    name
      .replace(/([A-Z])/g, (_, l, offset) => (offset > 0 ? '-' : '') + l.toLowerCase())
      .replace(/(\d+)/g, (_, n) => '-' + n)
      .replace(/--+/g, '-');

  return {
    name: 'lucide-tree-shake',
    transform(code, id) {
      if (id.includes('node_modules')) return null;
      if (!code.includes("from 'lucide-react'") && !code.includes('from "lucide-react"')) return null;

      const newCode = code.replace(
        /import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g,
        (_, imports) => {
          return imports
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean)
            .map((entry: string) => {
              const [orig, alias] = entry.split(/\s+as\s+/).map((s: string) => s.trim());
              const file = toKebab(orig);
              const local = alias || orig;
              return `import { default as ${local} } from 'lucide-react/dist/esm/icons/${file}.js'`;
            })
            .join('\n');
        }
      );

      return {code: newCode, map: null};
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [lucideTreeShakePlugin(), react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-motion': ['motion'],
          },
        },
      },
    },
    server: {
      proxy: {
        '/litepms-api': {
          target: 'https://litepms.ru/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/litepms-api/, ''),
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
