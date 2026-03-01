import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CloseFlow",
  description: "Real-estate closing workflow MVP",
  icons: {
    icon: "/logo-mark.svg",
    shortcut: "/logo-mark.svg",
    apple: "/logo-mark.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
