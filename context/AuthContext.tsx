"use client";

// AuthContext: a mock authentication layer for this POC.
//
// Real apps would call a backend API and store a session token (e.g. in an
// HTTP-only cookie). Here we "fake" that by keeping a list of registered
// users and the currently logged-in user in localStorage. Swap `login`,
// `signup`, and `logout` for real API calls later — every component that
// uses `useAuth()` will keep working unchanged.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@/types";

interface StoredUser extends User {
  password: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USERS_KEY = "shopwave_users";
const SESSION_KEY = "shopwave_session";

function readUsers(): StoredUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on first load (client only — localStorage doesn't exist on the server)
  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      setUser(JSON.parse(raw));
    }
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const users = readUsers();
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!match) {
      return { success: false, error: "Invalid email or password." };
    }
    const { password: _pw, ...publicUser } = match;
    setUser(publicUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
    return { success: true };
  }

  async function signup(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: "An account with this email already exists." };
    }
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    };
    writeUsers([...users, newUser]);
    const { password: _pw, ...publicUser } = newUser;
    setUser(publicUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
    return { success: true };
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
