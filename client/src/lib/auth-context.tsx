"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, setToken } from "./api";
import type { User } from "./types";

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (body: {
    displayName: string;
    email: string;
    password: string;
    role?: "student" | "teacher";
    gradeLevel?: string;
    classCode?: string;
  }) => Promise<User>;
  continueAsGuest: (displayName?: string) => Promise<User>;
  signOut: () => void;
  /** Lets a screen push a fresh user object after it earns drops or equips an item. */
  applyUser: (user: User) => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }

    api
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { token, user } = await api.login({ email, password });
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const signUp = useCallback<AuthState["signUp"]>(async (body) => {
    const { token, user } = await api.register(body);
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const continueAsGuest = useCallback(async (displayName?: string) => {
    const { token, user } = await api.guest(displayName);
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const signOut = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    if (!getToken()) return;
    const { user } = await api.me();
    setUser(user);
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, loading, signIn, signUp, continueAsGuest, signOut, applyUser: setUser, refresh }),
    [user, loading, signIn, signUp, continueAsGuest, signOut, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
