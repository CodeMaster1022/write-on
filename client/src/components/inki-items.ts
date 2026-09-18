import type { EquipSlot } from "@/lib/types";

/**
 * How each closet item is DRAWN. The server owns the economy (name, cost,
 * whether it's unlocked); the client owns the artwork, so Inki can be rendered
 * anywhere from `user.equipped` keys alone without a round trip.
 */
export interface ItemArt {
  art: string;
  color: string;
  slot: EquipSlot;
}

export const ITEM_ART: Record<string, ItemArt> = {
  "hat-top": { art: "topHat", color: "#FF7A5C", slot: "hat" },
  "hat-party": { art: "partyHat", color: "#F2A13B", slot: "hat" },
  "hat-crown": { art: "crown", color: "#FFC95C", slot: "hat" },
  "hat-grad": { art: "gradCap", color: "#2A2340", slot: "hat" },

  "neck-scarf": { art: "scarf", color: "#2FB6A3", slot: "neck" },
  "neck-medal": { art: "medal", color: "#FFC95C", slot: "neck" },
  "neck-bowtie": { art: "bowTie", color: "#E4577E", slot: "neck" },

  "held-pencil": { art: "pencil", color: "#F2A13B", slot: "held" },
  "held-book": { art: "book", color: "#5B4E8C", slot: "held" },
  "held-quill": { art: "quill", color: "#7FE3D2", slot: "held" },

  "scene-reef": { art: "reef", color: "#2FB6A3", slot: "scene" },
  "scene-library": { art: "library", color: "#5B4E8C", slot: "scene" },
  "scene-night": { art: "night", color: "#2A2340", slot: "scene" },
};

export const SLOT_LABELS: Record<EquipSlot, string> = {
  hat: "Hats",
  neck: "Around the neck",
  held: "In a tentacle",
  scene: "Backgrounds",
};
