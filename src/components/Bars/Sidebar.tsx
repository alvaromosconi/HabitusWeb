/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable react/prop-types */

import { Link, useLocation } from 'react-router-dom'
import { DashboardIcon, ExitIcon, LeftArrowIcon } from '../../assets/Icons'

interface SidebarProps {
    show: boolean
    setter: React.Dispatch<React.SetStateAction<boolean>>
    showMobileMenuBar?: boolean
}
export default function Sidebar({ show, setter }: SidebarProps) {
    // Define our base class
    const className = 'md:hidden bg-gray-800 w-[250px] transition-[margin-left] ease-in-out duration-500 fixed md:static top-0 bottom-0 left-0 z-40 rounded-lg'
    // Append class based on state of sidebar visiblity
    const appendClass = show ? '' : ' -ml-[250px]'

    interface MenuItemProps {
        icon: JSX.Element
        name?: string
        route?: string
    }
  // Clickable menu items
    const MenuItem = ({ icon, name, route }: MenuItemProps) => {
        // Highlight menu item based on currently displayed route
        const location = useLocation()
        const colorClass = location.pathname === route ? 'text-white' : 'text-white/50 hover:text-white'

        return (
            <Link
                to={route ?? '/'}
                onClick={() => {
                    setter((oldVal: any) => !oldVal)
                }}
                className={`flex gap-1 [&>*]:my-auto text-md pl-6 py-3 border-b-white/10 ${colorClass}`}
            >
                <div className="text-xl flex [&>*]:mx-auto w-[30px]">
                    {icon}
                </div>
                <div>{name}</div>
            </Link>
        )
    }

    // Overlay to prevent clicks in background, also serves as our close button
    const ModalOverlay = () => (
        <div
            className={'flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/10 z-30'}
            onClick={() => {
                setter((oldVal: boolean) => !oldVal)
            }}
        />
    )

    return (
        <>
            {show ? <ModalOverlay /> : <></>}
            <div className={`${className}${appendClass}`}>
                <div className='header flex justify-between'>
                    <img src='images/logo-essential.png' className='w-10 h-10 m-5'></img>
                    <div className='w-10 h-10 mt-5 mr-6'>
                        <MenuItem
                            route="/"
                            icon={<ExitIcon/>}
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <MenuItem
                        name="Dashboard"
                        route="/"
                        icon={<DashboardIcon/>}
                    />
                </div>
            </div>
        </>
    )
}
