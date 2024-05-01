import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.scss'
import 'react-toastify/dist/ReactToastify.css'
import { ReactNode } from 'react'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stocks app',
  description: 'Update description here',
}

interface PropTypes {
  children: ReactNode
  params: { locale: string }
}

export default function LocaleLayout({
  children,
  params: { locale },
}: PropTypes) {
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
