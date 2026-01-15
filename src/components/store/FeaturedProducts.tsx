'use client'

import { useState } from 'react'
import { ShoppingCart, Eye } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  image: string
  hoverImage?: string
  sizes: string[]
}

export function FeaturedProducts() {
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Classic Hoodie',
      price: 89.99,
      image: '/product1.jpg',
      hoverImage: '/product1-hover.jpg',
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: '2',
      name: 'Streetwear Tee',
      price: 49.99,
      image: '/product2.jpg',
      hoverImage: '/product2-hover.jpg',
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: '3',
      name: 'Cargo Pants',
      price: 129.99,
      image: '/product3.jpg',
      hoverImage: '/product3-hover.jpg',
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: '4',
      name: 'Denim Jacket',
      price: 159.99,
      image: '/product4.jpg',
      hoverImage: '/product4-hover.jpg',
      sizes: ['S', 'M', 'L', 'XL']
    }
  ])

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group relative overflow-hidden rounded-lg">
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-300"
                />
                {product.hoverImage && (
                  <img
                    src={product.hoverImage}
                    alt={`${product.name} hover`}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="flex-1 bg-white text-black py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100">
                    <ShoppingCart className="w-4 h-4" />
                    Quick Add
                  </button>
                  <button className="bg-white text-black p-2 rounded-lg hover:bg-gray-100">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 font-medium">${product.price}</p>
                <div className="flex gap-1 mt-2">
                  {product.sizes.map((size) => (
                    <span key={size} className="text-xs border border-gray-300 px-2 py-1 rounded">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
