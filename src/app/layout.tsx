import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { BASE_PATH } from "@/lib/basePath";
import "./globals.css";

export const metadata: Metadata = {
  title: "ต้นแบบบำรุงรักษาตามวาระ · Maintain-D",
  description: "ต้นแบบหน้าจอบำรุงรักษาตามวาระ (Next.js + Tailwind) ตาม component ของไลบรารี (Component) VMS Plus",
  icons: { icon: BASE_PATH + "/pea-logo.svg" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&display=swap" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" />
      </head>
      <body>{children}</body>
    </html>
  );
}
