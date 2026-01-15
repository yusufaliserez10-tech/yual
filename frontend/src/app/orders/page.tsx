'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { ordersAPI } from '@/lib/api'
import { Order } from '@/types'
import { formatPrice, formatDateTime } from '@/lib/utils'
import { Package, CheckCircle, Clock, XCircle } from 'lucide-react'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const data = await ordersAPI.getMine()
      setOrders(data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'PROCESSING':
        return <Package className="h-5 w-5 text-blue-500" />
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'text-green-600'
      case 'PENDING':
        return 'text-yellow-600'
      case 'FAILED':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading orders...</div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link
              href="/products"
              className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className="text-sm font-medium">{order.status}</span>
                    </div>
                    
                    <div className={`text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0">
                            {item.product.imageUrl ? (
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.title}
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 rounded-md">
                                <span className="text-lg">📦</span>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <Link
                              href={`/products/${item.productId}`}
                              className="text-sm font-medium text-gray-900 hover:text-primary-600"
                            >
                              {item.product.title}
                            </Link>
                            <p className="text-xs text-gray-600">{item.productVariant.name}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            {item.quantity} × {formatPrice(item.unitPrice)}
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Total ({order.items.reduce((sum, item) => sum + item.quantity, 0)} items)
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
