import React from 'react'
import Header from '~components/header'
import Image from 'next/image'
import Meal from '~public/images/gf-meal.jpg'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Select } from '@headlessui/react'

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

  return (
    <>
      <Header />

      <section className='w-full'>
        <div className='relative h-screen w-full'>
          <Image src={Meal} object-fit='cover' alt='meal' />
        </div>
        <div
          className='absolute top-1/2 left-0 right-0 w-3/4 text-center mx-auto shadow-xl rounded-xl p-10 z-20'
          style={{ backgroundColor: 'rgb(255 255 255 / 90%)' }}>
          <h1 className='text-2xl font-bold'>
            Explore the best gluten free restaurants in Thailand
          </h1>
          <div className='rounded-xl bg-white w-full flex shadow-xl p-10'>
            <MagnifyingGlassIcon aria-hidden='true' className='h-6 w-6' />
            <Select className='focus:outline-none min-w-20 ml-4'>
              {neighborhoodOptions.map(({ label, value }) => {
                return (
                  <>
                    <option key={value} value={value}>{label}</option>
                  </>
                )
              })}
            </Select>
          </div>
        </div>
      </section>
    </>
  )
}
