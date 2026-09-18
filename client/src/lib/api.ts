import type {
  AuthResponse,
  ClassStudent,
  Equipped,
  EquipSlot,
  RewardItem,
  User,
  WordEntry,
  Writing,
  WritingType,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const TOKEN_KEY = "writeon.token";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (res.status === 204) return undefined as T;

  const payload = await res.json().catch(() => ({}) as Record<string, unknown>);

  if (!res.ok) {
    const message =
      typeof payload.error === "string" ? payload.error : "Something went wrong. Please try again.";
    throw new ApiError(res.status, message, payload.details);
  }

  return payload as T;
}

export const api = {
  // --- auth ---
  register: (body: {
    displayName: string;
    email: string;
    password: string;
    role?: "student" | "teacher";
    gradeLevel?: string;
    classCode?: string;
  }) => request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  guest: (displayName?: string) =>
    request<AuthResponse>("/auth/guest", {
      method: "POST",
      body: JSON.stringify(displayName ? { displayName } : {}),
    }),

  me: () => request<{ user: User }>("/auth/me"),

  updateMe: (body: { displayName?: string; gradeLevel?: string | null; classCode?: string | null }) =>
    request<{ user: User }>("/auth/me", { method: "PATCH", body: JSON.stringify(body) }),

  claimGuest: (body: { email: string; password: string; displayName?: string }) =>
    request<AuthResponse>("/auth/claim-guest", { method: "POST", body: JSON.stringify(body) }),

  // --- writing ---
  listWritings: (type?: WritingType) =>
    request<{ writings: Writing[] }>(`/writings${type ? `?type=${type}` : ""}`),

  getWriting: (id: string) => request<{ writing: Writing }>(`/writings/${id}`),

  saveWriting: (body: {
    type: WritingType;
    title?: string;
    content: string;
    parts?: Record<string, unknown>;
  }) =>
    request<{ writing: Writing; inkDropsEarned: number; user: User }>("/writings", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  deleteWriting: (id: string) => request<void>(`/writings/${id}`, { method: "DELETE" }),

  // --- word bank ---
  words: (params: { partOfSpeech?: string; tier?: number; q?: string; limit?: number } = {}) => {
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== "") search.set(k, String(v));
    }
    const qs = search.toString();
    return request<{ words: WordEntry[] }>(`/wordbank${qs ? `?${qs}` : ""}`);
  },

  groupedWords: () =>
    request<{ grouped: Record<string, WordEntry[]> }>("/wordbank/grouped"),

  // --- closet ---
  rewards: () =>
    request<{ items: RewardItem[]; inkDrops: number; equipped: Equipped }>("/rewards"),

  unlock: (key: string) =>
    request<{ item: RewardItem; user: User }>("/rewards/unlock", {
      method: "POST",
      body: JSON.stringify({ key }),
    }),

  equip: (slot: EquipSlot, key: string | null) =>
    request<{ user: User }>("/rewards/equip", {
      method: "POST",
      body: JSON.stringify({ slot, key }),
    }),

  // --- teacher ---
  roster: () => request<{ classCode: string; students: ClassStudent[] }>("/teacher/students"),

  studentWritings: (id: string) =>
    request<{
      student: { id: string; displayName: string; gradeLevel: string | null; writingCount: number };
      writings: Writing[];
    }>(`/teacher/students/${id}/writings`),
};
