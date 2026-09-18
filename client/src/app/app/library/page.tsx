"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Inki } from "@/components/Inki";
import { Banner, ButtonLink } from "@/components/ui";
import { ApiError, api } from "@/lib/api";
import type { Writing, WritingType } from "@/lib/types";

const FILTERS: { value: WritingType | "all"; label: string }[] = [
  { value: "all", label: "Everything" },
  { value: "sentence", label: "Sentences" },
  { value: "paragraph", label: "Paragraphs" },
  { value: "essay", label: "Essays" },
];

const TYPE_STYLE: Record<WritingType, string> = {
  sentence: "bg-teal-wash text-teal-deep",
  paragraph: "bg-indigo-wash text-indigo-deep",
  essay: "bg-coral-wash text-[#C44A2C]",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function LibraryPage() {
  const [filter, setFilter] = useState<WritingType | "all">("all");
  const [writings, setWritings] = useState<Writing[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setWritings(null);
    api
      .listWritings(filter === "all" ? undefined : filter)
      .then(({ writings }) => setWritings(writings))
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Couldn't load your writing."),
      );
  }, [filter]);

  async function remove(id: string) {
    setError(null);
    try {
      await api.deleteWriting(id);
      setWritings((ws) => ws?.filter((w) => w._id !== id) ?? null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't delete that.");
    }
  }

  return (
    <div className="mx-auto max-w-[900px] px-5 py-8 flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-bold">My writing</h1>
        <p className="text-lg text-ink-soft">Everything you&apos;ve finished, newest first.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            aria-pressed={filter === f.value}
            className={`px-4 py-2.5 min-h-[44px] rounded-full font-bold text-[15px] transition-colors ${
              filter === f.value
                ? "bg-indigo text-white"
                : "bg-white border border-paper-edge text-ink-soft hover:text-indigo"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error ? <Banner tone="bad">{error}</Banner> : null}

      {writings === null && !error ? (
        <p className="text-ink-soft font-semibold">Loading…</p>
      ) : null}

      {writings && writings.length === 0 ? (
        <div className="relative lined-paper rounded-[28px] border border-paper-edge p-10 flex flex-col items-center gap-4 text-center mt-2">
          <span
            aria-hidden="true"
            className="absolute -top-3 left-1/2 h-5 w-[4.25rem] -translate-x-1/2 rotate-[-6deg] rounded-[2px] bg-sun-wash"
          />
          <div className="relative flex items-center justify-center w-[170px] h-[170px]">
            <div aria-hidden="true" className="absolute inset-4 rounded-full bg-indigo-wash" />
            <div className="relative">
              <Inki size={140} equipped={{ held: "held-pencil" }} mood="think" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Nothing here yet</h2>
          <p className="text-ink-soft max-w-[420px]">
            Once you save a sentence, paragraph, or essay it will show up here so you can read it again.
          </p>
          <ButtonLink href="/app">Start writing</ButtonLink>
        </div>
      ) : null}

      {writings && writings.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {writings.map((w) => (
            <li key={w._id} className="lined-paper border border-paper-edge rounded-card p-6 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-[13px] font-bold uppercase tracking-wide ${TYPE_STYLE[w.type]}`}
                >
                  {w.type}
                </span>
                <span className="text-[14px] font-semibold text-ink-faint">
                  {formatDate(w.createdAt)} · {w.wordCount} {w.wordCount === 1 ? "word" : "words"}
                </span>
                <button
                  onClick={() => remove(w._id)}
                  className="ml-auto text-[14px] font-bold text-ink-faint hover:text-coral-deep"
                >
                  Delete
                </button>
              </div>

              {w.title ? <h2 className="text-xl font-bold">{w.title}</h2> : null}
              <p className="whitespace-pre-wrap leading-relaxed">{w.content}</p>
            </li>
          ))}
        </ul>
      ) : null}

      <Link href="/app" className="self-start font-bold text-indigo hover:text-coral-deep">
        ← Back to writing
      </Link>
    </div>
  );
}
