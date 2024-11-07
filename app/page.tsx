'use client'
import React, { useEffect, useState } from 'react'
import Header from '~components/header'
import { MapPinIcon } from '@heroicons/react/24/outline'
import Select from 'react-select'
import { Permanent_Marker } from 'next/font/google'
import GoogleMaps from '~components/maps'
import RestaurantList from '~components/restaurants'
import { cuisines } from '~constants'

const permanentMarker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
})

export default function Home() {
  const neighborhoodOptions = [
    {
      label: 'Sukhumvit',
      value: 'sukhumvit',
    },
    {
      label: 'Silom',
      value: 'silom',
    },
    {
      label: 'Sathorn',
      value: 'sathorn',
    },
    {
      label: 'Bang Rak',
      value: 'bang rak',
    },
    {
      label: 'Chatuchak',
      value: 'chatuchak',
    },
    {
      label: 'Thonburi',
      value: 'thonburi',
    },
    {
      label: 'Bang Kapi',
      value: 'bang kapi',
    },
    {
      label: 'Phra Khanong',
      value: 'phra kanong',
    },
    {
      label: 'Ari',
      value: 'ari',
    },
    {
      label: 'Siam',
      value: 'Siam',
    },
  ]

  const cuisineOptions = cuisines.map((cuisine) => {
    return { label: cuisine, value: cuisine }
  })

  const [restaurants, setRestaurants] = useState([])

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

  useEffect(() => {
    fetchRestaurants()
  }, [])

  console.log(restaurants)
  return (
    <>
      <Header />

      <section
        className='w-full h-screen lg:h-screen-1/2 flex'
        style={{
          backgroundImage: `url('/images/gf-meal.jpg')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}>
        <div className='overlay w-full h-screen lg:h-screen-1/2 bg-black opacity-50 absolute' />
        <div className='max-w-4xl mx-auto p-10 absolute z-20 left-0 right-0'>
          <h1 className={`text-white text-4xl text-center leading-12`}>
            Explore Thailand&apos;s best{' '}
            <span
              className={`${permanentMarker.className} clear-both block text-7xl`}
              // style={{ fontSize: 'inherit' }}
            >
              gluten-free
            </span>{' '}
            restaurants
          </h1>
          <div className='rounded-xl w-full flex flex-wrap lg:flex-nowrap justify-between p-10 mt-2'>
            <div className='flex items-center pb-10'>
              <MapPinIcon aria-hidden='true' className='h-6 w-6 text-white' />
              <Select
                options={neighborhoodOptions}
                className='focus:outline-none w-full min-w-36 ml-4'
              />
            </div>
            <div className='flex items-center pb-10 w-full'>
              <Select
                options={cuisineOptions}
                placeholder='Search restaurants...'
                className='focus:outline-none w-full ml-4 capitalize'
              />
            </div>
          </div>
        </div>
      </section>
      <section>
        {' '}
        <div className='max-w-4xl py-20 mx-auto p-4'>
          <GoogleMaps
            apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAPS}`}
            center={{ lat: 13.741791324540523, lng: 100.55651768641842 }}
            zoom={12}
          />
        </div>
      </section>
      <section>{/* <RestaurantList /> Restaurants! */}</section>
      <section className='bg-white max-w-4xl mx-auto rounded-xl shadow-xl p-10'>
        <h2 className={`${permanentMarker.className} text-4xl`}>Trending</h2>
        <div className='grid grid-cols-3 gap-4'>
          {restaurants.map(({ name, photo }) => {
            return (
              <article
                key={name}
                className='relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80'>
                <img
                  alt=''
                  src={photo ? photo : ''}
                  className='absolute inset-0 -z-10 h-full w-full object-cover'
                />
                <div className='absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40' />
                <div className='absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10' />

                <div className='flex flex-wrap items-center gap-y-1 overflow-hidden text-sm/6 text-gray-300'>
                  <div className='-ml-4 flex items-center gap-x-4'>
                    <svg
                      viewBox='0 0 2 2'
                      className='-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50'>
                      <circle r={1} cx={1} cy={1} />
                    </svg>
                  </div>
                </div>
                <h3 className='mt-3 text-lg/6 font-semibold text-white'>
                  {name}
                </h3>
              </article>
              // <div
              //   key={name}
              //   className='rounded-xl shadow-xl p-3 flex items-center'>
              //   {name}
              //   {photo ? (
              //     <>
              //       <img src={photo} />
              //     </>
              //   ) : (
              //     ''
              //   )}
              // </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
