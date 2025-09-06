import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaPhone, 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaClock, 
  FaStar, 
  FaUser, 
  FaSpinner, 
  FaExclamationTriangle,
  FaEye,
  FaTools
} from 'react-icons/fa'
import api from '../config/api'

function Workers() {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    category: '',
    location: ''
  })

  useEffect(() => {
    fetchWorkers()
  }, [filters])

  const fetchWorkers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.location) params.append('location', filters.location)
      
      const response = await api.get(`/api/v1/workers/?${params}`)
      
      // Handle both paginated and non-paginated responses
      let workersData = []
      if (response.data && Array.isArray(response.data)) {
        // Direct array response
        workersData = response.data
      } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
        // Paginated response
        workersData = response.data.results
      } else if (response.data && response.data.workers && Array.isArray(response.data.workers)) {
        // Legacy format
        workersData = response.data.workers
      }
      
      setWorkers(workersData)
      setError(null)
    } catch (err) {
      setError('Failed to fetch workers')
      console.error('Error fetching workers:', err)
      setWorkers([]) // Ensure workers is always an array
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FaSpinner className="text-2xl text-blue-600 animate-spin" />
          </div>
          <p className="text-gray-600">Loading workers...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FaExclamationTriangle className="text-2xl text-red-600" />
          </div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <FaUser className="text-blue-600" />
          <span>Find Skilled Workers</span>
        </h1>
        
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FaTools className="text-blue-600" />
            <span>Filter Workers</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Electrical">Electrical</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Painting">Painting</option>
                <option value="Gardening">Gardening</option>
                <option value="Moving">Moving</option>
                <option value="General Labor">General Labor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter location..."
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Workers Grid */}
      {Array.isArray(workers) && workers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <div key={worker.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="p-6">
                {/* Header with name and availability */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{worker.name || 'Unknown'}</h3>
                  <span className={`inline-flex items-center px-3 py-1 text-xs rounded-full border ${
                    worker.available 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-red-100 text-red-800 border-red-200'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      worker.available ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    {worker.available ? 'Available' : 'Busy'}
                  </span>
                </div>
                
                {/* Contact Info */}
                {worker.phoneNumber && (
                  <div className="mb-3">
                    <p className="text-sm text-blue-600 font-medium flex items-center">
                      <FaPhone className="mr-2 text-sm" />
                      {worker.phoneNumber}
                    </p>
                  </div>
                )}
                
                {/* Worker Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaBriefcase className="mr-2 text-gray-400" />
                    <span>{worker.category}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-gray-400" />
                    <span>{worker.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaClock className="mr-2 text-gray-400" />
                    <span>Experience: {worker.experience}</span>
                  </div>
                  <div className="text-lg font-semibold text-blue-600">
                    KSh {worker.hourlyRate}/hr
                  </div>
                </div>
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-sm font-medium text-gray-900">{worker.rating}</span>
                    <span className="ml-1 text-sm text-gray-500">({worker.reviewCount} reviews)</span>
                  </div>
                </div>
                
                {/* Skills */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Skills:</h4>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(worker.skills) && worker.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200">
                        {skill}
                      </span>
                    ))}
                    {Array.isArray(worker.skills) && worker.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200">
                        +{worker.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                {/* View Profile Button */}
                <Link
                  to={`/workers/${worker.id}`}
                  className="flex items-center justify-center space-x-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md text-sm font-medium transition-colors"
                >
                  <FaEye className="text-sm" />
                  <span>View Profile</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaUser className="text-2xl text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">No workers found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default Workers
