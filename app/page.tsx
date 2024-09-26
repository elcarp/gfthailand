'use client'
import React from 'react'
import Header from '~components/header'
import { MapPinIcon } from '@heroicons/react/24/outline'
import Select from 'react-select'
import { Permanent_Marker } from 'next/font/google'
import GoogleMaps from '~components/maps'

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
  ]
  const cuisineOptions = [
    { label: 'italian', value: 'italian' },
    { label: 'chinese', value: 'chinese' },
    { label: 'indian', value: 'indian' },
    { label: 'japanese', value: 'japanese' },
    { label: 'mexican', value: 'mexican' },
    { label: 'thai', value: 'thai' },
    { label: 'french', value: 'french' },
    { label: 'greek', value: 'greek' },
    { label: 'lebanese', value: 'lebanese' },
    { label: 'spanish', value: 'spanish' },
  ]

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
          <h1 className={`text-white text-4xl text-center font-black leading-12`}>
            Explore Thailand&apos;s best{' '}
            <span
              className={`${permanentMarker.className} clear-both block text-7xl`}
              // style={{ fontSize: 'inherit' }}
              >
              gluten-free
            </span>{' '}
            restaurants
          </h1>
          <div className='rounded-xl w-full lg:flex justify-between p-10 mt-2'>
            <div className='flex items-center'>
              <MapPinIcon aria-hidden='true' className='h-6 w-6 text-white' />
              <Select
                options={neighborhoodOptions}
                className='focus:outline-none min-w-36 ml-4'
              />
            </div>
            <div className='flex items-center w-full'>
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
      <section className='bg-white max-w-4xl mx-auto rounded-xl shadow-xl p-10'>
        <h2 className={`${permanentMarker.className} text-4xl`}>Trending</h2>
      </section>
    </>
  )
}
