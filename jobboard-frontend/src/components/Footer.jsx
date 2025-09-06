import { Link } from 'react-router-dom'
import { 
  FaHeart, 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaWrench
} from 'react-icons/fa'

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <FaWrench className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold">FundiHub</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Connecting skilled workers with clients who need their services. 
              Find the perfect match for your project or showcase your expertise.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaGithub className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/workers" className="text-gray-300 hover:text-white transition-colors">
                  Find Workers
                </Link>
              </li>
              <li>
                <Link to="/job-feed" className="text-gray-300 hover:text-white transition-colors">
                  Job Feed
                </Link>
              </li>
              <li>
                <Link to="/create-job" className="text-gray-300 hover:text-white transition-colors">
                  Post a Job
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-300">
                <FaEnvelope className="text-gray-400" />
                <span>info@fundihub.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <FaPhone className="text-gray-400" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <FaMapMarkerAlt className="text-gray-400" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 FundiHub. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center space-x-1 mt-2 md:mt-0">
            <span>Made with</span>
            <FaHeart className="text-red-500 text-sm" />
            <span>in Kenya</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
