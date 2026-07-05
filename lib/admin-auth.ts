import { cookies } from "next/headers"
import { createHash, randomBytes } from "crypto"
import { NextResponse } from "next/server"
import { prisma } from "./prisma"

// Server-only. Never import this from a "use client" component — it touches
// cookies() and Prisma directly. The admin secret is checked here, straight
// against Postgres, and is never exposed over the public /api/graphql proxy.

const COOKIE_NAME = "ch2d_admin"
const COOKIE_MAX_AGE = 60 * 60 * 12 // 12h

export function hashSecret(key: string): string {
  return createHash("sha256").update(key).digest("hex")
}

export function generateSecret(length = 12): string {
  return randomBytes(length).toString("base64url").slice(0, length)
}

/** Re-checks the cookie against the database on every call, so deleting/rotating
 * the AdminSecret row immediately invalidates any existing session cookie. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies()
  const keyHash = store.get(COOKIE_NAME)?.value
  if (!keyHash) return false
  const match = await prisma.adminSecret.findUnique({ where: { keyHash } })
  return !!match
}

export async function signInAdmin(key: string): Promise<boolean> {
  const keyHash = hashSecret(key)
  const match = await prisma.adminSecret.findUnique({ where: { keyHash } })
  if (!match) return false

  const store = await cookies()
  store.set(COOKIE_NAME, keyHash, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  })
  return true
}

export async function signOutAdmin(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

/** Guard for app/api/admin/* route handlers: returns a 401 response to short-circuit
 * on, or null when the caller is authorized. Usage: `const denied = await requireAdmin(); if (denied) return denied` */
export async function requireAdmin(): Promise<NextResponse | null> {
  if (await isAdmin()) return null
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
