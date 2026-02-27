"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase.client";

// ✅ Replace with your real team emails (lowercase)
const ADMIN_EMAILS = new Set<string>([
  "stonemediaindia@gmail.com",
]);

export default function AdminGate({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAllowed = useMemo(() => {
    const email = user?.email?.toLowerCase() ?? "";
    return email && ADMIN_EMAILS.has(email);
  }, [user]);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const onLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const onLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] text-white p-10">Loading…</div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-xl font-semibold">Admin Login</h1>
          <p className="mt-2 text-white/70 text-sm">
            Sign in with your team Google account.
          </p>
          <button
            onClick={onLogin}
            className="mt-5 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm hover:bg-white/15"
          >
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-xl font-semibold">Access denied</h1>
          <p className="mt-2 text-white/70 text-sm">
            Signed in as <span className="text-white">{user.email}</span>, but
            this email isn’t on the admin allowlist.
          </p>
          <button
            onClick={onLogout}
            className="mt-5 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm hover:bg-white/15"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-white/70">Stone Media CMS</div>
          <button
            onClick={onLogout}
            className="text-sm text-white/70 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}