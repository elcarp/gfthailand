import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.CACHE_PURGE_TOKEN) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  try {
    const response = await fetch(
      `https://api.vercel.com/v1/projects/${process.env.VERCEL_PROJECT_ID}/domains/${process.env.VERCEL_DOMAIN}/purge-cache`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paths: ['/*'], // Purge all paths
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to purge CDN cache: ${response.statusText}`)
    }

    const result = await response.json()

    return NextResponse.json({
      message: 'CDN cache successfully purged',
      result,
    })
  } catch (error) {
    console.error('Error purging CDN cache:', error)
    return NextResponse.json(
      {
        message: 'Error purging CDN cache',
        error: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
