"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Inki } from "@/components/Inki";
import { SaveCelebration } from "@/components/SaveCelebration";
import { Banner, Button, inputClass } from "@/components/ui";
import { ApiError, api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface Step {
  key: "title" | "hook" | "thesis" | "bodyOne" | "bodyTwo" | "bodyThree" | "conclusion";
  label: string;
  hint: string;
  placeholder: string;
  long?: boolean;
  optional?: boolean;
}

const STEPS: Step[] = [
  {
    key: "title",
    label: "Title",
    hint: "What are you writing about?",
    placeholder: "Why Octopuses Deserve More Credit",
  },
  {
    key: "hook",
    label: "Hook",
    hint: "One sentence to make your reader curious. A question or a surprising fact works well.",
    placeholder: "Imagine an animal that can taste with its arms.",
  },
  {
    key: "thesis",
    label: "Main idea (thesis)",
    hint: "In one sentence, what is your whole essay trying to prove?",
    placeholder: "Octopuses are far more intelligent than most people realise.",
  },
  {
    key: "bodyOne",
    label: "First body paragraph",
    hint: "Your strongest reason, plus details that back it up.",
    placeholder: "First, octopuses solve problems…",
    long: true,
  },
  {
    key: "bodyTwo",
    label: "Second body paragraph",
    hint: "Another reason. Try starting it with a different transition word.",
    placeholder: "In addition, octopuses use tools…",
    long: true,
  },
  {
    key: "bodyThree",
    label: "Third body paragraph",
    hint: "One more reason, if your essay needs it.",
    placeholder: "Finally, octopuses can recognise people…",
    long: true,
    optional: true,
  },
  {
    key: "conclusion",
    label: "Conclusion",
    hint: "Remind your reader of your main idea and leave them with a thought.",
    placeholder: "The next time you see an octopus…",
    long: true,
  },
];

type Parts = Record<Step["key"], string>;

const EMPTY: Parts = {
  title: "",
  hook: "",
  thesis: "",
  bodyOne: "",
  bodyTwo: "",
  bodyThree: "",
  conclusion: "",
};

function buildEssay(parts: Parts): string {
  const intro = [parts.hook.trim(), parts.thesis.trim()].filter(Boolean).join(" ");

  const paragraphs = [
    intro,
    parts.bodyOne.trim(),
    parts.bodyTwo.trim(),
    parts.bodyThree.trim(),
    parts.conclusion.trim(),
  ].filter(Boolean);

  return paragraphs.join("\n\n");
}

export default function EssayBuilderPage() {
  const { applyUser } = useAuth();
  const [parts, setParts] = useState<Parts>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<{ earned: number; content: string } | null>(null);

  const essay = useMemo(() => buildEssay(parts), [parts]);
  const complete =
    parts.thesis.trim() !== "" && parts.bodyOne.trim() !== "" && parts.conclusion.trim() !== "";

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;
  const done = STEPS.filter((s) => parts[s.key].trim() !== "").length;

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      const res = await api.saveWriting({
        type: "essay",
        title: parts.title.trim() || "Untitled essay",
        content: essay,
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
        label="essay"
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
    <div className="mx-auto max-w-[820px] px-5 py-8 flex flex-col gap-6">
      <Link href="/app" className="font-bold text-indigo hover:text-coral-deep self-start">
        ← Back
      </Link>

      <header className="flex items-center gap-5">
        <div className="relative hidden sm:flex items-center justify-center w-[110px] h-[110px] shrink-0">
          <div aria-hidden="true" className="absolute inset-2 rounded-full bg-coral-wash" />
          <div className="relative">
            <Inki size={90} equipped={{ hat: "hat-grad", held: "held-quill" }} decorative />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl sm:text-4xl font-bold">Essay Planner</h1>
          <p className="text-lg text-ink-soft">
            An essay is just paragraphs in a good order. Plan each part here, then read the whole thing
            at the top.
          </p>
        </div>
      </header>

      <div className="sticky top-3 z-10 lined-paper border border-paper-edge rounded-panel p-6 shadow-[0_12px_28px_rgba(62,52,98,0.10)] flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <p className="flex-1 text-[13px] font-bold uppercase tracking-[0.06em] text-ink-faint">
            {parts.title.trim() || "Your essay so far"}
          </p>
          <p className="text-[13px] font-bold text-ink-faint">{wordCount} words</p>
        </div>

        {/* Progress across the essay's parts — long writing needs a sense of momentum. */}
        <div className="flex gap-1.5" role="presentation">
          {STEPS.map((s) => (
            <span
              key={s.key}
              className={`h-2 flex-1 rounded-full ${
                parts[s.key].trim() ? "bg-teal" : "bg-indigo-wash"
              }`}
            />
          ))}
        </div>
        <p className="text-[13px] font-semibold text-ink-faint">
          {done} of {STEPS.length} parts started
        </p>

        {essay ? (
          <p className="max-h-[220px] overflow-y-auto whitespace-pre-wrap leading-relaxed">{essay}</p>
        ) : (
          <p className="text-ink-faint">Start with a hook below…</p>
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

            {step.key === "title" ? (
              <input
                id={step.key}
                value={parts[step.key]}
                onChange={(e) => setParts((p) => ({ ...p, [step.key]: e.target.value }))}
                className={inputClass}
                placeholder={step.placeholder}
                maxLength={140}
              />
            ) : (
              <textarea
                id={step.key}
                value={parts[step.key]}
                onChange={(e) => setParts((p) => ({ ...p, [step.key]: e.target.value }))}
                className={`${inputClass} resize-y leading-relaxed ${step.long ? "min-h-[150px]" : "min-h-[92px]"}`}
                placeholder={step.placeholder}
                maxLength={4000}
                rows={step.long ? 5 : 2}
              />
            )}
          </li>
        ))}
      </ol>

      <div className="sticker bg-teal-wash border border-paper-edge rounded-card p-6 flex flex-col sm:flex-row items-center gap-4">
        <p className="flex-1 text-ink-soft">
          {complete
            ? "Your essay has a main idea, a body, and a conclusion — save it to earn 30 ink drops."
            : "You need a main idea, at least one body paragraph, and a conclusion."}
        </p>
        <Button onClick={handleSave} disabled={!complete || saving} className="w-full sm:w-auto px-8">
          {saving ? "Saving…" : "Save my essay"}
        </Button>
      </div>
    </div>
  );
}
