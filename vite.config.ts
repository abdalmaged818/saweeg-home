import { resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        homeAr: resolve(projectRoot, "index.html"),
        homeEn: resolve(projectRoot, "en/index.html"),
        aboutAr: resolve(projectRoot, "about/index.html"),
        aboutEn: resolve(projectRoot, "en/about/index.html"),
        newsAr: resolve(projectRoot, "news/index.html"),
        newsEn: resolve(projectRoot, "en/news/index.html"),
        umrahForumAr: resolve(projectRoot, "news/umrah-forum-2026/index.html"),
        umrahForumEn: resolve(projectRoot, "en/news/umrah-forum-2026/index.html"),
        culturesFestivalAr: resolve(projectRoot, "news/cultures-festival-2026/index.html"),
        culturesFestivalEn: resolve(projectRoot, "en/news/cultures-festival-2026/index.html"),
        bustanEmirVisitAr: resolve(projectRoot, "news/bustan-emir-visit/index.html"),
        bustanEmirVisitEn: resolve(projectRoot, "en/news/bustan-emir-visit/index.html"),
        princessSaraMeetingAr: resolve(projectRoot, "news/princess-sara-meeting/index.html"),
        princessSaraMeetingEn: resolve(projectRoot, "en/news/princess-sara-meeting/index.html"),
        blogAr: resolve(projectRoot, "blog/index.html"),
        blogEn: resolve(projectRoot, "en/blog/index.html"),
        opportunitiesAr: resolve(projectRoot, "opportunities/index.html"),
        opportunitiesEn: resolve(projectRoot, "en/opportunities/index.html"),
        notFound: resolve(projectRoot, "404.html")
      }
    }
  }
});
