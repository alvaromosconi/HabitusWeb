/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-void */
import React, { useEffect, useState } from 'react'
import { type Habit } from '../types/habitus-types'
import { DefaultHabitBox, HabitBox } from './HabitBox'
import { HabitusAPI } from '../api/API'
import HabitForm from './forms/HabitForm'
import Modal from './Modal'
import TelegramChatIdInput from './forms/TelegramChatIdInput'

function HabitGrid () {
    const [habits, setHabits] = useState<Habit[]>([])
    const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>(undefined)
    const [categories, setCategories] = useState<string[]>([])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [showTelegramInput, setShowTelegramInput] = useState<boolean>(false)

    const handleHabitChanges = (newHabit: Habit) => {
        const existingHabitIndex = habits.findIndex((hab) => hab.id === newHabit.id)
        if (existingHabitIndex === -1) {
            setHabits([...habits, newHabit])
        } else {
            habits[existingHabitIndex] = newHabit
            setHabits([...habits])
        }
        setIsModalOpen(false)
    }

    useEffect(() => {
        const fetchHabits = () => {
            HabitusAPI.getHabits()
                .then((data: Habit[]) => {
                    setHabits(data)
                })
                .catch((err: any) => {
                    console.log(err)
                })
        }
        fetchHabits()
    }, [])

    useEffect(() => {
        const updateCategories = () => {
            const userCategories = Array.from(new Set(habits.map((habit) => habit.category.name)))
            setCategories(userCategories)
        }

        updateCategories()
    }, [habits])

    const handleAddButtonClick = () => {
        setIsModalOpen(true)
    }

    const handleEditButtonClick = (habit: Habit) => {
        setSelectedHabit(habit)
        setIsModalOpen(true)
    }

    const handleDeleteButtonClick = async (habit: Habit) => {
        try {
            await HabitusAPI.deleteHabit(habit.id)
            setHabits((prevHabits) => {
                const updatedHabits = prevHabits.filter((ha) => ha.id !== habit.id)
                return updatedHabits
            })
        } catch (error) {
            console.error('Error deleting habit:', error)
        }
    }

    const handleTelegramButtonClick = () => {
        setShowTelegramInput(true)
    }

    const handleTelegramSubmit = async (userEnteredCode: number) => {
        try {
            await HabitusAPI.updateTelegramChatId(Number(userEnteredCode))
        } catch (error) {
            console.error('Error sending Telegram code:', error)
            alert('Error sending Telegram code. Please try again.')
        } finally {
            setShowTelegramInput(false)
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setShowTelegramInput(false)
    }

    const renderModalContent = (children: React.ReactNode) => {
        return <Modal open={true} onClose={closeModal}>{children}</Modal>
    }

    return (
        <div className='mx-16 my-16'>
            <DefaultHabitBox onAddButtonClick={handleAddButtonClick} />
            <div className="">
                {categories.map((category, index) => (
                    <div key={index} className='mt-4'>
                        <h2 className="text-2xl text-gray-500 font-sans">{category}</h2>
                        <hr className='bg-gray-700 w-full text-gray-700 mb-4'/>
                        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {habits
                                .filter((habit) => habit.category.name === category)
                                .map((habit, index) => (
                                    <HabitBox
                                        onEditButtonClick={() => { handleEditButtonClick(habit) }}
                                        onDeleteButtonClick={() => void handleDeleteButtonClick(habit)}
                                        onTelegramButtonClick={handleTelegramButtonClick}
                                        habit={habit}
                                        key={index}
                                    />
                                ))}
                        </div>
                    </div>
                ))}
            </div>
            {isModalOpen && renderModalContent(
                <HabitForm
                    habitToUpdate={selectedHabit}
                    onHabitsChange={handleHabitChanges}
                />
            )}
            {showTelegramInput && renderModalContent(
                <TelegramChatIdInput handleTelegramSubmit={handleTelegramSubmit}/>
            )}
        </div>
    )
}

export default HabitGrid
