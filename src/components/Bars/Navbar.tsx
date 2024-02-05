/* eslint-disable react/no-unknown-property */
/* eslint-disable no-mixed-spaces-and-tabs */

import { useContext, useState } from 'react'
import { Bars4Icon, UserCircleIcon } from '@heroicons/react/24/solid'
import { AuthContext } from '../../context/AuthContext'
import { type User } from '../../types/habitus-types'

// Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white"

interface Props {
	showSidebar: boolean
	setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

export function Navbar ({ showSidebar, setShowSidebar }: Props) {
	const [isOpen, setIsOpen] = useState(false)
	const { logout } = useContext(AuthContext)

	const toggleDropdown = () => {
		setIsOpen(!isOpen)
	}

	const removeTelegramCode = () => {
		const user: User | undefined = JSON.parse(localStorage.getItem('user') ?? 'null')
		if (user != null) {
			delete (user as { chatId?: number }).chatId
		  	localStorage.setItem('user', JSON.stringify(user))
		}
	  }
	return (
		<nav className="bg-gray-800 text-white w-full">
			<div className="mx-auto max-w-screen-2xl px-2">
				<div className="relative flex h-16 items-center justify-between">
					<div className="flex flex-1 items-center justify-between ">
						<div className={'md:hidden p-4'} onClick={() => { setShowSidebar((oldVal: boolean) => !oldVal) }}>
							<button>
								{!showSidebar && <Bars4Icon className='w-6 h-6'/>}
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
									<a href="/" className="text-lg text-white px-3 py-2 font-medium" aria-current="page">My Habits</a>
									<a href="/categories" className="text-lg text-white px-3 py-2 font-medium">Categories</a>
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
								<UserCircleIcon className='w-8 h-8'/>
							</button>
							<div className={`flex flex-col absolute right-0 z-10 mt-2 w-max origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${isOpen ? 'block' : 'hidden'}`}>
								{localStorage.getItem('authenticated') === 'true'
								?	<button type='button' className='w-[100%]' onClick={logout}>
										<a href="/login" className="w-[100%] hover:bg-gray-300 block px-4 py-2 text-sm text-gray-700" role="menuitem" id="user-menu-item-2">
											Sign out
										</a>
									</button>
								:	<a href="/login" className="w-max hover:bg-gray-300 block px-4 py-2 text-sm text-gray-700" role="menuitem" id="user-menu-item-2">
										Sign in
									</a>
								}
								<button type='button' onClick={removeTelegramCode}>
									<a href="/login" className="w-max hover:bg-gray-300 block px-4 py-2 text-sm text-gray-700" role="menuitem" id="user-menu-item-2">
										Reset Telegram Configuration
									</a>
								</button>
							</div>
					</div>
					</div>
				</div>
			</div>
		</nav>
	)
}

export default Navbar
