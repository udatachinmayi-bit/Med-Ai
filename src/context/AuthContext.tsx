"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import {
  loginWithGoogle,
  signupWithEmail,
} from "@/services/auth";

/* =========================================================
   AUTH CONTEXT TYPE
========================================================= */

type AuthContextValue = {
  user: User | null;
  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<User>;

  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<User>;

  googleLogin: () => Promise<User>;

  signOut: () => Promise<void>;

  resetPassword: (email: string) => Promise<void>;
};

/* =========================================================
   AUTH CONTEXT
========================================================= */

const AuthContext = createContext<
  AuthContextValue | undefined
>(undefined);

/* =========================================================
   AUTH PROVIDER
========================================================= */

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  /* =======================================================
     AUTH STATE LISTENER
  ======================================================= */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error(
          "Firebase authentication error:",
          error
        );

        setUser(null);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  /* =======================================================
     LOGIN
  ======================================================= */

  const login = async (
    email: string,
    password: string
  ): Promise<User> => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      throw new Error("Please enter your email address.");
    }

    if (!password) {
      throw new Error("Please enter your password.");
    }

    try {
      const result =
        await signInWithEmailAndPassword(
          auth,
          normalizedEmail,
          password
        );

      setUser(result.user);

      return result.user;
    } catch (error) {
      console.error("Login failed:", error);

      throw error;
    }
  };

  /* =======================================================
     SIGN UP
  ======================================================= */

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<User> => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim();

    if (!normalizedName) {
      throw new Error("Please enter your name.");
    }

    if (!normalizedEmail) {
      throw new Error("Please enter your email address.");
    }

    if (!password) {
      throw new Error("Please enter your password.");
    }

    try {
      const createdUser = await signupWithEmail(
        normalizedName,
        normalizedEmail,
        password
      );

      setUser(createdUser);

      return createdUser;
    } catch (error) {
      console.error("Sign up failed:", error);

      throw error;
    }
  };

  /* =======================================================
     GOOGLE SIGN IN
  ======================================================= */

  const googleLogin = async (): Promise<User> => {
    try {
      const signedInUser = await loginWithGoogle();

      setUser(signedInUser);

      return signedInUser;
    } catch (error) {
      console.error("Google sign in failed:", error);

      throw error;
    }
  };

  /* =======================================================
     SIGN OUT
  ======================================================= */

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);

      setUser(null);
    } catch (error) {
      console.error("Sign out failed:", error);

      throw error;
    }
  };

  /* =======================================================
     RESET PASSWORD
  ======================================================= */

  const resetPassword = async (
    email: string
  ) => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      throw new Error(
        "Please enter your email address."
      );
    }

    try {
      await sendPasswordResetEmail(
        auth,
        normalizedEmail
      );
    } catch (error) {
      console.error(
        "Password reset failed:",
        error
      );

      throw error;
    }
  };

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        googleLogin,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =========================================================
   USE AUTH
========================================================= */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}