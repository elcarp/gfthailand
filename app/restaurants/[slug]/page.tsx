import { getRestaurant } from '../../api/restaurants'
import { notFound } from 'next/navigation'

export default async function RestaurantPage({ params }: { params: { slug: string } }) {
  const restaurant = await getRestaurant(params.slug)

  if (!restaurant) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{restaurant.name}</h1>
      <div className="mb-4">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-64 object-cover rounded-lg" />
      </div>
      <p className="text-gray-600 mb-4">{restaurant.description}</p>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Location</h2>
        <p>{restaurant.address}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Menu</h2>
        <ul className="list-disc list-inside">
          {restaurant.menu.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}