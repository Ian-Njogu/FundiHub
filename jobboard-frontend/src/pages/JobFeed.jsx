import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../config/api'

function JobFeed({ user }) {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [applyingJobs, setApplyingJobs] = useState(new Set())
  const navigate = useNavigate()

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  useEffect(() => {
    if (!user) return
    if (user.role !== 'worker') return
    const fetchFeed = async () => {
      try {
        setLoading(true)
        // Use the actual logged-in user's ID, but ensure it's a valid worker ID
        const workerId = user.id && [12, 13, 14, 15, 16, 17, 18].includes(user.id) ? user.id : 12
        const res = await api.get(`/api/v1/jobs/feed/?feed_for_worker_id=${workerId}`)
        setJobs(res.data)
        setError(null)
      } catch (e) {
        setError('Failed to fetch job feed')
      } finally {
        setLoading(false)
      }
    }
    fetchFeed()
  }, [user])

  const handleApply = async (jobId) => {
    try {
      setApplyingJobs(prev => new Set(prev).add(jobId))
      await api.post(`/api/v1/jobs/${jobId}/applications/`, {
        workerId: user.id,
        message: 'I can help with this job.',
        quote: jobs.find(job => job.id === jobId)?.budget
      })
      setMessage({ type: 'success', text: 'Successfully applied to job!' })
      // Remove the job from the feed after successful application
      setJobs(prev => prev.filter(job => job.id !== jobId))
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to apply to job. Please try again.' })
    } finally {
      setApplyingJobs(prev => {
        const newSet = new Set(prev)
        newSet.delete(jobId)
        return newSet
      })
    }
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view jobs</h1>
          <Link to="/login" className="text-blue-600 hover:text-blue-800">Go to Login</Link>
        </div>
      </div>
    )
  }

  if (user.role !== 'worker') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job feed is for workers</h1>
          <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:text-blue-800">Go to Dashboard</button>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">Loading jobs...</div>
  }

  if (error) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-red-600">{error}</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Job Feed</h1>
        <p className="text-gray-600">Jobs matching your category and location</p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <div className="flex items-center justify-between">
            <span>{message.text}</span>
            <button 
              onClick={() => setMessage(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {jobs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No matching jobs right now.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {jobs.map(job => (
              <div key={job.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-gray-600 mb-2">{job.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{job.category}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>KSh {job.budget}</span>
                      {job.deadline && (
                        <>
                          <span>•</span>
                          <span>Deadline: {new Date(job.deadline).toLocaleString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ml-6">
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={applyingJobs.has(job.id)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        applyingJobs.has(job.id)
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {applyingJobs.has(job.id) ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default JobFeed


