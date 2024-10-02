import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // const body = request.body

  const body = {
    name: 'Smoking Pug',
    neighborhood: 'Silom',
    address: 'เลขที่ 651,653,655,657 661 บ้านสีลม ห้องเลขที่ A26 ชั้นที่ 01 663 Si Lom Rd, Silom, Bang Rak, Bangkok 10500',
    coordinates: {
      latitude: 13.724050793606516, 
      longitude: 100.520360334908,
    },
    tags: ['american'],
  }

  try {
    await kv.hset(`restaurant:smoking-pug`, body as any)
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
