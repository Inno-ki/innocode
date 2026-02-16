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

const names: Partial<Record<Platform, string>> = {
  "darwin-aarch64-dmg": "InnoCode Desktop.dmg",
  "darwin-x64-dmg": "InnoCode Desktop.dmg",
  "windows-x64-nsis": "InnoCode Desktop Installer.exe",
}

export async function GET(ctx: APIContext) {
  const platform = ctx.params.platform
  if (!platform) return new Response("Not Found", { status: 404 })

  const asset = assets[platform as Platform]
  if (!asset) return new Response("Not Found", { status: 404 })

  const resp = await fetch(`https://github.com/Inno-ki/innocode/releases/latest/download/${asset}`, {
    cf: {
      cacheTtl: 60 * 5,
      cacheEverything: true,
    },
  } as RequestInit)

  const name = names[platform as Platform]
  const headers = new Headers(resp.headers)
  if (name) headers.set("content-disposition", `attachment; filename="${name}"`)

  return new Response(resp.body, { ...resp, headers })
}
