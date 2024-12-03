import { notFound } from 'next/navigation'
import { getRestaurantById, getAllRestaurantIds, debugKV } from '~/lib/kv'

export async function generateStaticParams() {
  console.log('Generating static params...')
  const ids = await getAllRestaurantIds()
  console.log('Generated static params:', ids)
  return ids.map((id) => ({ id }))
}

interface RestaurantPageProps {
  params: { id: string }
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  console.log('Rendering page for restaurant ID:', params.id)

  try {
    await debugKV()

    const restaurant = await getRestaurantById(params.id)
    console.log('Fetched restaurant data:', restaurant)

    if (!restaurant) {
      console.log('Restaurant not found, returning 404')
      notFound()
    }

    return (
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-4'>
          {restaurant.name || 'Restaurant Name Not Available'}
        </h1>
        <pre className='bg-gray-100 p-4 rounded-md overflow-auto'>
          {JSON.stringify(restaurant, null, 2)}
        </pre>
      </div>
    )
  } catch (error) {
    console.error('Error in RestaurantPage:', error)
    return (
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-4'>Error</h1>
        <p>
          An error occurred while fetching the restaurant data. Please try again
          later.
        </p>
      </div>
    )
  }
}
