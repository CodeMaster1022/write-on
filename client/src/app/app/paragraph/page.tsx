"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Inki } from "@/components/Inki";
import { SaveCelebration } from "@/components/SaveCelebration";
import { Banner, Button, inputClass } from "@/components/ui";
import { ApiError, api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface Step {
  key: "topic" | "detailOne" | "detailTwo" | "detailThree" | "closing";
  label: string;
  hint: string;
  placeholder: string;
  optional?: boolean;
}

const STEPS: Step[] = [
  {
    key: "topic",
    label: "Topic sentence",
    hint: "Tell your reader what this paragraph is about. One sentence.",
    placeholder: "Octopuses are some of the smartest animals in the ocean.",
  },
  {
    key: "detailOne",
    label: "First detail",
    hint: "Give one fact, example, or reason that backs up your topic.",
    placeholder: "They can solve puzzles to get food out of a jar.",
  },
  {
    key: "detailTwo",
    label: "Second detail",
    hint: "Add another one. Try starting this sentence a different way.",
    placeholder: "Some octopuses use coconut shells as armour.",
  },
  {
    key: "detailThree",
    label: "Third detail",
    hint: "One more, if you have it.",
    placeholder: "Scientists have watched them recognise faces.",
    optional: true,
  },
  {
    key: "closing",
    label: "Closing sentence",
    hint: "Wrap it up. What should your reader remember?",
    placeholder: "There is a lot more going on in an octopus than eight arms.",
  },
];

type Parts = Record<Step["key"], string>;

const EMPTY: Parts = { topic: "", detailOne: "", detailTwo: "", detailThree: "", closing: "" };

function buildParagraph(parts: Parts): string {
  return STEPS.map((s) => parts[s.key].trim())
    .filter(Boolean)
    .join(" ");
}

export default function ParagraphBuilderPage() {
  const { applyUser } = useAuth();
  const [parts, setParts] = useState<Parts>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<{ earned: number; content: string } | null>(null);

  const paragraph = useMemo(() => buildParagraph(parts), [parts]);
  const complete =
    parts.topic.trim() !== "" && parts.detailOne.trim() !== "" && parts.closing.trim() !== "";

  const wordCount = paragraph.trim() ? paragraph.trim().split(/\s+/).length : 0;

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      const res = await api.saveWriting({
        type: "paragraph",
        title: parts.topic.trim().slice(0, 80),
        content: paragraph,
        parts,
      });
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
        label="paragraph"
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
      <Link href="/app" className="font-bold text-indigo hover:text-coral-deep self-start">
        ← Back
      </Link>

      <header className="flex items-center gap-5">
        <div className="relative hidden sm:flex items-center justify-center w-[110px] h-[110px] shrink-0">
          <div aria-hidden="true" className="absolute inset-2 rounded-full bg-indigo-wash" />
          <div className="relative">
            <Inki size={90} equipped={{ held: "held-book" }} decorative />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl sm:text-4xl font-bold">Paragraph Builder</h1>
          <p className="text-lg text-ink-soft">
            A strong paragraph has a topic sentence, details in the middle, and a closing. Build yours
            one piece at a time.
          </p>
        </div>
      </header>

      <div className="sticky top-3 z-10 lined-paper border border-paper-edge rounded-panel p-6 shadow-[0_12px_28px_rgba(62,52,98,0.10)] flex flex-col gap-2.5">
        <div className="flex items-center gap-3">
          <p className="flex-1 text-[13px] font-bold uppercase tracking-[0.06em] text-ink-faint">
            Your paragraph so far
          </p>
          <p className="text-[13px] font-bold text-ink-faint">{wordCount} words</p>
        </div>
        {paragraph ? (
          <p className="text-lg leading-relaxed">{paragraph}</p>
        ) : (
          <p className="text-lg text-ink-faint">Start with your topic sentence below…</p>
        )}
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

            <textarea
              id={step.key}
              value={parts[step.key]}
              onChange={(e) => setParts((p) => ({ ...p, [step.key]: e.target.value }))}
              className={`${inputClass} min-h-[92px] resize-y leading-relaxed`}
              placeholder={step.placeholder}
              maxLength={600}
              rows={2}
            />
          </li>
        ))}
      </ol>

      <div className="sticker bg-teal-wash border border-paper-edge rounded-card p-6 flex flex-col sm:flex-row items-center gap-4">
        <p className="flex-1 text-ink-soft">
          {complete
            ? "That's a full paragraph — save it to earn 15 ink drops."
            : "You need a topic sentence, at least one detail, and a closing."}
        </p>
        <Button onClick={handleSave} disabled={!complete || saving} className="w-full sm:w-auto px-8">
          {saving ? "Saving…" : "Save my paragraph"}
        </Button>
      </div>
    </div>
  );
}
