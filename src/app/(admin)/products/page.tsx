'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  sizes: string[]
  category: string
}

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    image: '',
    sizes: ['S', 'M', 'L', 'XL'],
    category: ''
  })

  useEffect(() => {
    const savedProducts = localStorage.getItem('products')
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    }
  }, [])

  const handleSave = () => {
    let updatedProducts: Product[]

    if (editingProduct) {
      updatedProducts = products.map(p => 
        p.id === editingProduct 
          ? { ...formData, id: editingProduct } as Product
          : p
      )
    } else {
      const newProduct: Product = {
        ...formData,
        id: Date.now().toString()
      } as Product
      updatedProducts = [...products, newProduct]
    }

    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== id)
      setProducts(updatedProducts)
      localStorage.setItem('products', JSON.stringify(updatedProducts))
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product.id)
    setFormData(product)
    setIsAddingProduct(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      description: '',
      image: '',
      sizes: ['S', 'M', 'L', 'XL'],
      category: ''
    })
    setIsAddingProduct(false)
    setEditingProduct(null)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleSize = (size: string) => {
    const currentSizes = formData.sizes || []
    if (currentSizes.includes(size)) {
      setFormData({
        ...formData,
        sizes: currentSizes.filter(s => s !== size)
      })
    } else {
      setFormData({
        ...formData,
        sizes: [...currentSizes, size]
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Manager</h1>
        <button
          onClick={() => setIsAddingProduct(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {isAddingProduct && (
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Available Sizes</label>
              <div className="flex gap-2">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 rounded ${
                      formData.sizes?.includes(size)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {formData.image && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Image Preview</label>
                <img
                  src={formData.image}
                  alt="Product preview"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={resetForm}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              {editingProduct ? 'Update' : 'Save'} Product
            </button>
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-4">Image</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Sizes</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-700">
                <td className="p-4">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </td>
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">${product.price.toFixed(2)}</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    {product.sizes.map((size) => (
                      <span key={size} className="text-xs bg-gray-700 px-2 py-1 rounded">
                        {size}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No products found. Add your first product to get started.
          </div>
        )}
      </div>
    </div>
  )
}
