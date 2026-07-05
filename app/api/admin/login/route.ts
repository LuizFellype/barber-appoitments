import { NextRequest, NextResponse } from "next/server"
import { signInAdmin } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  const { key } = await request.json()
  if (typeof key !== "string" || !key) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const ok = await signInAdmin(key)
  return NextResponse.json({ ok }, { status: ok ? 200 : 401 })
}
