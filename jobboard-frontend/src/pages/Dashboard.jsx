import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../config/api'

function Dashboard({ user }) {
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [workerJobs, setWorkerJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

    // Handle status change for a job
    const handleStatusChange = async (jobId, newStatus) => {
      try {
        const response = await api.patch(`/api/v1/jobs/${jobId}/`, { status: newStatus })
        // Update local state
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, status: response.data.status } : job
          )
        )
      } catch (err) {
        showMessage('error', 'Failed to update job status')
        console.error('Error updating job status:', err)
      }
    }

  useEffect(() => {
    if (user) {
      fetchJobs()
      if (user.role === 'client') {
        fetchApplications()
      } else if (user.role === 'worker') {
        fetchWorkerJobs()
      }
    }
  }, [user])

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      if (user.role === 'client') {
        const response = await api.get(`/api/v1/jobs/?client_id=${user.id}`)
        // Handle both array and paginated response formats
        const jobsData = Array.isArray(response.data) ? response.data : response.data.results || []
        setJobs(jobsData)
      } else {
        // Use the actual logged-in user's ID - no more hardcoded IDs!
        const response = await api.get(`/api/v1/jobs/feed/?feed_for_worker_id=${user.id}`)
        // Handle both array and paginated response formats
        const jobsData = Array.isArray(response.data) ? response.data : response.data.results || []
        setJobs(jobsData)
      }
      setError(null)
    } catch (err) {
      setError('Failed to fetch jobs')
      console.error('Error fetching jobs:', err)
      setJobs([]) // Ensure jobs is always an array
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    // Auto-hide message after 5 seconds
    setTimeout(() => setMessage(null), 5000)
  }

  const handleWorkerJobStatusChange = async (jobId, newStatus) => {
    try {
      const response = await api.patch(`/api/v1/jobs/${jobId}/`, { status: newStatus })
      setWorkerJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: response.data.status } : j))
      showMessage('success', 'Job status updated successfully!')
    } catch (e) {
      showMessage('error', 'Failed to update job status')
      console.error('Error updating job status:', e)
    }
  }

  

  const fetchApplications = async () => {
    try {
      const res = await api.get(`/api/v1/applications/?client_id=${user.id}`)
      // Handle both array and paginated response formats
      const applicationsData = Array.isArray(res.data) ? res.data : res.data.results || []
      setApplications(applicationsData)
    } catch (e) {
      console.error('Failed to load applications', e)
      setApplications([]) // Ensure applications is always an array
    }
  }

  const fetchWorkerJobs = async () => {
    try {
      const res = await api.get(`/api/v1/worker/${user.id}/jobs/`)
      // Handle both array and paginated response formats
      const workerJobsData = Array.isArray(res.data) ? res.data : res.data.results || []
      setWorkerJobs(workerJobsData)
    } catch (e) {
      console.error('Failed to load worker jobs', e)
      setWorkerJobs([]) // Ensure workerJobs is always an array
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      accepted: { color: 'bg-indigo-100 text-indigo-800', text: 'Accepted' },
      in_progress: { color: 'bg-blue-100 text-blue-800', text: 'In Progress' },
      completed: { color: 'bg-green-100 text-green-800', text: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' }
    }
    
    const config = statusConfig[status] || statusConfig.pending
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
        {config.text}
      </span>
    )
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your dashboard</h1>
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading dashboard...</div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}!</p>
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{Array.isArray(jobs) ? jobs.length : 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">
                {Array.isArray(jobs) ? jobs.filter(job => job.status === 'in_progress').length : 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {Array.isArray(jobs) ? jobs.filter(job => job.status === 'completed').length : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {user.role === 'client' ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/create-job"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Post New Job
            </Link>
            <Link
              to="/workers"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Find Workers
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Jobs For You</h2>
          <p className="text-gray-600 mb-4">These jobs match your category and location.</p>
          <Link to="/job-feed" className="text-blue-600 hover:text-blue-800">Go to Job Feed →</Link>
        </div>
      )}

      {/* Worker Profile Management */}
      {user.role === 'worker' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Management</h2>
          <p className="text-gray-600 mb-4">
            Set up your skills, location, and preferences to get better job matches.
          </p>
          <Link 
            to="/worker-profile" 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Manage Profile
          </Link>
        </div>
      )}

      {/* Recent Jobs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Recent Jobs</h2>
        </div>
        
        {!jobs || jobs.length === 0 ? (
          <div className="p-6 text-center">
            {user.role === 'client' ? (
              <>
                <p className="text-gray-500 mb-4">You haven't posted any jobs yet.</p>
                <Link
                  to="/create-job"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Post Your First Job
                </Link>
              </>
            ) : (
              <p className="text-gray-500">No matching jobs right now. Check back soon.</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {Array.isArray(jobs) && jobs.map((job) => (
              <div key={job.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{job.title}</h3>
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
                  {user.role === 'client' ? (
                    <div className="ml-6 flex flex-col items-end">
                      {getStatusBadge(job.status)}
                      <select
                        className="mt-2 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300"
                        value={job.status}
                        onChange={e => handleStatusChange(job.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      
                    </div>
                  ) : (
                    <div className="ml-6 flex flex-col items-end">
                      <button
                        onClick={async () => {
                          try {
                            await api.post(`/api/v1/jobs/${job.id}/applications/`, {
                              workerId: user.id,
                              message: 'I can help with this job.',
                              quote: job.budget
                            })
                            showMessage('success', 'Applied to job!')
                          } catch (e) {
                            showMessage('error', 'Failed to apply')
                          }
                        }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Client Applications Panel */}
      {user.role === 'client' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mt-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Applications</h2>
          </div>
          {!applications || applications.length === 0 ? (
            <div className="p-6 text-gray-500">No applications yet.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {Array.isArray(applications) && applications.map(app => (
                <div key={app.id} className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 font-medium">{app.workerName || `Worker #${app.workerId}`}</p>
                    <p className="text-gray-600 text-sm">Applied to: {app.jobTitle} • {app.jobCategory} • {app.jobLocation}</p>
                    <p className="text-gray-600 text-sm mt-1">Message: {app.message} • Quote: KSh {app.quote}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        try {
                          await api.post(`/api/v1/applications/${app.id}/accept/`)
                          // Remove the accepted application from the list
                          setApplications(prev => prev.filter(a => a.id !== app.id))
                          // Refresh jobs to show updated status
                          fetchJobs()
                          showMessage('success', 'Application accepted successfully!')
                        } catch (e) {
                          showMessage('error', 'Failed to accept application')
                          console.error('Error accepting application:', e)
                        }
                      }}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await api.post(`/api/v1/applications/${app.id}/reject/`)
                          // Remove the rejected application from the list
                          setApplications(prev => prev.filter(a => a.id !== app.id))
                          showMessage('success', 'Application rejected successfully!')
                        } catch (e) {
                          showMessage('error', 'Failed to reject application')
                          console.error('Error rejecting application:', e)
                        }
                      }}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Worker My Jobs Section */}
      {user.role === 'worker' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mt-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">My Jobs</h2>
          </div>
          {!workerJobs || workerJobs.length === 0 ? (
            <div className="p-6 text-gray-500">You have no assigned jobs yet.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {Array.isArray(workerJobs) && workerJobs.map(job => (
                <div key={job.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{job.title}</h3>
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
                    <div className="ml-6 flex flex-col items-end">
                      <span className="text-sm text-gray-600">Status</span>
                      <select
                        className="mt-1 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300"
                        value={job.status}
                        onChange={e => handleWorkerJobStatusChange(job.id, e.target.value)}
                      >
                        <option value="accepted">Accepted</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard
