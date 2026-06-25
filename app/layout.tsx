import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LegalBase",
  description: "LegalBase ポータル",
  icons: {
    icon: "https://legal-base.vercel.app/img/favicon.ico",
    shortcut: "https://legal-base.vercel.app/img/favicon.ico",
    apple: "https://legal-base.vercel.app/img/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
