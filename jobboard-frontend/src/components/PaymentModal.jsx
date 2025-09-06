import { useState } from 'react'
import { 
  FaTimes, 
  FaUser, 
  FaDollarSign, 
  FaFileAlt, 
  FaPhone, 
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaMobileAlt
} from 'react-icons/fa'
import api from '../config/api'

function PaymentModal({ isOpen, onClose, worker, job, onSuccess }) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    phoneNumber: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.amount || !formData.description || !formData.phoneNumber) {
      setMessage({ type: 'error', text: 'Please fill in all fields' })
      return
    }

    try {
      setLoading(true)
      setMessage({ type: '', text: '' })

      const response = await api.post('/api/v1/payments/payments/initiate_mpesa/', {
        amount: parseFloat(formData.amount),
        description: formData.description,
        worker: worker.id, // WorkerProfile ID
        job: job?.id || null,
        mpesa_phone_number: formData.phoneNumber
      })

      if (response.data.mpesa_response) {
        setMessage({ 
          type: 'success', 
          text: 'STK push sent! Please check your phone and enter your M-Pesa PIN to complete the payment.' 
        })
        
        // Reset form
        setFormData({ amount: '', description: '', phoneNumber: '' })
        
        // Close modal after 3 seconds
        setTimeout(() => {
          onClose()
          if (onSuccess) onSuccess()
        }, 3000)
      }
    } catch (error) {
      console.error('Payment error:', error)
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to initiate payment. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md my-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaDollarSign className="text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Pay Worker</h2>
                <p className="text-blue-100 text-sm">Secure M-Pesa Payment</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-full"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        
        <div className="p-6 max-h-96 overflow-y-auto">

          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center space-x-3">
                {message.type === 'success' ? (
                  <FaCheckCircle className="text-green-600 text-lg" />
                ) : (
                  <FaExclamationTriangle className="text-red-600 text-lg" />
                )}
                <span className="text-sm font-medium">{message.text}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <FaUser className="inline mr-2 text-blue-600" />
                Worker Details
              </label>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{worker.name}</p>
                    <p className="text-sm text-gray-600">{worker.category} • {worker.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaDollarSign className="inline mr-2 text-green-600" />
                Amount (KSh)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                required
                min="1"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaFileAlt className="inline mr-2 text-purple-600" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="What is this payment for?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMobileAlt className="inline mr-2 text-orange-600" />
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+254712345678"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                required
                pattern="\+254[0-9]{9}"
              />
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <FaPhone className="mr-1" />
                Enter your M-Pesa registered phone number
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FaMobileAlt />
                    <span>Pay with M-Pesa</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
