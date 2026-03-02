import type { Metadata } from "next";
import "./globals.css";
import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";

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
      <body className="bg-slate-50 text-slate-900">
        <AppHeader />
        {children}
        <AppFooter />
      </body>
    </html>
  );
}
