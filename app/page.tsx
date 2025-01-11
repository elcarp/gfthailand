'use client'

import React, { useEffect, useState } from 'react'
import { Permanent_Marker } from 'next/font/google'
import { MapPinIcon } from '@heroicons/react/24/outline'
import dynamic from 'next/dynamic'
import { cuisines } from '~/constants'
import { SingleValue } from 'react-select'
import Link from 'next/link'
import { Restaurant } from '~types/restaurants'
import { getGooglePlacesData } from '~/lib/googlePlaces'
import logo from '~public/images/gft-logo.png'
import Image from 'next/image'

const Select = dynamic(() => import('react-select'), { ssr: false })
const GoogleMaps = dynamic(() => import('~/components/maps'), { ssr: false })

const permanentMarker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
})

interface Option {
  label: string
  value: string
}

const neighborhoodOptions: Option[] = [
  { label: 'Sukhumvit', value: 'sukhumvit' },
  { label: 'Silom', value: 'silom' },
  { label: 'Sathorn', value: 'sathorn' },
  { label: 'Bang Rak', value: 'bang rak' },
  { label: 'Chatuchak', value: 'chatuchak' },
  { label: 'Thonburi', value: 'thonburi' },
  { label: 'Bang Kapi', value: 'bang kapi' },
  { label: 'Phra Khanong', value: 'phra kanong' },
  { label: 'Ari', value: 'ari' },
  { label: 'Siam', value: 'Siam' },
]

const cuisineOptions: Option[] = cuisines.map((cuisine) => ({
  label: cuisine,
  value: cuisine,
}))

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState<SingleValue<Option>>(null)
  const [selectedCuisine, setSelectedCuisine] =
    useState<SingleValue<Option>>(null)

  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/get-restaurant', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            Expires: '0',
          },
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (!data.restaurants || !Array.isArray(data.restaurants)) {
          throw new Error('Invalid data format received from API')
        }
        const restaurantsWithGoogleData = await getGooglePlacesData(
          data.restaurants
        )
        setRestaurants(restaurantsWithGoogleData)
      } catch (error) {
        console.error('Error fetching restaurants:', error)
        setError(
          'Failed to fetch complete restaurant data. Some information may be missing.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div>
          <p className='text-center'>Loading...</p>
          <br />
          <Image
            className='block clear-both'
            src={logo}
            width={100}
            height={100}
            alt='Gluten Free Thailand logo'
          />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen text-red-500'>
        {error}
      </div>
    )
  }

  return (
    <>
      <section
        className='w-full h-screen lg:h-screen-1/2 flex relative'
        style={{
          backgroundImage: `url('/images/gf-meal.jpg')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}>
        <div className='overlay w-full h-full bg-black opacity-50 absolute' />
        <div className='max-w-4xl mx-auto p-10 relative z-20'>
          <h1 className={`text-white text-4xl text-center leading-12`}>
            Explore Thailand&apos;s best{' '}
            <span
              className={`${permanentMarker.className} clear-both block text-7xl`}>
              gluten-free
            </span>{' '}
            restaurants
          </h1>
          <div className='rounded-xl w-full flex flex-wrap lg:flex-nowrap justify-between p-10 mt-2'>
            <div className='flex items-center pb-10 w-full lg:w-auto'>
              <MapPinIcon aria-hidden='true' className='h-6 w-6 text-white' />
              <Select
                options={neighborhoodOptions}
                className='focus:outline-none w-full min-w-36 ml-4'
                value={selectedNeighborhood}
                onChange={(selected) =>
                  setSelectedNeighborhood(selected as any)
                }
                placeholder='Select neighborhood'
              />
            </div>
            <div className='flex items-center pb-10 w-full lg:w-auto'>
              <Select
                options={cuisineOptions}
                placeholder='Search restaurants...'
                className='focus:outline-none w-full ml-4 capitalize'
                value={selectedCuisine}
                onChange={(selected) => setSelectedCuisine(selected as any)}
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className='max-w-4xl py-20 mx-auto p-4'>
          <GoogleMaps
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
            center={{ lat: 13.7274902015168, lng: 100.57534908460062 }}
            zoom={14}
            markers={restaurants
              .filter((restaurant) => restaurant.googlePlacesData)
              .map((restaurant) => ({
                position: {
                  lat: restaurant.googlePlacesData!.lat,
                  lng: restaurant.googlePlacesData!.lng,
                },
                title: restaurant.name,
                content: `<h3>${restaurant.name}</h3><p>${
                  restaurant.googlePlacesData!.address
                }</p>`,
              }))}
          />
        </div>
      </section>

      <section className='bg-white max-w-4xl mx-auto rounded-xl shadow-xl p-10'>
        <h2 className={`${permanentMarker.className} text-4xl mb-6`}>Browse</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-5'>
          {restaurants.map(({ name, id, googlePlacesData }) => (
            <Link href={`/restaurants/${id}`} key={id}>
              <article className='h-96 relative justify-end overflow-hidden rounded-2xl bg-wheat-600 px-8 py-8 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transition ease-in-out duration-300'>
                {googlePlacesData?.photos && googlePlacesData?.photos && (
                  <div className='mb-6'>
                    <img
                      src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${googlePlacesData.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                      alt={name}
                      className='w-full h-48 object-cover rounded-lg shadow-lg'
                    />
                  </div>
                )}
                <div className='absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40' />
                <div className='absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10' />

                <div className='flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-white'>
                  <div className='-ml-4 flex items-center gap-x-4'>
                    <svg
                      viewBox='0 0 2 2'
                      className='-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50'>
                      <circle cx={1} cy={1} r={1} />
                    </svg>
                    {googlePlacesData && googlePlacesData.rating && (
                      <div>{googlePlacesData.rating.toFixed(1)} ★</div>
                    )}
                  </div>
                </div>
                <h3 className='mt-3 text-lg leading-6 font-semibold text-white'>
                  {name}
                </h3>
                {googlePlacesData && googlePlacesData.address && (
                  <p className='mt-2 text-sm text-white truncate'>
                    {googlePlacesData.address}
                  </p>
                )}
              </article>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
