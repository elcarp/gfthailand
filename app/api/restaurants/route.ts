import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Get all keys
    const keys = await kv.keys('*')

    // Fetch data for all keys
    const data = await Promise.all(
      keys.map(async (key) => {
        const type = await kv.type(key)
        let value

        switch (type) {
          case 'string':
            value = await kv.get(key)
            break
          case 'hash':
            value = await kv.hgetall(key)
            break
          case 'list':
            value = await kv.lrange(key, 0, -1)
            break
          case 'set':
            value = await kv.smembers(key)
            break
          case 'zset':
            value = await kv.zrange(key, 0, -1, { withScores: true })
            break
          default:
            value = null
        }

        return { key, type, value }
      })
    )

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching data:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}