import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://iamuzor.github.io",
  base: "/yaatt",
  trailingSlash: "always",
  markdown: {
    shikiConfig: {
      theme: "github-dark-default",
    },
  },
});
