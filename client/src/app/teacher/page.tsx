"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Inki } from "@/components/Inki";
import { Banner, ButtonLink, Card } from "@/components/ui";
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

  const [selected, setSelected] = useState<ClassStudent | null>(null);
  const [studentWork, setStudentWork] = useState<Writing[] | null>(null);

  useEffect(() => {
    if (loading || user?.role !== "teacher") return;
    api
      .roster()
      .then((res) => {
        setClassCode(res.classCode);
        setStudents(res.students);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Couldn't load your roster."));
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
      <main className="min-h-screen flex items-center justify-center px-6">
        <Card className="max-w-[460px] flex flex-col items-center gap-5 text-center">
          <Inki size={140} equipped={{ hat: "hat-grad" }} />
          <h1 className="text-3xl font-bold">Teacher area</h1>
          <p className="text-ink-soft">
            Sign in with a teacher account to see your class roster and the writing your students have
            saved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/signin">Sign in</ButtonLink>
            <ButtonLink href="/signup?role=teacher" variant="ghost">
              Create a teacher account
            </ButtonLink>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-paper-edge">
        <div className="mx-auto max-w-[1080px] px-5 py-3 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Inki size={36} equipped={{ hat: "hat-grad" }} decorative />
            <span className="font-display text-xl font-extrabold text-indigo">Write on!</span>
          </Link>
          <span className="px-3 py-1.5 bg-indigo-wash text-indigo-deep rounded-full text-[13px] font-bold uppercase tracking-wide">
            Teacher
          </span>
          <div className="flex-1" />
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

      <main className="mx-auto w-full max-w-[1080px] px-5 py-8 flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-bold">My class</h1>
          {classCode ? (
            <p className="text-lg text-ink-soft">
              Students join by entering class code{" "}
              <span className="font-bold text-indigo">{classCode}</span> on their account screen.
            </p>
          ) : null}
        </header>

        {error ? <Banner tone="bad">{error}</Banner> : null}

        {students === null && !error ? <p className="font-semibold text-ink-soft">Loading roster…</p> : null}

        {students && students.length === 0 ? (
          <Card className="flex flex-col items-center gap-4 text-center">
            <Inki size={140} equipped={{ held: "held-book" }} mood="think" />
            <h2 className="text-2xl font-bold">No students yet</h2>
            <p className="text-ink-soft max-w-[460px]">
              Share your class code{" "}
              {classCode ? <span className="font-bold text-indigo">{classCode}</span> : null} with your
              students. Once they add it to their account, their writing shows up here.
            </p>
          </Card>
        ) : null}

        {students && students.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-bold">
                {students.length} {students.length === 1 ? "student" : "students"}
              </h2>
              <ul className="flex flex-col gap-2">
                {students.map((s) => {
                  const active = selected?._id === s._id;
                  return (
                    <li key={s._id}>
                      <button
                        onClick={() => setSelected(active ? null : s)}
                        aria-pressed={active}
                        className={`w-full text-left rounded-[18px] px-5 py-4 border-2 transition-colors ${
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
                <Card className="flex flex-col items-center gap-3 text-center">
                  <p className="text-lg font-bold">Pick a student</p>
                  <p className="text-ink-soft">
                    Choose a name to read what they&apos;ve written, including the word choices behind
                    each sentence.
                  </p>
                </Card>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{selected.displayName}&apos;s writing</h2>

                  {studentWork === null ? (
                    <p className="font-semibold text-ink-soft">Loading…</p>
                  ) : studentWork.length === 0 ? (
                    <Card>
                      <p className="text-ink-soft">
                        Nothing saved yet. Their work appears here as soon as they finish a piece.
                      </p>
                    </Card>
                  ) : (
                    <ul className="flex flex-col gap-4">
                      {studentWork.map((w) => (
                        <li key={w._id}>
                          <Card className="flex flex-col gap-2.5">
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
                          </Card>
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
