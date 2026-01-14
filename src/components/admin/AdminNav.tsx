'use client'

import { LogOut } from 'lucide-react'

export function AdminNav() {
  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">YUAL Admin</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-white hover:text-gray-300">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
