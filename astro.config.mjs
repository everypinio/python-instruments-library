import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import path from "path";
import react from "@astrojs/react";
import robotsTxt from "astro-robots-txt";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import svgr from "vite-plugin-svgr";


export default defineConfig({
  site: "https://everypinio.github.io/",
  base: "/python-instruments-library/",
  outDir: 'public',
  publicDir: 'static',
  integrations: [
    starlight({
      title: "Docs",
      components: {
        Sidebar: "./src/components/override/Sidebar.astro",
      },
      customCss: [
        // Path to your Tailwind base styles:
        "./src/styles/tailwind.css",
        // Some reactflow styles
        "./src/styles/reactflow.css",
        // Our own custom CSS
        "./src/styles/custom.css",
        // Joey: Please do not add any more custom css files
      ],
      lastUpdated: true,
      head: [
        {
          // Tag to support Latex display
          tag: "link",
          attrs: {
            rel: "stylesheet",
            href: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css",
            integrity:
              "sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV",
            crossorigin: "anonymous",
          },
        },
        {
          tag: "script",
          attrs: {
            src: "https://cdn.usefathom.com/script.js",
            "data-site": "LCCRNAEW",
            defer: true,
          },
        },
      ],
      sidebar: [
        // Joey: IMPORTANT, always use autogenerate unless
        // there is a very good reason not to use it
        {
          label: "💻 Instruments Database",
          collapsed: true,
          autogenerate: {
            directory: "instruments-database",
            collapsed: true,
          },
        },
      ],
      defaultLocale: "root",
      locales: {
        root: {
          lang: "en",
          label: "English",
        },
      },
    }),
    tailwind({
      // Disable the default base styles, otherwise CSS will break
      applyBaseStyles: false,
    }),
    react(),
    robotsTxt(),
  ],
  markdown: {
    shikiConfig: {
      theme: "dracula",
      langs: ["python", "json", "c"],
      wrap: true, // Enable word wrap to prevent horizontal scrolling
    },

    // 2 plugins for math support
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  vite: {
    resolve: {
      // Very import alias to make @blocks work for rollup
      alias: {
        "@root": path.resolve("../"),
        "@": path.resolve("../src/"),
      },
    },
    plugins: [svgr()],
  },
});