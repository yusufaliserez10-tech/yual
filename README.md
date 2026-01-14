# YUAL - Premium Streetwear E-commerce Platform

A high-end, production-ready SaaS E-commerce platform built with Next.js 14, featuring a complete admin dashboard and luxury storefront.

## Features

### 🛍️ Public Storefront
- **Hero Section**: Customizable hero with dynamic content from admin settings
- **Product Grid**: Featured products with hover effects and quick-add functionality
- **Slide-out Cart**: Smooth animated shopping cart with Framer Motion
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Instant theme updates from admin panel

### 🎛️ Admin Dashboard
- **Secure Authentication**: Email whitelist system (admin@yual.com)
- **Theme Customizer**: Real-time color, font, and hero customization
- **Product Manager**: Full CRUD operations for inventory management
- **Dark Mode UI**: Professional admin interface
- **Live Preview**: See changes instantly in the storefront

### 🎨 Theme Customization
- **Color Pickers**: Primary, secondary, and background colors
- **Font Selection**: Sans-serif and serif font options
- **Hero Editor**: Custom titles, subtitles, and image uploads
- **Persistent Settings**: All changes saved and applied immediately

### 📦 Product Management
- **Add/Edit Products**: Complete product information management
- **Image Uploads**: Support for product photography
- **Size Management**: S, M, L, XL size options
- **Category Organization**: Product categorization system
- **Bulk Operations**: Efficient product management

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Language**: TypeScript
- **Storage**: LocalStorage (demo purposes)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd yual
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

### Login Credentials
- **Email**: admin@yual.com
- **Password**: admin123

### Admin Routes
- **Dashboard**: `/admin`
- **Theme Customizer**: `/admin/theme`
- **Product Manager**: `/admin/products`
- **Login**: `/admin/login`

## Project Structure

```
src/
├── app/
│   ├── (admin)/          # Admin dashboard routes
│   │   ├── layout.tsx    # Admin layout with sidebar
│   │   ├── page.tsx      # Dashboard
│   │   ├── theme/        # Theme customizer
│   │   └── products/     # Product manager
│   ├── (store)/          # Public storefront routes
│   │   ├── layout.tsx    # Store layout
│   │   └── page.tsx      # Homepage
│   ├── admin/            # Admin login
│   ├── layout.tsx        # Root layout
│   └── globals.css      # Global styles
├── components/
│   ├── admin/            # Admin components
│   └── store/           # Store components
├── middleware.ts        # Authentication middleware
└── ...
```

## Features Overview

### Storefront Features
- **Dynamic Hero Section**: Customizable via admin panel
- **Product Cards**: Hover effects with image transitions
- **Quick Add to Cart**: Add products without leaving page
- **Shopping Cart**: Slide-out cart with quantity management
- **Responsive Navigation**: Mobile-friendly menu

### Admin Features
- **Theme Customization**: 
  - Color pickers for primary/secondary/background
  - Font selection (Sans/Serif)
  - Hero section content editor
  - Image upload for hero background
- **Product Management**:
  - Add new products with details
  - Edit existing products
  - Delete products
  - Size and category management
- **Security**: Email-based authentication system

## Customization

### Adding New Admin Features
1. Create new routes in `src/app/(admin)/`
2. Add navigation links in admin layout
3. Implement components in `src/components/admin/`

### Extending Storefront
1. Add new routes in `src/app/(store)/`
2. Create reusable components in `src/components/store/`
3. Update navigation as needed

### Theme System
The theme system uses CSS custom properties that can be dynamically updated:
- `--color-primary`: Main brand color
- `--color-secondary`: Accent color  
- `--color-background`: Page background
- `--font-sans`: Sans-serif font family
- `--font-serif`: Serif font family

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables if needed
3. Deploy automatically on push to main branch

### Other Platforms
```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

---

**YUAL** - Elevating Streetwear E-commerce
