'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface Marker {
  position: {
    lat: number
    lng: number
  }
  title: string
  content: string
}

interface GoogleMapsProps {
  apiKey: string
  center: {
    lat: number
    lng: number
  }
  zoom: number
  markers: Marker[]
}

const GoogleMaps: React.FC<GoogleMapsProps> = ({
  apiKey,
  center,
  zoom,
  markers,
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (!mapLoaded) {
      const loader = new Loader({
        apiKey,
        version: 'weekly',
      })

      loader.load().then(() => {
        if (mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center,
            zoom,
          })

          markers.forEach((marker) => {
            const newMarker = new google.maps.Marker({
              position: marker.position,
              map,
              title: marker.title,
            })

            const infoWindow = new google.maps.InfoWindow({
              content: marker.content,
            })

            newMarker.addListener('click', () => {
              infoWindow.open(map, newMarker)
            })
          })

          setMapLoaded(true)
        }
      })
    }
  }, [apiKey, center, zoom, markers, mapLoaded])

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
}

export default GoogleMaps
