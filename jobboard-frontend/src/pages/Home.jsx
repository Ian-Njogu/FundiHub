import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../config/api'

function Home() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories from API...')
        const response = await api.get('/api/v1/workers/categories/')
        console.log('API response:', response.data)
        setCategories(response.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
        console.log('Using fallback categories...')
        // Fallback to hardcoded categories if API fails
        const fallbackCategories = [
          { id: 1, name: 'Plumbing', icon: '🔧' },
          { id: 2, name: 'Cleaning', icon: '🧹' },
          { id: 3, name: 'Electrical', icon: '⚡' },
          { id: 4, name: 'Carpentry', icon: '🔨' },
          { id: 5, name: 'Painting', icon: '🎨' },
          { id: 6, name: 'Gardening', icon: '🌱' },
          { id: 7, name: 'Moving', icon: '📦' },
          { id: 8, name: 'General Labor', icon: '👷' }
        ]
        console.log('Setting fallback categories:', fallbackCategories)
        setCategories(fallbackCategories)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Skilled Workers
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Connect with reliable fundis, cleaners, plumbers, and day laborers in your area
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/workers"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Find Workers
              </Link>
              <Link
                to="/create-job"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Post a Job
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-lg text-gray-600">
              Browse workers by their specialties
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.isArray(categories) && categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/workers?category=${category.name}`}
                  className="group block p-6 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose FundiHub?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Workers</h3>
              <p className="text-gray-600">
                All workers are verified and reviewed by our community
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fair Pricing</h3>
              <p className="text-gray-600">
                Transparent pricing with no hidden fees
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Service</h3>
              <p className="text-gray-600">
                Connect with workers in your area within minutes
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
