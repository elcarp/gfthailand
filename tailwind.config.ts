/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wheat: {
          '50': '#fef8ed',
          '100': '#fdf1db',
          '200': '#fae3b7',
          '300': '#f8d593',
          '400': '#f5c76f',
          '500': '#f3b94b',
          '600': '#c2943c',
          '700': '#926f2d',
          '800': '#614a1e',
          '900': '#31250f',
        },
        pomelo: {
          '50': '#fef0ed',
          '100': '#fde0db',
          '200': '#fac1b7',
          '300': '#f8a393',
          '400': '#f5846f',
          '500': '#f3654b',
          '600': '#c2513c',
          '700': '#923d2d',
          '800': '#61281e',
          '900': '#31140f',
        },
        lime: {
          '50': '#fbfeed',
          '100': '#f7fddb',
          '200': '#f0fab7',
          '300': '#e8f893',
          '400': '#e1f56f',
          '500': '#d9f34b',
          '600': '#aec23c',
          '700': '#82922d',
          '800': '#57611e',
          '900': '#2b310f',
        },
      },
      height: {
        'screen-1/3': '33vh',
        'screen-1/2': '50vh',
        'screen-2/3': '66vh',
        'screen-3/4': '75vh',
      },
      fontSize: {
        xs: '.75rem',
        sm: '.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '2.5xl': '1.75rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
    },
  },
  plugins: [],
}
