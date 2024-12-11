import { notFound } from 'next/navigation'
import { getRestaurantById, getAllRestaurantIds, debugKV } from '~/lib/kv'
import Header from '~components/header'

// Define the correct params type for the page
type Params = {
  id: string
}

// Define the correct props type for the page
type Props = {
  params: Params
}

export async function generateStaticParams(): Promise<Params[]> {
  const ids = await getAllRestaurantIds()
  return ids.map((id) => ({ id }))
}

async function getPlaceDetails(placeId: string) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not configured')
  }

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,website,photos,rating,formatted_phone_number&key=${apiKey}`,
    { next: { revalidate: 3600 } }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch place details')
  }

  return response.json()
}

export default async function RestaurantPage({ params }: Props) {
  try {
    const restaurant = await getRestaurantById(params.id)

    if (!restaurant) {
      notFound()
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not configured')
    }

    // First, find the place ID using the restaurant name and location
    const query = encodeURIComponent(`${restaurant.name} Bangkok Thailand`)
    const findPlaceResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id,name,formatted_address&key=${apiKey}`
    )

    const findPlaceData = await findPlaceResponse.json()

    if (!findPlaceResponse.ok || findPlaceData.status === 'ZERO_RESULTS') {
      return (
        <div className='container mx-auto px-4 py-8'>
          <h1 className='text-3xl font-bold mb-4'>{restaurant.name}</h1>
          <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4'>
            <p className='text-yellow-700'>
              This restaurant could not be found in Google Places. Showing
              stored information only.
            </p>
          </div>
          <pre className='bg-gray-100 p-4 rounded-md overflow-auto'>
            {JSON.stringify(restaurant, null, 2)}
          </pre>
        </div>
      )
    }

    // Get detailed place information
    const placeDetails = await getPlaceDetails(
      findPlaceData.candidates[0].place_id
    )

    return (
      <>
        <Header />
        <div className='container mx-auto px-4 py-8'>
          <div className='max-w-4xl mx-auto'>
            <h1 className='text-4xl font-bold mb-6'>
              {placeDetails.result.name}
            </h1>

            {placeDetails.result.photos && placeDetails.result.photos[0] && (
              <div className='mb-6'>
                <img
                  src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${placeDetails.result.photos[0].photo_reference}&key=${apiKey}`}
                  alt={placeDetails.result.name}
                  className='w-full h-64 object-cover rounded-lg shadow-lg'
                />
              </div>
            )}

            <div className='grid md:grid-cols-2 gap-6 mb-8'>
              <div className='space-y-4'>
                <div>
                  <h2 className='text-lg font-semibold mb-2'>Location</h2>
                  <p className='text-gray-600'>
                    {placeDetails.result.formatted_address}
                  </p>
                </div>

                {placeDetails.result.formatted_phone_number && (
                  <div>
                    <h2 className='text-lg font-semibold mb-2'>Phone</h2>
                    <p className='text-gray-600'>
                      {placeDetails.result.formatted_phone_number}
                    </p>
                  </div>
                )}

                {placeDetails.result.rating && (
                  <div>
                    <h2 className='text-lg font-semibold mb-2'>Rating</h2>
                    <p className='text-gray-600'>
                      {placeDetails.result.rating} / 5
                    </p>
                  </div>
                )}
              </div>

              <div className='space-y-4'>
                {placeDetails.result.website && (
                  <div>
                    <h2 className='text-lg font-semibold mb-2'>Website</h2>
                    <a
                      href={placeDetails.result.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline'>
                      Visit Website
                    </a>
                  </div>
                )}

                <div>
                  <h2 className='text-lg font-semibold mb-2'>Coordinates</h2>
                  <p className='text-gray-600'>
                    Lat: {placeDetails.result.geometry.location.lat}
                    <br />
                    Lng: {placeDetails.result.geometry.location.lng}
                  </p>
                </div>
              </div>
            </div>

            <div className='mt-8 pt-8 border-t'>
              <h2 className='text-2xl font-semibold mb-4'>
                Original Database Entry
              </h2>
              <pre className='bg-gray-100 p-4 rounded-md overflow-auto'>
                {JSON.stringify(restaurant, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </>
    )
  } catch (error) {
    console.error('Error in RestaurantPage:', error)
    return (
      <>
        <Header />
        <div className='container mx-auto px-4 py-8'>
          <h1 className='text-3xl font-bold mb-4'>Error</h1>
          <p className='text-red-600'>
            An error occurred while fetching the restaurant data. Please try
            again later.
          </p>
        </div>
      </>
    )
  }
}
