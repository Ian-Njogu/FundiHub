import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

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
      
      const response = await axios.get(`/api/v1/workers?${params}`)
      setWorkers(response.data.workers || response.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch workers')
      console.error('Error fetching workers:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading workers...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Skilled Workers</h1>
        
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.map((worker) => (
          <div key={worker.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{worker.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  worker.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {worker.available ? 'Available' : 'Busy'}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-2">{worker.category}</p>
                <p className="text-gray-600 mb-2">{worker.location}</p>
                <p className="text-gray-600 mb-2">Experience: {worker.experience}</p>
                <p className="text-lg font-semibold text-blue-600">KSh {worker.hourlyRate}/hr</p>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-sm text-gray-600">{worker.rating}</span>
                  <span className="ml-1 text-sm text-gray-500">({worker.reviewCount} reviews)</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Skills:</h4>
                <div className="flex flex-wrap gap-1">
                  {worker.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                  {worker.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{worker.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              
              <Link
                to={`/workers/${worker.id}`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-center block transition-colors"
              >
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {workers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No workers found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default Workers
