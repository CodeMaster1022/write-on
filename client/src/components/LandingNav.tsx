"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Inki } from "@/components/Inki";
import { ButtonLink } from "@/components/ui";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#inki", label: "Club Inki" },
  { href: "#teachers", label: "For teachers" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-paper-edge bg-paper/95 backdrop-blur-sm">
      <nav className="mx-auto max-w-[1180px] px-6 py-4 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Inki size={40} decorative />
          <span className="font-display text-2xl font-extrabold text-indigo">Write on!</span>
        </Link>

        <div className="hidden lg:flex flex-1 items-center justify-center gap-8">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-semibold text-ink-soft hover:text-coral-deep"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="ml-auto flex items-center justify-end gap-2 sm:gap-3 shrink-0">
          <Link href="/signin" className="hidden md:inline font-bold text-indigo hover:text-coral-deep">
            Sign in
          </Link>
          <ButtonLink href="/app" className="hidden sm:inline-flex px-5 py-2.5 min-h-[44px] text-[15px]">
            Try it free
          </ButtonLink>
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full text-indigo hover:bg-indigo-wash"
            aria-expanded={open}
            aria-controls="landing-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="landing-menu"
          className="lg:hidden border-t border-paper-edge bg-paper px-6 py-4 flex flex-col gap-1"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-3 rounded-xl font-semibold text-ink-soft hover:bg-indigo-wash hover:text-indigo"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/signin"
            className="md:hidden px-3 py-3 rounded-xl font-bold text-indigo hover:bg-indigo-wash"
            onClick={() => setOpen(false)}
          >
            Sign in
          </Link>
          <ButtonLink href="/app" className="sm:hidden mt-2" onClick={() => setOpen(false)}>
            Try it free
          </ButtonLink>
        </div>
      ) : null}
    </header>
  );
}
