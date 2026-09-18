"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Inki } from "@/components/Inki";
import { SaveCelebration } from "@/components/SaveCelebration";
import { POS_THEME, WordHelp } from "@/components/WordHelp";
import { Banner, Button, inputClass } from "@/components/ui";
import { ApiError, api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { PartOfSpeech } from "@/lib/types";

interface Step {
  key: "article" | "adjective" | "noun" | "verb" | "adverb" | "detail";
  pos: PartOfSpeech | null;
  label: string;
  hint: string;
  placeholder: string;
  optional?: boolean;
}

const STEPS: Step[] = [
  {
    key: "article",
    pos: "article",
    label: "Start with an article",
    hint: "The, A, or An.",
    placeholder: "The",
  },
  {
    key: "adjective",
    pos: "adjective",
    label: "Add a describing word",
    hint: "What is your noun like?",
    placeholder: "brave",
    optional: true,
  },
  {
    key: "noun",
    pos: "noun",
    label: "Who or what is your sentence about?",
    hint: "This is your noun.",
    placeholder: "octopus",
  },
  {
    key: "verb",
    pos: "verb",
    label: "What did they do?",
    hint: "This is your verb — the action.",
    placeholder: "painted",
  },
  {
    key: "adverb",
    pos: "adverb",
    label: "How did they do it?",
    hint: "This is your adverb. Many end in -ly.",
    placeholder: "swiftly",
    optional: true,
  },
  {
    key: "detail",
    pos: null,
    label: "Anything else to add?",
    hint: "A few extra words to finish the picture.",
    placeholder: "in the moonlight",
    optional: true,
  },
];

type Parts = Record<Step["key"], string>;

const EMPTY: Parts = { article: "", adjective: "", noun: "", verb: "", adverb: "", detail: "" };

function buildSentence(parts: Parts): string {
  const words = [parts.article, parts.adjective, parts.noun, parts.verb, parts.adverb, parts.detail]
    .map((w) => w.trim())
    .filter(Boolean);

  if (words.length === 0) return "";

  const joined = words.join(" ");
  const capitalized = joined.charAt(0).toUpperCase() + joined.slice(1);
  return /[.!?]$/.test(capitalized) ? capitalized : `${capitalized}.`;
}

export default function SentenceBuilderPage() {
  const { applyUser } = useAuth();
  const [parts, setParts] = useState<Parts>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<{ earned: number; content: string } | null>(null);

  const sentence = useMemo(() => buildSentence(parts), [parts]);
  const complete = parts.noun.trim() !== "" && parts.verb.trim() !== "";

  function update(key: Step["key"], value: string) {
    setParts((p) => ({ ...p, [key]: value }));
  }

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      const res = await api.saveWriting({ type: "sentence", content: sentence, parts });
      applyUser(res.user);
      setSaved({ earned: res.inkDropsEarned, content: res.writing.content });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't save that. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (saved) {
    return (
      <SaveCelebration
        label="sentence"
        earned={saved.earned}
        content={saved.content}
        onWriteAnother={() => {
          setParts(EMPTY);
          setSaved(null);
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-[800px] px-5 py-8 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/app" className="font-bold text-indigo hover:text-coral-deep">
          ← Back
        </Link>
      </div>

      <header className="flex items-center gap-5">
        <div className="relative hidden sm:flex items-center justify-center w-[110px] h-[110px] shrink-0">
          <div aria-hidden="true" className="absolute inset-2 rounded-full bg-teal-wash" />
          <div className="relative">
            <Inki size={90} equipped={{ held: "held-pencil" }} decorative />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl sm:text-4xl font-bold">Sentence Builder</h1>
          <p className="text-lg text-ink-soft">
            Fill in the parts one at a time. Your sentence builds itself at the top as you go.
          </p>
        </div>
      </header>

      {/* Live preview — always visible while scrolling through the steps. */}
      <div className="sticky top-3 z-10 lined-paper border border-paper-edge rounded-panel p-6 shadow-[0_12px_28px_rgba(62,52,98,0.10)] flex flex-col gap-3">
        <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-ink-faint">
          Your sentence so far
        </p>

        {sentence ? (
          <p className="text-2xl leading-snug font-semibold">{sentence}</p>
        ) : (
          <p className="text-2xl leading-snug text-ink-faint">Start below and watch it appear…</p>
        )}

        <div className="flex flex-wrap gap-2">
          {STEPS.filter((s) => s.pos && parts[s.key].trim()).map((s) => {
            const theme = POS_THEME[s.pos!];
            return (
              <span
                key={s.key}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-bold ${theme.chip} ${theme.text}`}
              >
                {theme.label}: {parts[s.key].trim()}
              </span>
            );
          })}
        </div>
      </div>

      {error ? <Banner tone="bad">{error}</Banner> : null}

      <ol className="flex flex-col gap-5 pt-2">
        {STEPS.map((step, i) => (
          <li key={step.key} className="relative bg-white border border-paper-edge rounded-card p-6 flex flex-col gap-4">
            <span
              aria-hidden="true"
              className="absolute -top-2.5 left-8 h-4 w-12 rotate-[-6deg] rounded-[2px] bg-sun-wash"
            />
            <div className="flex items-start gap-4">
              <span className="font-display shrink-0 w-10 h-10 flex items-center justify-center bg-indigo-wash text-indigo-deep text-lg font-bold rounded-xl">
                {i + 1}
              </span>
              <div className="flex flex-col gap-1">
                <label htmlFor={step.key} className="text-xl font-bold">
                  {step.label}
                  {step.optional ? (
                    <span className="ml-2 text-[13px] font-semibold uppercase tracking-wide text-ink-faint">
                      optional
                    </span>
                  ) : null}
                </label>
                <p className="text-ink-soft">{step.hint}</p>
              </div>
            </div>

            <input
              id={step.key}
              value={parts[step.key]}
              onChange={(e) => update(step.key, e.target.value)}
              className={inputClass}
              placeholder={step.placeholder}
              maxLength={80}
            />

            {step.pos ? <WordHelp partOfSpeech={step.pos} onPick={(w) => update(step.key, w)} /> : null}
          </li>
        ))}
      </ol>

      <div className="sticker bg-teal-wash border border-paper-edge rounded-card p-6 flex flex-col sm:flex-row items-center gap-4">
        <p className="flex-1 text-ink-soft">
          {complete
            ? "Looks like a complete sentence — save it to earn 5 ink drops."
            : "A complete sentence needs at least a noun and a verb."}
        </p>
        <Button onClick={handleSave} disabled={!complete || saving} className="w-full sm:w-auto px-8">
          {saving ? "Saving…" : "Save my sentence"}
        </Button>
      </div>
    </div>
  );
}
