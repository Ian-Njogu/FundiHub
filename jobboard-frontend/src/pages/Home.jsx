import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  FaWrench, 
  FaBroom, 
  FaBolt, 
  FaHammer, 
  FaPaintBrush, 
  FaSeedling, 
  FaTruck, 
  FaHardHat,
  FaUsers,
  FaBriefcase,
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaArrowRight
} from 'react-icons/fa'
import api from '../config/api'

function Home() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/v1/workers/categories/')
        setCategories(response.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
        // Fallback to hardcoded categories if API fails
        const fallbackCategories = [
          { id: 1, name: 'Plumbing', icon: <FaWrench className="text-4xl" /> },
          { id: 2, name: 'Cleaning', icon: <FaBroom className="text-4xl" /> },
          { id: 3, name: 'Electrical', icon: <FaBolt className="text-4xl" /> },
          { id: 4, name: 'Carpentry', icon: <FaHammer className="text-4xl" /> },
          { id: 5, name: 'Painting', icon: <FaPaintBrush className="text-4xl" /> },
          { id: 6, name: 'Gardening', icon: <FaSeedling className="text-4xl" /> },
          { id: 7, name: 'Moving', icon: <FaTruck className="text-4xl" /> },
          { id: 8, name: 'General Labor', icon: <FaHardHat className="text-4xl" /> }
        ]
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
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaWrench className="text-4xl text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Skilled Workers
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Connect with reliable fundis, cleaners, plumbers, and day laborers in your area
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/workers"
                className="flex items-center justify-center space-x-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <FaUsers className="text-lg" />
                <span>Find Workers</span>
              </Link>
              <Link
                to="/create-job"
                className="flex items-center justify-center space-x-2 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                <FaBriefcase className="text-lg" />
                <span>Post a Job</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose FundiHub?
            </h2>
            <p className="text-lg text-gray-600">
              The trusted platform for connecting skilled workers with clients
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Workers</h3>
              <p className="text-gray-600">All workers are verified and reviewed by our community</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Service</h3>
              <p className="text-gray-600">Get the best service with our quality guarantee</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Response</h3>
              <p className="text-gray-600">Get responses from workers within minutes</p>
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
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <FaSpinner className="text-2xl text-blue-600 animate-spin" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.isArray(categories) && categories.map((category, index) => (
                <Link
                  key={category.id || category.name || index}
                  to={`/workers?category=${category.name}`}
                  className="group block p-6 bg-gray-50 rounded-lg hover:bg-blue-50 hover:shadow-md transition-all duration-300 border border-gray-200"
                >
                  <div className="text-center">
                    <div className="text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of satisfied clients and workers on FundiHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/workers"
              className="flex items-center justify-center space-x-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <FaUsers className="text-lg" />
              <span>Browse Workers</span>
              <FaArrowRight className="text-sm" />
            </Link>
            <Link
              to="/create-job"
              className="flex items-center justify-center space-x-2 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              <FaBriefcase className="text-lg" />
              <span>Post Your Job</span>
              <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
