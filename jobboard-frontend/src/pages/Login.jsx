import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { 
  FaWrench, 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaUserTie,
  FaHardHat,
  FaSpinner,
  FaExclamationTriangle,
  FaTimes,
  FaCheckCircle
} from 'react-icons/fa'
import api from '../config/api'

function Login({ onLogin }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const navigate = useNavigate()
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data) => {
    try {
      setError(null) // Clear any previous errors
      const endpoint = isSignup ? '/api/v1/auth/signup' : '/api/v1/auth/login'
      const response = await api.post(endpoint, data)
      const { accessToken, user } = response.data
      
      // Store token
      localStorage.setItem('accessToken', accessToken)
      
      // Call parent login function
      onLogin(user)
      
      // Redirect to dashboard
      navigate('/dashboard')
    } catch (error) {
      console.error(isSignup ? 'Signup error:' : 'Login error:', error)
      if (error.response?.status === 401) {
        setError('Invalid credentials. Please check your email and password.')
      } else if (error.response?.status === 400) {
        const errorDetail = error.response.data.detail
        if (typeof errorDetail === 'string') {
          setError(errorDetail)
        } else {
          setError('Please check your input and try again.')
        }
      } else {
        setError(isSignup ? 'Signup failed. Please try again.' : 'Login failed. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
            <FaWrench className="text-white text-2xl" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignup ? 'Create Account' : 'Welcome to FundiHub'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignup ? 'Join FundiHub to connect with skilled workers' : 'Connect with skilled workers for your projects'}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaExclamationTriangle className="text-red-600" />
                <span className="text-sm font-medium">{error}</span>
              </div>
              <button 
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            {/* Name field - only show for signup */}
            {isSignup && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2 text-blue-600" />
                  Full Name
                </label>
                <input
                  {...register('name', { 
                    required: isSignup ? 'Full name is required' : false,
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationTriangle className="mr-1" />
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2 text-blue-600" />
                Email Address
              </label>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationTriangle className="mr-1" />
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                <FaUserTie className="inline mr-2 text-blue-600" />
                I am a...
              </label>
              <select
                {...register('role')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                defaultValue="client"
              >
                <option value="client">
                  <FaUserTie className="mr-2" />
                  Client (Looking for workers)
                </option>
                <option value="worker">
                  <FaHardHat className="mr-2" />
                  Worker (Looking for jobs)
                </option>
              </select>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                <FaLock className="inline mr-2 text-blue-600" />
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationTriangle className="mr-1" />
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  {isSignup ? 'Creating account...' : 'Signing in...'}
                </>
              ) : (
                <>
                  {isSignup ? <FaUser className="mr-2" /> : <FaCheckCircle className="mr-2" />}
                  {isSignup ? 'Create Account' : 'Sign In'}
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup)
                setError(null) // Clear error when switching modes
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          {!isSignup && (
            <div className="text-center">
              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <FaCheckCircle className="inline mr-2 text-blue-600" />
                Demo credentials: Use any valid email and password
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default Login
