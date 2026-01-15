'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { productsAPI } from '@/lib/api'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart } from 'lucide-react'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsAPI.getAll()
        setProducts(data)
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = async (productVariantId: string) => {
    // This will be implemented when we create the cart functionality
    console.log('Adding to cart:', productVariantId)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading products...</div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/products/${product.id}`}>
                  <div className="aspect-square bg-gray-200 relative">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-4xl">📦</span>
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600">
                      {product.title}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      {product.variants.length > 0 ? (
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(product.variants[0].price)}
                        </span>
                      ) : (
                        <span className="text-gray-500">No variants</span>
                      )}
                    </div>
                    
                    {product.variants.length > 0 && (
                      <button
                        onClick={() => handleAddToCart(product.variants[0].id)}
                        className="bg-primary-600 text-white p-2 rounded-md hover:bg-primary-700"
                        title="Add to cart"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  {product.variants.length > 1 && (
                    <p className="text-xs text-gray-500 mt-2">
                      {product.variants.length} variants available
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
