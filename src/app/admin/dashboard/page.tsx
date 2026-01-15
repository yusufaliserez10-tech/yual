/**
 * Admin Dashboard - Main Hub
 * Enterprise-grade dashboard with real-time analytics and quick actions
 */

'use client'

import { useState, useEffect } from 'react'
import { 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  DollarSign,
  Eye,
  Plus,
  Settings,
  LogOut
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { db } from '@/lib/database'
import { Analytics, Product, Order } from '@/types'

export default function AdminDashboard() {
  const { getSession, logout, isSuperAdmin } = useAuth()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [topProducts, setTopProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [analyticsData, ordersData, productsData] = await Promise.all([
        db.getAnalytics(),
        db.getOrders(),
        db.getProducts()
      ])

      setAnalytics(analyticsData)
      
      // Get recent orders (last 5)
      const recent = ordersData
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
      setRecentOrders(recent)

      // Get top products (mock data for now)
      setTopProducts(productsData.slice(0, 5))
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const session = getSession()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">YUAL Dashboard</h1>
              {isSuperAdmin() && (
                <span className="ml-3 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                  Super Admin
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {session?.user.name}
              </span>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              <li>
                <a
                  href="/admin/dashboard"
                  className="flex items-center space-x-3 text-gray-700 bg-gray-100 rounded-lg px-4 py-2"
                >
                  <Eye className="w-5 h-5" />
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a
                  href="/admin/products"
                  className="flex items-center space-x-3 text-gray-600 hover:bg-gray-100 rounded-lg px-4 py-2"
                >
                  <Package className="w-5 h-5" />
                  <span>Products</span>
                </a>
              </li>
              <li>
                <a
                  href="/admin/orders"
                  className="flex items-center space-x-3 text-gray-600 hover:bg-gray-100 rounded-lg px-4 py-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Orders</span>
                </a>
              </li>
              <li>
                <a
                  href="/admin/customers"
                  className="flex items-center space-x-3 text-gray-600 hover:bg-gray-100 rounded-lg px-4 py-2"
                >
                  <Users className="w-5 h-5" />
                  <span>Customers</span>
                </a>
              </li>
              <li>
                <a
                  href="/admin/analytics"
                  className="flex items-center space-x-3 text-gray-600 hover:bg-gray-100 rounded-lg px-4 py-2"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>Analytics</span>
                </a>
              </li>
              <li>
                <a
                  href="/admin/settings"
                  className="flex items-center space-x-3 text-gray-600 hover:bg-gray-100 rounded-lg px-4 py-2"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </a>
              </li>
            </ul>
          </nav>

          {/* Quick Actions */}
          <div className="mt-8 px-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <a
                href="/admin/products/new"
                className="flex items-center space-x-2 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
            <p className="text-gray-600 mt-2">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>

          {/* Stats Grid */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${analytics.revenue.thisMonth.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600">
                      +12.5% from last month
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
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.orders.thisMonth}
                    </p>
                    <p className="text-sm text-blue-600">
                      +8.2% from last month
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.visitors.thisMonth.toLocaleString()}
                    </p>
                    <p className="text-sm text-purple-600">
                      +18.1% from last month
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.conversionRate}%
                    </p>
                    <p className="text-sm text-orange-600">
                      +2.1% from last month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">{order.customerEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ${order.total.toFixed(2)}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {topProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={product.images[0]?.url || '/placeholder.jpg'}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.quantity} in stock</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
