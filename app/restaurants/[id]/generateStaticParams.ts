import { kv } from '@vercel/kv'

export async function generateStaticParams() {
  const restaurants = await kv.hgetall('restaurants')
  
  return Object.keys(restaurants).map((slug) => ({
    slug: slug,
  }))
}