import { NextRequest, NextResponse } from "next/server"

// Server-side proxy so the browser never sees the Hasura admin secret.
// lib/api/fetchGraphQL.ts calls this route instead of hitting Hasura directly.
async function handler(request: NextRequest) {
  const headers = new Headers(request.headers)

  headers.set("x-hasura-admin-secret", `${process.env.HASURA_SECRET}`)
  // Once you add auth back, swap the line above for a per-request role/JWT,
  // e.g. headers.set("Authorization", `Bearer ${token}`) and configure
  // HASURA_GRAPHQL_JWT_SECRET in docker-compose.yml.

  const graphqlUrl = process.env.GRAPHQL_URL || "no-url-set"

  const result = await fetch(graphqlUrl, { method: "POST", headers, body: request.body, duplex: "half" })

  // Node's fetch auto-decompresses the response body based on Content-Encoding.
  // Re-serializing via NextResponse.json ensures the client always receives plain JSON
  // regardless of whether Hasura compressed the response.
  const data = await result.json()
  return NextResponse.json(data, { status: result.status })
}

export const dynamic = "force-dynamic"

export { handler as GET, handler as POST }
