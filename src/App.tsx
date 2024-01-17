/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Routes, Route, useLocation } from 'react-router-dom'
import HabitGrid from './components/HabitsGrid'
import Login from './pages/Login'
import { AuthProvider } from './context/AuthContext'
import Sidebar from './components/Bars/Sidebar'
import { useState } from 'react'
import CustomNavbar from './components/Bars/Navbar'
import Categories from './pages/Categories'

// App.jsx

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
	return (
	  <>
		{location.pathname !== '/login' && <CustomNavbar showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>}
		<div className="min-h-screen flex">
			{location.pathname !== '/login' && <Sidebar show={showSidebar} setter={setShowSidebar} />}
			<MainContent location={location} />
		</div>
	  </>

	)
  }

  interface MainContentProps {
	location: any
  }

  function MainContent ({ location }: MainContentProps) {
	return (
	  <div className="flex-1">
		<Routes>
			<Route path="/login" element={<Login />} />
		 	<Route path="/home" element={<HabitGrid />} />
		  	<Route path="/" element={<HabitGrid />} />
			<Route path="/categories" element={<Categories />} />
		</Routes>
	  </div>
	)
  }

export default App
