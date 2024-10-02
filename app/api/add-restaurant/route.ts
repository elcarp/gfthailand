import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body || !body.id || typeof body.id !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing restaurant ID' },
        { status: 400 }
      )
    }

    const { id, ...restaurantData } = body

    await kv.hset(`restaurant:${id}`, restaurantData)

    return NextResponse.json({
      success: true,
      message: 'Restaurant data added successfully',
    })
  } catch (error) {
    console.error('Error adding restaurant data:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to add restaurant data' },
      { status: 500 }
    )
  }
}