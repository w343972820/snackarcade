/**
 * Vitest configuration.
 *
 * The unit tests deliberately cover only pure logic — word counting, SEO rules,
 * schema generation. Anything that needs `astro:content` belongs in an
 * integration test against the built output, not here, because mocking Astro's
 * content layer produces tests that pass while the real thing is broken.
 */
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
});
