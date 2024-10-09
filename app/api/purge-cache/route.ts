import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  
  if (secret !== process.env.CACHE_PURGE_TOKEN) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }
  
  try {
    // Revalidate the entire app
    revalidatePath('/')
    
    // If you have specific paths that need revalidation, add them here
    revalidatePath('/restaurants')
    
    return NextResponse.json({ 
      revalidated: true, 
      date: new Date().toISOString(),
      message: 'Cache successfully purged' 
    })
  } catch (err) {
    return NextResponse.json({ 
      message: 'Error revalidating', 
      error: (err as Error).message 
    }, { status: 500 })
  }
}