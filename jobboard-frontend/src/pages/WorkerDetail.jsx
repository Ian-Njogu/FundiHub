import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../config/api'

function WorkerDetail() {
  const { id } = useParams()
  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchWorker()
  }, [id])

  const fetchWorker = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/v1/workers/${id}`)
      setWorker(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch worker details')
      console.error('Error fetching worker:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading worker details...</div>
      </div>
    )
  }

  if (error || !worker) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600">{error || 'Worker not found'}</div>
        <div className="text-center mt-4">
          <Link to="/workers" className="text-blue-600 hover:text-blue-800">
            Back to Workers
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/workers" className="text-blue-600 hover:text-blue-800 flex items-center">
          ← Back to Workers
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{worker.name}</h1>
              <p className="text-lg text-gray-600 mb-2">{worker.category}</p>
              <p className="text-gray-600 mb-2">{worker.location}</p>
              <div className="flex items-center mb-2">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="ml-1 text-lg font-semibold">{worker.rating}</span>
                <span className="ml-1 text-gray-500">({worker.reviewCount} reviews)</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-3xl font-bold text-blue-600 mb-2">KSh {worker.hourlyRate}/hr</div>
              <span className={`px-3 py-1 text-sm rounded-full ${
                worker.available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {worker.available ? 'Available' : 'Currently Busy'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* About */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2"><strong>Experience:</strong> {worker.experience}</p>
                  <p className="text-gray-700 mb-2"><strong>Category:</strong> {worker.category}</p>
                  <p className="text-gray-700"><strong>Location:</strong> {worker.location}</p>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {worker.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Portfolio */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Portfolio</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {worker.portfolio.map((item) => (
                    <div key={item.id} className="border rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
                <div className="space-y-4">
                  {worker.reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{review.client}</span>
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1 text-sm text-gray-600">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-8 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hire {worker.name}</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">KSh {worker.hourlyRate}/hr</p>
                    <p className="text-sm text-gray-600">Hourly rate</p>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 font-semibold">{worker.rating}</span>
                    <span className="ml-1 text-gray-600">({worker.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="pt-4">
                    <Link
                      to={`/create-job?worker_id=${worker.id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md text-center block transition-colors font-medium"
                    >
                      Hire Now
                    </Link>
                  </div>
                  
                  <div className="text-center">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Contact Worker
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkerDetail
