import { Restaurant } from '~types/restaurants'

export async function getGooglePlacesData(
  restaurants: Restaurant[]
): Promise<Restaurant[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    console.error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not configured')
    return restaurants
  }

  const updatedRestaurants = await Promise.all(
    restaurants.map(async (restaurant) => {
      const query = encodeURIComponent(`${restaurant.name} Bangkok Thailand`)
      const findPlaceResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id,name,formatted_address,geometry&key=${apiKey}`
      )

      const findPlaceData = await findPlaceResponse.json()

      if (
        findPlaceData.status === 'OK' &&
        findPlaceData.candidates.length > 0
      ) {
        const placeId = findPlaceData.candidates[0].place_id
        const detailsResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,rating,formatted_phone_number&key=${apiKey}`
        )

        const detailsData = await detailsResponse.json()

        if (detailsData.status === 'OK') {
          return {
            ...restaurant,
            googlePlacesData: {
              address: detailsData.result.formatted_address,
              lat: detailsData.result.geometry.location.lat,
              lng: detailsData.result.geometry.location.lng,
              rating: detailsData.result.rating,
              phone: detailsData.result.formatted_phone_number,
            },
          }
        }
      }

      return restaurant
    })
  )

  return updatedRestaurants
}
