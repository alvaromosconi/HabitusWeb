/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Routes, Route, useLocation } from 'react-router-dom'
import HabitGrid from './components/HabitsGrid'
import { CustomNavbar } from './components/CustomNavbar'
import Login from './pages/Login'
import { AuthProvider } from './context/AuthContext'

function App () {
	const location = useLocation()
	return (
		<div className="App h-screen overflow-y-auto">
			<AuthProvider>
				<header>
					{location.pathname !== '/login' && <CustomNavbar />}
				</header>
				<Routes>
					<Route path="/home" element={<HabitGrid />} />
					<Route path="/" element={<HabitGrid />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</AuthProvider>
		</div>
	)
}

export default App
