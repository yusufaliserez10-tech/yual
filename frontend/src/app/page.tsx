import Header from '@/components/Header'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to YUAL
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your complete e-commerce solution
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Modern Design</h3>
              <p className="text-gray-600">Beautiful, responsive interface built with Tailwind CSS</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Secure Checkout</h3>
              <p className="text-gray-600">Safe and reliable payment processing</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Admin Dashboard</h3>
              <p className="text-gray-600">Complete store management tools</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
