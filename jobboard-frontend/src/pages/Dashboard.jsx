import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaClipboardList, 
  FaClock, 
  FaCheckCircle, 
  FaPlus, 
  FaUsers, 
  FaUserCog, 
  FaBriefcase,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaEye,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaExclamationTriangle,
  FaTimes,
  FaCheck,
  FaInfoCircle,
  FaLongArrowAltRight,
  FaSignInAlt
} from 'react-icons/fa'
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
      pending: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        text: 'Pending',
        icon: <FaClock className="text-xs" />
      },
      accepted: { 
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200', 
        text: 'Accepted',
        icon: <FaCheck className="text-xs" />
      },
      in_progress: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        text: 'In Progress',
        icon: <FaSpinner className="text-xs" />
      },
      completed: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        text: 'Completed',
        icon: <FaCheckCircle className="text-xs" />
      },
      cancelled: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        text: 'Cancelled',
        icon: <FaTimes className="text-xs" />
      }
    }
    
    const config = statusConfig[status] || statusConfig.pending
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs rounded-full border ${config.color}`}>
        {config.icon}
        <span>{config.text}</span>
      </span>
    )
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaUserCog className="text-2xl text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your dashboard</h1>
          <Link to="/login" className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <FaSignInAlt className="text-sm" />
            <span>Go to Login</span>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FaSpinner className="text-2xl text-blue-600 animate-spin" />
          </div>
          <p className="text-gray-600">Loading dashboard...</p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600 flex items-center space-x-2">
          <FaUserCog className="text-sm" />
          <span>Welcome back, {user.name}!</span>
        </p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : message.type === 'info'
            ? 'bg-blue-50 border-blue-200 text-blue-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {message.type === 'success' ? (
                <FaCheckCircle className="text-green-600" />
              ) : message.type === 'info' ? (
                <FaInfoCircle className="text-blue-600" />
              ) : (
                <FaExclamationTriangle className="text-red-600" />
              )}
              <span>{message.text}</span>
            </div>
            <button 
              onClick={() => setMessage(null)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaClipboardList className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{Array.isArray(jobs) ? jobs.length : 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FaClock className="text-yellow-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">
                {Array.isArray(jobs) ? jobs.filter(job => job.status === 'in_progress').length : 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaCheckCircle className="text-green-600 text-xl" />
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FaPlus className="text-blue-600" />
            <span>Quick Actions</span>
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/create-job"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <FaPlus className="text-sm" />
              <span>Post New Job</span>
            </Link>
            <Link
              to="/workers"
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <FaUsers className="text-sm" />
              <span>Find Workers</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center space-x-2">
            <FaBriefcase className="text-blue-600" />
            <span>Jobs For You</span>
          </h2>
          <p className="text-gray-600 mb-4">These jobs match your category and location.</p>
          <Link to="/job-feed" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
            <span>Go to Job Feed</span>
            <FaLongArrowAltRight className="text-sm" />
          </Link>
        </div>
      )}

      {/* Worker Profile Management */}
      {user.role === 'worker' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center space-x-2">
            <FaUserCog className="text-green-600" />
            <span>Profile Management</span>
          </h2>
          <p className="text-gray-600 mb-4">
            Set up your skills, location, and preferences to get better job matches.
          </p>
          <Link 
            to="/worker-profile" 
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <FaUserCog className="text-sm" />
            <span>Manage Profile</span>
          </Link>
        </div>
      )}

      {/* Recent Jobs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <FaClipboardList className="text-blue-600" />
            <span>Recent Jobs</span>
          </h2>
        </div>
        
        {!jobs || jobs.length === 0 ? (
          <div className="p-6 text-center">
            {user.role === 'client' ? (
              <>
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaClipboardList className="text-2xl text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4">You haven't posted any jobs yet.</p>
                <Link
                  to="/create-job"
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <FaPlus className="text-sm" />
                  <span>Post Your First Job</span>
                </Link>
              </>
            ) : (
              <>
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaBriefcase className="text-2xl text-gray-400" />
                </div>
                <p className="text-gray-500">No matching jobs right now. Check back soon.</p>
              </>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {Array.isArray(jobs) && jobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{job.title}</h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FaBriefcase className="text-gray-400" />
                        <span>{job.category}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaDollarSign className="text-gray-400" />
                        <span>KSh {job.budget}</span>
                      </div>
                      {job.deadline && (
                        <div className="flex items-center space-x-1">
                          <FaCalendarAlt className="text-gray-400" />
                          <span>{new Date(job.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {user.role === 'client' ? (
                    <div className="ml-6 flex flex-col items-end space-y-3">
                      {getStatusBadge(job.status)}
                      <select
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
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
                    <div className="ml-6 flex flex-col items-end space-y-3">
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
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                      >
                        <FaPlus className="text-xs" />
                        <span>Apply</span>
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <FaUsers className="text-blue-600" />
              <span>Applications</span>
            </h2>
          </div>
          {!applications || applications.length === 0 ? (
            <div className="p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaUsers className="text-2xl text-gray-400" />
              </div>
              <p className="text-gray-500">No applications yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {Array.isArray(applications) && applications.map(app => (
                <div key={app.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {app.workerName ? app.workerName.charAt(0).toUpperCase() : 'W'}
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">{app.workerName || `Worker #${app.workerId}`}</p>
                          <p className="text-gray-500 text-sm">Applied to: {app.jobTitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <FaBriefcase className="text-gray-400" />
                          <span>{app.jobCategory}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaMapMarkerAlt className="text-gray-400" />
                          <span>{app.jobLocation}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaDollarSign className="text-gray-400" />
                          <span>KSh {app.quote}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">
                        <span className="font-medium">Message:</span> {app.message}
                      </p>
                    </div>
                    <div className="ml-6 flex items-center space-x-2">
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
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
                      >
                        <FaCheck className="text-xs" />
                        <span>Accept</span>
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
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
                      >
                        <FaTimes className="text-xs" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Worker My Jobs Section */}
      {user.role === 'worker' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <FaBriefcase className="text-green-600" />
              <span>My Jobs</span>
            </h2>
          </div>
          {!workerJobs || workerJobs.length === 0 ? (
            <div className="p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaBriefcase className="text-2xl text-gray-400" />
              </div>
              <p className="text-gray-500">You have no assigned jobs yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {Array.isArray(workerJobs) && workerJobs.map(job => (
                <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{job.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <FaBriefcase className="text-gray-400" />
                          <span>{job.category}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaMapMarkerAlt className="text-gray-400" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaDollarSign className="text-gray-400" />
                          <span>KSh {job.budget}</span>
                        </div>
                        {job.deadline && (
                          <div className="flex items-center space-x-1">
                            <FaCalendarAlt className="text-gray-400" />
                            <span>{new Date(job.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ml-6 flex flex-col items-end space-y-3">
                      {getStatusBadge(job.status)}
                      <select
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm"
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
