'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  quantity: number
}

export function SlideOutCart() {
  const [isOpen, setIsOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

    const handleOpenCart = () => setIsOpen(true)
    window.addEventListener('openCart', handleOpenCart)
    
    return () => window.removeEventListener('openCart', handleOpenCart)
  }, [])

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
        }
        return item
      }).filter(Boolean) as CartItem[]
      
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
  }

  const removeItem = (id: string) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.id !== id)
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-2xl font-bold">Shopping Cart</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">Your cart is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-gray-600">Size: {item.size}</p>
                            <p className="font-semibold">${item.price.toFixed(2)}</p>
                            
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1 hover:bg-gray-200 rounded"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1 hover:bg-gray-200 rounded"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => removeItem(item.id)}
                                className="ml-auto p-1 hover:bg-red-100 text-red-500 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div className="border-t p-6 space-y-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                      Proceed to Checkout
                    </button>
                    
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
