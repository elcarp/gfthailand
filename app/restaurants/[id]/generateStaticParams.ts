import { kv } from '@vercel/kv'

export async function generateStaticParams() {
  const restaurantKeys = await kv.keys('restaurant:*')

  // Fetch data for all restaurant keys
  const restaurants = await Promise.all(
    restaurantKeys.map(async (key) => {
      const restaurantData = await kv.hgetall(key)
      return { id: key.split(':')[1], ...restaurantData }
    })
  )

  
  return Object.keys(restaurants).map((id) => ({
    slug: id,
  }))
}