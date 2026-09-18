import Link from "next/link";
import { Inki, ItemPreview } from "@/components/Inki";
import { LandingNav } from "@/components/LandingNav";
import { ButtonLink, Card, SectionHeading } from "@/components/ui";

const FEATURES = [
  {
    title: "Guided sentence building",
    body: "Students build a complete sentence piece by piece — article, noun, adjective, verb — so structure becomes something they can see and feel, not just hear about.",
    wash: "bg-indigo-wash",
    stroke: "#5B4E8C",
    tilt: "-rotate-1",
    tape: "rotate-[-8deg] bg-sun-wash",
    icon: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
      </>
    ),
  },
  {
    title: "Grows with the writer",
    body: "Sentence, paragraph, and essay tools share the same friendly scaffolding — so a student who starts in September can keep using Write on! all year as their writing gets longer.",
    wash: "bg-teal-wash",
    stroke: "#1C7A6C",
    tilt: "rotate-1",
    tape: "rotate-[6deg] bg-coral-wash",
    icon: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 13 9 5 9-5" />
      </>
    ),
  },
  {
    title: "A word coach built in",
    body: "Stuck on a dull word? Word help explains nouns, verbs, adjectives, and adverbs in kid-friendly language and offers vivid options to choose from.",
    wash: "bg-coral-wash",
    stroke: "#C44A2C",
    tilt: "-rotate-[0.6deg]",
    tape: "rotate-[-3deg] bg-teal-wash",
    icon: (
      <>
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M15.1 14a5 5 0 1 0-6.2 0c.7.6 1.1 1.2 1.1 2h4c0-.8.4-1.4 1.1-2Z" />
      </>
    ),
  },
];

const STEPS = [
  {
    title: "Pick what you're writing",
    body: "Sentence, paragraph, or essay. One choice, one clear screen — no menus to get lost in.",
    mood: "think" as const,
  },
  {
    title: "Build it with help nearby",
    body: "Fill in each part step by step. Every prompt has a help button when a student needs a reminder or an idea.",
    mood: "happy" as const,
  },
  {
    title: "See it come together",
    body: 'The finished writing appears in one piece — the moment where "I can\'t write" quietly turns into "look what I wrote."',
    mood: "cheer" as const,
  },
];

const TEACHER_POINTS = [
  {
    title: "No setup day required",
    body: "Runs in a browser on a Chromebook, tablet, or phone. Students can start as a guest in one tap.",
  },
  {
    title: "Works as a station",
    body: "Independent enough for centers, quiet time, or early finishers — without a teacher hovering over every step.",
  },
  {
    title: "Scaffolds, not answers",
    body: "Students choose every word themselves. Write on! supplies the structure and the nudge, never the finished sentence.",
  },
  {
    title: "Grammar in context",
    body: "Parts of speech are taught at the moment a student needs them, inside their own sentence — not on a worksheet.",
  },
];

const WORD_STICKERS = [
  { word: "The", className: "bg-indigo-wash text-indigo -rotate-8 top-3 left-2" },
  { word: "brave", className: "bg-teal-wash text-teal-deep rotate-6 top-8 right-2 sm:right-4" },
  { word: "octopus", className: "bg-coral-wash text-[#C44A2C] -rotate-3 bottom-36 left-2" },
  { word: "painted", className: "bg-sun-wash text-[#8A6410] rotate-8 bottom-40 right-2" },
];

function Check({ color = "#7FE3D2" }: { color?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 12"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none absolute -bottom-1 left-0 w-full ${className}`}
    >
      <path
        d="M2 8c12-6 18 6 30 0s18 6 30 0 18 6 30 0 18 6 26-2"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Wave({ className = "", fill = "#fbf6ec" }: { className?: string; fill?: string }) {
  return (
    <svg
      viewBox="0 0 1440 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block w-full h-8 ${className}`}
    >
      <path fill={fill} d="M0 24C240 48 480 0 720 16 960 32 1200 8 1440 24V0H0Z" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      <LandingNav />

      {/* HERO */}
      <section className="mx-auto w-full max-w-[1180px] px-6 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 flex flex-col items-start gap-6">
            <span className="px-4 py-2 bg-teal-wash text-teal-deep text-[13px] font-bold tracking-[0.08em] uppercase rounded-full">
              Writing support for young writers
            </span>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.06]">
              Every student has a story.
              <br />
              Let&apos;s help them{" "}
              <span className="relative inline-block text-coral">
                write it.
                <Squiggle className="text-coral" />
              </span>
            </h1>
            <p className="max-w-[520px] text-lg sm:text-xl leading-relaxed text-ink-soft">
              Write on! walks students from a single sentence to a finished essay — one guided step at a
              time, with a friendly companion named Inki cheering them on.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <ButtonLink href="/app" className="px-8 text-[17px]">
                Start writing free
              </ButtonLink>
              <ButtonLink href="#how" variant="ghost" className="px-7 text-[17px]">
                See how it works
              </ButtonLink>
            </div>
            <p className="text-[15px] text-ink-faint">
              Works in any browser — no app store, no student email required.
            </p>
          </div>

          <div className="w-full max-w-[480px] shrink-0">
            <div className="relative flex flex-col items-center pt-6 pb-2">
              <div
                aria-hidden="true"
                className="absolute top-8 left-1/2 -translate-x-1/2 w-[280px] h-[280px] rounded-full bg-teal-wash"
              />
              {WORD_STICKERS.map((s) => (
                <span
                  key={s.word}
                  className={`sticker absolute z-10 px-3 py-1.5 text-[13px] font-bold rounded-lg ${s.className}`}
                >
                  {s.word}
                </span>
              ))}
              <div className="relative z-[1] pt-4">
                <Inki size={210} equipped={{ held: "held-pencil" }} mood="cheer" decorative />
              </div>
              <div className="relative z-[1] -mt-4 w-full lined-paper rotate-1 rounded-2xl border border-paper-edge px-5 py-4 shadow-[0_16px_36px_rgba(62,52,98,0.1)]">
                <p className="font-display text-lg font-bold leading-snug">
                  The brave octopus painted a picture
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-teal-deep">
                  <Check color="#2FB6A3" />
                  Complete sentence — nice work!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEACHER-BUILT STRIP */}
      <section className="relative bg-indigo">
        <Wave />
        <div className="mx-auto max-w-[1180px] px-6 py-5 flex items-center justify-center gap-3.5">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0"
          >
            <path d="M22 10 12 5 2 10l10 5 10-5Z" />
            <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
          </svg>
          <p className="font-display text-lg sm:text-xl font-semibold text-white text-center">
            Designed by a classroom teacher who knows exactly where young writers get stuck.
          </p>
        </div>
        <Wave className="rotate-180" fill="#f3ead8" />
      </section>

      {/* FEATURES */}
      <section id="features" className="bulletin-board scroll-mt-24 px-6 py-20">
        <div className="mx-auto w-full max-w-[1180px] flex flex-col gap-12">
          <div className="flex justify-center">
            <SectionHeading
              center
              eyebrow="Chapter 1"
              title="Support at every sticking point"
              blurb={'Blank page. Boring words. "I don\'t know what to write." Write on! has a tool for each one.'}
            />
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {FEATURES.map((f) => (
              <Card key={f.title} className={`lift relative flex flex-col gap-4 ${f.tilt}`}>
                <span
                  aria-hidden="true"
                  className={`absolute -top-3 left-1/2 h-5 w-[4.25rem] -translate-x-1/2 rounded-[2px] opacity-90 ${f.tape}`}
                />
                <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ${f.wash}`}>
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={f.stroke}
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {f.icon}
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">{f.title}</h3>
                <p className="leading-relaxed text-ink-soft">{f.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="scroll-mt-24 bg-indigo-tint px-6 py-20">
        <div className="mx-auto max-w-[1180px] flex flex-col gap-12">
          <div className="flex justify-center">
            <SectionHeading
              center
              eyebrow="Chapter 2"
              title="Three taps to a finished sentence"
              blurb="Simple enough for a second grader to use alone, structured enough to actually teach."
            />
          </div>

          <ol className="relative grid gap-10 md:grid-cols-3 md:gap-7">
            <div
              aria-hidden="true"
              className="hidden md:block absolute top-[58px] left-[16%] right-[16%] border-t-[3px] border-dashed border-indigo/25"
            />
            <div
              aria-hidden="true"
              className="md:hidden absolute top-16 bottom-16 left-1/2 -translate-x-1/2 border-l-[3px] border-dashed border-indigo/25"
            />
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative flex flex-col items-center text-center gap-3.5">
                <div className="relative z-[1] flex items-center justify-center w-[116px] h-[116px] rounded-full bg-paper border border-paper-edge">
                  <Inki size={96} mood={s.mood} decorative />
                </div>
                <span className="font-display w-10 h-10 flex items-center justify-center bg-indigo text-white text-lg font-bold rounded-full">
                  {i + 1}
                </span>
                <h3 className="text-[22px] font-bold">{s.title}</h3>
                <p className="leading-relaxed text-ink-soft">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CLUB INKI */}
      <section id="inki" className="scroll-mt-24 mx-auto w-full max-w-[1180px] px-6 py-20">
        <div className="bg-indigo rounded-[32px] p-10 sm:p-14 flex flex-col lg:flex-row items-center gap-14 overflow-hidden relative">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-white/5"
          />
          <div className="flex-1 flex flex-col items-start gap-5 relative">
            <span className="px-4 py-2 bg-white/15 text-white text-[13px] font-bold tracking-[0.08em] uppercase rounded-full">
              Chapter 3 · Club Inki Closet
            </span>
            <h2 className="text-4xl sm:text-[42px] font-bold text-white leading-tight">
              One more sentence, one new hat for Inki
            </h2>
            <p className="max-w-[520px] text-lg leading-relaxed text-[#E8E2F5]">
              Finished writing earns ink drops students can spend dressing up their companion. It&apos;s a
              small, silly reason to come back tomorrow — and the reason reluctant writers keep going.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "Rewards for effort, not for being right",
                "No leaderboards, no comparing students",
                "Nothing to buy — every item is earned by writing",
              ].map((point) => (
                <li key={point} className="flex items-center gap-2.5 font-semibold text-white">
                  <Check />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full max-w-[380px] shrink-0 relative flex flex-col items-center gap-6">
            <svg
              viewBox="0 0 320 18"
              aria-hidden="true"
              className="w-full text-white/40"
            >
              <path d="M8 14h304" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <circle cx="12" cy="9" r="5" fill="currentColor" />
              <circle cx="308" cy="9" r="5" fill="currentColor" />
            </svg>
            <div className="w-full bg-white/10 border border-white/20 rounded-3xl p-8 flex flex-col items-center gap-6">
              <Inki
                size={190}
                equipped={{ hat: "hat-crown", neck: "neck-scarf" }}
                mood="cheer"
                decorative
              />
              <div className="w-full grid grid-cols-3 gap-3">
                <div className="sticker bg-white rounded-[14px] py-3 flex flex-col items-center gap-1 -rotate-2">
                  <ItemPreview itemKey="hat-crown" size={40} />
                  <span className="text-xs font-bold text-indigo-deep">Word Crown</span>
                </div>
                <div className="sticker bg-white rounded-[14px] py-3 flex flex-col items-center gap-1 rotate-2">
                  <ItemPreview itemKey="neck-scarf" size={40} />
                  <span className="text-xs font-bold text-indigo-deep">Scarf</span>
                </div>
                <div className="bg-white/20 border border-dashed border-white/60 rounded-[14px] py-3.5 flex flex-col items-center justify-center gap-1.5">
                  <span className="text-xl font-bold text-white">?</span>
                  <span className="text-xs font-bold text-white">Locked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOR TEACHERS */}
      <section id="teachers" className="scroll-mt-24 px-6 py-20">
        <div className="mx-auto max-w-[1180px] lined-paper rounded-[32px] border border-paper-edge p-8 sm:p-12 lg:p-14">
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
            <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-5">
              <Inki size={88} equipped={{ held: "held-book" }} mood="think" decorative />
              <SectionHeading
                eyebrow="Chapter 4"
                title="Made for real classrooms"
                blurb="Write on! was built by a teacher between lesson plans, for the students sitting in front of her. Every screen is shaped by what actually works at a desk on a Tuesday morning."
              />
              <ButtonLink href="/signup?role=teacher" variant="secondary" className="self-start mt-1">
                Bring it to your class
              </ButtonLink>
            </div>

            <div className="flex-1 grid gap-5 sm:grid-cols-2 w-full">
              {TEACHER_POINTS.map((p) => (
                <div
                  key={p.title}
                  className="bg-white/80 border border-paper-edge rounded-[18px] p-6 flex flex-col gap-2.5 border-l-4 border-l-coral"
                >
                  <h3 className="text-xl font-bold">{p.title}</h3>
                  <p className="text-[15px] leading-relaxed text-ink-soft">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-[860px] px-6 py-24 flex flex-col items-center gap-6 text-center">
        <div className="relative flex flex-col items-center gap-6">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 -translate-x-1/2 w-40 h-40 rounded-full bg-coral-wash"
          />
          <div className="relative">
            <Inki size={120} equipped={{ held: "held-pencil" }} mood="cheer" decorative />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-[1.1]">
            Ready to watch a reluctant writer finish a sentence?
          </h2>
          <p className="max-w-[580px] text-lg sm:text-xl leading-relaxed text-ink-soft">
            Open Write on! in a browser and try it the way your students will — no download, no account
            needed.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
            <ButtonLink href="/app" className="px-9 text-lg">
              Try Write on! free
            </ButtonLink>
            <ButtonLink href="#teachers" variant="ghost" className="px-8 text-lg">
              Teacher info
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-indigo-night px-6 pt-14 pb-10">
        <Wave className="absolute -top-7 left-0 right-0" />
        <div className="mx-auto max-w-[1180px] flex flex-col gap-10">
          <div className="flex flex-col md:flex-row items-start gap-12 md:gap-20">
            <div className="w-full md:w-[320px] shrink-0 flex flex-col gap-3.5">
              <div className="flex items-center gap-2.5">
                <Inki size={34} decorative />
                <span className="font-display text-2xl font-extrabold text-white">Write on!</span>
              </div>
              <p className="text-[15px] leading-relaxed text-[#B3AAC7]">
                Guided writing practice for young writers — helping every student find their words.
              </p>
            </div>

            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div className="flex flex-col gap-3">
                <h3 className="text-[15px] font-bold text-white tracking-[0.04em] uppercase">Product</h3>
                <a href="#features" className="text-[15px] text-[#B3AAC7] hover:text-white">
                  Features
                </a>
                <a href="#how" className="text-[15px] text-[#B3AAC7] hover:text-white">
                  How it works
                </a>
                <a href="#inki" className="text-[15px] text-[#B3AAC7] hover:text-white">
                  Club Inki Closet
                </a>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-[15px] font-bold text-white tracking-[0.04em] uppercase">
                  For teachers
                </h3>
                <a href="#teachers" className="text-[15px] text-[#B3AAC7] hover:text-white">
                  Classroom use
                </a>
                <Link href="/signup?role=teacher" className="text-[15px] text-[#B3AAC7] hover:text-white">
                  Create a class
                </Link>
                <Link href="/app" className="text-[15px] text-[#B3AAC7] hover:text-white">
                  Try the app
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-[15px] font-bold text-white tracking-[0.04em] uppercase">About</h3>
                <a href="#teachers" className="text-[15px] text-[#B3AAC7] hover:text-white">
                  Our story
                </a>
                <span className="text-[15px] text-[#8F86A6]">[CONTACT EMAIL]</span>
                <span className="text-[15px] text-[#8F86A6]">[PRIVACY POLICY]</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#423868] flex flex-wrap items-center gap-4">
            <p className="flex-1 text-sm text-[#8F86A6]">
              © {new Date().getFullYear()} Write on! · Made by a teacher, for teachers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
