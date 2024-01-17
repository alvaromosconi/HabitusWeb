/* eslint-disable react/no-unknown-property */
/* eslint-disable no-mixed-spaces-and-tabs */

import { useState } from 'react'
import { LeftArrowIcon, MenuIcon } from '../../assets/Icons'

// Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white"

interface Props {
	showSidebar: boolean
	setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

export function Navbar ({ showSidebar, setShowSidebar }: Props) {
	const [isOpen, setIsOpen] = useState(false)

	const toggleDropdown = () => {
		setIsOpen(!isOpen)
	}

	return (
		<nav className="bg-gray-800 text-white w-full">
			<div className="mx-auto max-w-screen-2xl px-2">
				<div className="relative flex h-16 items-center justify-between">
					<div className="flex flex-1 items-center justify-between ">
						<div className={'md:hidden p-4'} onClick={() => { setShowSidebar((oldVal: boolean) => !oldVal) }}>
							<button>
								{!showSidebar ? <MenuIcon /> : <LeftArrowIcon />}
							</button>
						</div>
						<div className="flex flex-shrink-0 items-center">
							{!showSidebar
								? <a href='/home'>
									<img className="h-8 w-auto" src="images/logo.svg" alt="habitus_logo"/>
								</a>
							: <> </>}
							<div className="hidden sm:ml-6 sm:block">
								<div className="flex space-x-4">
									<a href="#" className="text-lg text-white px-3 py-2 font-medium" aria-current="page">My Habits</a>
									<a href="#" className="text-lg text-white px-3 py-2 font-medium">Statistics</a>
									<a href="#" className="text-lg text-white px-3 py-2 font-medium">Habit Partners</a>
									<a href="#" className="text-lg text-white px-3 py-2 font-medium">Community Habits</a>
								</div>
							</div>
						</div>
						<div className="relative ml-3 group">
							<button
								type="button"
								onClick={toggleDropdown}
								className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
								id="user-menu-button"
								aria-expanded="false"
								aria-haspopup="true"
							>
								<span className="absolute -inset-1.5"></span>
								<span className="sr-only">Open user menu</span>
								<img
									className="h-12 w-12 rounded-full"
									src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
									alt="add-habit-button"
								/>
							</button>
							<div className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${isOpen ? 'block' : 'hidden'}`}>
								<a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" id="user-menu-item-0">
									Your Profile
								</a>
								<a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" id="user-menu-item-1">
									Settings
								</a>
								<a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" id="user-menu-item-2">
									Sign out
								</a>
							</div>
					</div>
					</div>
				</div>
			</div>
		</nav>
	)
}

export default Navbar
