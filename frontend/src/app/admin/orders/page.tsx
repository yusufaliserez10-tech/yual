'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useAuth } from '@/lib/auth-context'
import { ordersAPI } from '@/lib/api'
import { Order } from '@/types'
import { formatPrice, formatDateTime } from '@/lib/utils'
import { CheckCircle, Clock, Package, XCircle, RefreshCw } from 'lucide-react'

export default function AdminOrdersPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/')
      return
    }

    fetchOrders()
  }, [user, router])

  const fetchOrders = async () => {
    try {
      const data = await ordersAPI.getAll()
      setOrders(data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId)
    try {
      await ordersAPI.updateStatus(orderId, newStatus)
      await fetchOrders()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update order status')
    } finally {
      setUpdatingOrderId(null)
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

  const getNextStatusOptions = (currentStatus: string) => {
    switch (currentStatus) {
      case 'PENDING':
        return [
          { value: 'PROCESSING', label: 'Mark as Processing', color: 'text-blue-600' },
          { value: 'CANCELLED', label: 'Cancel Order', color: 'text-red-600' }
        ]
      case 'PROCESSING':
        return [
          { value: 'COMPLETED', label: 'Mark as Completed', color: 'text-green-600' },
          { value: 'CANCELLED', label: 'Cancel Order', color: 'text-red-600' }
        ]
      case 'COMPLETED':
        return []
      case 'CANCELLED':
        return []
      default:
        return []
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">Manage customer orders and fulfillment</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600">
              When customers place orders, they will appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.id.slice(-8)}
                      </div>
                      <div className={`text-xs ${
                        order.paymentStatus === 'PAID' ? 'text-green-600' :
                        order.paymentStatus === 'PENDING' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {order.paymentStatus}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.user?.name || 'Guest'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user?.email || 'No email'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(order.totalAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {getNextStatusOptions(order.status).map((option) => (
                          <button
                            key={option.value}
                            onClick={() => updateOrderStatus(order.id, option.value)}
                            disabled={updatingOrderId === order.id}
                            className={`flex items-center space-x-1 ${option.color} hover:opacity-75 disabled:opacity-50`}
                          >
                            {updatingOrderId === order.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <RefreshCw className="h-4 w-4" />
                            )}
                            <span className="text-xs">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
