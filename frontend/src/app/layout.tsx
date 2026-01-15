import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/lib/auth-context'

export const metadata: Metadata = {
  title: 'YUAL - Shopify Clone',
  description: 'A complete e-commerce platform built with Next.js and Node.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
