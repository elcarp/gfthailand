'use client'

import { useEffect, useRef, useState } from 'react'

interface Marker {
  position: { lat: number; lng: number }
  title?: string
  content?: string
}

interface GoogleMapsProps {
  apiKey: string
  center: { lat: number; lng: number }
  zoom?: number
  markers?: Marker[]
}

export default function GoogleMaps({
  apiKey,
  center,
  zoom = 10,
  markers = [],
}: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapLoadError, setMapLoadError] = useState<string | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
    script.async = true
    script.defer = true
    script.onerror = () => setMapLoadError('Failed to load Google Maps')

    script.onload = () => {
      setMapLoaded(true)
      if (mapRef.current && window.google) {
        const newMap = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
        })
        setMap(newMap)

        let currentInfoWindow: google.maps.InfoWindow | null = null

        // Add markers with click popups
        markers.forEach((marker) => {
          const markerInstance = new window.google.maps.Marker({
            position: marker.position,
            map: newMap,
            title: marker.title,
          })

          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div>${marker.content || marker.title}</div>`,
          })

          markerInstance.addListener('click', () => {
            if (currentInfoWindow) {
              currentInfoWindow.close()
            }
            infoWindow.open(newMap, markerInstance)
            currentInfoWindow = infoWindow
          })
        })

        newMap.addListener('click', () => {
          if (currentInfoWindow) {
            currentInfoWindow.close()
          }
        })
      }
    }

    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [apiKey, center, zoom, markers])

  if (mapLoadError) {
    return (
      <div className='flex items-center justify-center h-[400px] bg-gray-100 rounded-lg'>
        <div className='text-center'>
          <p className='text-red-500 mb-4'>{mapLoadError}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className='relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden'>
      <div ref={mapRef} className='w-full h-full' />
      {!mapLoaded && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      )}
    </div>
  )
}
