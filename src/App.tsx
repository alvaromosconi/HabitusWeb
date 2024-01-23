import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import HabitGrid from './components/HabitsGrid'
import Login from './pages/Login'
import { AuthProvider } from './context/AuthContext'
import Sidebar from './components/Bars/Sidebar'
import CustomNavbar from './components/Bars/Navbar'
import Categories from './pages/Categories'
import Register from './pages/Register'
import { useState } from 'react'

function App () {
  const location = useLocation()
  const [showSidebar, setShowSidebar] = useState<boolean>(false)

  return (
    <div className="App h-screen overflow-y-auto">
      <AuthProvider>
        <Layout showSidebar={showSidebar} setShowSidebar={setShowSidebar} location={location} />
      </AuthProvider>
    </div>
  )
}

interface LayoutProps {
  showSidebar: boolean
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
  location: any
}

function Layout ({ showSidebar, setShowSidebar, location }: LayoutProps) {
  const path = location.pathname
  const showBars = path !== '/login' && path !== '/register'
  return (
    <>
      {showBars && <CustomNavbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />}
      <div className="min-h-screen flex">
        {showBars && <Sidebar show={showSidebar} setter={setShowSidebar} />}
        <MainContent location={location} />
      </div>
    </>
  )
}

interface MainContentProps {
  location: any
}

function MainContent ({ location }: MainContentProps) {
  const authenticated = localStorage.getItem('authenticated')

  // Verifica si el usuario está autenticado y si está en la página de inicio de sesión
  if (authenticated === 'true' && location.pathname === '/login') {
    return <Navigate to="/home" />
  }

  return (
    <div className="flex-1">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<HabitGrid />} />
        <Route path="/" element={<HabitGrid />} />
        <Route path="/categories" element={<Categories />} />
      </Routes>
    </div>
  )
}

export default App
