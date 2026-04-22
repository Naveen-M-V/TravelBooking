import type { NextRequest } from 'next/server'

const backendBase = (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api'
).replace(/\/$/, '')

async function proxy(request: NextRequest, pathSegments: string[]) {
  const path = pathSegments.join('/')
  const target = `${backendBase}/${path}${request.nextUrl.search}`

  const headers = new Headers(request.headers)
  headers.delete('host')
  headers.delete('content-length')
  headers.delete('cookie')
  headers.delete('authorization')

  const method = request.method.toUpperCase()
  const hasBody = !['GET', 'HEAD'].includes(method)

  const response = await fetch(target, {
    method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    redirect: 'manual',
  })

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  })
}

type RouteContext = { params: { path: string[] } }

export async function GET(request: NextRequest, context: RouteContext) {
  return proxy(request, context.params.path)
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxy(request, context.params.path)
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxy(request, context.params.path)
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxy(request, context.params.path)
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxy(request, context.params.path)
}

export async function OPTIONS(request: NextRequest, context: RouteContext) {
  return proxy(request, context.params.path)
}
