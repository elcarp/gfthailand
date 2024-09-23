'use client'

import { useEffect, useRef, useState } from 'react'

interface GoogleMapsProps {
  apiKey: string
  center: { lat: number; lng: number }
  zoom?: number
}

export default function GoogleMaps({
  apiKey,
  center,
  zoom = 10,
}: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapLoadError, setMapLoadError] = useState<string | null>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS}`
    script.async = true
    script.defer = true
    script.onerror = () => setMapLoadError('Failed to load Google Maps')

    script.onload = () => {
      setMapLoaded(true)
      if (mapRef.current && window.google) {
        new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
        })
      }
    }

    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [apiKey, center, zoom])

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
