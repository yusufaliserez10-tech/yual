export interface User {
  id: string
  email: string
  name: string
  role: 'CUSTOMER' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  title: string
  description: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
  variants: ProductVariant[]
}

export interface ProductVariant {
  id: string
  productId: string
  name: string
  sku?: string
  price: number // in cents
  stock: number
  createdAt: string
  updatedAt: string
}

export interface Cart {
  id: string
  userId?: string
  status: 'ACTIVE' | 'CONVERTED' | 'ABANDONED'
  createdAt: string
  updatedAt: string
  items: CartItem[]
}

export interface CartItem {
  id: string
  cartId: string
  productVariantId: string
  quantity: number
  createdAt: string
  updatedAt: string
  productVariant: ProductVariant & {
    product: Product
  }
}

export interface Order {
  id: string
  userId?: string
  cartId?: string
  totalAmount: number // in cents
  currency: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED'
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  user?: User
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productVariantId: string
  quantity: number
  unitPrice: number // in cents, snapshot at order time
  createdAt: string
  product: Product
  productVariant: ProductVariant
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}
