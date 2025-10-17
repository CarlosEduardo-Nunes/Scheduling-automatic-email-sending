import React, { createContext, useContext, useMemo, useState } from "react";
import {
  saveToken,
  readToken,
  clearToken,
  saveUserId,
  readUserId,
  clearUserId,
} from "../lib/storage";

type AuthContextValue = {
  token: string | null;
  userId: number | null;
  isAuthenticated: boolean;
  setAuth: (token: string | null, userId: number | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => readToken());
  const [userId, setUserIdState] = useState<number | null>(() => readUserId());

  function setAuth(newToken: string | null, newUserId: number | null) {
    // sincroniza estado <-> localStorage
    if (newToken) saveToken(newToken);
    else clearToken();
    if (newUserId != null) saveUserId(newUserId);
    else clearUserId();

    setTokenState(newToken);
    setUserIdState(newUserId);
  }

  function logout() {
    setAuth(null, null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      userId,
      isAuthenticated: Boolean(token),
      setAuth,
      logout,
    }),
    [token, userId]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
