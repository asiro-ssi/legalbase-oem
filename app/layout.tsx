import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LegalBase",
  description: "LegalBase ポータル",
  icons: {
    icon: "https://legal-base.vercel.app/img/favicon.ico",
    shortcut: "https://legal-base.vercel.app/img/favicon.ico",
    apple: "https://legal-base.vercel.app/img/favicon.ico",
  },
  // このポータルはログインを伴わない公開ページなので、
  // 帳票や問答集が検索結果に出ないよう検索エンジンから除外する。
  // robots.txt で Disallow にはしない（クロールを禁止すると
  // この noindex 自体が読まれず、URL だけ登録されることがある）。
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
