// InnoCode electron-builder config for CI.
// Wraps the upstream config with InnoCode branding. macOS signing and
// notarization activate automatically when the signing env is present
// (CSC_LINK/CSC_KEY_PASSWORD for the Developer ID cert; APPLE_ID,
// APPLE_APP_SPECIFIC_PASSWORD and APPLE_TEAM_ID for notarytool) and are
// stripped otherwise so local/unsigned builds keep working. Windows
// builds stay unsigned until InnoCode has Windows code-signing
// infrastructure.
import type { Configuration } from "electron-builder"
import base from "./electron-builder.config"

const hasMacCert = Boolean(process.env.CSC_LINK)
const hasNotaryCreds = Boolean(process.env.APPLE_ID || process.env.APPLE_API_KEY)

const config: Configuration = {
  ...base,
  // Visible branding only. appId, RPM package name, and `opencode://`
  // deep-link scheme stay on upstream values to avoid breaking parallel
  // installations and hardcoded scheme parsing in the renderer.
  productName: "InnoCode",
  // Keep the `opencode://` scheme (renderer parses it, and changing it breaks
  // existing deep links) but show "InnoCode" as the handler name in OS prompts.
  protocols: { name: "InnoCode", schemes: ["opencode"] },
  // Skip @electron/rebuild — windows-latest runners no longer detect a
  // Visual Studio installation for node-gyp, and the transitive native
  // module (msgpackr-extract) already ships prebuilds for the Electron
  // ABI. Re-enable once InnoCode CI runs on a runner with MSVC, or once
  // we need to compile a module that lacks prebuilds.
  npmRebuild: false,
  // The upstream config pulls native/{index.js, mac_window.node, swift-build}
  // into the bundle. InnoCode doesn't build those add-ons, so drop them to
  // avoid electron-builder warnings about a missing source directory.
  extraResources: undefined,
  mac: base.mac
    ? hasMacCert
      ? { ...base.mac, notarize: hasNotaryCreds }
      : { ...base.mac, identity: null, notarize: false }
    : undefined,
  dmg: base.dmg ? { ...base.dmg, sign: hasMacCert } : undefined,
  win: base.win ? { ...base.win, signtoolOptions: undefined } : undefined,
  publish: null,
}

export default config
