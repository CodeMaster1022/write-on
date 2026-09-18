"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Inki } from "@/components/Inki";
import { Banner, ButtonLink } from "@/components/ui";
import { ApiError, api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { ClassStudent, Writing } from "@/lib/types";

function formatWhen(iso: string | null): string {
  if (!iso) return "Not yet";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function TeacherPage() {
  const { user, loading, signOut } = useAuth();

  const [classCode, setClassCode] = useState<string | null>(null);
  const [students, setStudents] = useState<ClassStudent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsCode, setNeedsCode] = useState(false);

  const [selected, setSelected] = useState<ClassStudent | null>(null);
  const [studentWork, setStudentWork] = useState<Writing[] | null>(null);

  useEffect(() => {
    if (loading || user?.role !== "teacher") return;
    api
      .roster()
      .then((res) => {
        setClassCode(res.classCode);
        setStudents(res.students);
        setNeedsCode(false);
      })
      .catch((err) => {
        const message = err instanceof ApiError ? err.message : "Couldn't load your roster.";
        if (err instanceof ApiError && err.status === 400) {
          setNeedsCode(true);
          setStudents([]);
        }
        setError(message);
      });
  }, [loading, user]);

  useEffect(() => {
    if (!selected) {
      setStudentWork(null);
      return;
    }
    setStudentWork(null);
    api
      .studentWritings(selected._id)
      .then((res) => setStudentWork(res.writings))
      .catch(() => setError("Couldn't load that student's writing."));
  }, [selected]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-semibold text-ink-soft">Loading…</p>
      </main>
    );
  }

  if (!user || user.role !== "teacher") {
    return (
      <main className="min-h-screen overflow-x-hidden flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[460px] flex flex-col items-center gap-6 text-center">
          <div className="relative flex items-center justify-center w-[220px] h-[220px]">
            <div aria-hidden="true" className="absolute inset-5 rounded-full bg-indigo-wash" />
            <div className="relative">
              <Inki size={170} equipped={{ hat: "hat-grad" }} mood="think" />
            </div>
          </div>
          <div className="relative lined-paper w-full rounded-[28px] border border-paper-edge p-8 flex flex-col items-center gap-5">
            <span
              aria-hidden="true"
              className="absolute -top-3 left-1/2 h-5 w-[4.25rem] -translate-x-1/2 rotate-[-6deg] rounded-[2px] bg-sun-wash"
            />
            <h1 className="text-3xl font-bold">Teacher area</h1>
            <p className="text-ink-soft">
              Sign in with a teacher account to see your class roster and the writing your students have
              saved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              <ButtonLink href="/signin" className="flex-1 min-w-[140px]">
                Sign in
              </ButtonLink>
              <ButtonLink href="/signup?role=teacher" variant="ghost" className="flex-1 min-w-[140px]">
                Create a teacher account
              </ButtonLink>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <header className="bg-paper/95 border-b border-paper-edge">
        <div className="mx-auto max-w-[1080px] px-5 py-3 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Inki size={36} equipped={{ hat: "hat-grad" }} decorative />
            <span className="font-display text-xl font-extrabold text-indigo">Write on!</span>
          </Link>
          <span className="px-3 py-1.5 bg-indigo-wash text-indigo-deep rounded-full text-[13px] font-bold">
            Teacher
          </span>
          <div className="flex-1" />
          <Link href="/app" className="font-bold text-[15px] text-ink-soft hover:text-indigo">
            Write
          </Link>
          <Link href="/app/account" className="font-bold text-[15px] text-ink-soft hover:text-indigo">
            Account
          </Link>
          <button
            onClick={signOut}
            className="font-bold text-[15px] text-ink-faint hover:text-coral-deep"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1080px] px-5 py-8 flex flex-col gap-8">
        <header className="flex flex-col lg:flex-row lg:items-end gap-5">
          <div className="flex items-center gap-5 flex-1">
            <div className="relative hidden sm:flex items-center justify-center w-[110px] h-[110px] shrink-0">
              <div aria-hidden="true" className="absolute inset-2 rounded-full bg-indigo-wash" />
              <div className="relative">
                <Inki size={90} equipped={{ held: "held-book" }} mood="think" decorative />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl sm:text-4xl font-bold">
                My{" "}
                <span className="relative inline-block text-coral">
                  class
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
              <p className="text-lg text-ink-soft">
                {classCode
                  ? "Students join by entering this class code on their account screen."
                  : "Add a class code so students can find your roster."}
              </p>
            </div>
          </div>

          {classCode ? (
            <div className="sticker relative self-start lg:self-auto -rotate-1 rounded-[18px] bg-indigo px-6 py-4 text-white">
              <span
                aria-hidden="true"
                className="absolute -top-2.5 left-1/2 h-4 w-12 -translate-x-1/2 rotate-[6deg] rounded-[2px] bg-sun-wash"
              />
              <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-white/70">Class code</p>
              <p className="font-display text-3xl font-extrabold tracking-wide">{classCode}</p>
            </div>
          ) : null}
        </header>

        {error && !needsCode ? <Banner tone="bad">{error}</Banner> : null}

        {needsCode ? (
          <div className="relative lined-paper rounded-[28px] border border-paper-edge p-10 flex flex-col items-center gap-4 text-center mt-2">
            <span
              aria-hidden="true"
              className="absolute -top-3 left-1/2 h-5 w-[4.25rem] -translate-x-1/2 rotate-[-6deg] rounded-[2px] bg-sun-wash"
            />
            <Inki size={140} equipped={{ held: "held-book" }} mood="think" />
            <h2 className="text-2xl font-bold">Pick a class code first</h2>
            <p className="text-ink-soft max-w-[460px]">
              Students need a short code to join your roster. Add one on your account, then come back
              here.
            </p>
            <ButtonLink href="/app/account">Add a class code</ButtonLink>
          </div>
        ) : null}

        {students === null && !error ? <p className="font-semibold text-ink-soft">Loading roster…</p> : null}

        {students && students.length === 0 && !needsCode ? (
          <div className="relative lined-paper rounded-[28px] border border-paper-edge p-10 flex flex-col items-center gap-4 text-center mt-2">
            <span
              aria-hidden="true"
              className="absolute -top-3 left-1/2 h-5 w-[4.25rem] -translate-x-1/2 rotate-[-6deg] rounded-[2px] bg-sun-wash"
            />
            <div className="relative flex items-center justify-center w-[170px] h-[170px]">
              <div aria-hidden="true" className="absolute inset-4 rounded-full bg-indigo-wash" />
              <div className="relative">
                <Inki size={140} equipped={{ held: "held-book" }} mood="think" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">No students yet</h2>
            <p className="text-ink-soft max-w-[460px]">
              Share your class code{" "}
              {classCode ? <span className="font-bold text-indigo">{classCode}</span> : null} with your
              students. Once they add it to their account, their writing shows up here.
            </p>
          </div>
        ) : null}

        {students && students.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-bold">
                {students.length} {students.length === 1 ? "student" : "students"}
              </h2>
              <ul className="flex flex-col gap-3">
                {students.map((s) => {
                  const active = selected?._id === s._id;
                  return (
                    <li key={s._id}>
                      <button
                        onClick={() => setSelected(active ? null : s)}
                        aria-pressed={active}
                        className={`sticker w-full text-left rounded-[18px] px-5 py-4 border-2 transition-colors ${
                          active
                            ? "bg-indigo-wash border-indigo"
                            : "bg-white border-paper-edge hover:border-indigo-wash"
                        }`}
                      >
                        <span className="block font-bold text-lg">{s.displayName}</span>
                        <span className="block text-[14px] text-ink-soft">
                          {s.writingCount} {s.writingCount === 1 ? "piece" : "pieces"} · last wrote{" "}
                          {formatWhen(s.lastWroteAt)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="flex flex-col gap-4">
              {!selected ? (
                <div className="relative lined-paper rounded-[28px] border border-paper-edge p-8 flex flex-col items-center gap-3 text-center">
                  <span
                    aria-hidden="true"
                    className="absolute -top-3 left-1/2 h-5 w-[4.25rem] -translate-x-1/2 rotate-[-6deg] rounded-[2px] bg-sun-wash"
                  />
                  <p className="text-lg font-bold">Pick a student</p>
                  <p className="text-ink-soft">
                    Choose a name to read what they&apos;ve written, including the word choices behind
                    each sentence.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{selected.displayName}&apos;s writing</h2>

                  {studentWork === null ? (
                    <p className="font-semibold text-ink-soft">Loading…</p>
                  ) : studentWork.length === 0 ? (
                    <div className="lined-paper rounded-[22px] border border-paper-edge p-7">
                      <p className="text-ink-soft">
                        Nothing saved yet. Their work appears here as soon as they finish a piece.
                      </p>
                    </div>
                  ) : (
                    <ul className="flex flex-col gap-4">
                      {studentWork.map((w) => (
                        <li
                          key={w._id}
                          className="lined-paper rounded-[22px] border border-paper-edge p-6 flex flex-col gap-2.5"
                        >
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="px-3 py-1 bg-indigo-wash text-indigo-deep rounded-full text-[13px] font-bold uppercase tracking-wide">
                              {w.type}
                            </span>
                            <span className="text-[14px] font-semibold text-ink-faint">
                              {formatWhen(w.createdAt)} · {w.wordCount} words
                            </span>
                          </div>
                          {w.title ? <h3 className="text-lg font-bold">{w.title}</h3> : null}
                          <p className="whitespace-pre-wrap leading-relaxed">{w.content}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </section>
          </div>
        ) : null}
      </main>
    </div>
  );
}
