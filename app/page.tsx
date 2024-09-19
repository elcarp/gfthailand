'use client'

import Image from 'next/image'

import glutenBg from '~public/images/gluten-bg.jpg'

import React from 'react'
// import { Suspense } from 'react';
import { GoogleMap, GoogleMapApiLoader, Marker } from 'react-google-map-wrapper'
// import { Fallback } from '../components';

function Map() {
  return (
    // you can pass props to map container element.
    // use Tailwind CSS or styled-components or anything to style your container.
    <GoogleMap
      className='h-full'
      zoom={17}
      center={{ lat: 13.735925009176135, lng: 100.56334643097027 }}>
      <Marker lat={13.735925009176135} lng={100.56334643097027} />
    </GoogleMap>
  )
}
export default function Home() {
  return (
    <>
      <section className='flex'>
        <div className='h-screen w-1/2'>
          <GoogleMapApiLoader
            apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAPS}`}
            suspense>
            <Map />
          </GoogleMapApiLoader>
        </div>
        <div className='w-1/2 relative h-screen'>
          <Image src={glutenBg} alt='gluten' layout='fill' objectFit='cover' />
        </div>
      </section>
    </>
  )
}
