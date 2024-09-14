'use client'

import Image from 'next/image'

import { Map, Marker } from 'pigeon-maps'
import { useState } from 'react'

export default function Home() {
  const [center, setCenter] = useState([50.879, 4.6997])
  const [zoom, setZoom] = useState(11)
  return (
    <>
      <Map
        height={300}
        center={center}
        zoom={zoom}
        onBoundsChanged={({ center, zoom }) => {
          setCenter(center)
          setZoom(zoom)
        }}
      />
    </>
  )
}
