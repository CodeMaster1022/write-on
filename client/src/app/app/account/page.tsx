"use client";

import { useState } from "react";
import { Inki } from "@/components/Inki";
import { Banner, Button, Field, InkDrops, inputClass } from "@/components/ui";
import { ApiError, api, setToken } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function AccountPage() {
  const { user, applyUser } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [gradeLevel, setGradeLevel] = useState(user?.gradeLevel ?? "");
  const [classCode, setClassCode] = useState(user?.classCode ?? "");
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileErr, setProfileErr] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [claimErr, setClaimErr] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);

  if (!user) return null;

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileErr(null);
    setProfileMsg(null);
    setSavingProfile(true);
    try {
      const res = await api.updateMe({
        displayName,
        gradeLevel: gradeLevel || null,
        classCode: classCode || null,
      });
      applyUser(res.user);
      setProfileMsg("Saved!");
    } catch (err) {
      setProfileErr(err instanceof ApiError ? err.message : "Couldn't save that.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function claim(e: React.FormEvent) {
    e.preventDefault();
    setClaimErr(null);
    setClaiming(true);
    try {
      const res = await api.claimGuest({ email, password, displayName: displayName || undefined });
      setToken(res.token);
      applyUser(res.user);
    } catch (err) {
      setClaimErr(err instanceof ApiError ? err.message : "Couldn't save your account.");
    } finally {
      setClaiming(false);
    }
  }

  return (
    <div className="mx-auto max-w-[720px] px-5 py-8 flex flex-col gap-7">
      <header className="flex items-center gap-6">
        <div className="relative flex items-center justify-center w-[130px] h-[130px] shrink-0">
          <div aria-hidden="true" className="absolute inset-2 rounded-full bg-teal-wash" />
          <div className="relative">
            <Inki size={110} equipped={user.equipped} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <span
              className={`px-3 py-1 rounded-full text-[13px] font-bold ${
                user.isGuest
                  ? "bg-sun-wash text-[#8A6410]"
                  : user.role === "teacher"
                    ? "bg-indigo-wash text-indigo-deep"
                    : "bg-teal-wash text-teal-deep"
              }`}
            >
              {user.isGuest ? "Guest writer" : user.role === "teacher" ? "Teacher" : "Student"}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <InkDrops count={user.inkDrops} />
            <span className="text-[15px] font-semibold text-ink-soft">
              {user.writingCount} {user.writingCount === 1 ? "piece" : "pieces"} of writing
            </span>
          </div>
          {user.email ? <p className="text-[15px] text-ink-soft">{user.email}</p> : null}
          {user.gradeLevel ? (
            <p className="text-[15px] text-ink-faint">{user.gradeLevel}</p>
          ) : null}
        </div>
      </header>

      {user.isGuest ? (
        <section className="sticker relative bg-sun-wash border border-[#EFDDB0] rounded-[28px] p-7 flex flex-col gap-5">
          <span
            aria-hidden="true"
            className="absolute -top-2.5 left-8 h-4 w-12 rotate-[8deg] rounded-[2px] bg-coral-wash"
          />
          <div className="flex flex-col gap-1.5">
            <h2 className="text-2xl font-bold">Save your work</h2>
            <p className="text-ink-soft">
              Add an email and password to keep your writing, your {user.inkDrops} ink drops, and
              everything Inki is wearing.
            </p>
          </div>

          {claimErr ? <Banner tone="bad">{claimErr}</Banner> : null}

          <form onSubmit={claim} className="flex flex-col gap-5">
            <Field label="Email" htmlFor="claim-email">
              <input
                id="claim-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@school.org"
              />
            </Field>
            <Field label="Password" hint="At least 8 characters." htmlFor="claim-password">
              <input
                id="claim-password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
              />
            </Field>
            <Button type="submit" disabled={claiming} className="self-start px-8">
              {claiming ? "Saving…" : "Save my account"}
            </Button>
          </form>
        </section>
      ) : null}

      <section className="relative lined-paper border border-paper-edge rounded-[28px] p-7 flex flex-col gap-5 mt-2">
        <span
          aria-hidden="true"
          className="absolute -top-3 left-1/2 h-5 w-[4.25rem] -translate-x-1/2 rotate-[-6deg] rounded-[2px] bg-sun-wash"
        />
        <h2 className="text-2xl font-bold">Profile</h2>

        {profileErr ? <Banner tone="bad">{profileErr}</Banner> : null}
        {profileMsg ? <Banner tone="good">{profileMsg}</Banner> : null}

        <form onSubmit={saveProfile} className="flex flex-col gap-5">
          <Field label="Name" htmlFor="displayName">
            <input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={inputClass}
              maxLength={60}
              required
            />
          </Field>

          {user.role !== "teacher" ? (
          <Field label="Grade" hint="Optional." htmlFor="gradeLevel">
            <input
              id="gradeLevel"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className={inputClass}
              maxLength={20}
              placeholder="3rd"
            />
          </Field>
          ) : null}

          <Field
            label="Class code"
            hint={
              user.role === "teacher"
                ? "Students enter this code to join your roster."
                : "Your teacher will give you this if your class uses one."
            }
            htmlFor="classCode"
          >
            <input
              id="classCode"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              className={inputClass}
              maxLength={12}
              placeholder="RIVERA3"
            />
          </Field>

          <Button type="submit" variant="secondary" disabled={savingProfile} className="self-start px-8">
            {savingProfile ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </section>
    </div>
  );
}
