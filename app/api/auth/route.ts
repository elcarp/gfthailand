import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const CORRECT_PASSWORD = process.env.AUTH_PASSWORD

export async function POST(request: Request) {
  const { password } = await request.json()

  if (password === CORRECT_PASSWORD) {
    cookies().set('auth', 'true', { httpOnly: true, secure: true })
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ success: false }, { status: 401 })
  }
}