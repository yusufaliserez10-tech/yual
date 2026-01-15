'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { productsAPI, cartAPI } from '@/lib/api'
import { Product, ProductVariant } from '@/types'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, ArrowLeft } from 'lucide-react'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productsAPI.getById(params.id as string)
        setProduct(data)
        if (data.variants.length > 0) {
          setSelectedVariant(data.variants[0])
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch product')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const handleAddToCart = async () => {
    if (!selectedVariant) return

    setIsAddingToCart(true)
    try {
      await cartAPI.addItem(selectedVariant.id, quantity)
      // Show success message or redirect to cart
      alert('Product added to cart!')
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading product...</div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-red-600">
            {error || 'Product not found'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-8xl">📦</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>
            
            <p className="text-gray-600 mb-6">
              {product.description}
            </p>

            {/* Variant Selection */}
            {product.variants.length > 1 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variant
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-3 border rounded-md text-left transition-colors ${
                        selectedVariant?.id === variant.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium">{variant.name}</div>
                      <div className="text-sm text-gray-600">
                        {formatPrice(variant.price)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price and Stock */}
            {selectedVariant && (
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatPrice(selectedVariant.price)}
                </div>
                <div className={`text-sm ${
                  selectedVariant.stock > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedVariant.stock > 0 
                    ? `${selectedVariant.stock} units available` 
                    : 'Out of stock'
                  }
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            {selectedVariant && selectedVariant.stock > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    min="1"
                    max={selectedVariant.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(selectedVariant.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            )}

            {/* Product Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Product Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div><strong>SKU:</strong> {selectedVariant?.sku || 'N/A'}</div>
                <div><strong>Variant:</strong> {selectedVariant?.name || 'N/A'}</div>
                <div><strong>Stock:</strong> {selectedVariant?.stock || 0} units</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
