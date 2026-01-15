import { AdminNav } from '@/components/admin/AdminNav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminNav />
      <div className="flex">
        <aside className="w-64 bg-gray-800 min-h-screen p-4">
          <nav className="space-y-2">
            <a href="/admin" className="block px-4 py-2 rounded hover:bg-gray-700">Dashboard</a>
            <a href="/admin/theme" className="block px-4 py-2 rounded hover:bg-gray-700">Theme Customizer</a>
            <a href="/admin/products" className="block px-4 py-2 rounded hover:bg-gray-700">Products</a>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
