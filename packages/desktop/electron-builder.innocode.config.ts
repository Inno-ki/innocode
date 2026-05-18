// Unsigned electron-builder config for InnoCode CI.
// Wraps the upstream config and strips Apple/Windows signing so builds
// succeed without certificates. Replace with a signed config once
// InnoCode has APPLE_API_KEY / Windows code-signing infrastructure.
import type { Configuration } from "electron-builder"
import base from "./electron-builder.config"

const config: Configuration = {
  ...base,
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
