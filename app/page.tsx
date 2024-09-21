'use client'
import React from 'react'
import Header from '~components/header'
import Image from 'next/image'
import Meal from '~public/images/gf-meal.jpg'
import { MapPinIcon } from '@heroicons/react/24/outline'
import Select from 'react-select'
import { Ms_Madi } from 'next/font/google'

const msMadi = Ms_Madi({
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

      <section className='w-full'>
        <div className='relative h-screen w-full'>
          <Image src={Meal} object-fit='cover' alt='meal' />
        </div>
        <div
          className='absolute top-1/3 left-0 right-0 w-3/4 text-center mx-auto shadow-xl rounded-xl p-10 z-20'
          style={{ backgroundColor: 'rgb(255 255 255 / 90%)' }}>
          <h1 className={`${msMadi.className} text-4xl`}>
            Explore the best gluten free restaurants in Thailand
          </h1>
          <div className='rounded-xl bg-white w-full flex justify-between shadow-xl p-10 mt-2'>
            <div className='flex items-center'>
              <MapPinIcon aria-hidden='true' className='h-6 w-6' />
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
    </>
  )
}
