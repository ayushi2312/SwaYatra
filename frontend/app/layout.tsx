import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SWA-YATRA - Smart Heritage Tour Guide',
  description: 'Official AI-powered Indian heritage tour guide and smart travel assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

