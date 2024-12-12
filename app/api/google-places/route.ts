import { NextResponse } from 'next/server'

async function fetchGooglePlacesData(query: string) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    throw new Error('GOOGLE_MAPS_API_KEY is not configured')
  }

  console.log('Fetching place data for query:', query)

  const findPlaceResponse = await fetch(
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id,name,formatted_address,geometry&key=${apiKey}`
  )

  if (!findPlaceResponse.ok) {
    console.error(
      'Find Place API error:',
      findPlaceResponse.status,
      await findPlaceResponse.text()
    )
    throw new Error(`HTTP error! status: ${findPlaceResponse.status}`)
  }

  const findPlaceData = await findPlaceResponse.json()
  console.log('Find Place API response:', findPlaceData)

  if (findPlaceData.status !== 'OK' || findPlaceData.candidates.length === 0) {
    console.warn('No place found for query:', query)
    return null
  }

  const placeId = findPlaceData.candidates[0].place_id
  const detailsResponse = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,rating,formatted_phone_number,photos&key=${apiKey}`
  )

  if (!detailsResponse.ok) {
    console.error(
      'Place Details API error:',
      detailsResponse.status,
      await detailsResponse.text()
    )
    throw new Error(`HTTP error! status: ${detailsResponse.status}`)
  }

  const detailsData = await detailsResponse.json()
  console.log('Place Details API response:', detailsData)

  if (detailsData.status !== 'OK') {
    console.warn('Failed to get details for place ID:', placeId)
    return null
  }

  // Process photos
  const photos = detailsData.result.photos
    ? detailsData.result.photos.slice(0, 5).map((photo: any) => ({
        photo_reference: photo.photo_reference,
        height: photo.height,
        width: photo.width,
      }))
    : []

  return {
    address: detailsData.result.formatted_address,
    lat: detailsData.result.geometry.location.lat,
    lng: detailsData.result.geometry.location.lng,
    rating: detailsData.result.rating,
    phone: detailsData.result.formatted_phone_number,
    photos: photos,
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    )
  }

  try {
    const googlePlacesData = await fetchGooglePlacesData(query)
    return NextResponse.json(googlePlacesData)
  } catch (error) {
    console.error('Error in Google Places API route:', error)
    return NextResponse.json(
      { error: 'Error fetching Google Places data' },
      { status: 500 }
    )
  }
}
