'use client'

import { useState, useEffect } from 'react'

interface SiteSettings {
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  fontFamily: string
}

export function HeroSection() {
  const [settings, setSettings] = useState<SiteSettings>({
    heroTitle: 'Premium Streetwear',
    heroSubtitle: 'Elevate Your Style',
    heroImage: '/hero-placeholder.jpg',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    backgroundColor: '#ffffff',
    fontFamily: 'sans'
  })

  useEffect(() => {
    const savedSettings = localStorage.getItem('site_settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', settings.primaryColor)
    document.documentElement.style.setProperty('--color-secondary', settings.secondaryColor)
    document.documentElement.style.setProperty('--color-background', settings.backgroundColor)
    document.documentElement.style.setProperty('--font-sans', settings.fontFamily === 'sans' ? 'system-ui, -apple-system, sans-serif' : 'Georgia, serif')
  }, [settings])

  return (
    <section 
      className="relative h-screen flex items-center justify-center bg-cover bg-center"
      style={{ 
        backgroundImage: `url(${settings.heroImage})`,
        backgroundColor: settings.backgroundColor
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative z-10 text-center text-white px-4">
        <h1 
          className="text-5xl md:text-7xl font-bold mb-6"
          style={{ fontFamily: settings.fontFamily === 'sans' ? 'system-ui, -apple-system, sans-serif' : 'Georgia, serif' }}
        >
          {settings.heroTitle}
        </h1>
        <p 
          className="text-xl md:text-2xl mb-8"
          style={{ fontFamily: settings.fontFamily === 'sans' ? 'system-ui, -apple-system, sans-serif' : 'Georgia, serif' }}
        >
          {settings.heroSubtitle}
        </p>
        <button 
          className="px-8 py-4 text-lg font-semibold rounded-lg transition-all hover:scale-105"
          style={{ 
            backgroundColor: settings.primaryColor,
            color: settings.secondaryColor
          }}
        >
          Shop Now
        </button>
      </div>
    </section>
  )
}
