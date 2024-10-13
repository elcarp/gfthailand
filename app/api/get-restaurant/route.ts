import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Get all keys that start with 'restaurant:'
    const restaurantKeys = await kv.keys('restaurant:*')

    // Fetch data for all restaurant keys
    const restaurants = await Promise.all(
      restaurantKeys.map(async (key) => {
        const restaurantData = await kv.hgetall(key)
        return { id: key.split(':')[1], ...restaurantData }
      })
    )

    // Add a timestamp to the response
    const timestamp = new Date().toISOString()

    return NextResponse.json(
      { success: true, restaurants, timestamp },
      {
        headers: {
          cache: 'no-store',
          'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate',
          'CDN-Cache-Control': 'no-store',
          'Vercel-CDN-Cache-Control': 'no-store',
          'Surrogate-Control': 'no-store',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch restaurants',
        error: (error as Error).message,
      },
      {
        status: 500,
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate',
          'CDN-Cache-Control': 'no-store',
          'Vercel-CDN-Cache-Control': 'no-store',
          'Surrogate-Control': 'no-store',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    )
  }
}
