import { defineConfig } from 'vite';

const repoName = 'exe_logic-motion-showcase';

export default defineConfig({
  base: `/${repoName}/`,
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
});
