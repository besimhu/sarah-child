import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sfchild.netlify.app',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file'
  }
});

