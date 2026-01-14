import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Cascade Autobody & Paint Supply",
    template: "%s | Cascade Autobody & Paint Supply",
  },
  description:
    "Your trusted source for auto body and paint supplies in Yakima and Toppenish, WA. Professional-grade products for collision repair, painting, and restoration.",
  keywords: [
    "auto body supplies",
    "paint supplies",
    "collision repair",
    "Yakima",
    "Toppenish",
    "Washington",
    "automotive paint",
    "body shop supplies",
  ],
  authors: [{ name: "Cascade Autobody & Paint Supply" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Cascade Autobody & Paint Supply",
    title: "Cascade Autobody & Paint Supply",
    description:
      "Professional auto body and paint supplies in Yakima and Toppenish, WA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
