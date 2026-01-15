/**
 * Modular Database Layer
 * Designed for easy migration to Supabase or PostgreSQL
 * Currently using localStorage for demonstration
 */

import { Product, Order, User, StoreSettings, Cart, Analytics } from '@/types'

// Database interface for modularity
export interface DatabaseService {
  // Products
  getProducts(): Promise<Product[]>
  getProduct(id: string): Promise<Product | null>
  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>
  updateProduct(id: string, updates: Partial<Product>): Promise<Product>
  deleteProduct(id: string): Promise<void>
  
  // Orders
  getOrders(): Promise<Order[]>
  getOrder(id: string): Promise<Order | null>
  createOrder(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order>
  updateOrder(id: string, updates: Partial<Order>): Promise<Order>
  
  // Users
  getUsers(): Promise<User[]>
  getUser(id: string): Promise<User | null>
  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>
  
  // Store Settings
  getStoreSettings(): Promise<StoreSettings>
  updateStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings>
  
  // Cart
  getCart(cartId: string): Promise<Cart | null>
  updateCart(cartId: string, cart: Partial<Cart>): Promise<Cart>
  
  // Analytics
  getAnalytics(): Promise<Analytics>
}

// LocalStorage Implementation
class LocalStorageDatabase implements DatabaseService {
  private readonly KEYS = {
    PRODUCTS: 'yual_products',
    ORDERS: 'yual_orders',
    USERS: 'yual_users',
    STORE_SETTINGS: 'yual_store_settings',
    CARTS: 'yual_carts',
    ANALYTICS: 'yual_analytics'
  }

  constructor() {
    this.initializeData()
  }

  private initializeData(): void {
    // Initialize with sample data if empty
    if (!localStorage.getItem(this.KEYS.PRODUCTS)) {
      this.seedProducts()
    }
    if (!localStorage.getItem(this.KEYS.ORDERS)) {
      this.seedOrders()
    }
    if (!localStorage.getItem(this.KEYS.STORE_SETTINGS)) {
      this.seedStoreSettings()
    }
    if (!localStorage.getItem(this.KEYS.ANALYTICS)) {
      this.seedAnalytics()
    }
  }

  // Products
  async getProducts(): Promise<Product[]> {
    const products = localStorage.getItem(this.KEYS.PRODUCTS)
    return products ? JSON.parse(products) : []
  }

  async getProduct(id: string): Promise<Product | null> {
    const products = await this.getProducts()
    return products.find(p => p.id === id) || null
  }

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const products = await this.getProducts()
    const product: Product = {
      ...productData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    products.push(product)
    localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products))
    return product
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const products = await this.getProducts()
    const index = products.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Product not found')
    
    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date()
    }
    localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products))
    return products[index]
  }

  async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts()
    const filtered = products.filter(p => p.id !== id)
    localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(filtered))
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    const orders = localStorage.getItem(this.KEYS.ORDERS)
    return orders ? JSON.parse(orders) : []
  }

  async getOrder(id: string): Promise<Order | null> {
    const orders = await this.getOrders()
    return orders.find(o => o.id === id) || null
  }

  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const orders = await this.getOrders()
    const order: Order = {
      ...orderData,
      id: this.generateId(),
      orderNumber: this.generateOrderNumber(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    orders.push(order)
    localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(orders))
    return order
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const orders = await this.getOrders()
    const index = orders.findIndex(o => o.id === id)
    if (index === -1) throw new Error('Order not found')
    
    orders[index] = {
      ...orders[index],
      ...updates,
      updatedAt: new Date()
    }
    localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(orders))
    return orders[index]
  }

  // Users
  async getUsers(): Promise<User[]> {
    const users = localStorage.getItem(this.KEYS.USERS)
    return users ? JSON.parse(users) : []
  }

  async getUser(id: string): Promise<User | null> {
    const users = await this.getUsers()
    return users.find(u => u.id === id) || null
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const users = await this.getUsers()
    const user: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    users.push(user)
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users))
    return user
  }

  // Store Settings
  async getStoreSettings(): Promise<StoreSettings> {
    const settings = localStorage.getItem(this.KEYS.STORE_SETTINGS)
    if (settings) {
      return JSON.parse(settings)
    }
    return this.seedStoreSettings()
  }

  async updateStoreSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
    const current = await this.getStoreSettings()
    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date()
    }
    localStorage.setItem(this.KEYS.STORE_SETTINGS, JSON.stringify(updated))
    return updated
  }

  // Cart
  async getCart(cartId: string): Promise<Cart | null> {
    const carts = localStorage.getItem(this.KEYS.CARTS)
    const allCarts = carts ? JSON.parse(carts) : {}
    return allCarts[cartId] || null
  }

  async updateCart(cartId: string, cartData: Partial<Cart>): Promise<Cart> {
    const carts = localStorage.getItem(this.KEYS.CARTS)
    const allCarts = carts ? JSON.parse(carts) : {}
    
    const current = allCarts[cartId] || {
      id: cartId,
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      currency: 'USD'
    }
    
    const updated = { ...current, ...cartData }
    allCarts[cartId] = updated
    localStorage.setItem(this.KEYS.CARTS, JSON.stringify(allCarts))
    return updated
  }

  // Analytics
  async getAnalytics(): Promise<Analytics> {
    const analytics = localStorage.getItem(this.KEYS.ANALYTICS)
    if (analytics) {
      return JSON.parse(analytics)
    }
    return this.seedAnalytics()
  }

  // Helper methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private generateOrderNumber(): string {
    const prefix = 'YUAL'
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${prefix}-${timestamp}-${random}`
  }

  // Seed data methods
  private seedProducts(): void {
    const sampleProducts: Product[] = [
      {
        id: 'prod-1',
        name: 'Premium Streetwear Hoodie',
        description: 'Luxury hoodie crafted from premium materials with attention to detail',
        price: 129.99,
        comparePrice: 159.99,
        sku: 'YUAL-HOODIE-001',
        trackQuantity: true,
        quantity: 50,
        images: [
          {
            id: 'img-1',
            url: 'https://picsum.photos/seed/hoodie1/800/800',
            alt: 'Premium Hoodie Front',
            position: 1
          }
        ],
        category: 'Hoodies',
        tags: ['premium', 'streetwear', 'luxury'],
        status: 'active',
        variants: [],
        seo: {
          title: 'Premium Streetwear Hoodie | YUAL',
          description: 'Luxury hoodie crafted from premium materials',
          keywords: ['hoodie', 'streetwear', 'luxury'],
          handle: 'premium-streetwear-hoodie'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prod-2',
        name: 'Designer Graphic Tee',
        description: 'Premium cotton t-shirt with exclusive graphic design',
        price: 59.99,
        sku: 'YUAL-TEE-001',
        trackQuantity: true,
        quantity: 100,
        images: [
          {
            id: 'img-2',
            url: 'https://picsum.photos/seed/tee1/800/800',
            alt: 'Designer Tee',
            position: 1
          }
        ],
        category: 'T-Shirts',
        tags: ['designer', 'graphic', 'cotton'],
        status: 'active',
        variants: [],
        seo: {
          title: 'Designer Graphic Tee | YUAL',
          description: 'Premium cotton t-shirt with exclusive design',
          keywords: ['t-shirt', 'graphic', 'designer'],
          handle: 'designer-graphic-tee'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(sampleProducts))
  }

  private seedOrders(): void {
    const sampleOrders: Order[] = [
      {
        id: 'order-1',
        orderNumber: 'YUAL-1234567890-001',
        customerId: 'customer-1',
        customerEmail: 'customer@example.com',
        status: 'confirmed',
        paymentStatus: 'paid',
        fulfillmentStatus: 'unfulfilled',
        subtotal: 189.98,
        tax: 15.20,
        shipping: 10.00,
        total: 215.18,
        currency: 'USD',
        items: [],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          city: 'New York',
          province: 'NY',
          country: 'United States',
          zip: '10001'
        },
        billingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          city: 'New York',
          province: 'NY',
          country: 'United States',
          zip: '10001'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(sampleOrders))
  }

  private seedStoreSettings(): StoreSettings {
    const settings: StoreSettings = {
      id: 'settings-1',
      storeName: 'YUAL',
      storeDescription: 'Premium Streetwear & Luxury Fashion',
      storeEmail: 'info@yual.com',
      currency: 'USD',
      timezone: 'America/New_York',
      theme: {
        primaryColor: '#000000',
        secondaryColor: '#ffffff',
        accentColor: '#6366f1',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        fontFamily: 'Inter',
        banner: {
          title: 'Premium Streetwear',
          subtitle: 'Elevate Your Style with YUAL',
          buttonText: 'Shop Now',
          buttonLink: '/products'
        }
      },
      seo: {
        title: 'YUAL - Premium Streetwear & Luxury Fashion',
        description: 'Discover premium streetwear and luxury fashion at YUAL',
        keywords: ['streetwear', 'luxury', 'fashion', 'premium']
      },
      shipping: {
        defaultRate: 10.00,
        zones: []
      },
      tax: {
        enabled: true,
        inclusive: false,
        rate: 8.0,
        regions: []
      },
      payments: {
        providers: [],
        currency: 'USD'
      },
      updatedAt: new Date()
    }
    localStorage.setItem(this.KEYS.STORE_SETTINGS, JSON.stringify(settings))
    return settings
  }

  private seedAnalytics(): Analytics {
    const analytics: Analytics = {
      revenue: {
        today: 1250.00,
        thisWeek: 8750.00,
        thisMonth: 35000.00,
        thisYear: 420000.00
      },
      orders: {
        today: 8,
        thisWeek: 56,
        thisMonth: 224,
        thisYear: 2688
      },
      visitors: {
        today: 450,
        thisWeek: 3150,
        thisMonth: 12600,
        thisYear: 151200
      },
      conversionRate: 1.78,
      averageOrderValue: 156.25,
      topProducts: [],
      recentOrders: []
    }
    localStorage.setItem(this.KEYS.ANALYTICS, JSON.stringify(analytics))
    return analytics
  }
}

// Supabase Implementation (for future migration)
export class SupabaseDatabase implements DatabaseService {
  // TODO: Implement Supabase integration
  // This will be used when migrating to production database
  
  async getProducts(): Promise<Product[]> {
    throw new Error('Supabase implementation not yet available')
  }
  
  async getProduct(id: string): Promise<Product | null> {
    throw new Error('Supabase implementation not yet available')
  }
  
  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    throw new Error('Supabase implementation not yet available')
  }
  
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    throw new Error('Supabase implementation not yet available')
  }
  
  async deleteProduct(id: string): Promise<void> {
    throw new Error('Supabase implementation not yet available')
  }
  
  // Implement other methods...
  async getOrders(): Promise<Order[]> {
    throw new Error('Supabase implementation not yet available')
  }
  
  async getOrder(id: string): Promise<Order | null> {
    throw new Error('Supabase implementation not yet available')
  }
  
  async createOrder(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    throw new Error('Supabase implementation not yet available')
  }
  
  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    throw new Error('Supabase implementation not yet available')
  }
  
  async getUsers(): Promise<User[]> {
    throw new Error('Supabase implementation not yet available')
  }
  
  async getUser(id: string): Promise<User | null> {
    throw new Error('Supabase implementation not yet available')
  }
  
  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    throw new Error('Supabase implementation not yet available')
  }
  
  async getStoreSettings(): Promise<StoreSettings> {
    throw new Error('Supabase implementation not yet available')
  }
  
  async updateStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    throw new Error('Supabase implementation not yet available')
  }
  
  async getCart(cartId: string): Promise<Cart | null> {
    throw new Error('Supabase implementation not yet available')
  }
  
  async updateCart(cartId: string, cart: Partial<Cart>): Promise<Cart> {
    throw new Error('Supabase implementation not yet available')
  }
  
  async getAnalytics(): Promise<Analytics> {
    throw new Error('Supabase implementation not yet available')
  }
}

// Database factory
export function createDatabase(): DatabaseService {
  // In production, this could be based on environment variables
  // For now, always return LocalStorage implementation
  return new LocalStorageDatabase()
}

// Singleton instance
export const db = createDatabase()

export default db
