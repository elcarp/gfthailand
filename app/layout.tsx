import type { Metadata } from 'next'
import './globals.css'
import { Varela } from 'next/font/google'
import Header from '~components/header'
import Footer from '~components/footer'

const varela = Varela({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Gluten Free Thailand',
  description: 'Curated Gluten Free Restaurants in Thailand',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${varela.className} antialiased`}>
        <Header />
        {children}
        <Footer/>
      </body>
    </html>
  )
}
