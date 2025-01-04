import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-xl font-bold">
              inno
              <span className="bg-blue-600 bg-clip-text text-transparent">
                code
              </span>
            </h1>
          </Link>
          <div className="hidden items-center gap-6 sm:flex">
            <Link
              href="/templates"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Templates
            </Link>
            <Link
              href="/docs"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Documentation
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/pricing"
            className="hidden rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 sm:block"
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:to-blue-700"
          >
            Sign in
          </Link>
        </div>
      </nav>
    </header>
  );
}
