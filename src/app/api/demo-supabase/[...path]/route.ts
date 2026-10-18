// ============================================================
// Fake Supabase endpoint for the dev-only demo preview.
//
// When `isDemoPreview()` is on (see src/lib/demo.ts) the browser
// Supabase client points here instead of a real project. Every table
// read answers "no rows", so pages render their genuine empty states,
// and the dashboard RPC returns sample numbers so the overview has
// something to show. Writes are accepted and discarded.
//
// Outside demo preview (production builds, or once real keys exist)
// every request is a 404 — this route does nothing on a real install.
// ============================================================

import { isDemoPreview } from '@/lib/demo'

export const dynamic = 'force-dynamic'

type Ctx = { params: Promise<{ path: string[] }> }

const JSON_HEADERS = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }

function json(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { ...JSON_HEADERS, ...(init.headers ?? {}) },
  })
}

async function handle(request: Request, { params }: Ctx): Promise<Response> {
  if (!isDemoPreview()) return new Response('Not found', { status: 404 })

  const { path } = await params
  const [service, version, ...rest] = path

  if (service === 'auth') {
    return json({ message: 'demo preview has no auth server' }, { status: 401 })
  }
  if (service !== 'rest' || version !== 'v1') {
    return new Response('Not found', { status: 404 })
  }

  // PostgREST RPC: POST /rest/v1/rpc/<fn>
  if (rest[0] === 'rpc') {
    const body = await request.json().catch(() => ({}))
    if (rest[1] === 'dashboard_overview') {
      return json(sampleOverview(Number(body?.p_days) || 7, String(body?.p_tz || 'UTC')))
    }
    return json([])
  }

  // Table access. `.single()` asks for one object and PostgREST answers
  // 406 when there are no rows; `.maybeSingle()` and lists get [].
  const wantsObject = (request.headers.get('accept') ?? '').includes(
    'application/vnd.pgrst.object',
  )
  if (request.method === 'GET' || request.method === 'HEAD') {
    if (wantsObject) {
      return json(
        {
          code: 'PGRST116',
          details: 'The result contains 0 rows',
          hint: null,
          message: 'JSON object requested, multiple (or no) rows returned',
        },
        { status: 406 },
      )
    }
    return json([], { headers: { 'Content-Range': '*/0' } })
  }
  // INSERT / UPDATE / DELETE: pretend success, keep nothing.
  return json([], { status: request.method === 'POST' ? 201 : 200 })
}

export const GET = handle
export const HEAD = handle
export const POST = handle
export const PATCH = handle
export const PUT = handle
export const DELETE = handle

/* ------------------------------------------------------------------ */

function sampleOverview(days: number, timeZone: string) {
  const now = Date.now()
  const hourly = days === 1
  const points = hourly ? 24 : days
  const step = hourly ? 3_600_000 : 86_400_000
  const wave = (i: number, base: number, amp: number) =>
    Math.max(0, Math.round(base + amp * Math.sin(i / 2.2) + ((i * 7) % 5)))

  const series = Array.from({ length: points }, (_, i) => ({
    t: new Date(now - (points - 1 - i) * step).toISOString(),
    incoming: wave(i, hourly ? 9 : 64, hourly ? 6 : 22),
    outgoing: wave(i + 1, hourly ? 8 : 58, hourly ? 5 : 20),
    newConversations: wave(i + 2, hourly ? 2 : 14, hourly ? 2 : 5),
    resolved: wave(i + 3, hourly ? 2 : 11, hourly ? 2 : 4),
    dealsWon: wave(i + 4, hourly ? 0 : 2, hourly ? 1 : 1.5),
  }))

  const ago = (min: number) => new Date(now - min * 60_000).toISOString()
  const later = (min: number) => new Date(now + min * 60_000).toISOString()

  return {
    generatedAt: new Date(now).toISOString(),
    timeZone,
    days,
    unit: hourly ? 'hour' : 'day',
    periodStart: new Date(now - points * step).toISOString(),
    previousStart: new Date(now - 2 * points * step).toISOString(),
    previousEnd: new Date(now - points * step).toISOString(),
    replyTargetMinutes: 15,
    attention: {
      waiting: 3,
      oldestWaitingSince: ago(42),
      waitingOverTarget: 1,
      unassigned: 2,
      windowsClosing: 1,
      failed: 0,
      failedMessages: [],
      queue: [
        {
          conversationId: 'demo-1',
          contactName: 'Aisha Khan',
          contactPhone: '+91 98765 43210',
          avatarUrl: '/avatars/aisha.jpg',
          preview: 'Is the summer sale still on?',
          waitingSince: ago(42),
          windowClosesAt: later(60 * 20),
          assignedAgentId: null,
          handedOff: false,
        },
        {
          conversationId: 'demo-2',
          contactName: 'Sofia Lopez',
          contactPhone: '+34 612 345 678',
          avatarUrl: '/avatars/sofia.jpg',
          preview: 'Can I reschedule to Friday?',
          waitingSince: ago(9),
          windowClosesAt: later(60 * 23),
          assignedAgentId: null,
          handedOff: true,
        },
        {
          conversationId: 'demo-3',
          contactName: 'Daniel Weber',
          contactPhone: '+49 151 2345 6789',
          avatarUrl: '/avatars/daniel.jpg',
          preview: 'Do you deliver to Berlin?',
          waitingSince: ago(4),
          windowClosesAt: later(60 * 2),
          assignedAgentId: '00000000-0000-0000-0000-000000000001',
          handedOff: false,
        },
      ],
    },
    replies: {
      medianHuman: 6.5,
      medianHumanPrevious: 9,
      team: [
        {
          userId: '00000000-0000-0000-0000-000000000001',
          name: 'Demo Owner',
          avatarUrl: null,
          role: 'owner',
          presence: 'online',
          lastSeenAt: ago(0),
          open: 12,
          replies: 148,
          medianMinutes: 5.2,
        },
        {
          userId: 'demo-agent-2',
          name: 'Emma Collins',
          avatarUrl: '/avatars/emma.jpg',
          role: 'agent',
          presence: 'away',
          lastSeenAt: ago(25),
          open: 7,
          replies: 96,
          medianMinutes: 8.1,
        },
        {
          userId: 'demo-agent-3',
          name: 'Rahul Mehta',
          avatarUrl: '/avatars/rahul.jpg',
          role: 'agent',
          presence: 'online',
          lastSeenAt: ago(1),
          open: 9,
          replies: 121,
          medianMinutes: 6.7,
        },
      ],
      ai: { replies: 214, medianMinutes: 0.1 },
    },
    volume: {
      series,
      hourly: Array.from({ length: 24 }, (_, h) =>
        h < 8 ? 2 + h : h < 20 ? 18 + ((h * 5) % 14) : 26 - h,
      ),
    },
    kpis: {
      newConversations: 96,
      newConversationsPrevious: 81,
      resolved: 74,
      resolvedPrevious: 70,
      dealsWon: 11,
      dealsWonPrevious: 8,
      dealsWonValue: 384000,
      broadcastDelivered: 4180,
      broadcastRead: 3965,
      broadcastDeliveredPrevious: 3900,
      broadcastReadPrevious: 3400,
    },
    pipeline: {
      pipelines: [{ id: 'demo-pipe', name: 'Sales' }],
      stages: [
        { id: 's1', pipelineId: 'demo-pipe', name: 'New', color: '#0ea5e9', dealCount: 14, totalValue: 212000 },
        { id: 's2', pipelineId: 'demo-pipe', name: 'Qualified', color: '#f59e0b', dealCount: 9, totalValue: 168000 },
        { id: 's3', pipelineId: 'demo-pipe', name: 'Proposal', color: '#8b5cf6', dealCount: 6, totalValue: 245000 },
        { id: 's4', pipelineId: 'demo-pipe', name: 'Won', color: '#10b981', dealCount: 11, totalValue: 384000 },
      ],
      stats: [{ pipelineId: 'demo-pipe', won: 11, lost: 3, avgDaysToWin: 4.2, idleDeals: 2 }],
    },
    campaigns: {
      latestBroadcast: {
        id: 'demo-bc',
        name: 'Diwali offer 🎉',
        status: 'completed',
        at: ago(60 * 26),
        recipients: 4310,
        delivered: 4180,
        read: 3965,
        replied: 1336,
        failed: 12,
      },
      automationRuns: 382,
      automationFailed: 2,
      flowFailed: 0,
      topFailingFlow: null,
      templatesApproved: 6,
      templatesRejected: 1,
    },
    // Incomplete on purpose so the setup checklist shows what's left
    // to configure on a brand-new install.
    setup: {
      whatsappConnected: false,
      hasContacts: true,
      hasApprovedTemplate: false,
      memberCount: 1,
      hasConversations: true,
    },
  }
}
