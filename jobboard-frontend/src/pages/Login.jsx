import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import api from '../config/api'

function Login({ onLogin }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const navigate = useNavigate()
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState(null)

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <span className="text-2xl">🔧</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignup ? 'Create Account' : 'Sign in to FundiHub'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignup ? 'Join FundiHub to connect with skilled workers' : 'Connect with skilled workers for your projects'}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 text-lg font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Name field - only show for signup */}
            {isSignup && (
              <div>
                <label htmlFor="name" className="sr-only">
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
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
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 focus:z-10 sm:text-sm ${
                  isSignup ? 'rounded-none' : 'rounded-t-md'
                }`}
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
            <div>
              <label htmlFor="role" className="sr-only">
                Role
              </label>
              <select
                {...register('role')}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-200 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 sm:text-sm"
                defaultValue="client"
              >
                <option value="client">Client</option>
                <option value="worker">Worker</option>
              </select>
            </div>
              <input
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (isSignup ? 'Creating account...' : 'Signing in...') : (isSignup ? 'Create Account' : 'Sign in')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup)
                setError(null) // Clear error when switching modes
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          {!isSignup && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
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
