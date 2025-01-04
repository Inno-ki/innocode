import Link from "next/link";
import { GlobeAltIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

interface HeaderProps {
  lang?: "en" | "de";
  onLanguageChange?: (lang: "en" | "de") => void;
  showRestart?: boolean;
  onRestart?: () => void;
}

export default function Header({
  lang = "en",
  onLanguageChange = () => {},
  showRestart = false,
  onRestart = () => {},
}: HeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-xl font-bold">
              inno
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                code
              </span>
            </h1>
          </Link>

          {showRestart && (
            <button
              onClick={onRestart}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              <ArrowPathIcon className="size-4" />
              New App
            </button>
          )}
        </div>

        {onLanguageChange && (
          <button
            onClick={() => onLanguageChange(lang === "en" ? "de" : "en")}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <GlobeAltIcon className="size-4" />
            {lang.toUpperCase()}
          </button>
        )}
      </nav>
    </header>
  );
}
