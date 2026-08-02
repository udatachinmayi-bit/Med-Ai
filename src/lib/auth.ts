import type { AuthError } from "firebase/auth";

export function getAuthErrorMessage(error: unknown) {
  const code = (error as AuthError).code;
  const messages: Record<string, string> = {
    "auth/user-not-found": "We could not find an account with that email address.",
    "auth/wrong-password": "The password you entered is incorrect.",
    "auth/invalid-credential": "The email or password you entered is incorrect.",
    "auth/email-already-in-use": "An account already exists with this email address.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Your password must be at least 6 characters long.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled. Please try again.",
    "auth/popup-blocked": "Your browser blocked the sign-in popup. Please allow popups and try again.",
    "auth/account-exists-with-different-credential": "An account already exists with this email using a different sign-in method.",
    "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  };
  return messages[code] ?? "We could not complete your request. Please try again.";
}
