import Link from "next/link";

export default function Footer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 -z-10 mb-3 mt-5 flex h-16 w-full flex-col items-center justify-between space-y-3 px-3 pt-4 text-center sm:mb-0 sm:h-20 sm:flex-row sm:pt-2">
      <div></div>
      <div className="flex space-x-4 pb-4 sm:pb-0">
        <Link href="https://www.inno-ki.de/" className="group" aria-label="">
          Inno KI GmbH
        </Link>
      </div>
    </footer>
  );
}
