/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import React from 'react'

interface Props {
    children: React.ReactNode
    onClose: () => void
  }

const Modal = ({ children, onClose }: Props) => {
    return (
        <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm grid grid-cols-1 content-center justify-items-center'>
            <div className='bg-gray-50 rounded-lg flex flex-col h-full overflow-y-auto'>
                <button className='text-[#E04717] text-3xl self-end mr-4 mt-2 hover:text-[#D44316] hover:scale-90' onClick={onClose}>
                X
                </button>
                {children}
            </div>
        </div>
    )
}

export default Modal
