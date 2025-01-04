"use client";

import CodeViewer from "@/components/code-viewer";
import { useScrollTo } from "@/hooks/use-scroll-to";
import { domain } from "@/utils/domain";
import { CheckIcon } from "@heroicons/react/16/solid";
import {
  ArrowLongRightIcon,
  ChevronDownIcon,
  CodeBracketIcon,
  PlayIcon,
} from "@heroicons/react/20/solid";
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
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import Header from "@/components/Header";

const translations = {
  en: {
    hero: {
      title: "Your ideas.",
      subtitle: "Into code in seconds.",
      description:
        "Use the power of AI to turn your app ideas into reality instantly. No code. No complexity.",
    },
    input: {
      placeholder: "Create an emoji generator...",
    },
    settings: {
      model: "Model",
      quality: {
        label: "Quality",
        low: "Quick & Dirty (faster)",
        high: "Premium Style (slower)",
      },
    },
    examples: {
      title: "POPULAR EXAMPLES",
      items: [
        {
          icon: "✨",
          title: "Emoji Generator",
          desc: "With facial expressions",
          prompt: "Create an emoji generator with facial expressions",
        },
        {
          icon: "📝",
          title: "Markdown Editor",
          desc: "With live preview",
          prompt: "Build a markdown editor with preview",
        },
        {
          icon: "⏱️",
          title: "Pomodoro Timer",
          desc: "With sound effects",
          prompt: "Create a pomodoro timer with sound",
        },
        {
          icon: "✓",
          title: "Todo App",
          desc: "With tags & categories",
          prompt: "Build a todo app with tags and categories",
        },
      ],
    },
    chat: {
      placeholder: "Make changes to your app...",
      response:
        "I've updated your app based on your request. You can see the changes in the preview.",
    },
    loading: {
      creating: "Building your app...",
      updating: "Updating your app...",
      wait: "This may take a few seconds",
    },
    share: {
      button: "Share",
      tooltip: "Share your app with others",
      success: "Your app has been published & copied to your clipboard!",
    },
  },
  de: {
    hero: {
      title: "Deine Ideen.",
      subtitle: "In Sekunden zu Code.",
      description:
        "Nutze die Power von KI, um deine App-Ideen sofort Realität werden zu lassen. Ohne Code. Ohne Komplexität.",
    },
    input: {
      placeholder: "Erstelle einen Emoji-Generator...",
    },
    settings: {
      model: "Modell",
      quality: {
        label: "Qualität",
        low: "Quick & Dirty (schneller)",
        high: "Premium Style (dauert länger)",
      },
    },
    examples: {
      title: "BELIEBTE VORSCHLÄGE",
      items: [
        {
          icon: "✨",
          title: "Emoji Generator",
          desc: "Mit Gesichtsausdrücken",
          prompt: "Erstelle einen Emoji-Generator mit Gesichtsausdrücken",
        },
        {
          icon: "📝",
          title: "Markdown Editor",
          desc: "Mit Live Preview",
          prompt: "Baue einen Markdown Editor mit Preview",
        },
        {
          icon: "⏱️",
          title: "Pomodoro Timer",
          desc: "Mit Sound Effekten",
          prompt: "Entwickle einen Pomodoro Timer mit Sound",
        },
        {
          icon: "✓",
          title: "Todo App",
          desc: "Mit Tags & Kategorien",
          prompt: "Erstelle eine Todo-App mit Tags und Kategorien",
        },
      ],
    },
    chat: {
      placeholder: "Ändere die App...",
      response:
        "Ich habe die App basierend auf deiner Anfrage aktualisiert. Du kannst die Änderungen in der Vorschau sehen.",
    },
    loading: {
      creating: "Erstelle deine App...",
      updating: "Update deine App...",
      wait: "Das kann einige Sekunden dauern",
    },
    share: {
      button: "Teilen",
      tooltip: "Teile deine App mit anderen",
      success: "Deine App wurde veröffentlicht und in dein Clipboard kopiert!",
    },
  },
};

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
  const [activeTab, setActiveTab] = useState<"preview" | "code">("code");
  const [lang, setLang] = useState<"en" | "de">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("lang") as "en" | "de") || "en";
    }
    return "en";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", lang);
    }
  }, [lang]);

  const t = translations[lang];

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
      })
      .on("error", () => {
        setStatus("initial");
        toast.error("Failed to generate code");
      });
  }

  async function updateApp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setStatus("updating");
    setModification("");

    let codeMessage = {
      role: "assistant",
      content: t.chat.response,
    };
    let modificationMessage = { role: "user", content: modification };

    setGeneratedCode("");

    const res = await fetch("/api/generateCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          ...messages,
          { role: "assistant", content: generatedCode },
          modificationMessage,
        ],
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
        setMessages((m) => [...m, modificationMessage, codeMessage]);
        setStatus("updated");
      })
      .on("error", () => {
        setStatus("created");
        toast.error("Failed to update code");
      });
  }

  useEffect(() => {
    const chatContainer = document.querySelector("[data-chat-container]");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    let el = document.querySelector(".cm-scroller");
    if (el && loading) {
      let end = el.scrollHeight - el.clientHeight;
      el.scrollTo({ top: end });
    }
  }, [loading, generatedCode]);

  useEffect(() => {
    return () => {
      if (loading && status === "updating") {
        setStatus("created");
      }
    };
  }, [loading, status]);

  const handleRestart = () => {
    setStatus("initial");
    setPrompt("");
    setModel(models[0].value);
    setQuality("low");
    setShadcn(false);
    setModification("");
    setGeneratedCode("");
    setMessages([]);
    setInitialAppConfig({ model: "", quality: "", shadcn: true });
  };

  return (
    <main className="fixed inset-0 flex flex-col">
      <Header
        lang={lang}
        onLanguageChange={(newLang) => setLang(newLang)}
        showRestart={status !== "initial"}
        onRestart={handleRestart}
      />

      <div className="h-full flex-1 pt-14">
        <AnimatePresence mode="wait">
          {status === "initial" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto flex h-full w-full max-w-7xl flex-col items-center px-4 pt-2 sm:pt-12"
            >
              <h1 className="max-w-4xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text p-2 text-center text-3xl font-bold text-transparent sm:text-6xl">
                {t.hero.title}
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text">
                  {t.hero.subtitle}
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-center text-base leading-relaxed text-gray-600 sm:text-lg">
                {t.hero.description}
              </p>

              <div className="mt-8 w-full max-w-2xl">
                <form onSubmit={createApp}>
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
                            placeholder={t.input.placeholder}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-3xl px-6 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 focus-visible:outline-none disabled:text-gray-400"
                        >
                          {loading ? (
                            <LoadingDots color="currentColor" style="large" />
                          ) : (
                            <ArrowLongRightIcon className="-ml-0.5 size-6" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center justify-between gap-3 sm:grow sm:flex-col sm:items-start sm:justify-center sm:gap-2">
                        <p className="text-sm font-medium text-gray-700">
                          {t.settings.model}
                        </p>
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
                          {t.settings.quality.label}
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
                                      {t.settings.quality.low}
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
                                      {t.settings.quality.high}
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

                <div className="mt-6">
                  <p className="mb-2 text-sm font-medium text-gray-500">
                    {t.examples.title}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {t.examples.items.map((example) => (
                      <button
                        key={example.prompt}
                        onClick={() => setPrompt(example.prompt)}
                        className="group flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 text-left transition-all hover:border-blue-500/20 hover:bg-blue-50/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                      >
                        <span className="text-lg">{example.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                            {example.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {example.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-full flex-1 overflow-hidden"
            >
              <div className="flex flex-1">
                {/* Chat Section */}
                <div className="flex w-[350px] flex-col border-r border-gray-200 bg-white">
                  <div
                    className="flex-1 overflow-y-auto p-4"
                    data-chat-container
                  >
                    <div className="space-y-4">
                      {messages.map((message, i) => (
                        <div
                          key={i}
                          className={`flex ${
                            message.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              message.role === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            } max-w-[80%]`}
                          >
                            <p className="whitespace-pre-wrap text-sm">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      ))}
                      {loading && (
                        <div className="flex justify-start">
                          <div className="rounded-2xl bg-gray-100 px-4 py-2">
                            <LoadingDots color="black" style="large" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Chat Input */}
                  <div className="border-t border-gray-200 p-4">
                    <form onSubmit={updateApp}>
                      <fieldset disabled={loading} className="group">
                        <div className="relative flex rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5 group-disabled:bg-gray-50">
                          <input
                            required
                            name="modification"
                            value={modification}
                            onChange={(e) => setModification(e.target.value)}
                            className="w-full rounded-l-xl bg-transparent px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus-visible:outline-none disabled:cursor-not-allowed"
                            placeholder={t.chat.placeholder}
                          />
                          <button
                            type="submit"
                            disabled={loading}
                            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-xl px-3 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 focus-visible:outline-none disabled:text-gray-400"
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
                  </div>
                </div>

                {/* Preview/Code Section */}
                <div className="flex flex-1 flex-col overflow-hidden">
                  <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4">
                    <div className="flex">
                      <button
                        onClick={() => setActiveTab("preview")}
                        className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${
                          activeTab === "preview"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <PlayIcon className="size-5" />
                        Preview
                      </button>
                      <button
                        onClick={() => setActiveTab("code")}
                        className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${
                          activeTab === "code"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <CodeBracketIcon className="size-5" />
                        Code
                      </button>
                    </div>

                    <div>
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
                                toast.success(t.share.success, {
                                  description: `${domain}/share/${appId}`,
                                });
                                navigator.clipboard.writeText(
                                  `${domain}/share/${appId}`,
                                );
                              }}
                              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition enabled:hover:from-blue-700 enabled:hover:to-cyan-700 disabled:grayscale"
                            >
                              <span className="relative">
                                {isPublishing && (
                                  <span className="absolute inset-0 flex items-center justify-center">
                                    <LoadingDots color="white" style="large" />
                                  </span>
                                )}

                                <ArrowUpOnSquareIcon
                                  className={`${isPublishing ? "invisible" : ""} size-4`}
                                />
                              </span>
                              {t.share.button}
                            </button>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="select-none rounded-lg bg-white px-3 py-2 text-sm leading-none text-gray-900 shadow-lg ring-1 ring-gray-900/5"
                              sideOffset={5}
                            >
                              {t.share.tooltip}
                              <Tooltip.Arrow className="fill-white" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </Tooltip.Provider>
                    </div>
                  </div>

                  <div className="relative flex-1 overflow-hidden">
                    <div className="isolate h-full">
                      <CodeViewer
                        code={generatedCode}
                        showEditor={activeTab === "code"}
                      />
                    </div>

                    <AnimatePresence>
                      {loading && (
                        <motion.div
                          initial={
                            status === "updating" ? { x: "100%" } : undefined
                          }
                          animate={
                            status === "updating" ? { x: "0%" } : undefined
                          }
                          exit={{ x: "100%" }}
                          transition={{
                            type: "spring",
                            bounce: 0,
                            duration: 0.85,
                            delay: 0.5,
                          }}
                          className="absolute inset-x-0 bottom-0 top-1/2 flex items-center justify-center border-l border-gray-200 bg-white/95 backdrop-blur-sm md:inset-y-0 md:left-1/2 md:right-0"
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
                                ? t.loading.creating
                                : t.loading.updating}
                            </p>
                            <p className="text-sm text-gray-500">
                              {t.loading.wait}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Toaster position="bottom-right" />
    </main>
  );
}

async function minDelay<T>(promise: Promise<T>, ms: number) {
  let delay = new Promise((resolve) => setTimeout(resolve, ms));
  let [p] = await Promise.all([promise, delay]);

  return p;
}
