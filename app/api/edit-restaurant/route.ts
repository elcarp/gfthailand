import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    if (!body || !body.id || typeof body.id !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing restaurant ID' },
        {
          status: 400,
          headers: {
            'Cache-Control':
              'no-store, no-cache, must-revalidate, proxy-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
            'Surrogate-Control': 'no-store',
          },
        }
      )
    }

    const { id, ...restaurantData } = body

    // Update the restaurant data in Vercel KV
    await kv.hset(`restaurant:${id}`, restaurantData)

    return NextResponse.json(
      {
        success: true,
        message: 'Restaurant data updated successfully',
      },
      {
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
          'Surrogate-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    console.error('Error updating restaurant data:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update restaurant data' },
      {
        status: 500,
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
          'Surrogate-Control': 'no-store',
        },
      }
    )
  }
}