import { Link } from 'react-router-dom'
import { 
  FaHome, 
  FaUsers, 
  FaBriefcase, 
  FaTachometerAlt, 
  FaPlus, 
  FaSignInAlt,
  FaWrench
} from 'react-icons/fa'
import UserProfileDropdown from './UserProfileDropdown'

function Header({ user, onLogout, onEditProfile }) {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <FaWrench className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-gray-900">FundiHub</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            <Link to="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <FaHome className="text-sm" />
              <span>Home</span>
            </Link>
            {(!user || user.role === 'client') && (
              <Link to="/workers" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                <FaUsers className="text-sm" />
                <span>Find Workers</span>
              </Link>
            )}
            {user && user.role === 'worker' && (
              <Link to="/job-feed" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                <FaBriefcase className="text-sm" />
                <span>Job Feed</span>
              </Link>
            )}
            {user && (
              <>
                <Link to="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <FaTachometerAlt className="text-sm" />
                  <span>Dashboard</span>
                </Link>
                {user.role === 'client' && (
                  <Link to="/create-job" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    <FaPlus className="text-sm" />
                    <span>Post Job</span>
                  </Link>
                )}
              </>
            )}
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <UserProfileDropdown 
                user={user} 
                onLogout={onLogout}
                onEditProfile={onEditProfile}
              />
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <FaSignInAlt className="text-sm" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
