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

export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get('token')
  if (!token) {
    return new Response(JSON.stringify({ error: 'Missing token' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const strapiEndpoint = `${STRAPI_URL}/api/ebook/download?token=${encodeURIComponent(token)}`
  const requestHeaders: HeadersInit = { Accept: 'application/json' }
  if (STRAPI_API_TOKEN) {
    requestHeaders.Authorization = `Bearer ${STRAPI_API_TOKEN}`
  }

  try {
    const response = await fetch(strapiEndpoint, { headers: requestHeaders })
    const body = await response.text()
    return new Response(body, {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Ebook download proxy failed:', error)
    return new Response(JSON.stringify({ error: 'Download unavailable' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
