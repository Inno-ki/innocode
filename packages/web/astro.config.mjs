// @ts-check
import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"
import solidJs from "@astrojs/solid-js"
import vercel from "@astrojs/vercel"
import theme from "toolbeam-docs-theme"
import config from "./config.mjs"
import { rehypeHeadingIds } from "@astrojs/markdown-remark"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import { spawnSync } from "child_process"

// https://astro.build/config
export default defineConfig({
  site: config.url,
  output: "server",
  adapter: vercel({
    imageService: true,
  }),
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
  devToolbar: {
    enabled: false,
  },
  server: {
    host: "0.0.0.0",
  },
  markdown: {
    rehypePlugins: [rehypeHeadingIds, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
  },
  build: {},
  integrations: [
    configSchema(),
    solidJs(),
    starlight({
      title: "InnoCode",
      favicon: "/favicon-v3.svg",
      head: [
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: "/favicon-v3.ico",
            sizes: "32x32",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "icon",
            type: "image/png",
            href: "/favicon-96x96-v3.png",
            sizes: "96x96",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "apple-touch-icon",
            href: "/apple-touch-icon-v3.png",
            sizes: "180x180",
          },
        },
      ],
      lastUpdated: true,
      expressiveCode: { themes: ["github-light", "github-dark"] },
      social: [],
      markdown: {
        headingLinks: false,
      },
      customCss: ["./src/styles/custom.css"],
      logo: {
        light: "./src/assets/logo-light.svg",
        dark: "./src/assets/logo-dark.svg",
        replacesTitle: true,
      },
      sidebar: [
        "intro",
        "config",
        "providers",
        "network",
        "enterprise",
        "troubleshooting",
        {
          label: "Usage",
          items: ["tui", "cli", "web", "ide", "zen", "github", "gitlab"],
        },

        {
          label: "Configure",
          items: [
            "tools",
            "rules",
            "agents",
            "models",
            "themes",
            "keybinds",
            "commands",
            "formatters",
            "permissions",
            "lsp",
            "mcp-servers",
            "acp",
            "skills",
            "custom-tools",
          ],
        },

        {
          label: "Develop",
          items: ["sdk", "server", "plugins", "ecosystem"],
        },
      ],
      components: {
        Hero: "./src/components/Hero.astro",
        Head: "./src/components/Head.astro",
        Header: "./src/components/Header.astro",
        SiteTitle: "./src/components/SiteTitle.astro",
      },
      plugins: [
        theme({
          headerLinks: config.headerLinks,
        }),
      ],
    }),
  ],
})

function configSchema() {
  return {
    name: "configSchema",
    hooks: {
      "astro:build:done": async () => {
        console.log("generating config schema")
        spawnSync("../opencode/script/schema.ts", ["./dist/config.json"])
      },
    },
  }
}
