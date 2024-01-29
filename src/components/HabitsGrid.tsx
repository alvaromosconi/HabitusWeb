/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-void */
import React, { useEffect, useState } from 'react'
import { type APIResponse, type Habit } from '../types/habitus-types'
import { DefaultHabitBox, HabitBox } from './HabitBox'
import { HabitusAPI } from '../api/API'
import HabitForm from './forms/HabitForm'
import Modal from './Modal'
import TelegramSetupForm from './forms/TelegramSetupForm'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

function HabitGrid () {
    dayjs.extend(utc)
    dayjs.extend(timezone)

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
                    // Transformar cada habit.notificationTime a la hora local
                    const habitsWithLocalTime = data.map(habit => {
                        const localTime = dayjs.utc(habit.notificationTime, 'HH:mm:ss').tz(dayjs.tz.guess())
                        return { ...habit, notificationTime: localTime.format('HH:mm:ss') }
                    })
                    setHabits(habitsWithLocalTime)
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
        await HabitusAPI.updateTelegramChatId(userEnteredCode)
            .then(async (response: APIResponse) => {
                localStorage.setItem('user', JSON.stringify(response.resource))
            })
            .catch(async (response: APIResponse) => {
                console.error('Error sending Telegram code:', response.message)
                alert('Error sending Telegram code. Please try again.')
            })
            .finally(() => {
                setShowTelegramInput(false)
            })
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
                <TelegramSetupForm handleTelegramSubmit={handleTelegramSubmit}/>
            )}
        </div>
    )
}

export default HabitGrid
