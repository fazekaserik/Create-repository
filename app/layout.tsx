import type { Metadata, Viewport } from 'next'
import './globals.css'
import HamburgerMenu from '@/components/HamburgerMenu'

export const metadata: Metadata = {
  title: 'NextBody — See Your Transformation',
  description: 'Upload a photo and see your body transformation in 90 days. AI-powered fitness visualization.',
  openGraph: {
    title: 'NextBody — See Your Transformation',
    description: 'Upload a photo and see your body transformation in 90 days.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-black text-white antialiased">
        <HamburgerMenu />
        {children}
      </body>
    </html>
  )
}
