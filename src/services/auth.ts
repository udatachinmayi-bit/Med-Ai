import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export async function createUserProfile(user: User, name?: string) {
  const userReference = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userReference);

  if (!userSnapshot.exists()) {
    await setDoc(userReference, {
      uid: user.uid,
      name: name ?? user.displayName ?? "MedAI Member",
      email: user.email ?? "",
      photoURL: user.photoURL ?? null,
      createdAt: serverTimestamp(),
    });
  }
}

export async function signupWithEmail(
  name: string,
  email: string,
  password: string
) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await updateProfile(credential.user, {
    displayName: name,
  });

  await createUserProfile(credential.user, name);

  return credential.user;
}

export async function loginWithEmail(
  email: string,
  password: string
) {
  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return credential.user;
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);

  await createUserProfile(result.user);

  return result.user;
}

// No longer needed when using popup
export async function completeGoogleRedirect() {
  return null;
}

export function sendResetEmail(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export function logoutUser() {
  return signOut(auth);
}