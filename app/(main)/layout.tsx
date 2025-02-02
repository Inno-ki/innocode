import Image from "next/image";
import bgImg from "@/public/halo.png";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className="bg-gradient-to-br from-gray-50 via-white to-gray-50 antialiased">
      <div className="isolate">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center py-2">
          {/* <Header /> */}
          {children}
          <Footer />
        </div>
      </div>
    </body>
  );
}
