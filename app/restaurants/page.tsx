import Link from 'next/link'
import { kv } from '@vercel/kv'
import Header from '~components/header'

export default async function RestaurantListPage() {
  // Get all keys that start with 'restaurant:'
  const restaurantKeys = await kv.keys('restaurant:*')

  // Fetch data for all restaurant keys
  const restaurants = await Promise.all(
    restaurantKeys.map(async (key) => {
      const restaurantData = await kv.hgetall(key)
      return { id: key.split(':')[1], ...restaurantData }
    })
  )

  return (
    <>
      <Header />
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-6'>Our Restaurants</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Object.entries(restaurants).map(
            ([slug, restaurant]: [string, any]) => (
              <Link
                href={`/restaurants/${restaurant.id}`}
                key={restaurant.id}
                className='block'>
                <div className='border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300'>
                  <img
                    src={restaurant.photo}
                    alt={restaurant.name}
                    className='w-full h-48 object-cover'
                  />
                  <div className='p-4'>
                    <h2 className='text-xl font-semibold mb-2'>
                      {restaurant.name}
                    </h2>
                    <p className='text-gray-600 truncate'>
                      {restaurant.description}
                    </p>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </>
  )
}
