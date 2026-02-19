import { useState } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { login as apiLogin, register as apiRegister } from "../lib/api";
import AuthContext from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode<{ userId: string }>(token);
      return { id: decoded.userId };
    } catch {
      localStorage.removeItem("token");
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  async function login(email: string, password: string): Promise<void> {
    const data = await apiLogin(email, password);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    const decoded = jwtDecode<{ userId: string }>(data.token);
    setUser({ id: decoded.userId });
  }

  async function register(email: string, password: string): Promise<void> {
    const data = await apiRegister(email, password);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser({ id: data.id });
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
