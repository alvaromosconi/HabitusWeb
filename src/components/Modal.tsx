import React, { useState, useEffect } from 'react'

interface Props {
  children: React.ReactNode
  onClose: () => void
  open: boolean
}

const Modal = ({ children, onClose, open }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(open)

    useEffect(() => {
        setIsModalOpen(open)
    }, [open])

    return (
        <>
        {isModalOpen && (
            <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm grid grid-cols-1 content-center justify-items-center'>
                <div className='bg-gray-50 rounded-lg flex flex-col h-full overflow-y-auto'>
                    <button
                        className='text-[#E04717] text-3xl self-end mr-4 mt-2 hover:text-[#D44316] hover:scale-90'
                        onClick={onClose}
                    >
                    X
                    </button>
                    {children}
                </div>
            </div>
        )}
        </>
    )
}

export default Modal
