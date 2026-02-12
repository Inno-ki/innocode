import fs from "fs/promises"
import { xdgData, xdgCache, xdgConfig, xdgState } from "xdg-basedir"
import path from "path"
import os from "os"

const app = "innocode"
const legacyApp = "opencode"

const data = path.join(xdgData!, app)
const cache = path.join(xdgCache!, app)
const config = path.join(xdgConfig!, app)
const state = path.join(xdgState!, app)

const legacyData = path.join(xdgData!, legacyApp)
const legacyConfig = path.join(xdgConfig!, legacyApp)
const legacyState = path.join(xdgState!, legacyApp)

export namespace Global {
  export const Path = {
    // Allow override via OPENCODE_TEST_HOME for test isolation
    get home() {
      return process.env.OPENCODE_TEST_HOME || os.homedir()
    },
    data,
    bin: path.join(data, "bin"),
    log: path.join(data, "log"),
    cache,
    config,
    state,
  }
}

async function pathExists(target: string) {
  return fs
    .access(target)
    .then(() => true)
    .catch(() => false)
}

async function migrateLegacyDir(source: string, dest: string) {
  const sourceExists = await pathExists(source)
  const destExists = await pathExists(dest)
  if (!sourceExists || destExists) return
  await fs.cp(source, dest, { recursive: true, errorOnExist: false })
}

await Promise.all([
  migrateLegacyDir(legacyData, data),
  migrateLegacyDir(legacyConfig, config),
  migrateLegacyDir(legacyState, state),
])

await Promise.all([
  fs.mkdir(Global.Path.data, { recursive: true }),
  fs.mkdir(Global.Path.config, { recursive: true }),
  fs.mkdir(Global.Path.state, { recursive: true }),
  fs.mkdir(Global.Path.log, { recursive: true }),
  fs.mkdir(Global.Path.bin, { recursive: true }),
])

const CACHE_VERSION = "21"

const version = await Bun.file(path.join(Global.Path.cache, "version"))
  .text()
  .catch(() => "0")

if (version !== CACHE_VERSION) {
  try {
    const contents = await fs.readdir(Global.Path.cache)
    await Promise.all(
      contents.map((item) =>
        fs.rm(path.join(Global.Path.cache, item), {
          recursive: true,
          force: true,
        }),
      ),
    )
  } catch (e) {}
  await Bun.file(path.join(Global.Path.cache, "version")).write(CACHE_VERSION)
}
