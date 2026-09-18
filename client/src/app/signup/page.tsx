"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Inki } from "@/components/Inki";
import { Banner, Button, Field, inputClass } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

function SignUpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { signUp } = useAuth();

  const [role, setRole] = useState<"student" | "teacher">(
    params.get("role") === "teacher" ? "teacher" : "student",
  );
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [classCode, setClassCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const user = await signUp({
        displayName,
        email,
        password,
        role,
        gradeLevel: gradeLevel || undefined,
        classCode: classCode || undefined,
      });
      router.push(user.role === "teacher" ? "/teacher" : "/app");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't create that account.");
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-[1040px] flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
      <div className="flex flex-col items-center lg:items-start gap-5 text-center lg:text-left lg:sticky lg:top-16">
        <Link href="/" className="flex items-center gap-3">
          <span className="font-display text-2xl font-extrabold text-indigo">Write on!</span>
        </Link>

        <div className="relative flex items-center justify-center w-[260px] h-[260px]">
          <div
            aria-hidden="true"
            className={`absolute inset-6 rounded-full ${role === "teacher" ? "bg-indigo-wash" : "bg-coral-wash"}`}
          />
          <div className="relative">
            <Inki
              size={200}
              equipped={role === "teacher" ? { held: "held-book" } : { hat: "hat-party" }}
              mood={role === "teacher" ? "think" : "cheer"}
            />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
          Create your{" "}
          <span className="relative inline-block text-coral">
            account
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
        <p className="max-w-[360px] text-lg leading-relaxed text-ink-soft">
          Keep your writing, your ink drops, and Inki&apos;s wardrobe.
        </p>
      </div>

      <div className="w-full max-w-[500px] relative lined-paper rounded-[28px] border border-paper-edge p-8 flex flex-col gap-6 mt-3">
        <span
          aria-hidden="true"
          className="absolute -top-3 left-1/2 h-5 w-[4.25rem] -translate-x-1/2 rotate-[-6deg] rounded-[2px] bg-sun-wash"
        />

        {error ? <Banner tone="bad">{error}</Banner> : null}

        <fieldset className="flex flex-col gap-3">
          <legend className="font-bold text-[15px] mb-1">I am a…</legend>
          <div className="grid grid-cols-2 gap-3">
            {(["student", "teacher"] as const).map((r) => (
              <label
                key={r}
                className={`cursor-pointer rounded-xl border-2 px-4 py-3.5 font-bold capitalize text-center transition-colors ${
                  role === r
                    ? "border-indigo bg-indigo-wash text-indigo-deep sticker"
                    : "border-paper-edge bg-white text-ink-soft hover:border-indigo-wash"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={r}
                  checked={role === r}
                  onChange={() => setRole(r)}
                  className="sr-only"
                />
                {r}
              </label>
            ))}
          </div>
        </fieldset>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field label={role === "teacher" ? "Your name" : "First name"} htmlFor="displayName">
            <input
              id="displayName"
              required
              maxLength={60}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={inputClass}
              placeholder={role === "teacher" ? "Ms. Rivera" : "Sam"}
            />
          </Field>

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

          <Field label="Password" hint="At least 8 characters." htmlFor="password">
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </Field>

          {role === "student" ? (
            <>
              <Field label="Grade" hint="Optional." htmlFor="gradeLevel">
                <input
                  id="gradeLevel"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className={inputClass}
                  placeholder="3rd"
                />
              </Field>
              <Field
                label="Class code"
                hint="Optional — your teacher will give you one if you need it."
                htmlFor="classCode"
              >
                <input
                  id="classCode"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                  className={inputClass}
                  placeholder="RIVERA3"
                  maxLength={12}
                />
              </Field>
            </>
          ) : (
            <Field
              label="Class code"
              hint="Students enter this to join your roster. Pick something short."
              htmlFor="classCode"
            >
              <input
                id="classCode"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                className={inputClass}
                placeholder="RIVERA3"
                maxLength={12}
              />
            </Field>
          )}

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="text-center text-ink-soft">
          Already have an account?{" "}
          <Link href="/signin" className="font-bold text-indigo hover:text-coral-deep">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <main className="min-h-screen overflow-x-hidden px-6 py-10 lg:py-16 flex items-center justify-center">
      <Suspense fallback={<p className="text-ink-soft">Loading…</p>}>
        <SignUpForm />
      </Suspense>
    </main>
  );
}
