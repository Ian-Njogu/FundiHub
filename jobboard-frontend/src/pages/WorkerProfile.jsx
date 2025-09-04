import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../config/api'

function WorkerProfile({ user }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [categories, setCategories] = useState([])
  const [profile, setProfile] = useState({
    category: '',
    location: '',
    hourly_rate: '',
    bio: '',
    skills: '',
    experience_years: 0,
    is_available: true
  })
  const [isEditing, setIsEditing] = useState(false)
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
    
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch available categories
        const categoriesRes = await api.get('/api/v1/workers/categories/')
        setCategories(categoriesRes.data)
        
        // Try to fetch existing profile
        try {
          const profileRes = await api.get('/api/v1/worker/profile/')
          setProfile({
            category: profileRes.data.category || '',
            location: profileRes.data.location || '',
            hourly_rate: profileRes.data.hourly_rate || '',
            bio: profileRes.data.bio || '',
            skills: Array.isArray(profileRes.data.skills) ? profileRes.data.skills.join(', ') : '',
            experience_years: profileRes.data.experience_years || 0,
            is_available: profileRes.data.is_available
          })
          setIsEditing(true)
        } catch (e) {
          if (e.response?.status === 404) {
            // No profile exists yet, show create form
            setIsEditing(false)
          } else {
            throw e
          }
        }
        
      } catch (e) {
        console.error('Failed to fetch data:', e)
        setError('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      setError(null)
      
      const payload = {
        category: profile.category,
        location: profile.location,
        hourly_rate: parseFloat(profile.hourly_rate),
        bio: profile.bio || '',
        skills: profile.skills.split(',').map(s => s.trim()).filter(s => s),
        experience_years: parseInt(profile.experience_years) || 0,
        is_available: profile.is_available !== undefined ? profile.is_available : true
      }
      
      if (isEditing) {
        // Update existing profile
        await api.put('/api/v1/worker/profile/', payload)
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        // Create new profile
        await api.post('/api/v1/worker/profile/', payload)
        setMessage({ type: 'success', text: 'Profile created successfully!' })
        setIsEditing(true)
      }
      
    } catch (e) {
      console.error('Failed to save profile:', e)
      setError(e.response?.data?.detail || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to manage your profile</h1>
          <button onClick={() => navigate('/login')} className="text-blue-600 hover:text-blue-800">Go to Login</button>
        </div>
      </div>
    )
  }

  if (user.role !== 'worker') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile management is for workers</h1>
          <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:text-blue-800">Go to Dashboard</button>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">Loading profile...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Your Profile' : 'Set Up Your Profile'}
        </h1>
        <p className="text-gray-600">
          {isEditing 
            ? 'Update your skills, location, and preferences to get better job matches'
            : 'Tell us about your skills and preferences to get matched with relevant jobs'
          }
        </p>
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

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Skill Category *
            </label>
            <select
              name="category"
              value={profile.category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.name} value={category.name}>
                  {category.name} - {category.description}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleInputChange}
              required
              placeholder="e.g., Nairobi West, Westlands, Kilimani"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Hourly Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hourly Rate (KSh) *
            </label>
            <input
              type="number"
              name="hourly_rate"
              value={profile.hourly_rate}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              placeholder="e.g., 25.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              name="skills"
              value={profile.skills}
              onChange={handleInputChange}
              placeholder="e.g., Pipe fitting, Leak repair, Water heater installation"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">Separate multiple skills with commas</p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleInputChange}
              rows={3}
              placeholder="Tell us about your experience and expertise..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Experience Years */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience
            </label>
            <input
              type="number"
              name="experience_years"
              value={profile.experience_years}
              onChange={handleInputChange}
              min="0"
              max="50"
              placeholder="e.g., 5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Available Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_available"
              checked={profile.is_available}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Available for new jobs
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                saving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {saving ? 'Saving...' : (isEditing ? 'Update Profile' : 'Create Profile')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WorkerProfile

