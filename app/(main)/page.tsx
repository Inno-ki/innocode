"use client";

import CodeViewer from "@/components/code-viewer";
import { useScrollTo } from "@/hooks/use-scroll-to";
import { domain } from "@/utils/domain";
import { CheckIcon } from "@heroicons/react/16/solid";
import { ArrowLongRightIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import * as Select from "@radix-ui/react-select";
import * as Switch from "@radix-ui/react-switch";
import * as Tooltip from "@radix-ui/react-tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { ChatCompletionStream } from "together-ai/lib/ChatCompletionStream.mjs";
import LoadingDots from "../../components/loading-dots";
import { shareApp } from "./actions";
import LightningBoltIcon from "@/components/icons/lightning-bolt";
import LightbulbIcon from "@/components/icons/lightbulb";

export default function Home() {
  let [status, setStatus] = useState<
    "initial" | "creating" | "created" | "updating" | "updated"
  >("initial");
  let [prompt, setPrompt] = useState("");
  let models = [
    {
      label: "Llama 3.1 405B",
      value: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
    },
    {
      label: "Qwen 2.5 Coder 32B",
      value: "Qwen/Qwen2.5-Coder-32B-Instruct",
    },
    {
      label: "Llama 3.3 70B",
      value: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    },
    {
      label: "Gemma 2 27B",
      value: "google/gemma-2-27b-it",
    },
  ];
  let [model, setModel] = useState(models[0].value);
  let [quality, setQuality] = useState("low");
  let [shadcn, setShadcn] = useState(false);
  let [modification, setModification] = useState("");
  let [generatedCode, setGeneratedCode] = useState("");
  let [initialAppConfig, setInitialAppConfig] = useState({
    model: "",
    quality: "",
    shadcn: true,
  });
  let [ref, scrollTo] = useScrollTo();
  let [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );
  let [isPublishing, setIsPublishing] = useState(false);

  let loading = status === "creating" || status === "updating";

  async function createApp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (status !== "initial") {
      scrollTo({ delay: 0.5 });
    }

    setStatus("creating");
    setGeneratedCode("");

    let res = await fetch("/api/generateCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        quality,
        shadcn,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    if (!res.body) {
      throw new Error("No response body");
    }

    ChatCompletionStream.fromReadableStream(res.body)
      .on("content", (delta) => setGeneratedCode((prev) => prev + delta))
      .on("end", () => {
        setMessages([{ role: "user", content: prompt }]);
        setInitialAppConfig({ model, quality, shadcn });
        setStatus("created");
      });
  }

  async function updateApp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setStatus("updating");

    let codeMessage = { role: "assistant", content: generatedCode };
    let modificationMessage = { role: "user", content: modification };

    setGeneratedCode("");

    const res = await fetch("/api/generateCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [...messages, codeMessage, modificationMessage],
        model: initialAppConfig.model,
        quality: initialAppConfig.quality,
        shadcn: initialAppConfig.shadcn,
      }),
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    if (!res.body) {
      throw new Error("No response body");
    }

    ChatCompletionStream.fromReadableStream(res.body)
      .on("content", (delta) => setGeneratedCode((prev) => prev + delta))
      .on("end", () => {
        setMessages((m) => [...m, codeMessage, modificationMessage]);
        setStatus("updated");
      });
  }

  useEffect(() => {
    let el = document.querySelector(".cm-scroller");
    if (el && loading) {
      let end = el.scrollHeight - el.clientHeight;
      el.scrollTo({ top: end });
    }
  }, [loading, generatedCode]);

  return (
    <main className="min-h-screen pt-28 sm:pt-36">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center px-4 text-center">
        <div className="flex items-center gap-2 rounded-2xl bg-gray-900/5 px-4 py-1 ring-1 ring-gray-900/25">
          <span className="text-sm text-gray-600">Neu</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 px-3 py-1 text-sm font-medium text-blue-600">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-600 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
            </span>
            KI-App-Generierung
          </span>
        </div>

        <h1 className="mt-6 max-w-3xl bg-gradient-to-b from-gray-900 to-gray-700 bg-clip-text p-2 text-4xl font-bold text-transparent sm:text-6xl">
          Aus Ideen werden
          <br /> Apps in Sekunden
        </h1>
        <p className="mt-6 max-w-xl text-lg text-gray-600">
          Erstelle sofort Apps mit der Power von KI. Sag einfach, was du bauen
          willst.
        </p>

        <form className="mt-12 w-full max-w-xl" onSubmit={createApp}>
          <fieldset disabled={loading} className="disabled:opacity-75">
            <div className="relative">
              <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-r from-blue-100 to-cyan-100 opacity-50 transition-opacity group-hover:opacity-100" />
              <div className="relative flex rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                <div className="relative flex flex-grow items-stretch focus-within:z-10">
                  <textarea
                    rows={3}
                    required
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    name="prompt"
                    className="w-full resize-none rounded-l-3xl bg-transparent px-6 py-5 text-lg text-gray-900 placeholder-gray-400 focus-visible:outline-none"
                    placeholder="Erstelle einen Taschenrechner..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-3xl px-6 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 focus-visible:outline-none disabled:text-gray-400"
                >
                  {status === "creating" ? (
                    <LoadingDots color="currentColor" style="large" />
                  ) : (
                    <ArrowLongRightIcon className="-ml-0.5 size-6" />
                  )}
                </button>
              </div>
            </div>
            <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center justify-between gap-3 sm:grow sm:flex-col sm:items-start sm:justify-center sm:gap-2">
                <p className="text-sm font-medium text-gray-700">Modell</p>
                <Select.Root
                  name="model"
                  disabled={loading}
                  value={model}
                  onValueChange={(value) => setModel(value)}
                >
                  <Select.Trigger className="group flex w-60 max-w-xs items-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                    <Select.Value />
                    <Select.Icon className="ml-auto">
                      <ChevronDownIcon className="size-5 text-gray-400 group-focus-visible:text-gray-600 group-enabled:group-hover:text-gray-600" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                      <Select.Viewport className="p-1">
                        {models.map((model) => (
                          <Select.Item
                            key={model.value}
                            value={model.value}
                            className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm text-gray-900 outline-none data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-600"
                          >
                            <Select.ItemText asChild>
                              <span className="inline-flex items-center gap-2">
                                <div className="size-2 rounded-full bg-blue-600" />
                                {model.label}
                              </span>
                            </Select.ItemText>
                            <Select.ItemIndicator className="ml-auto">
                              <CheckIcon className="size-5 text-blue-600" />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              <div className="flex h-full items-center justify-between gap-3 sm:flex-col sm:items-start sm:justify-center sm:gap-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="quality"
                >
                  Qualität
                </label>
                <Select.Root
                  name="quality"
                  disabled={loading}
                  value={quality}
                  onValueChange={setQuality}
                >
                  <Select.Trigger className="group flex w-56 max-w-xs items-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                    <Select.Value />
                    <Select.Icon className="ml-auto">
                      <ChevronDownIcon className="size-5 text-gray-400 group-focus-visible:text-gray-600 group-enabled:group-hover:text-gray-600" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                      <Select.Viewport className="p-1">
                        <Select.Item
                          value="low"
                          className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm text-gray-900 outline-none data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-600"
                        >
                          <Select.ItemText asChild>
                            <span className="inline-flex items-center gap-1.5">
                              <LightningBoltIcon className="size-3 text-blue-600" />
                              Quick & Dirty (schneller)
                            </span>
                          </Select.ItemText>
                          <Select.ItemIndicator className="ml-auto">
                            <CheckIcon className="size-5 text-blue-600" />
                          </Select.ItemIndicator>
                        </Select.Item>
                        <Select.Item
                          value="high"
                          className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm text-gray-900 outline-none data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-600"
                        >
                          <Select.ItemText asChild>
                            <span className="inline-flex items-center gap-1.5">
                              <LightbulbIcon className="size-3 text-yellow-500" />
                              Premium Style (dauert länger)
                            </span>
                          </Select.ItemText>
                          <Select.ItemIndicator className="ml-auto">
                            <CheckIcon className="size-5 text-blue-600" />
                          </Select.ItemIndicator>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              <div className="flex h-full items-center justify-between gap-3 sm:flex-col sm:items-start sm:justify-center sm:gap-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="shadcn"
                >
                  shadcn/ui
                </label>
                <Switch.Root
                  className="group flex h-7 w-16 items-center rounded-full border border-gray-200 bg-white px-1 shadow-sm transition-colors hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 data-[state=checked]:bg-blue-600"
                  id="shadcn"
                  name="shadcn"
                  checked={shadcn}
                  onCheckedChange={(value) => setShadcn(value)}
                >
                  <Switch.Thumb className="ease-spring-2 size-5 rounded-full bg-gray-500 shadow-sm transition-transform duration-100 data-[state=checked]:translate-x-[36px] data-[state=checked]:bg-white" />
                </Switch.Root>
              </div>
            </div>
          </fieldset>
        </form>

        {status !== "initial" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              overflow: "hidden",
              transitionEnd: { overflow: "visible" },
            }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="mt-16 w-full"
            onAnimationComplete={() => scrollTo()}
            ref={ref}
          >
            <div className="flex gap-4">
              <form className="w-full" onSubmit={updateApp}>
                <fieldset disabled={loading} className="group">
                  <div className="relative flex rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 group-disabled:bg-gray-50">
                    <div className="relative flex flex-grow items-stretch focus-within:z-10">
                      <input
                        required
                        name="modification"
                        value={modification}
                        onChange={(e) => setModification(e.target.value)}
                        className="w-full rounded-l-2xl bg-transparent px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus-visible:outline-none disabled:cursor-not-allowed"
                        placeholder="Sag was du an deiner App ändern willst"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-2xl px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 focus-visible:outline-none disabled:text-gray-400"
                    >
                      {loading ? (
                        <LoadingDots color="currentColor" style="large" />
                      ) : (
                        <ArrowLongRightIcon className="-ml-0.5 size-5" />
                      )}
                    </button>
                  </div>
                </fieldset>
              </form>
              <div>
                <Toaster position="bottom-right" />
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        disabled={loading || isPublishing}
                        onClick={async () => {
                          setIsPublishing(true);
                          let userMessages = messages.filter(
                            (message) => message.role === "user",
                          );
                          let prompt =
                            userMessages[userMessages.length - 1].content;

                          const appId = await minDelay(
                            shareApp({
                              generatedCode,
                              prompt,
                              model: initialAppConfig.model,
                            }),
                            1000,
                          );
                          setIsPublishing(false);
                          toast.success(
                            "Deine App ist online & in der Zwischenablage!",
                            {
                              description: `${domain}/share/${appId}`,
                            },
                          );
                          navigator.clipboard.writeText(
                            `${domain}/share/${appId}`,
                          );
                        }}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 text-sm font-medium text-white transition enabled:hover:from-blue-700 enabled:hover:to-cyan-700 disabled:grayscale"
                      >
                        <span className="relative">
                          {isPublishing && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <LoadingDots color="white" style="large" />
                            </span>
                          )}

                          <ArrowUpOnSquareIcon
                            className={`${isPublishing ? "invisible" : ""} size-5`}
                          />
                        </span>
                        Teilen
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="select-none rounded-lg bg-white px-3 py-2 text-sm leading-none text-gray-900 shadow-lg ring-1 ring-gray-900/5"
                        sideOffset={5}
                      >
                        Teil deine App mit anderen
                        <Tooltip.Arrow className="fill-white" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
            </div>
            <div className="relative mt-8 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="isolate">
                <CodeViewer code={generatedCode} showEditor />
              </div>

              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={status === "updating" ? { x: "100%" } : undefined}
                    animate={status === "updating" ? { x: "0%" } : undefined}
                    exit={{ x: "100%" }}
                    transition={{
                      type: "spring",
                      bounce: 0,
                      duration: 0.85,
                      delay: 0.5,
                    }}
                    className="absolute inset-x-0 bottom-0 top-1/2 flex items-center justify-center rounded-r-2xl border-l border-gray-200 bg-white/95 backdrop-blur-sm md:inset-y-0 md:left-1/2 md:right-0"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-8 w-8">
                        <svg className="animate-spin" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      </div>
                      <p className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-3xl font-bold text-transparent">
                        {status === "creating"
                          ? "Deine App wird erstellt..."
                          : "Deine App wird geupdated..."}
                      </p>
                      <p className="text-sm text-gray-500">
                        Dauert nur ein paar Sekunden
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

async function minDelay<T>(promise: Promise<T>, ms: number) {
  let delay = new Promise((resolve) => setTimeout(resolve, ms));
  let [p] = await Promise.all([promise, delay]);

  return p;
}
