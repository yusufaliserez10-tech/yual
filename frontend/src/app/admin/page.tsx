'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useAuth } from '@/lib/auth-context'
import { ordersAPI, productsAPI } from '@/lib/api'
import { Order, Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/')
      return
    }

    const fetchData = async () => {
      try {
        const [ordersData, productsData] = await Promise.all([
          ordersAPI.getAll(),
          productsAPI.getAll()
        ])
        setOrders(ordersData)
        setProducts(productsData)
      } catch (error) {
        console.error('Failed to fetch admin data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  const totalRevenue = orders
    .filter(order => order.paymentStatus === 'PAID')
    .reduce((sum, order) => sum + order.totalAmount, 0)

  const totalOrders = orders.length
  const totalProducts = products.length
  const pendingOrders = orders.filter(order => order.status === 'PENDING').length

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your store and view analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatPrice(totalRevenue)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900">{totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
            </div>
            <div className="p-6">
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order.id.slice(-8)}
                        </p>
                        <p className="text-xs text-gray-600">
                          {order.user?.name || 'Guest'} • {order.items.length} items
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <p className={`text-xs ${
                          order.status === 'COMPLETED' ? 'text-green-600' :
                          order.status === 'PROCESSING' ? 'text-blue-600' :
                          order.status === 'PENDING' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <a
                  href="/admin/products"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Manage Products</h3>
                  <p className="text-xs text-gray-600">Add, edit, or remove products</p>
                </a>
                
                <a
                  href="/admin/orders"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Manage Orders</h3>
                  <p className="text-xs text-gray-600">View and update order status</p>
                </a>
                
                <a
                  href="/products"
                  target="_blank"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <h3 className="text-sm font-medium text-gray-900 mb-1">View Store</h3>
                  <p className="text-xs text-gray-600">See your store as customers do</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
