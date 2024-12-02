import { kv } from '@vercel/kv'

export async function getAllRestaurantIds(): Promise<string[]> {
  try {
    const keys = await kv.keys('restaurant:*')
    console.log('Found restaurant keys:', keys)
    return keys.map((key) => key.split(':')[1])
  } catch (error) {
    console.error('Error fetching restaurant IDs:', error)
    return []
  }
}

export async function getRestaurantById(id: string): Promise<any> {
  try {
    const key = `restaurant:${id}`
    const value = await kv.get(key)
    console.log(`Fetched value for ${key}:`, value)
    return value
  } catch (error) {
    console.error(`Error fetching restaurant ${id}:`, error)
    return null
  }
}

export async function debugKV() {
  try {
    const allKeys = await kv.keys('*')
    console.log('All keys in KV:', allKeys)

    for (const key of allKeys) {
      const value = await kv.get(key)
      console.log(`Key: ${key}, Type: ${typeof value}, Value:`, value)
    }
  } catch (error) {
    console.error('Error in debugKV:', error)
  }
}
