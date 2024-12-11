import React from 'react'
import { useLoadScript, Autocomplete } from '@react-google-maps/api'
// import { Input } from '@/components/ui/input'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const libraries = ['places']

export function PlacesAutocomplete() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as ['places'],
  })

  const [autocomplete, setAutocomplete] =
    React.useState<google.maps.places.Autocomplete | null>(null)
  const [placeInfo, setPlaceInfo] = React.useState<{
    name: string
    latitude: number
    longitude: number
    website: string
    photoUrl: string
  } | null>(null)

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete)
  }

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()
      if (place.geometry && place.geometry.location) {
        setPlaceInfo({
          name: place.name || '',
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          website: place.website || '',
          photoUrl:
            place.photos && place.photos[0] ? place.photos[0].getUrl() : '',
        })
      }
    } else {
      console.log('Autocomplete is not loaded yet!')
    }
  }

  if (loadError) return <div>Error loading maps</div>
  if (!isLoaded) return <div>Loading...</div>

  return (
    <div className='w-full max-w-md mx-auto space-y-4'>
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <input type='text' placeholder='Enter a location' className='w-full' />
      </Autocomplete>
      {placeInfo && (
        <div>
          <div>
            <div>{placeInfo.name}</div>
          </div>
          <div>
            <p>Latitude: {placeInfo.latitude}</p>
            <p>Longitude: {placeInfo.longitude}</p>
            {placeInfo.website && (
              <p>
                Website:{' '}
                <a
                  href={placeInfo.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 hover:underline'>
                  {placeInfo.website}
                </a>
              </p>
            )}
            {placeInfo.photoUrl && (
              <img
                src={placeInfo.photoUrl}
                alt={placeInfo.name}
                className='mt-2 w-full h-48 object-cover rounded-md'
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
