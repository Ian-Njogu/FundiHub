import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../config/api'

function JobFeed({ user }) {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [applyingJobs, setApplyingJobs] = useState(new Set())
  const [appliedJobs, setAppliedJobs] = useState(new Set())
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
        // Use the actual logged-in user's ID - no more hardcoded IDs!
        const res = await api.get(`/api/v1/jobs/feed/?feed_for_worker_id=${user.id}`)
        setJobs(res.data)
        setError(null)
        
        // Check which jobs the worker has already applied to
        const appliedJobIds = new Set()
        for (const job of res.data) {
          try {
            // Try to get applications for this specific job
            const appRes = await api.get(`/api/v1/applications/?job_id=${job.id}`)
            // If the worker has an application to this job, add it to applied set
            if (appRes.data.some(app => app.worker === user.id)) {
              appliedJobIds.add(job.id)
            }
          } catch (e) {
            console.log(`Could not check applications for job ${job.id}`)
          }
        }
        setAppliedJobs(appliedJobIds)
        
      } catch (e) {
        console.error('Failed to fetch job feed:', e)
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
      
      // Debug: Log what we're about to send
      const payload = {
        message: 'I can help with this job.',
        quote: jobs.find(job => job.id === jobId)?.budget
      }
      console.log('Sending application payload:', payload)
      console.log('Job ID:', jobId)
      console.log('User:', user)
      
      // Only send the fields the backend expects (message and quote)
      const response = await api.post(`/api/v1/jobs/${jobId}/applications/`, payload)
      console.log('Application successful:', response.data)
      
      setMessage({ type: 'success', text: 'Successfully applied to job!' })
      // Add job to applied jobs set
      setAppliedJobs(prev => new Set([...prev, jobId]))
      // Remove the job from the feed after successful application
      setJobs(prev => prev.filter(job => job.id !== jobId))
    } catch (e) {
      console.error('Application failed:', e)
      console.error('Error response:', e.response?.data)
      console.error('Error status:', e.response?.status)
      
      if (e.response?.status === 400 && e.response?.data?.detail?.includes('already applied')) {
        setMessage({ type: 'info', text: 'You have already applied to this job!' })
        // Add job to applied jobs set even if it was a duplicate
        setAppliedJobs(prev => new Set([...prev, jobId]))
      } else {
        setMessage({ type: 'error', text: 'Failed to apply to job. Please try again.' })
      }
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
            : message.type === 'info'
            ? 'bg-blue-100 border border-blue-400 text-blue-700'
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
                    {appliedJobs.has(job.id) ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm border border-green-300">
                        Already Applied
                      </span>
                    ) : (
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
                    )}
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


