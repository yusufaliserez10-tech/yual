'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { ShoppingCart, User, LogOut } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            YUAL
          </Link>

          <nav className="flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-gray-900">
              Products
            </Link>
            
            <Link href="/cart" className="text-gray-700 hover:text-gray-900 relative">
              <ShoppingCart className="h-5 w-5" />
              {/* Cart count will be added later */}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="text-gray-700 hover:text-gray-900">
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-gray-900 flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
