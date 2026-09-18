"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Inki } from "@/components/Inki";
import { Banner, Button, InkDrops } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

const NAV = [
  { href: "/app", label: "Write" },
  { href: "/app/library", label: "My writing" },
  { href: "/app/closet", label: "Closet" },
  { href: "/app/account", label: "Account" },
];

function GuestGate() {
  const { continueAsGuest } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setError(null);
    setBusy(true);
    try {
      await continueAsGuest();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't start. Is the API running?");
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[460px] flex flex-col items-center gap-6 text-center">
        <div className="relative flex items-center justify-center w-[220px] h-[220px]">
          <div aria-hidden="true" className="absolute inset-5 rounded-full bg-teal-wash" />
          <div className="relative">
            <Inki size={170} equipped={{ held: "held-pencil" }} mood="cheer" />
          </div>
        </div>
        <div className="relative lined-paper w-full rounded-[28px] border border-paper-edge p-8 flex flex-col items-center gap-5">
          <span
            aria-hidden="true"
            className="absolute -top-3 left-1/2 h-5 w-[4.25rem] -translate-x-1/2 rotate-[-6deg] rounded-[2px] bg-sun-wash"
          />
          <h1 className="text-3xl font-bold">Ready to write?</h1>
          <p className="text-ink-soft">
            Jump straight in — no account needed. You can save your work to an account whenever you like.
          </p>
          {error ? <Banner tone="bad">{error}</Banner> : null}
          <Button onClick={start} disabled={busy} className="w-full">
            {busy ? "Getting things ready…" : "Start writing"}
          </Button>
          <p className="text-[15px] text-ink-soft">
            Already have an account?{" "}
            <Link href="/signin" className="font-bold text-indigo hover:text-coral-deep">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-ink-soft font-semibold">Loading…</p>
      </main>
    );
  }

  if (!user) return <GuestGate />;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <header className="bg-paper/95 border-b border-paper-edge">
        <div className="mx-auto max-w-[1080px] px-5 py-3 flex items-center gap-4">
          <Link href="/app" className="flex items-center gap-2.5 shrink-0">
            <Inki size={36} equipped={user.equipped} decorative />
            <span className="font-display text-xl font-extrabold text-indigo hidden sm:inline">
              Write on!
            </span>
          </Link>

          <nav className="flex-1 flex items-center justify-center gap-1 sm:gap-2">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 sm:px-4 py-2 rounded-full text-[15px] font-bold transition-colors ${
                    active ? "bg-indigo-wash text-indigo-deep" : "text-ink-soft hover:text-indigo"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <InkDrops count={user.inkDrops} />
            <button
              onClick={() => {
                signOut();
                router.push("/");
              }}
              className="text-[15px] font-bold text-ink-faint hover:text-coral-deep"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {user.isGuest ? (
        <div className="bg-sun-wash border-b border-[#EFDDB0] px-5 py-2.5">
          <div className="mx-auto max-w-[1080px] flex flex-wrap items-center justify-center gap-2 text-center">
            <p className="text-[15px] font-semibold text-[#8A6410]">
              You&apos;re writing as a guest — your work is saved to this device&apos;s session only.
            </p>
            <Link href="/app/account" className="text-[15px] font-bold text-indigo hover:text-coral-deep">
              Save it to an account →
            </Link>
          </div>
        </div>
      ) : null}

      <main className="flex-1">{children}</main>
    </div>
  );
}
