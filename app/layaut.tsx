import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Weight Tracker',
  description: 'Track your weight progress',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  )
}
