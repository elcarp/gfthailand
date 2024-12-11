import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const dbId = searchParams.get('dbId')

  // This would be replaced with a database lookup in a real application
  const restaurantInfo = await getRestaurantInfoFromDatabase(dbId as any)

  if (!restaurantInfo) {
    return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  const query = encodeURIComponent(`${restaurantInfo.name} ${restaurantInfo.city} ${restaurantInfo.country}`)
  
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id,name,formatted_address&key=${apiKey}`
  )

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch from Google API' }, { status: 500 })
  }

  const data = await response.json()

  if (data.candidates && data.candidates.length > 0) {
    return NextResponse.json(data.candidates[0])
  } else {
    return NextResponse.json({ error: 'No matching place found' }, { status: 404 })
  }
}

// Mock function to simulate database lookup
async function getRestaurantInfoFromDatabase(dbId: string) {
  const restaurants = {
    'the-shack': { name: 'The Shack', city: 'Bangkok', country: 'Thailand' },
    'gluten-free-heaven': { name: 'Gluten Free Heaven', city: 'Chiang Mai', country: 'Thailand' },
    // Add more restaurants as needed
  }
  return restaurants[dbId as keyof typeof restaurants]
}

