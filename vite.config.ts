import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        homeAr: resolve(__dirname, "index.html"),
        homeEn: resolve(__dirname, "en/index.html"),
        aboutAr: resolve(__dirname, "about/index.html"),
        aboutEn: resolve(__dirname, "en/about/index.html"),
        newsAr: resolve(__dirname, "news/index.html"),
        newsEn: resolve(__dirname, "en/news/index.html"),
        blogAr: resolve(__dirname, "blog/index.html"),
        blogEn: resolve(__dirname, "en/blog/index.html"),
        opportunitiesAr: resolve(__dirname, "opportunities/index.html"),
        opportunitiesEn: resolve(__dirname, "en/opportunities/index.html"),
        notFound: resolve(__dirname, "404.html")
      }
    }
  }
});
