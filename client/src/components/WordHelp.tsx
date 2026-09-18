"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { PartOfSpeech, WordEntry } from "@/lib/types";

/** One theme per part of speech, reused by the builder chips so colour carries meaning. */
export const POS_THEME: Record<
  PartOfSpeech,
  { label: string; chip: string; text: string; wash: string; border: string }
> = {
  article: {
    label: "Article",
    chip: "bg-indigo-wash",
    text: "text-indigo",
    wash: "bg-indigo-tint",
    border: "border-indigo",
  },
  adjective: {
    label: "Adjective",
    chip: "bg-teal-wash",
    text: "text-teal-deep",
    wash: "bg-teal-wash",
    border: "border-teal",
  },
  noun: {
    label: "Noun",
    chip: "bg-coral-wash",
    text: "text-[#C44A2C]",
    wash: "bg-coral-wash",
    border: "border-coral",
  },
  verb: {
    label: "Verb",
    chip: "bg-sun-wash",
    text: "text-[#8A6410]",
    wash: "bg-sun-wash",
    border: "border-sun",
  },
  adverb: {
    label: "Adverb",
    chip: "bg-[#EFE9F8]",
    text: "text-indigo-deep",
    wash: "bg-indigo-wash",
    border: "border-indigo",
  },
};

/** Kid-facing explanations, in the voice the MVP already used. */
export const POS_EXPLAINER: Record<PartOfSpeech, string> = {
  article:
    "Articles are the little words that go in front of a noun. Use “the” when you mean a certain one, “a” for any one, and “an” before a vowel sound.",
  noun: "A noun is a person, place, or thing. If you can put “the” in front of it, it's probably a noun.",
  verb: "A verb is the action — it's what someone or something DOES. Ran, painted, shouted: all verbs.",
  adjective:
    "Adjectives describe NOUNS. They tell you what the noun is like. A mouse could be fat, thin, brown, or white — those details help our brains draw a picture.",
  adverb:
    "Adverbs tell HOW the action happened, and they usually end in -ly. I wrote my sentences for homework. How did I write them? Swiftly!",
};

export function WordHelp({
  partOfSpeech,
  onPick,
}: {
  partOfSpeech: PartOfSpeech;
  onPick: (word: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [words, setWords] = useState<WordEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const theme = POS_THEME[partOfSpeech];

  useEffect(() => {
    if (!open || words) return;
    api
      .words({ partOfSpeech, limit: 12 })
      .then(({ words }) => setWords(words))
      .catch(() => setError("Couldn't load word ideas right now."));
  }, [open, words, partOfSpeech]);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`self-start inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full font-bold text-[15px] ${theme.chip} ${theme.text} hover:brightness-95`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9.5" />
          <path d="M12 16v-4M12 8.5h.01" />
        </svg>
        {open ? `Hide ${theme.label.toLowerCase()} help` : `${theme.label} help`}
      </button>

      {open ? (
        <div className={`rounded-xl p-5 flex flex-col gap-4 ${theme.wash}`}>
          <p className="leading-relaxed text-ink">{POS_EXPLAINER[partOfSpeech]}</p>

          {error ? <p className="font-semibold text-coral-deep">{error}</p> : null}

          {words === null && !error ? (
            <p className="text-ink-soft font-semibold">Finding some good words…</p>
          ) : null}

          {words && words.length > 0 ? (
            <div className="flex flex-col gap-2">
              <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-ink-faint">
                Tap one to use it
              </p>
              <ul className="flex flex-col gap-2">
                {words.map((w) => (
                  <li key={w._id}>
                    <button
                      type="button"
                      onClick={() => onPick(w.word)}
                      className="w-full text-left bg-white/80 hover:bg-white rounded-lg px-4 py-3 min-h-[44px] flex flex-col gap-0.5 transition-colors"
                    >
                      <span className="font-bold text-ink">{w.word}</span>
                      {w.meaning ? <span className="text-[14px] text-ink-soft">{w.meaning}</span> : null}
                      {w.example ? (
                        <span className="text-[14px] italic text-ink-faint">{w.example}</span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
