export type Role = "student" | "teacher";
export type WritingType = "sentence" | "paragraph" | "essay";
export type PartOfSpeech = "noun" | "verb" | "adjective" | "adverb" | "article";
export type EquipSlot = "hat" | "neck" | "held" | "scene";

export interface Equipped {
  hat: string | null;
  neck: string | null;
  held: string | null;
  scene: string | null;
}

export interface User {
  id: string;
  displayName: string;
  email: string | null;
  role: Role;
  isGuest: boolean;
  gradeLevel: string | null;
  classCode: string | null;
  inkDrops: number;
  ownedItems: string[];
  equipped: Equipped;
  writingCount: number;
  lastWroteAt: string | null;
}

export interface Writing {
  _id: string;
  userId: string;
  type: WritingType;
  title: string;
  content: string;
  parts: Record<string, unknown>;
  wordCount: number;
  inkDropsEarned: number;
  createdAt: string;
  updatedAt: string;
}

export interface WordEntry {
  _id: string;
  word: string;
  partOfSpeech: PartOfSpeech;
  meaning: string;
  example: string;
  tier: 1 | 2 | 3;
}

export interface RewardItem {
  _id: string;
  key: string;
  name: string;
  slot: EquipSlot;
  cost: number;
  art: string;
  color: string;
  blurb: string;
  sortOrder: number;
  owned: boolean;
  affordable: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ClassStudent {
  _id: string;
  displayName: string;
  gradeLevel: string | null;
  writingCount: number;
  lastWroteAt: string | null;
  inkDrops: number;
}
