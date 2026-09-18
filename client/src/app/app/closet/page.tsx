"use client";

import { useEffect, useState } from "react";
import { Inki, ItemPreview } from "@/components/Inki";
import { SLOT_LABELS } from "@/components/inki-items";
import { Banner, Button, ButtonLink, InkDrops } from "@/components/ui";
import { ApiError, api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { EquipSlot, RewardItem } from "@/lib/types";

const SLOT_ORDER: EquipSlot[] = ["hat", "neck", "held", "scene"];

export default function ClosetPage() {
  const { user, applyUser } = useAuth();
  const [items, setItems] = useState<RewardItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    api
      .rewards()
      .then(({ items }) => setItems(items))
      .catch(() => setError("Couldn't open the closet. Is the API running?"));
  }, []);

  async function reload() {
    const { items } = await api.rewards();
    setItems(items);
  }

  async function unlock(item: RewardItem) {
    setError(null);
    setNotice(null);
    setPending(item.key);
    try {
      const res = await api.unlock(item.key);
      applyUser(res.user);
      await reload();
      setNotice(`${item.name} unlocked — Inki is wearing it now!`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't unlock that item.");
    } finally {
      setPending(null);
    }
  }

  async function equip(slot: EquipSlot, key: string | null) {
    setError(null);
    setNotice(null);
    setPending(key ?? `${slot}-off`);
    try {
      const res = await api.equip(slot, key);
      applyUser(res.user);
      await reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't change that.");
    } finally {
      setPending(null);
    }
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-[1080px] px-5 py-8 flex flex-col gap-8">
      <header className="relative flex flex-col lg:flex-row items-center gap-8 bg-indigo rounded-[32px] p-8 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-white/5"
        />
        <div className="relative bg-white/10 border border-white/20 rounded-3xl p-6">
          <Inki size={200} equipped={user.equipped} mood="cheer" />
        </div>
        <div className="flex flex-col gap-3 text-center lg:text-left">
          <h1 className="text-4xl font-bold text-white">Club Inki Closet</h1>
          <p className="text-lg leading-relaxed text-[#E8E2F5] max-w-[480px]">
            Every piece of writing earns ink drops. Spend them here — everything is earned by writing,
            never bought.
          </p>
          <p className="flex items-center justify-center lg:justify-start gap-2 text-white font-bold">
            You have <InkDrops count={user.inkDrops} className="bg-white/20 text-white" />
          </p>
        </div>
      </header>

      {error ? <Banner tone="bad">{error}</Banner> : null}
      {notice ? <Banner tone="good">{notice}</Banner> : null}

      {items === null && !error ? (
        <p className="text-ink-soft font-semibold">Opening the closet…</p>
      ) : null}

      {items && items.length === 0 ? (
        <div className="relative lined-paper rounded-[28px] border border-paper-edge p-10 flex flex-col items-center gap-4 text-center mt-2">
          <span
            aria-hidden="true"
            className="absolute -top-3 left-1/2 h-5 w-[4.25rem] -translate-x-1/2 rotate-[-6deg] rounded-[2px] bg-sun-wash"
          />
          <div className="relative flex items-center justify-center w-[170px] h-[170px]">
            <div aria-hidden="true" className="absolute inset-4 rounded-full bg-indigo-wash" />
            <div className="relative">
              <Inki size={140} equipped={user.equipped} mood="think" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">The closet is still empty</h2>
          <p className="text-ink-soft max-w-[420px]">
            Earn ink drops by finishing a piece of writing, then come back to pick out a new look for
            Inki.
          </p>
          <ButtonLink href="/app">Start writing</ButtonLink>
        </div>
      ) : null}

      {items
        ? SLOT_ORDER.map((slot) => {
            const slotItems = items.filter((i) => i.slot === slot);
            if (slotItems.length === 0) return null;

            const equippedKey = user.equipped[slot];

            return (
              <section key={slot} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold">{SLOT_LABELS[slot]}</h2>
                  {equippedKey ? (
                    <button
                      onClick={() => equip(slot, null)}
                      disabled={pending !== null}
                      className="text-[15px] font-bold text-ink-faint hover:text-coral-deep disabled:opacity-50"
                    >
                      Take off
                    </button>
                  ) : null}
                </div>

                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {slotItems.map((item) => {
                    const isEquipped = equippedKey === item.key;
                    const busy = pending === item.key;

                    return (
                      <li
                        key={item.key}
                        className={`sticker bg-white rounded-card p-5 flex flex-col gap-3 border-2 ${
                          isEquipped ? "border-teal" : "border-paper-edge"
                        }`}
                      >
                        <div className="h-[72px] flex items-center justify-center bg-paper rounded-xl">
                          <ItemPreview itemKey={item.key} size={64} />
                        </div>

                        <div className="flex flex-col gap-1">
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          {item.blurb ? (
                            <p className="text-[14px] leading-snug text-ink-soft">{item.blurb}</p>
                          ) : null}
                        </div>

                        <div className="mt-auto pt-1">
                          {item.owned ? (
                            isEquipped ? (
                              <p className="flex items-center gap-1.5 font-bold text-teal-deep text-[15px]">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                                  <path d="M20 6 9 17l-5-5" />
                                </svg>
                                Wearing it
                              </p>
                            ) : (
                              <Button
                                variant="quiet"
                                onClick={() => equip(slot, item.key)}
                                disabled={pending !== null}
                                className="w-full min-h-[44px] text-[15px]"
                              >
                                {busy ? "…" : "Wear it"}
                              </Button>
                            )
                          ) : (
                            <Button
                              variant={item.affordable ? "primary" : "ghost"}
                              onClick={() => unlock(item)}
                              disabled={!item.affordable || pending !== null}
                              className="w-full min-h-[44px] text-[15px]"
                            >
                              {busy ? "Unlocking…" : `${item.cost} drops`}
                            </Button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })
        : null}
    </div>
  );
}
