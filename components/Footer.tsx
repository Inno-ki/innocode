import Link from "next/link";

export default function Footer() {
  return (
    <footer className="fixed bottom-2 right-2 z-10">
      <Link
        href="https://www.inno-ki.de/"
        className="group flex items-center gap-1 rounded-full border bg-white/10 px-3 py-1.5 text-sm text-gray-400 shadow-lg backdrop-blur-md transition-all hover:bg-white/20 hover:text-gray-800"
        aria-label="Made by innoki"
      >
        made by
        <span className="bg-gradient-to-r from-purple-600 to-[#99c21d] bg-clip-text font-medium text-transparent">
          innoki
        </span>
        <span className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
          →
        </span>
      </Link>
    </footer>
  );
}
