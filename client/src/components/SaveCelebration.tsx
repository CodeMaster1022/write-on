"use client";

import Link from "next/link";
import { Inki } from "./Inki";
import { ButtonLink, InkDrops } from "./ui";
import { useAuth } from "@/lib/auth-context";

/** Shown after any piece of writing is saved — the payoff moment. */
export function SaveCelebration({
  earned,
  content,
  onWriteAnother,
  label,
}: {
  earned: number;
  content: string;
  onWriteAnother: () => void;
  label: string;
}) {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-[720px] px-5 py-12 flex flex-col items-center gap-6 text-center">
      <div className="relative flex items-center justify-center w-[230px] h-[230px]">
        <div aria-hidden="true" className="absolute inset-5 rounded-full bg-coral-wash" />
        <div className="relative">
          <Inki size={190} equipped={user?.equipped} mood="cheer" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Look what you wrote!</h1>
        <p className="text-lg text-ink-soft">
          Your {label} is saved. You earned{" "}
          <span className="font-bold text-teal-deep">{earned} ink drops</span>.
        </p>
      </div>

      <div className="relative lined-paper w-full rounded-[28px] border border-paper-edge p-7 text-left mt-1">
        <span
          aria-hidden="true"
          className="absolute -top-3 left-1/2 h-5 w-[4.25rem] -translate-x-1/2 rotate-[-6deg] rounded-[2px] bg-sun-wash"
        />
        <p className="whitespace-pre-wrap text-lg leading-relaxed">{content}</p>
      </div>

      {user ? (
        <p className="flex items-center gap-2 text-ink-soft">
          Your total: <InkDrops count={user.inkDrops} />
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onWriteAnother}
          className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-full font-bold bg-coral text-white shadow-[0_10px_24px_rgba(232,95,66,0.3)] hover:bg-coral-deep transition-transform hover:-translate-y-0.5"
        >
          Write another
        </button>
        <ButtonLink href="/app/closet" variant="secondary">
          Spend ink drops
        </ButtonLink>
        <Link href="/app/library" className="font-bold text-indigo hover:text-coral-deep px-3">
          See all my writing
        </Link>
      </div>
    </div>
  );
}
