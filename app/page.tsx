'use client'

import Image from 'next/image'

// import { Map, Marker } from 'pigeon-maps'
import { useState } from 'react'
import glutenBg from '~public/images/gluten-bg.jpg'

import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import React from 'react'

const containerStyle = {
  width: '400px',
  height: '400px',
}

const center = {
  lat: -3.745,
  lng: -38.523,
}

export default function Home() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR_API_KEY',
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center)
    map.fitBounds(bounds)

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  // const [hue, setHue] = useState(0)
  // const color = `hsl(${hue % 360}deg 39% 70%)`
  return (
    <>
      <section className='flex'>
        <div className='h-screen w-1/2'>
          isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}>
            {/* Child components, such as markers, info windows, etc. */}
            <></>
          </GoogleMap>
          ) : <></>
          {/* <Map defaultCenter={[13.743544035029018, 100.56214878374486]} defaultZoom={11}>
            <Marker
              width={50}
              anchor={[50.879, 4.6997]}
              color={color}
              onClick={() => setHue(hue + 20)}
            />
            <Marker
              width={50}
              anchor={[50.879, 4.6997]}
              color={color}
              onClick={() => setHue(hue + 20)}></Marker>
          </Map> */}
        </div>
        <div className='w-1/2 relative h-screen'>
          <Image src={glutenBg} alt='gluten' layout='fill' objectFit='cover' />
        </div>
      </section>
    </>
  )
}
