import { kv } from '@vercel/kv'

export async function GET() {
  const restaurants = await kv.hgetall('restaurants')
  return Response.json(restaurants)
}

export async function getRestaurant(slug: string) {
  const restaurant = await kv.hget('restaurants', slug)
  return restaurant
}