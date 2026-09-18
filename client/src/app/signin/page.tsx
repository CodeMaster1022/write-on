"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Inki } from "@/components/Inki";
import { Banner, Button, Field, inputClass } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

export default function SignInPage() {
  const router = useRouter();
  const { signIn, continueAsGuest } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"signin" | "guest" | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy("signin");
    try {
      const user = await signIn(email, password);
      router.push(user.role === "teacher" ? "/teacher" : "/app");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't sign in. Please try again.");
      setBusy(null);
    }
  }

  async function handleGuest() {
    setError(null);
    setBusy("guest");
    try {
      await continueAsGuest();
      router.push("/app");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't start a guest session.");
      setBusy(null);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden px-6 py-10 lg:py-16 flex items-center justify-center">
      <div className="w-full max-w-[1040px] flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className="flex flex-col items-center lg:items-start gap-5 text-center lg:text-left">
          <Link href="/" className="flex items-center gap-3">
            <span className="font-display text-2xl font-extrabold text-indigo">Write on!</span>
          </Link>

          <div className="relative flex items-center justify-center w-[260px] h-[260px]">
            <div aria-hidden="true" className="absolute inset-6 rounded-full bg-teal-wash" />
            <div className="relative">
              <Inki size={200} equipped={{ held: "held-pencil" }} mood="cheer" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Welcome{" "}
            <span className="relative inline-block text-coral">
              back
              <svg
                viewBox="0 0 120 12"
                fill="none"
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-1 left-0 w-full text-coral"
              >
                <path
                  d="M2 8c12-6 18 6 30 0s18 6 30 0 18 6 30 0 18 6 26-2"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p className="max-w-[340px] text-lg leading-relaxed text-ink-soft">
            Sign in to pick up where you left off.
          </p>
        </div>

        <div className="w-full max-w-[460px] flex flex-col gap-5">
          <div className="relative lined-paper rounded-[28px] border border-paper-edge p-8 flex flex-col gap-6 mt-3">
            <span
              aria-hidden="true"
              className="absolute -top-3 left-1/2 h-5 w-[4.25rem] -translate-x-1/2 rotate-[-6deg] rounded-[2px] bg-sun-wash"
            />

            {error ? <Banner tone="bad">{error}</Banner> : null}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Field label="Email" htmlFor="email">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@school.org"
                />
              </Field>

              <Field label="Password" htmlFor="password">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </Field>

              <Button type="submit" disabled={busy !== null} className="w-full">
                {busy === "signin" ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <p className="text-center text-ink-soft">
              New here?{" "}
              <Link href="/signup" className="font-bold text-indigo hover:text-coral-deep">
                Create an account
              </Link>
            </p>
          </div>

          <div className="sticker relative -rotate-1 rounded-[22px] bg-teal-wash border border-paper-edge p-6 flex flex-col items-center gap-3 text-center">
            <span
              aria-hidden="true"
              className="absolute -top-2.5 left-8 h-4 w-12 rotate-[8deg] rounded-[2px] bg-coral-wash"
            />
            <p className="font-bold text-indigo-deep">Just want to try it?</p>
            <p className="text-[15px] text-ink-soft">
              Start writing right away. You can save your work to an account later.
            </p>
            <Button variant="secondary" onClick={handleGuest} disabled={busy !== null} className="w-full">
              {busy === "guest" ? "Setting up…" : "Continue as guest"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
