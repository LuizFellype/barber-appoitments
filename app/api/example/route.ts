import { NextResponse } from "next/server"

// Example REST endpoint demonstrating the app/api/* -> lib/api/fetchApi.ts pattern.
// Replace with real handlers (typically backed by Prisma) as you add models.
export async function GET() {
  return NextResponse.json({ message: "Hello from /api/example" })
}
