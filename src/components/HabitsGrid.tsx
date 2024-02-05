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
import { ColorRing } from 'react-loader-spinner'

function HabitGrid () {
    dayjs.extend(utc)
    dayjs.extend(timezone)

    const [habits, setHabits] = useState<Habit[]>([])
    const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>(undefined)
    const [categories, setCategories] = useState<string[]>([])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [showTelegramInput, setShowTelegramInput] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleHabitChanges = (newHabit: Habit) => {
        setIsLoading(true)
        newHabit = habitWithLocalTime(newHabit)
        const existingHabitIndex = habits.findIndex((hab) => hab.id === newHabit.id)
        if (existingHabitIndex === -1) {
            setHabits([...habits, newHabit])
        } else {
            habits[existingHabitIndex] = newHabit
            setHabits([...habits])
        }
        setIsModalOpen(false)
        setIsLoading(false)
    }

    useEffect(() => {
        void fetchHabits()
      }, [])

    const fetchHabits = async () => {
        setIsLoading(true)
        await HabitusAPI.getHabits()
            .then((data: Habit[]) => {
                setHabits(habitsWithLocalTime(data))
                setIsLoading(false)
            })
            .catch((err: any) => {
                console.error(err)
            })
        setIsLoading(false)
    }

    useEffect(() => {
        const updateCategories = () => {
            const userCategories = Array.from(new Set(habits.map((habit) => habit.category.name)))
            setCategories(userCategories)
        }
        updateCategories()
    }, [habits])

    const habitsWithLocalTime = (data: Habit[]): Habit[] => {
        const formattedHabits = data.map(habit => {
            return habitWithLocalTime(habit)
        })
        return formattedHabits
    }

    const habitWithLocalTime = (habit: Habit): Habit => {
        const localTime = dayjs.utc(habit.notificationTime, 'HH:mm:ss').tz(dayjs.tz.guess())
        return { ...habit, notificationTime: localTime.format('HH:mm:ss') }
    }

    const handleAddButtonClick = () => {
        setIsModalOpen(true)
    }

    const handleEditButtonClick = (habit: Habit) => {
        setSelectedHabit(habit)
        setIsModalOpen(true)
    }

    const handleDeleteButtonClick = async (habit: Habit) => {
        setIsLoading(true)
        try {
            await HabitusAPI.deleteHabit(habit.id)
            setHabits((prevHabits) => {
                const updatedHabits = prevHabits.filter((ha) => ha.id !== habit.id)
                return updatedHabits
            })
        } catch (error) {
            console.error('Error deleting habit:', error)
        }
        setIsLoading(false)
    }

    const handleTelegramButtonClick = () => {
        setShowTelegramInput(true)
    }

    const handleTelegramSubmit = async (userEnteredCode: number) => {
        setIsLoading(true)
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
        setIsLoading(false)
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
            {isLoading
            ? <div className='fixed top-0 left-0 w-full h-full bg-[rgba(255, 255, 255, 0.7)] flex items-center justify-center z-999'>
                    <ColorRing width={100} height={100}/>
                </div>
                : ''
            }
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
