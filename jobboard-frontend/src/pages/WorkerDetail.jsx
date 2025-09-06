import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../config/api'
import PaymentModal from '../components/PaymentModal'

function WorkerDetail() {
  const { id } = useParams()
  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    fetchWorker()
  }, [id])

  const fetchWorker = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/v1/workers/${id}/`)
      console.log('Worker data:', response.data)
      setWorker(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch worker details')
      console.error('Error fetching worker:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!reviewForm.comment.trim()) return

    try {
      setSubmittingReview(true)
      setMessage({ type: '', text: '' }) // Clear previous messages
      
      await api.post(`/api/v1/workers/${id}/reviews/`, reviewForm)
      
      // Refresh worker data to show new review
      await fetchWorker()
      
      // Reset form
      setReviewForm({ rating: 5, comment: '' })
      setShowReviewForm(false)
      
      setMessage({ type: 'success', text: 'Review submitted successfully!' })
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (err) {
      console.error('Error submitting review:', err)
      setMessage({ type: 'error', text: 'Failed to submit review. Please try again.' })
      
      // Clear error message after 5 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } finally {
      setSubmittingReview(false)
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

      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-lg mr-2">
                {message.type === 'success' ? '✅' : '❌'}
              </span>
              <span className="font-medium">{message.text}</span>
            </div>
            <button
              onClick={() => setMessage({ type: '', text: '' })}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{worker.name || 'Unknown'}</h1>
              {worker.phoneNumber && (
                <p className="text-lg text-blue-600 mb-2 font-medium flex items-center">
                  <span className="mr-2">📞</span>
                  {worker.phoneNumber}
                </p>
              )}
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
                  <p className="text-gray-700 mb-2"><strong>Category:</strong> {worker.category}</p>
                  <p className="text-gray-700"><strong>Location:</strong> {worker.location}</p>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
                {worker.skills && Array.isArray(worker.skills) && worker.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {worker.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No skills listed yet.</p>
                )}
              </div>

              {/* Reviews */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
                {worker.reviews && Array.isArray(worker.reviews) && worker.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {worker.reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="font-semibold text-gray-900">{review.clientName}</span>
                            <div className="flex items-center ml-3">
                              {[...Array(5)].map((_, i) => (
                                <span 
                                  key={i} 
                                  className={`text-sm ${
                                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No reviews yet</p>
                )}
              </div>

              {/* Review Form */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Leave a Review</h2>
                  <button
                    onClick={() => {
                      setShowReviewForm(!showReviewForm)
                      setMessage({ type: '', text: '' }) // Clear any existing messages
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {showReviewForm ? 'Cancel' : 'Write Review'}
                  </button>
                </div>
                
                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-lg">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className={`text-2xl ${
                              star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                            } hover:text-yellow-400 transition-colors`}
                          >
                            ★
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {reviewForm.rating} star{reviewForm.rating !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comment
                      </label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        placeholder="Share your experience with this worker..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submittingReview || !reviewForm.comment.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-8 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hire {worker.name || 'Worker'}</h3>
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
                  
                  <div className="pt-4 space-y-3">
                    <Link
                      to={`/create-job?worker_id=${worker.id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md text-center block transition-colors font-medium"
                    >
                      Hire Now
                    </Link>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md text-center block transition-colors font-medium"
                    >
                      Pay Worker
                    </button>
                  </div>
                  
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        worker={worker}
        onSuccess={() => {
          // Refresh worker data or show success message
          fetchWorker()
        }}
      />
    </div>
  )
}

export default WorkerDetail
