import path from 'node:path';
import { defineConfig } from 'vitest/config';

// Mirrors tsconfig.json's "@/*" -> "./*" path mapping so lib/ modules can use the same
// import style under vitest as they do under Next.js.
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
