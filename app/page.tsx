'use client'

import React, { useEffect, useState } from 'react'
import { Permanent_Marker } from 'next/font/google'
import { MapPinIcon } from '@heroicons/react/24/outline'
import dynamic from 'next/dynamic'
import Header from '~/components/header'
import { cuisines } from '~/constants'
import { SingleValue } from 'react-select'

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

interface Restaurant {
  name: string
  photo: string
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState<SingleValue<Option>>(null)
  const [selectedCuisine, setSelectedCuisine] =
    useState<SingleValue<Option>>(null)

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('/api/get-restaurant', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            Expires: '0',
          },
        })
        const data = await response.json()
        setRestaurants(data.restaurants)
      } catch (error) {
        console.error('Error fetching restaurants:', error)
      }
    }

    fetchRestaurants()
  }, [])

  return (
    <>
      <Header />

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
            markers={[
              {
                position: { lat: 13.7274902015168, lng: 100.57534908460062 },
                title: 'Broccoli Revolution',
                content: '<h3>Broccoli Revolution</h3>',
              },
              {
                position: { lat: 13.7274817565562, lng: 100.56823675334469 },
                title: 'Vistro',
                content: '<h3>Vistro</h3>',
              },
            ]}
          />
        </div>
      </section>

      <section className='bg-white max-w-4xl mx-auto rounded-xl shadow-xl p-10'>
        <h2 className={`${permanentMarker.className} text-4xl mb-6`}>Browse</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {restaurants.map(({ name, photo }) => (
            <article
              key={name}
              className='relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80'>
              <img
                alt={name}
                src={photo || '/images/default-food.jpg'}
                className='absolute inset-0 -z-10 h-full w-full object-cover'
              />
              <div className='absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40' />
              <div className='absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10' />

              <div className='flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300'>
                <div className='-ml-4 flex items-center gap-x-4'>
                  <svg
                    viewBox='0 0 2 2'
                    className='-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50'>
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                </div>
              </div>
              <h3 className='mt-3 text-lg leading-6 font-semibold text-white'>
                {name}
              </h3>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
