'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Select from 'react-select'
import Header from '~components/header'
import { cuisines } from '~constants'

export default function ProtectedContent(): JSX.Element {
  const [restaurants, setRestaurants] = useState<any>()
  const [restaurantName, setRestaurantName] = useState<string>('')
  const [restaurantId, setRestaurantId] = useState<string>('')
  const [neighborhood, setNeighborhood] = useState<any>()
  const [latitude, setLatitude] = useState<number>()
  const [longitude, setLongitude] = useState<number>()
  const [tags, setTags] = useState<any>()
  const [deleteId, setDeleteId] = useState<string>('')
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [editing, setEditing] = useState<boolean>(false)
  const [showAddModal, setShowAddModal] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timestamp, setTimestamp] = useState('')

  const router = useRouter()

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/get-restaurant', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
        },
      })
      const data = await response.json()
      setRestaurants(data.restaurants)
      setTimestamp(data.timestamp)
    } catch (error) {
      console.error('Error fetching restaurants:', error)
    }
  }

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const neighborhoodOptions = [
    { label: 'Sukhumvit', value: 'sukhumvit' },
    { label: 'Silom', value: 'silom' },
    { label: 'Sathorn', value: 'sathorn' },
    { label: 'Bang Rak', value: 'bang rak' },
    { label: 'Chatuchak', value: 'chatuchak' },
    { label: 'Thonburi', value: 'thonburi' },
    { label: 'Bang Kapi', value: 'bang kapi' },
    { label: 'Phra Khanong', value: 'phra kanong' },
    { label: 'Ari', value: 'ari' },
    { label: 'Siam', value: 'Siam' },
  ]

  const cuisineOptions = cuisines.map((cuisine) => ({
    label: cuisine,
    value: cuisine,
  }))

  const id = restaurantName && restaurantName.replace(/ /g, '-').toLowerCase()
  const tagValues = tags && tags?.map(({ value }: any) => value)

  const handleAddRestaurant = async () => {
    const restaurantData = {
      name: restaurantName,
      id: id,
      neighborhood: neighborhood?.value,
      address: '',
      coordinates: {
        latitude: latitude,
        longitude: longitude,
      },
      tags: tagValues,
    }
    try {
      setIsLoading(true)
      const response = await fetch('/api/add-restaurant', {
        cache: 'no-store',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurantData),
      })

      if (!response.ok) {
        throw new Error('Failed to add restaurant')
      }

      console.log('Restaurant added successfully!')

      // Clear the form
      setRestaurantName('')
      setNeighborhood({ value: '' })
      setLatitude(undefined)
      setLongitude(undefined)
      setTags(undefined)

      // Refresh the list of restaurants
      await fetchRestaurants()

      router.refresh()
    } catch (error) {
      console.error('Error adding restaurant:', error)
      setError('Failed to add restaurant. Please try again.')
    } finally {
      setIsLoading(false)
      setShowAddModal(false)
    }
  }
  function clearForm() {
    setRestaurantName('')
    setNeighborhood({ value: '' })
    setLatitude(undefined)
    setLongitude(undefined)
    setTags(undefined)
    setRestaurantId('')
    setEditing(false)
  }
  function closeModal() {
    clearForm()
    setShowAddModal(false)
  }
  function setEdit(
    restaurantName: string,
    id: string,
    longitude?: number,
    latitude?: number,
    neighborhood?: string,
    tags?: any
  ) {
    setShowAddModal(true)
    setRestaurantName(restaurantName)
    setRestaurantId(id)
    setLongitude(longitude)
    setLatitude(latitude)
    setNeighborhood({ value: neighborhood, label: neighborhood })
    setEditing(true)
    setTags(tags.map((tag: string) => ({ value: tag, label: tag })))
  }
  console.log(neighborhood, 'neighborhood')

  const handleEditRestaurant = async () => {
    const restaurantData = {
      name: restaurantName,
      id: restaurantId, // Use the existing restaurantId instead of generating a new one
      neighborhood: neighborhood?.value,
      address: '',
      coordinates: {
        latitude: latitude,
        longitude: longitude,
      },
      tags: tagValues,
    }
    try {
      setIsLoading(true)
      const response = await fetch('/api/edit-restaurant', { // Change the API endpoint to edit-restaurant
        cache: 'no-store',
        method: 'PUT', // Use PUT method for updating
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurantData),
      })
  
      if (!response.ok) {
        throw new Error('Failed to edit restaurant')
      }
  
      console.log('Restaurant edited successfully!')
  
      // Clear the form
      clearForm()
  
      // Refresh the list of restaurants
      await fetchRestaurants()
  
      router.refresh()
    } catch (error) {
      console.error('Error editing restaurant:', error)
      setError('Failed to edit restaurant. Please try again.')
    } finally {
      setIsLoading(false)
      setShowAddModal(false)
    }
  }
  function handleDeleteModal(id: string) {
    setShowDeleteModal(true)
    setDeleteId(id)
  }

  const handleDelete = async () => {
    try {
      const encodedId = encodeURIComponent(deleteId)
      const response = await fetch(`/api/delete-restaurant?id=${encodedId}`, {
        cache: 'no-store',
        method: 'DELETE',
      })

      if (response.ok) {
        console.log('deleted!')
        setShowDeleteModal(false)
        await fetchRestaurants()
      } else {
        throw new Error('Failed to delete restaurant')
      }
    } catch (error) {
      console.error('Failed to delete restaurant:', error)
      setError('Failed to delete restaurant. Please try again.')
    }
  }

  return (
    <>
      <div
        className={`${
          showDeleteModal ? 'block' : 'hidden'
        } bg-white absolute rounded-xl p-10 top-1/3 left-0 right-0 mx-auto w-1/3 z-50 shadow-xl`}>
        <span className='block text-center'>Are you sure?</span>
        <div className='flex mt-5 justify-center w-full'>
          <button
            type='button'
            onClick={() => setShowDeleteModal(false)}
            className='mx-2 block rounded-md transparent px-3 py-2 text-center text-sm font-semibold text-pomelo-600 hover:text-white shadow-sm hover:bg-pomelo-600 border-pomelo-600 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pomelo-600'>
            Cancel
          </button>
          <button
            type='button'
            onClick={handleDelete}
            className='mx-2 block rounded-md bg-pomelo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-pomelo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pomelo-600'>
            Yes, Delete
          </button>
        </div>
      </div>
      <div
        className={`${
          showAddModal ? 'block' : 'hidden'
        } bg-white absolute rounded-xl p-10 top-1/4 left-0 right-0 mx-auto max-w-4xl z-50 shadow-xl`}>
        <div className='max-w-4xl mx-auto py-10 grid grid-cols-2 gap-4'>
          <div>
            <label htmlFor='restaurantName' className='sr-only'>
              Restaurant Name
            </label>
            <input
              id='restaurantName'
              name='Restaurant Name'
              type='text'
              placeholder='Restaurant Name'
              value={restaurantName}
              onChange={({ target }) => setRestaurantName(target.value)}
              className='block w-full px-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>
          <div>
            <Select
              options={neighborhoodOptions}
              className='text-sm text-gray-900 placeholder:text-gray-400'
              placeholder='Select Neighborhood'
              value={neighborhood}
              onChange={(selected) => setNeighborhood(selected)}
            />
          </div>
          <div>
            <label htmlFor='latitude' className='sr-only'>
              Latitude
            </label>
            <input
              id='latitude'
              name='Latitude'
              type='number'
              placeholder='Latitude'
              value={latitude}
              onChange={({ target }) => setLatitude(parseFloat(target.value))}
              className='block w-full px-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>
          <div>
            <label htmlFor='longitude' className='sr-only'>
              Longitude
            </label>
            <input
              id='longitude'
              name='Longitude'
              type='number'
              placeholder='Longitude'
              value={longitude}
              onChange={({ target }) => setLongitude(parseFloat(target.value))}
              className='block w-full px-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>
          <div className='col-span-2'>
            <Select
              isMulti
              name='cuisines'
              options={cuisineOptions}
              className='basic-multi-select text-sm'
              classNamePrefix='select'
              placeholder='Select Cuisine'
              onChange={(selected) => setTags(selected)}
              value={tags}
            />
          </div>
        </div>
        <div className='flex mt-5 justify-center w-full'>
          <button
            type='button'
            onClick={() => closeModal()}
            className='mx-2 block rounded-md transparent px-3 py-2 text-center text-sm font-semibold text-pomelo-600 hover:text-white shadow-sm hover:bg-pomelo-600 border-pomelo-600 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pomelo-600'>
            Cancel
          </button>
          <button
            type='button'
            onClick={editing ? handleEditRestaurant : handleAddRestaurant}
            className='mx-2 block rounded-md bg-pomelo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-pomelo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pomelo-600'>
            {editing ? 'Update' : 'Submit'}
          </button>
        </div>
      </div>

      <Header />
      <section className='py-20'>
        <div className='px-4 sm:px-6 lg:px-8 container mx-auto'>
          <div className='sm:flex sm:items-center'>
            <div className='sm:flex-auto'>
              <h1 className='text-base font-semibold leading-6 text-gray-900'>
                Restaurants
              </h1>
              <p className='mt-2 text-sm text-gray-700'>
                A list of all the restaurants included in the database.
              </p>
            </div>
            <div className='mt-4 sm:ml-16 sm:mt-0 sm:flex-none'>
              <button
                type='button'
                onClick={() => setShowAddModal(true)}
                className='block rounded-md bg-pomelo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-pomelo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pomelo-600'>
                Add restaurant
              </button>
            </div>
          </div>
          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
                <table className='min-w-full divide-y divide-gray-300'>
                  <thead>
                    <tr>
                      <th
                        scope='col'
                        className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0'>
                        Name
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                        Neighborhood
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                        Tags
                      </th>
                      <th
                        scope='col'
                        className='relative py-3.5 pl-3 pr-4 sm:pr-0'>
                        <span className='sr-only'>Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {restaurants &&
                      restaurants.map(
                        ({ name, neighborhood, tags, id }: any) => (
                          <tr key={name}>
                            <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0'>
                              {name}
                            </td>
                            <td className='capitalize whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                              {neighborhood}
                            </td>
                            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                              {tags &&
                                tags?.map((tag: string) => (
                                  <span
                                    key={tag}
                                    className='capitalize mx-2 inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10'>
                                    {tag}
                                  </span>
                                ))}
                            </td>
                            <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0'>
                              <a
                                href='#'
                                onClick={() =>
                                  setEdit(
                                    name,
                                    id,
                                    latitude,
                                    longitude,
                                    neighborhood
                                  )
                                }
                                className='text-pomelo-600 hover:text-pomelo-900 mx-1'>
                                Edit
                                <span className='sr-only'>, {name}</span>
                              </a>
                              <a
                                onClick={() => handleDeleteModal(id)}
                                className='text-pomelo-600 hover:text-pomelo-900 mx-1 cursor-pointer'>
                                Delete
                                <span className='sr-only'>, {name}</span>
                              </a>
                            </td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
                <button
                  className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
                  onClick={fetchRestaurants}>
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
