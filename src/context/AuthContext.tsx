"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  completeGoogleRedirect,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  sendResetEmail,
  signupWithEmail,
} from "@/services/auth";

type AuthContextValue = {
  user: User |null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<User>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle Google Redirect Login
  useEffect(() => {
    completeGoogleRedirect().catch((error) => {
      console.error("Google redirect sign-in failed:", error);
    });
  }, []);

  // Listen for Firebase Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);

      if (nextUser) {
        if (
          pathname === "/login" ||
          pathname === "/signup" ||
          pathname === "/"
        ) {
          router.replace("/dashboard");
        }
      }
    });

    return unsubscribe;
  }, [router, pathname]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login: loginWithEmail,
      signup: signupWithEmail,
      logout: async () => {
        await logoutUser();
        router.replace("/login");
      },
      googleLogin: loginWithGoogle,
      resetPassword: sendResetEmail,
    }),
    [user, loading, router]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}