import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Liveness probe for load balancers / Docker. Deliberately reveals nothing
// about the runtime (uptime, environment or version).
export async function GET() {
  return NextResponse.json(
    { status: 'healthy' },
    { status: 200, headers: { 'Cache-Control': 'no-store' } }
  )
}
