import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
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
            'vendor-lucide': ['lucide-react'],
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
        '/yookassa-api': {
          target: 'https://api.yookassa.ru/v3',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/yookassa-api/, ''),
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, _req, _res) => {
              const shopId = env.VITE_YOOKASSA_SHOP_ID;
              const secretKey = env.VITE_YOOKASSA_SECRET_KEY;
              
              if (shopId && secretKey) {
                const auth = Buffer.from(`${shopId}:${secretKey}`).toString('base64');
                proxyReq.setHeader('Authorization', `Basic ${auth}`);
                console.log(`✅ [YooKassa Proxy] Отправка запроса (ShopId: ${shopId})`);
              } else {
                console.error('❌ [YooKassa Proxy] Ключи не найдены в .env! Проверь VITE_YOOKASSA_SHOP_ID и VITE_YOOKASSA_SECRET_KEY');
              }
            });
            
            proxy.on('error', (err, _req, _res) => {
              console.error('[Proxy Error] YooKassa:', err);
            });
          },
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
