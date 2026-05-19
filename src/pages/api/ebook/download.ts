import type { APIRoute } from 'astro'

export const prerender = false

const STRAPI_URL = (
  import.meta.env.STRAPI_URL ||
  import.meta.env.PUBLIC_STRAPI_URL ||
  ''
).replace(/\/$/, '')

if (import.meta.env.PROD && !STRAPI_URL) {
  console.error('[ebook/download] STRAPI_URL is not set — ebook downloads will fail')
}

const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function extensionFromContentType(contentType: string | null) {
  if (contentType?.includes('application/epub+zip')) return 'epub'
  if (contentType?.includes('application/pdf')) return 'pdf'
  return 'bin'
}

function resolveFilename(downloadUrl: URL, contentType: string | null) {
  const requestedFormat = downloadUrl.searchParams.get('format')
  const extension = requestedFormat === 'epub' || requestedFormat === 'pdf'
    ? requestedFormat
    : extensionFromContentType(contentType)

  return `svet-za-malo-ebook.${extension}`
}

export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get('token')
  if (!token) {
    return jsonResponse({ error: 'Missing token' }, 400)
  }

  const strapiEndpoint = `${STRAPI_URL}/api/ebook/download?token=${encodeURIComponent(token)}`
  const requestHeaders: HeadersInit = { Accept: 'application/json' }
  if (STRAPI_API_TOKEN) {
    requestHeaders.Authorization = `Bearer ${STRAPI_API_TOKEN}`
  }

  try {
    const response = await fetch(strapiEndpoint, { headers: requestHeaders })
    const body = await response.text()

    if (url.searchParams.get('download') !== '1') {
      return new Response(body, {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const payload = JSON.parse(body) as { url?: string; error?: string }
    if (!response.ok || !payload.url) {
      return jsonResponse(payload || { error: 'Download unavailable' }, response.status)
    }

    const fileResponse = await fetch(payload.url)
    if (!fileResponse.ok || !fileResponse.body) {
      return jsonResponse({ error: 'Download unavailable' }, 502)
    }

    const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream'
    const headers = new Headers({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${resolveFilename(url, contentType)}"`,
      'Cache-Control': 'no-store',
    })
    const contentLength = fileResponse.headers.get('content-length')
    if (contentLength) headers.set('Content-Length', contentLength)

    return new Response(fileResponse.body, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('Ebook download proxy failed:', error)
    return jsonResponse({ error: 'Download unavailable' }, 502)
  }
}
