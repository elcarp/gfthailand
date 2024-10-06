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

    return NextResponse.json(
      { success: true, restaurants },
      {
        headers: {
          'Cache-Control': 'max-age=10',
          'CDN-Cache-Control': 'max-age=10',
          'Vercel-CDN-Cache-Control': 'max-age=10',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch restaurants' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'Surrogate-Control': 'no-store',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    )
  }
}
