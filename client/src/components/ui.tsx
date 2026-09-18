import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "quiet";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-coral text-white shadow-[0_10px_24px_rgba(232,95,66,0.3)] hover:bg-coral-deep",
  secondary: "bg-indigo text-white hover:bg-indigo-deep",
  ghost: "bg-white text-indigo border-2 border-indigo-wash hover:border-indigo",
  quiet: "bg-indigo-wash text-indigo-deep hover:bg-indigo-tint",
};

const BASE =
  "inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-full font-bold text-base transition-transform duration-100 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={`${BASE} ${VARIANTS[variant]} ${className}`} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${BASE} ${VARIANTS[variant]} ${className}`} {...props} />;
}

export function Card({
  children,
  className = "",
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  return (
    <As className={`bg-white border border-paper-edge rounded-card p-7 ${className}`}>{children}</As>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  htmlFor: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="font-bold text-ink text-[15px]">
        {label}
      </label>
      {hint ? <p className="text-sm text-ink-soft -mt-1">{hint}</p> : null}
      {children}
      {error ? (
        <p role="alert" className="text-sm font-semibold text-coral-deep">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const inputClass =
  "w-full min-h-[52px] px-4 py-3 bg-white border-2 border-paper-edge rounded-xl text-[17px] text-ink placeholder:text-ink-faint focus:border-indigo focus:outline-none";

export function Banner({
  tone = "info",
  children,
}: {
  tone?: "info" | "good" | "bad";
  children: ReactNode;
}) {
  const tones = {
    info: "bg-indigo-wash text-indigo-deep",
    good: "bg-teal-wash text-teal-deep",
    bad: "bg-coral-wash text-coral-deep",
  };

  return (
    <div role={tone === "bad" ? "alert" : "status"} className={`rounded-xl px-4 py-3 font-semibold ${tones[tone]}`}>
      {children}
    </div>
  );
}

export function InkDrops({ count, className = "" }: { count: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-wash font-bold text-indigo-deep ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2.5c4 5 7 8.6 7 12.1a7 7 0 1 1-14 0C5 11.1 8 7.5 12 2.5Z"
          fill="currentColor"
        />
      </svg>
      {count}
      <span className="sr-only"> ink drops</span>
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  blurb,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  blurb?: string;
  center?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-3 ${center ? "items-center text-center" : "items-start"}`}>
      {eyebrow ? (
        <span className="px-4 py-2 bg-teal-wash text-teal-deep text-[13px] font-bold tracking-[0.08em] uppercase rounded-full">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-4xl sm:text-[44px] font-bold text-ink leading-tight">{title}</h2>
      {blurb ? <p className="max-w-[620px] text-lg leading-relaxed text-ink-soft">{blurb}</p> : null}
    </div>
  );
}
