/**
 * Core type definitions for YUAL E-commerce Platform
 * Enterprise-grade type system for scalability and type safety
 */

// User & Authentication Types
export interface User {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'customer'
  createdAt: Date
  updatedAt: Date
}

export interface AuthSession {
  user: User
  token: string
  expiresAt: Date
}

// Product Types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  comparePrice?: number
  sku: string
  barcode?: string
  trackQuantity: boolean
  quantity: number
  images: ProductImage[]
  category: string
  tags: string[]
  status: 'active' | 'draft' | 'archived'
  variants: ProductVariant[]
  seo: ProductSEO
  createdAt: Date
  updatedAt: Date
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  position: number
}

export interface ProductVariant {
  id: string
  productId: string
  title: string
  price: number
  sku: string
  barcode?: string
  inventory: number
  option1?: string
  option2?: string
  option3?: string
  image?: ProductImage
}

export interface ProductSEO {
  title: string
  description: string
  keywords: string[]
  handle: string
}

// Order Types
export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerEmail: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  fulfillmentStatus: 'unfulfilled' | 'partial' | 'fulfilled'
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: string
  items: OrderItem[]
  shippingAddress: Address
  billingAddress: Address
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  productId: string
  variantId?: string
  name: string
  sku: string
  quantity: number
  price: number
  total: number
  image?: ProductImage
}

export interface Address {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  province: string
  country: string
  zip: string
  phone?: string
}

// Cart Types
export interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: string
}

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  quantity: number
  product: Product
  variant?: ProductVariant
}

// Store Settings Types
export interface StoreSettings {
  id: string
  storeName: string
  storeDescription: string
  storeEmail: string
  storePhone?: string
  storeAddress?: Address
  currency: string
  timezone: string
  theme: ThemeSettings
  seo: StoreSEO
  shipping: ShippingSettings
  tax: TaxSettings
  payments: PaymentSettings
  updatedAt: Date
}

export interface ThemeSettings {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  logo?: {
    url: string
    width: number
    height: number
  }
  favicon?: string
  banner: {
    title: string
    subtitle: string
    image?: string
    buttonText: string
    buttonLink: string
  }
}

export interface StoreSEO {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  twitterCard?: string
}

export interface ShippingSettings {
  freeShippingThreshold?: number
  defaultRate: number
  zones: ShippingZone[]
}

export interface ShippingZone {
  id: string
  name: string
  countries: string[]
  rates: ShippingRate[]
}

export interface ShippingRate {
  id: string
  name: string
  price: number
  minWeight?: number
  maxWeight?: number
}

export interface TaxSettings {
  enabled: boolean
  inclusive: boolean
  rate: number
  regions: TaxRegion[]
}

export interface TaxRegion {
  id: string
  name: string
  country: string
  province?: string
  rate: number
}

export interface PaymentSettings {
  providers: PaymentProvider[]
  currency: string
}

export interface PaymentProvider {
  id: string
  name: string
  type: 'stripe' | 'paypal' | 'square' | 'shopify_payments'
  enabled: boolean
  testMode: boolean
  config: Record<string, any>
}

// Analytics Types
export interface Analytics {
  revenue: {
    today: number
    thisWeek: number
    thisMonth: number
    thisYear: number
  }
  orders: {
    today: number
    thisWeek: number
    thisMonth: number
    thisYear: number
  }
  visitors: {
    today: number
    thisWeek: number
    thisMonth: number
    thisYear: number
  }
  conversionRate: number
  averageOrderValue: number
  topProducts: Product[]
  recentOrders: Order[]
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form Types
export interface ProductFormData {
  name: string
  description: string
  price: string
  comparePrice?: string
  sku: string
  trackQuantity: boolean
  quantity: string
  category: string
  tags: string[]
  status: 'active' | 'draft'
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
}

export interface OrderFormData {
  customerId: string
  items: Array<{
    productId: string
    variantId?: string
    quantity: number
  }>
  shippingAddress: Address
  billingAddress?: Address
  notes?: string
}

// Component Props Types
export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  pagination?: {
    page: number
    limit: number
    total: number
    onPageChange: (page: number) => void
  }
  actions?: {
    label: string
    onClick: (item: T) => void
    variant?: 'primary' | 'secondary' | 'danger'
  }[]
}

export interface Column<T> {
  key: keyof T
  label: string
  render?: (value: any, item: T) => React.ReactNode
  sortable?: boolean
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
