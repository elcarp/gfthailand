import { Restaurant } from '~types/restaurants'

export async function getGooglePlacesData(
  restaurants: Restaurant[]
): Promise<Restaurant[]> {
  const updatedRestaurants = await Promise.all(
    restaurants.map(async (restaurant) => {
      try {
        const query = encodeURIComponent(`${restaurant.name} Bangkok Thailand`)
        const response = await fetch(`/api/google-places?query=${query}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const googlePlacesData = await response.json()

        if (!googlePlacesData) {
          console.warn(`No place found for restaurant: ${restaurant.name}`)
          return restaurant
        }

        return {
          ...restaurant,
          googlePlacesData,
        }
      } catch (error) {
        console.error(
          `Error fetching Google Places data for ${restaurant.name}:`,
          error
        )
        return restaurant
      }
    })
  )

  return updatedRestaurants
}
