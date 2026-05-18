// Unsigned electron-builder config for InnoCode CI.
// Wraps the upstream config and strips Apple/Windows signing so builds
// succeed without certificates. Replace with a signed config once
// InnoCode has APPLE_API_KEY / Windows code-signing infrastructure.
import type { Configuration } from "electron-builder"
import base from "./electron-builder.config"

const config: Configuration = {
  ...base,
  // Visible branding only. appId, RPM package name, and `opencode://`
  // deep-link scheme stay on upstream values to avoid breaking parallel
  // installations and hardcoded scheme parsing in the renderer.
  productName: "InnoCode",
  // The upstream config pulls native/{index.js, mac_window.node, swift-build}
  // into the bundle. InnoCode doesn't build those add-ons, so drop them to
  // avoid electron-builder warnings about a missing source directory.
  extraResources: undefined,
  mac: base.mac ? { ...base.mac, identity: null, notarize: false } : undefined,
  dmg: base.dmg ? { ...base.dmg, sign: false } : undefined,
  win: base.win ? { ...base.win, signtoolOptions: undefined } : undefined,
  publish: null,
}

export default config
