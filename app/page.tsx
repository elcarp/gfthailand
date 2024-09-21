import React from 'react'
import Header from '~components/header'
import Image from 'next/image'
import Meal from '~public/images/gf-meal.jpg'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function Home() {
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
          <div className='rounded-xl bg-white w-full shadow-xl p-10'>
            <MagnifyingGlassIcon aria-hidden='true' className='h-6 w-6' />
          </div>
        </div>
      </section>
    </>
  )
}
