"use client";

import Link from "next/link";
import { Inki } from "@/components/Inki";
import { useAuth } from "@/lib/auth-context";

const TASKS = [
  {
    href: "/app/sentence",
    title: "Sentence",
    blurb: "Build one strong sentence, part by part.",
    reward: 5,
    accent: "bg-teal-wash",
    stroke: "#1C7A6C",
    tilt: "-rotate-1",
    tape: "rotate-[-8deg] bg-sun-wash",
    icon: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h10" />
      </>
    ),
  },
  {
    href: "/app/paragraph",
    title: "Paragraph",
    blurb: "A topic sentence, details, and a closing.",
    reward: 15,
    accent: "bg-indigo-wash",
    stroke: "#5B4E8C",
    tilt: "rotate-1",
    tape: "rotate-[6deg] bg-coral-wash",
    icon: (
      <>
        <path d="M4 6h16" />
        <path d="M4 11h16" />
        <path d="M4 16h10" />
      </>
    ),
  },
  {
    href: "/app/essay",
    title: "Essay",
    blurb: "Plan an intro, body paragraphs, and an ending.",
    reward: 30,
    accent: "bg-coral-wash",
    stroke: "#C44A2C",
    tilt: "-rotate-[0.5deg]",
    tape: "rotate-[-3deg] bg-teal-wash",
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
  },
];

const EXTRAS = [
  { href: "/app/library", title: "My writing", blurb: "Everything you've finished." },
  { href: "/app/closet", title: "Club Inki Closet", blurb: "Spend ink drops on Inki's outfits." },
  { href: "/app/account", title: "My account", blurb: "Name, grade, and class code." },
];

export default function AppHome() {
  const { user } = useAuth();
  if (!user) return null;

  const firstName = user.displayName.split(" ")[0];

  return (
    <div className="mx-auto max-w-[1080px] px-5 py-10 flex flex-col gap-10">
      <section className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative flex items-center justify-center w-[160px] h-[160px] shrink-0">
          <div aria-hidden="true" className="absolute inset-3 rounded-full bg-teal-wash" />
          <div className="relative">
            <Inki size={140} equipped={user.equipped} mood="cheer" />
          </div>
        </div>
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Hi {firstName}! What are we{" "}
            <span className="relative inline-block text-coral">
              writing
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
            </span>{" "}
            today?
          </h1>
          <p className="text-lg text-ink-soft">
            {user.writingCount === 0
              ? "Pick a size below. Inki will help you along the way."
              : `You've finished ${user.writingCount} ${
                  user.writingCount === 1 ? "piece" : "pieces"
                } of writing so far. Keep going!`}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="text-2xl font-bold">Start writing</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TASKS.map((task) => (
            <Link
              key={task.href}
              href={task.href}
              className={`lift group relative bg-white border border-paper-edge rounded-card p-7 flex flex-col gap-4 ${task.tilt}`}
            >
              <span
                aria-hidden="true"
                className={`absolute -top-3 left-1/2 h-5 w-[4.25rem] -translate-x-1/2 rounded-[2px] opacity-90 ${task.tape}`}
              />
              <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ${task.accent}`}>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={task.stroke}
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {task.icon}
                </svg>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-2xl font-bold group-hover:text-indigo">{task.title}</h3>
                <p className="text-ink-soft leading-relaxed">{task.blurb}</p>
              </div>
              <p className="mt-auto pt-2 text-[15px] font-bold text-teal-deep">
                Earns {task.reward} ink drops
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="text-2xl font-bold">Other places to go</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {EXTRAS.map((extra) => (
            <Link
              key={extra.href}
              href={extra.href}
              className="sticker bg-indigo-tint rounded-[18px] px-6 py-5 flex flex-col gap-1 hover:bg-indigo-wash transition-colors"
            >
              <span className="font-bold text-indigo-deep text-lg">{extra.title}</span>
              <span className="text-[15px] text-ink-soft">{extra.blurb}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
