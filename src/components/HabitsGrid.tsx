/* eslint-disable no-void */
import React, { useEffect, useState } from 'react'
import { type Habit } from '../types/habitus-types'
import { DefaultHabitBox, HabitBox } from './HabitBox'
import { HabitusAPI } from '../api/API'
import HabitForm from './forms/HabitForm'
import Modal from './Modal'

function HabitGrid () {
    const [habits, setHabits] = useState<Habit[]>([])
    const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>(undefined)
    const [categories, setCategories] = useState<string[]>([])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const handleHabitChanges = (newHabit: Habit) => {
        const existingHabitIndex = habits.findIndex((hab) => hab.id === newHabit.id)
        if (existingHabitIndex === -1) {
            setHabits([...habits, newHabit])
        } else {
            habits[existingHabitIndex] = newHabit
            setHabits(() => habits)
        }

        closeModal()
    }

    useEffect(() => {
        HabitusAPI.getHabits()
            .then((data: Habit[]) => {
                setHabits(data)
                const userCategories = Array.from(new Set(data.map((habit) => habit.category.name)))
                setCategories(userCategories)
            })
            .catch((err: any) => {
                console.log(err)
            })
    }, [setHabits])

    useEffect(() => {
    }, [habits])

    const handleAddButtonClick = () => {
        openModal()
    }

    const handleEditButtonClick = (habit: Habit) => {
        setSelectedHabit(habit)
        openModal()
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

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        if (isModalOpen) {
            setIsModalOpen(false)
        }
    }

    return (
        <div className='mx-16 my-16'>
            <button className="bg-[#ade017] hover:bg-[#cdee6a] text-white font-bold py-2 px-4 rounded-full inline-flex items-center mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Add Category</span>
            </button>
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
                                    habit={habit}
                                    key={index}
                                />
                            ))}
                    </div>
                </div>
            ))}
            </div>
            {isModalOpen &&
                <Modal onClose={closeModal}>
                    <HabitForm habitToUpdate={selectedHabit}
                               onHabitsChange={handleHabitChanges}
                    />
                </Modal>
            }
        </div>
    )
}

export default HabitGrid
