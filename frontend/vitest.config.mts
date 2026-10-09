// vitest.config.mts: runs the pure-TypeScript domain tests under test/ (unit, fuzz, invariant).
// Screens are exercised on web and Expo Go; these tests cover the rules behind them.

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.spec.ts'],
    environment: 'node',
  },
});
