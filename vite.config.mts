import tsConfigPaths from 'vite-tsconfig-paths'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'
export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    coverage: {
      exclude: [...coverageConfigDefaults.exclude, '**/build/**'],
      all: false,
    },
  },
})
