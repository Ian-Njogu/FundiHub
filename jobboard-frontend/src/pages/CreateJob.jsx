import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'

function CreateJob({ user }) {
  // useForm manages form state and validation
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  // React Router hook to programmatically navigate
  const navigate = useNavigate()

  // Get URL query parameters (e.g., ?worker_id=2)
  const [searchParams] = useSearchParams()
  const workerId = searchParams.get('worker_id')

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Build job payload
      const jobData = {
        ...data,
        clientId: user?.id || 1,                 // fallback if user ID missing
        workerId: workerId ? parseInt(workerId) : null,
        budget: parseInt(data.budget)            // ensure budget is a number
      }
      
      // Send POST request to create job
      const response = await axios.post('/api/v1/jobs', jobData)
      console.log('Job created:', response.data)
      
      // Redirect to dashboard after successful creation
      navigate('/dashboard')
    } catch (error) {
      console.error('Error creating job:', error)
      alert('Failed to create job. Please try again.')
    }
  }

  // If no user is logged in, show login prompt
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to create a job or hire worker
          </h1>
          <button 
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-800"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Main job creation form
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
        <p className="text-gray-600">
          Describe the work you need done and find the right worker.
        </p>
      </div>

      {/* Form container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Job Details</h2>
        </div>
        
        {/* Job creation form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          
          {/* Title + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job title field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                {...register('title', { required: 'Job title is required' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-md 
                           focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300"
                placeholder="e.g., Fix leaking kitchen sink"
              />
              {/* Validation error */}
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Category dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full px-3 py-2 border border-gray-200 rounded-md 
                           focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300"
              >
                <option value="">Select a category</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Electrical">Electrical</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Painting">Painting</option>
                <option value="Gardening">Gardening</option>
                <option value="Moving">Moving</option>
                <option value="General Labor">General Labor</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* Description field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register('description', { 
                required: 'Description is required',
                minLength: {
                  value: 20,
                  message: 'Description must be at least 20 characters'
                }
              })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-md 
                         focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300"
              placeholder="Describe the work you need done, including any specific requirements..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Location + Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                {...register('location', { required: 'Location is required' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-md 
                           focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300"
                placeholder="e.g., Nairobi West"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            {/* Budget field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget (KSh) *
              </label>
              <input
                {...register('budget', { 
                  required: 'Budget is required',
                  min: {
                    value: 100,
                    message: 'Budget must be at least KSh 100'
                  }
                })}
                type="number"
                min="100"
                className="w-full px-3 py-2 border border-gray-200 rounded-md 
                           focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300"
                placeholder="e.g., 2000"
              />
              {errors.budget && (
                <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
              )}
            </div>
          </div>

          {/* Deadline (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline (Optional)
            </label>
            <input
              {...register('deadline')}
              type="datetime-local"
              className="w-full px-3 py-2 border border-gray-200 rounded-md 
                         focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300"
            />
          </div>

          {/* Invited worker (optional) */}
          {workerId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invited Worker
              </label>
              <input
                type="text"
                value={`Worker #${workerId}`}
                disabled
                className="w-full px-3 py-2 border border-gray-100 rounded-md bg-gray-50 text-gray-600"
              />
            </div>
          )}

          {/* Form actions (Cancel / Submit) */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 
                         rounded-md text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white 
                         rounded-md text-sm font-medium transition-colors 
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateJob
