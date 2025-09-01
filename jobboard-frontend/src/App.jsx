import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Workers from './pages/Workers'
import WorkerDetail from './pages/WorkerDetail'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CreateJob from './pages/CreateJob'
import JobFeed from './pages/JobFeed'
import WorkerProfile from './pages/WorkerProfile'

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header user={user} onLogout={logout} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/workers/:id" element={<WorkerDetail />} />
            <Route path="/login" element={<Login onLogin={login} />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/create-job" element={<CreateJob user={user} />} />
            <Route path="/job-feed" element={<JobFeed user={user} />} />
            <Route path="/worker-profile" element={<WorkerProfile user={user} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
