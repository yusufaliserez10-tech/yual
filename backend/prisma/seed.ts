import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  // Create customer user
  const customerPassword = await bcrypt.hash('customer123', 10)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      name: 'Customer User',
      role: 'CUSTOMER',
    },
  })

  // Create sample products
  const product1 = await prisma.product.create({
    data: {
      title: 'Premium T-Shirt',
      description: 'High-quality cotton t-shirt with modern design. Perfect for everyday wear.',
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      variants: {
        create: [
          {
            name: 'Small',
            sku: 'TSHIRT-S',
            price: 1999, // $19.99
            stock: 50,
          },
          {
            name: 'Medium',
            sku: 'TSHIRT-M',
            price: 1999, // $19.99
            stock: 75,
          },
          {
            name: 'Large',
            sku: 'TSHIRT-L',
            price: 1999, // $19.99
            stock: 60,
          },
        ],
      },
    },
  })

  const product2 = await prisma.product.create({
    data: {
      title: 'Wireless Headphones',
      description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      variants: {
        create: [
          {
            name: 'Black',
            sku: 'HEADPHONES-BLK',
            price: 9999, // $99.99
            stock: 25,
          },
          {
            name: 'White',
            sku: 'HEADPHONES-WHT',
            price: 9999, // $99.99
            stock: 20,
          },
        ],
      },
    },
  })

  const product3 = await prisma.product.create({
    data: {
      title: 'Leather Wallet',
      description: 'Genuine leather bifold wallet with RFID protection. Slim and stylish.',
      imageUrl: 'https://images.unsplash.com/photo-1627123424554-ab36d4f7c31e?w=800',
      variants: {
        create: [
          {
            name: 'Brown',
            sku: 'WALLET-BRN',
            price: 4999, // $49.99
            stock: 40,
          },
          {
            name: 'Black',
            sku: 'WALLET-BLK',
            price: 4999, // $49.99
            stock: 35,
          },
        ],
      },
    },
  })

  const product4 = await prisma.product.create({
    data: {
      title: 'Smart Watch',
      description: 'Feature-rich smartwatch with health tracking and notifications.',
      imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
      variants: {
        create: [
          {
            name: '42mm Silver',
            sku: 'WATCH-42-SLV',
            price: 24999, // $249.99
            stock: 15,
          },
          {
            name: '46mm Space Gray',
            sku: 'WATCH-46-GRAY',
            price: 29999, // $299.99
            stock: 10,
          },
        ],
      },
    },
  })

  const product5 = await prisma.product.create({
    data: {
      title: 'Running Shoes',
      description: 'Lightweight and comfortable running shoes with advanced cushioning.',
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
      variants: {
        create: [
          {
            name: 'US 8',
            sku: 'SHOES-8',
            price: 8999, // $89.99
            stock: 30,
          },
          {
            name: 'US 9',
            sku: 'SHOES-9',
            price: 8999, // $89.99
            stock: 35,
          },
          {
            name: 'US 10',
            sku: 'SHOES-10',
            price: 8999, // $89.99
            stock: 25,
          },
          {
            name: 'US 11',
            sku: 'SHOES-11',
            price: 8999, // $89.99
            stock: 20,
          },
        ],
      },
    },
  })

  console.log('Seeding finished.')
  console.log(`Created admin user: ${admin.email} with password: admin123`)
  console.log(`Created customer user: ${customer.email} with password: customer123`)
  console.log(`Created ${5} products with sample variants`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
