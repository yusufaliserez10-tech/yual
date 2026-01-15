import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { url, method } = req

    // Health check
    if (url === '/api/health' && method === 'GET') {
      return res.status(200).json({ status: 'ok', service: 'yual-backend' })
    }

    // Auth routes
    if (url?.startsWith('/api/auth/')) {
      if (url === '/api/auth/login' && method === 'POST') {
        const { email, password } = req.body
        const user = await prisma.user.findUnique({ where: { email } })
        
        if (!user || !await bcrypt.compare(password, user.password)) {
          return res.status(401).json({ error: 'Invalid credentials' })
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
        return res.json({
          token,
          user: { id: user.id, email: user.email, name: user.name, role: user.role }
        })
      }

      if (url === '/api/auth/register' && method === 'POST') {
        const { email, password, name } = req.body
        const existing = await prisma.user.findUnique({ where: { email } })
        
        if (existing) {
          return res.status(409).json({ error: 'Email already in use' })
        }

        const hashed = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
          data: { email, password: hashed, name, role: 'CUSTOMER' }
        })

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
        return res.status(201).json({
          token,
          user: { id: user.id, email: user.email, name: user.name, role: user.role }
        })
      }
    }

    // Products routes
    if (url?.startsWith('/api/products/')) {
      if (url === '/api/products' && method === 'GET') {
        const products = await prisma.product.findMany({
          include: { variants: true },
          orderBy: { createdAt: 'desc' }
        })
        return res.json(products)
      }

      if (url.match(/^\/api\/products\/[^\/]+$/) && method === 'GET') {
        const id = url.split('/').pop()
        const product = await prisma.product.findUnique({
          where: { id },
          include: { variants: true }
        })
        
        if (!product) {
          return res.status(404).json({ error: 'Product not found' })
        }
        
        return res.json(product)
      }
    }

    return res.status(404).json({ error: 'Route not found' })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
