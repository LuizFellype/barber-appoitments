import { NextRequest, NextResponse } from "next/server"

// Server-side proxy so the browser never sees the Hasura admin secret.
// lib/api/fetchGraphQL.ts calls this route instead of hitting Hasura directly.
async function handler(request: NextRequest) {
  const headers = new Headers(request.headers)

  headers.set("x-hasura-admin-secret", `${process.env.HASURA_SECRET}`)
  // The admin secret alone would grant unrestricted admin access; pinning the role
  // to "public" makes Hasura enforce that role's permissions instead (Service/Slot
  // select only, restricted columns on Appointment — see Hasura console > Data >
  // Permissions). This route only ever serves the public booking page; admin reads
  // and all writes go through app/api/admin/* + app/api/bookings (Prisma), not here.
  // Once you add real end-user auth, swap this for a per-request role/JWT, e.g.
  // headers.set("Authorization", `Bearer ${token}`) with HASURA_GRAPHQL_JWT_SECRET
  // configured in docker-compose.yml.
  headers.set("x-hasura-role", "public")

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
