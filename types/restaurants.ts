export interface Restaurant {
  name: string
  photo: string
  id: string
  googlePlacesData?: {
    photos: any
    address: string
    lat: number
    lng: number
    rating: number
    phone: string
  }
}

