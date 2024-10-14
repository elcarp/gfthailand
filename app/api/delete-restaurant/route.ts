import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ success: false, message: 'No ID provided' }, { status: 400 })
  }

  try {
    // Decode the ID to handle special characters
    const decodedId = decodeURIComponent(id)
    // const key = `restaurant:${decodedId}`
    const key = `restaurant:${id}`


    const exists = await kv.exists(key)

    if (!exists) {
      return NextResponse.json({ success: false, message: 'Restaurant not found' }, { status: 404 })
    }

    await kv.del(key)

    return NextResponse.json({ success: true, message: 'Restaurant deleted successfully' })
  } catch (error) {
    console.error('Error deleting restaurant:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete restaurant', error: (error as Error).message },
      { status: 500 }
    )
  }
}