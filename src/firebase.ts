import { initializeApp } from "firebase/app";
import {
  getFirestore,
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore immediately — needed for CMS/data on every page
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */

// ─── Lazy Auth — only loads firebase/auth + iframe when first called ──────────
// This prevents the 89.9 KiB firebaseapp.com/auth/iframe from blocking page load.
// Auth is only needed when user clicks Sign In, not on initial page render.

import type { Auth } from "firebase/auth";

let _auth: Auth | null = null;

export async function getAuthInstance(): Promise<Auth> {
  if (_auth) return _auth;
  const { getAuth } = await import("firebase/auth");
  _auth = getAuth(app);
  return _auth;
}

// Keep a sync getter for places that need current user AFTER auth has loaded
// Returns null safely if auth hasn't been initialized yet
export function getAuthSync(): Auth | null {
  return _auth;
}

// ─── Operational types for structured diagnostic reporting ────────────────────

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Error Handler
export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const currentUser = getAuthSync()?.currentUser ?? null;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email,
      })) ?? [],
    },
    operationType,
    path,
  };
  console.error("Firestore Exception Catch: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
