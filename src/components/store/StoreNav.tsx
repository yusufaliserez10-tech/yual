'use client'

import { ShoppingCart, User } from 'lucide-react'
import { SlideOutCart } from './SlideOutCart'

export function StoreNav() {
  const openCart = () => {
    window.dispatchEvent(new CustomEvent('openCart'))
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">YUAL</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-900 hover:text-gray-600">Home</a>
              <a href="/products" className="text-gray-900 hover:text-gray-600">Products</a>
              <a href="/about" className="text-gray-900 hover:text-gray-600">About</a>
              <a href="/contact" className="text-gray-900 hover:text-gray-600">Contact</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <User className="w-5 h-5" />
              </button>
              <button 
                onClick={openCart}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <SlideOutCart />
    </>
  )
}
