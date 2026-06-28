import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/sql.js')) return 'sql';
          if (id.includes('javascript-projects/') && (
            id.includes('calculator.js') ||
            id.includes('toast.js') ||
            id.includes('two-way-data-bind.js') ||
            id.includes('stopwatch.js') ||
            id.includes('timer.js') ||
            id.includes('guess-word.js') ||
            id.includes('rock-paper-scissors.js') ||
            id.includes('mini-prisma-demo.js')
          )) return 'demos';
          if (id.includes('utilities/helpers.js')) return 'utils';
        },
      },
    },
    cssMinify: 'lightningcss',
  },
});
