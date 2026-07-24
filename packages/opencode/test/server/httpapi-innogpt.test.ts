import { afterAll, beforeAll, describe, expect } from "bun:test"
import { LayerNode } from "@opencode-ai/core/effect/layer-node"
import { FSUtil } from "@opencode-ai/core/fs-util"
import { Effect, Layer } from "effect"
import { resetDatabase } from "../fixture/db"
import { TestInstance } from "../fixture/fixture"
import { testEffect } from "../lib/effect"
import { httpApiLayer, request } from "./httpapi-layer"

const testStateLayer = Layer.effectDiscard(
  Effect.acquireRelease(
    Effect.promise(() => resetDatabase()),
    () => Effect.promise(() => resetDatabase()),
  ),
)

const it = testEffect(Layer.mergeAll(testStateLayer, LayerNode.compile(FSUtil.node), httpApiLayer))
const projectOptions = { config: { formatter: false, lsp: false } }

function providerIDs(input: unknown): string[] {
  if (typeof input !== "object" || input === null || !("all" in input)) return []
  const all = (input as { all: unknown }).all
  if (!Array.isArray(all)) return []
  return all
    .map((item) => (typeof item === "object" && item !== null && "id" in item ? String(item.id) : ""))
    .filter(Boolean)
}

const list = (directory: string) => request("/provider", { headers: { "x-opencode-directory": directory } })

// These guard the InnoCode fork customizations that upstream syncs have
// silently dropped before (the provider-list injection lived in a file the
// monorepo restructure deleted). If one of these fails after a sync, re-apply
// the innogpt placeholder injection in
// src/server/routes/instance/httpapi/handlers/provider.ts and the
// enabled_providers default in src/config/config.ts.
describe("innogpt fork customizations", () => {
  it.instance(
    "lists innogpt in the provider catalog before any key is stored",
    Effect.gen(function* () {
      const directory = (yield* TestInstance).directory
      const response = yield* list(directory)
      expect(response.status).toBe(200)
      expect(providerIDs(yield* response.json)).toContain("innogpt")
    }),
    projectOptions,
  )

  describe("shipped default (test preload override cleared)", () => {
    // the test preload sets INNOCODE_ALL_PROVIDERS=1 so upstream tests see the
    // full catalog; clear it before the instance is built to test the shipped
    // default
    beforeAll(() => {
      delete process.env.INNOCODE_ALL_PROVIDERS
    })
    afterAll(() => {
      process.env.INNOCODE_ALL_PROVIDERS = "1"
    })

    it.instance(
      "hides all providers except innogpt by default",
      Effect.gen(function* () {
        const directory = (yield* TestInstance).directory
        const response = yield* list(directory)
        expect(response.status).toBe(200)
        expect(providerIDs(yield* response.json)).toEqual(["innogpt"])
      }),
      projectOptions,
    )

    it.instance(
      "config enabled_providers overrides the innogpt-only default",
      Effect.gen(function* () {
        const directory = (yield* TestInstance).directory
        const response = yield* list(directory)
        expect(response.status).toBe(200)
        const ids = providerIDs(yield* response.json)
        expect(ids).toContain("anthropic")
        expect(ids).toContain("innogpt")
      }),
      { config: { formatter: false, lsp: false, enabled_providers: ["innogpt", "anthropic"] } },
    )
  })
})
