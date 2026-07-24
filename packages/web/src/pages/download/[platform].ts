import type { APIContext } from "astro"

const assets = {
  "darwin-aarch64-dmg": "innocode-desktop-darwin-aarch64.dmg",
  "darwin-x64-dmg": "innocode-desktop-darwin-x64.dmg",
  "windows-x64-nsis": "innocode-desktop-windows-x64.exe",
  "linux-x64-deb": "innocode-desktop-linux-amd64.deb",
  "linux-x64-appimage": "innocode-desktop-linux-amd64.AppImage",
  "linux-x64-rpm": "innocode-desktop-linux-x86_64.rpm",
} as const

type Platform = keyof typeof assets

export async function GET(ctx: APIContext) {
  const platform = ctx.params.platform
  if (!platform) return new Response("Not Found", { status: 404 })

  const asset = assets[platform as Platform]
  if (!asset) return new Response("Not Found", { status: 404 })

  // Redirect to the GitHub release asset instead of proxying the bytes.
  // Streaming ~150MB binaries through a Vercel function truncates the
  // download (function response limits + platform re-compression), which
  // shipped corrupt DMGs.
  return ctx.redirect(`https://github.com/Inno-ki/innocode/releases/latest/download/${asset}`, 307)
}
