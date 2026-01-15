'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { cartAPI, ordersAPI } from '@/lib/api'
import { Cart, CartItem } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const data = await cartAPI.get()
      setCart(data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch cart')
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setIsUpdating(itemId)
    try {
      await cartAPI.updateItem(itemId, newQuantity)
      await fetchCart()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update quantity')
    } finally {
      setIsUpdating(null)
    }
  }

  const removeItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to remove this item?')) return

    setIsUpdating(itemId)
    try {
      await cartAPI.removeItem(itemId)
      await fetchCart()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to remove item')
    } finally {
      setIsUpdating(null)
    }
  }

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return

    setIsCheckingOut(true)
    try {
      const order = await ordersAPI.create()
      alert('Order placed successfully!')
      // Redirect to order success page or orders page
      window.location.href = '/orders'
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to place order')
    } finally {
      setIsCheckingOut(false)
    }
  }

  const calculateTotal = () => {
    if (!cart) return 0
    return cart.items.reduce((total, item) => {
      return total + (item.productVariant.price * item.quantity)
    }, 0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading cart...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-red-600">Error: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link
              href="/products"
              className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Items ({cart.items.length})</h2>
                
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0">
                        {item.productVariant.product.imageUrl ? (
                          <img
                            src={item.productVariant.product.imageUrl}
                            alt={item.productVariant.product.title}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 rounded-md">
                            <span className="text-2xl">📦</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <Link
                          href={`/products/${item.productVariant.productId}`}
                          className="text-lg font-medium text-gray-900 hover:text-primary-600"
                        >
                          {item.productVariant.product.title}
                        </Link>
                        <p className="text-sm text-gray-600">{item.productVariant.name}</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(item.productVariant.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isUpdating === item.id || item.quantity <= 1}
                          className="p-1 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        
                        <span className="w-12 text-center">{item.quantity}</span>
                        
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isUpdating === item.id || item.quantity >= item.productVariant.stock}
                          className="p-1 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Item Total and Remove */}
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatPrice(item.productVariant.price * item.quantity)}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={isUpdating === item.id}
                          className="text-red-600 hover:text-red-700 text-sm flex items-center mt-1 disabled:opacity-50"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                <div className="mt-4 text-center">
                  <Link
                    href="/products"
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
