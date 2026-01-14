'use client'

import { useState, useEffect } from 'react'
import { Palette, Type, Image, Save } from 'lucide-react'

interface SiteSettings {
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  fontFamily: string
}

export default function ThemeCustomizer() {
  const [settings, setSettings] = useState<SiteSettings>({
    heroTitle: 'Premium Streetwear',
    heroSubtitle: 'Elevate Your Style',
    heroImage: '/hero-placeholder.jpg',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    backgroundColor: '#ffffff',
    fontFamily: 'sans'
  })

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const savedSettings = localStorage.getItem('site_settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSave = () => {
    setIsSaving(true)
    localStorage.setItem('site_settings', JSON.stringify(settings))
    
    setTimeout(() => {
      setIsSaving(false)
      alert('Settings saved successfully!')
    }, 500)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSettings({ ...settings, heroImage: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Theme Customizer</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 px-6 py-2 rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Colors</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Primary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Secondary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.backgroundColor}
                    onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.backgroundColor}
                    onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Typography</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Font Family</label>
              <select
                value={settings.fontFamily}
                onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded"
              >
                <option value="sans">Sans Serif</option>
                <option value="serif">Serif</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Image className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Hero Section</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hero Title</label>
              <input
                type="text"
                value={settings.heroTitle}
                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
              <input
                type="text"
                value={settings.heroSubtitle}
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hero Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              {settings.heroImage && (
                <div className="mt-4">
                  <img
                    src={settings.heroImage}
                    alt="Hero preview"
                    className="w-full h-48 object-cover rounded"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div 
          className="p-8 rounded-lg text-center"
          style={{ 
            backgroundColor: settings.backgroundColor,
            color: settings.primaryColor === '#000000' ? '#ffffff' : settings.primaryColor
          }}
        >
          <h1 
            className="text-4xl font-bold mb-4"
            style={{ 
              fontFamily: settings.fontFamily === 'sans' ? 'system-ui, -apple-system, sans-serif' : 'Georgia, serif',
              color: settings.primaryColor
            }}
          >
            {settings.heroTitle}
          </h1>
          <p 
            className="text-xl mb-6"
            style={{ 
              fontFamily: settings.fontFamily === 'sans' ? 'system-ui, -apple-system, sans-serif' : 'Georgia, serif',
              color: settings.primaryColor
            }}
          >
            {settings.heroSubtitle}
          </p>
          <button 
            className="px-6 py-3 rounded-lg font-semibold"
            style={{ 
              backgroundColor: settings.primaryColor,
              color: settings.secondaryColor
            }}
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  )
}
