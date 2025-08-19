function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">FundiHub</h3>
            <p className="text-gray-300">
              Connecting skilled workers with clients in need of quality services.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
              <li><a href="/workers" className="text-gray-300 hover:text-white">Find Workers</a></li>
              <li><a href="/login" className="text-gray-300 hover:text-white">Login</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300">
              Email: info@fundihub.com<br />
              Phone: +254 700 000 000
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 FundiHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
