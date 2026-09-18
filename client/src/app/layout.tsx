import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Write on! — Guided writing for young writers",
  description:
    "Write on! walks students from a single sentence to a finished essay, one guided step at a time, with a friendly companion named Inki cheering them on.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${baloo.variable} ${nunito.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
