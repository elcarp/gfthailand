'use client'

import { useState, useEffect } from 'react'
import Header from '~components/header'

export default function Manager(): any {
  const [restaurants, setRestaurants] = useState<any>()
  const [restaurantName, setRestaurantName] = useState<string>()

  useEffect(() => {
    async function fetchRestaurants() {
      const response = await fetch('/api/get-restaurant')
      if (response.ok) {
        const data = await response.json()
        setRestaurants(data)
      }
    }

    fetchRestaurants()
  }, [])
  console.log(restaurants)

  const restaurantsList = restaurants && restaurants.restaurants

  const id = restaurantName && restaurantName.replace(/ /g, '-').toLowerCase()
  

  const handleSubmit = async () => {
    // event.preventDefault()
    await fetch('/api/add-restaurant', {
      // body: JSONdata,

      method: 'POST',
    })
    console.log('submitted!')
  }
  return (
    <>
      <Header />
      <section className='py-20'>
        <div className='max-w-4xl mx-auto py-10'>
        <div>
          <label htmlFor='email' className='sr-only'>
            Email
          </label>
          <input
            id='restaurantName'
            name='Restaraunt Name'
            type='text'
            placeholder='Restaurant Name'
            onChange={({ target }) => setRestaurantName(target.value)}
            className='block w-1/4 px-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />
        </div>
        </div>
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
                onClick={() => handleSubmit()}
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
                    {restaurantsList &&
                      restaurantsList.map(
                        ({  name, neighborhood, tags  }: any) => (
                          <tr key={name}>
                            <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0'>
                              {name}
                            </td>
                            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                              {neighborhood}
                            </td>
                            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                              {tags.map((tag: string) => {
                                return (
                                  <>
                                    <span className='capitalize mx-2 inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10'>
                                      {tag}
                                    </span>
                                  </>
                                )
                              })}
                            </td>

                            <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0'>
                              <a
                                href='#'
                                className='text-pomelo-600 hover:text-pomelo-900'>
                                Edit
                                <span className='sr-only'>, {name}</span>
                              </a>
                            </td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
