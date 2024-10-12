'use client'

import { useState, useEffect } from 'react'

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([])

  useEffect(() => {
    async function fetchRestaurants() {
      const response = await fetch('/api/restaurants', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        setRestaurants(data)
      }
    }

    fetchRestaurants()
  }, [])

  return (
    <ul>
      {restaurants.map((restaurant: any) => (
        <li key={restaurant.name}>{restaurant.name}</li>
      ))}
    </ul>
  )
}
