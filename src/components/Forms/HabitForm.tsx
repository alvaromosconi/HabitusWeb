/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useEffect, useState } from 'react'
import { type Habit, type PostHabit, HabitState, WeekDays, type Category } from '../../types/habitus-types'
import HabitusAPI from '../../api/API'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { type Dayjs } from 'dayjs'

interface Props {
    habitToUpdate?: Habit
	onHabitsChange: (habit: Habit) => void
}

const HabitForm = ({ habitToUpdate, onHabitsChange }: Props) => {
    const [time, setTime] = React.useState<Dayjs>(dayjs('15:30:00', 'HH:mm:ss'))
    const [selectedDays, setSelectedDays] = useState<WeekDays[]>([])
    const [habit, setHabit] = useState<PostHabit>({
        categoryId: 1,
        name: '',
        description: '',
        notificationTime: '15:30:00',
        selectedDays: ['Monday'],
        state: HabitState.Active
    })
    const [categories, setCategories] = useState<Category[]>([{ id: 0, name: '' }])

    useEffect(() => {
        if (habitToUpdate != null) {
            setHabit({
                categoryId: habitToUpdate.category.id,
                name: habitToUpdate.name,
                description: habitToUpdate.description,
                notificationTime: habitToUpdate.notificationTime,
                selectedDays: habitToUpdate.selectedDaysSerialized.split(', '),
                state: habitToUpdate.state
            })
            setTime(dayjs(habitToUpdate.notificationTime, 'HH:mm:ss'))
            setSelectedDays(habitToUpdate.selectedDaysSerialized.split(', ') as WeekDays[])
        }
    }, [])

    useEffect(() => {
        async function fetchCategories () {
            const categoriesData = await getCategories()
            setCategories([...categoriesData, ...categories])
        }

        void fetchCategories()
    }, [setCategories])

    const handleDaySelection = (day: WeekDays) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter((selectedDay) => selectedDay !== day))
        } else {
            setSelectedDays([...selectedDays, day])
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setHabit({ ...habit, [e.target.name]: e.target.value })
    }

    async function getCategories () {
        return await HabitusAPI.getCategories()
    }

    async function handleAddHabit (e: React.FormEvent) {
        e.preventDefault()
        const habitWithTimeAndDays = { ...habit, notificationTime: time.format('HH:mm:ss').toString(), selectedDays }
        console.log(habitToUpdate !== undefined)
        if (habitToUpdate !== undefined) {
            onHabitsChange(await HabitusAPI.updateHabit(habitWithTimeAndDays, habitToUpdate.id))
        } else {
            onHabitsChange(await HabitusAPI.postHabit(habitWithTimeAndDays))
        }
    }

    return (
        <div className="bg-gray-50 rounded-xl grid grid-cols-1 px-4 py-4 w-full h-full">
            <div className="flex justify-between flex-col h-max">
                <h2 className="text-3xl font-bold text-center text-[#E04717] mb-4">New Habit</h2>
                <form onSubmit={handleAddHabit} className='grid grid-cols-1 max-w-[400px] gap-y-4'>
                    <div className="">
                        <input
                            type="text"
                            name="name"
                            placeholder='Name'
                            value={habit.name}
                            onChange={handleInputChange}
                            className="w-full h-10 border-b-2 border-gray-300 rounded-md focus:outline-none focus:border-[#D44316] indent-2"
                        />
                    </div>

                    <div className="">
                        <textarea
                            name="description"
                            placeholder='Description'
                            value={habit.description}
                            onChange={handleInputChange}
                            className="w-full h-12 border-b-2 border-gray-300 rounded-md focus:outline-none focus:border-[#D44316] indent-2"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <select
                            name="categoryId"
                            defaultValue={'default'}
                            onChange={handleInputChange}
                            className="w-full h-10 border-b-2 border-gray-300 rounded-md focus:outline-none focus:border-[#D44316] indent-2"
                        >
                           <option value='default' disabled>Select a category</option>
                            {categories?.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col ">
                        <label className="text-sm font-medium text-gray-700 mb-2">Notification Time</label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                value={dayjs(time)}
                                defaultValue={dayjs('09:00:20')}
                                ampm={false}
                                onChange={newValue => {
                                    if (newValue != null) {
                                        const timeString: Dayjs = newValue
                                        setTime(timeString)
                                    }
                                }}
                                className=''
                            />
                        </LocalizationProvider>

                    </div>

                    <div className="">
                        <div className="flex flex-wrap gap-x-4 justify-between">
                            {Object.values(WeekDays).map((day) => (
                                <label className="text-lg basis-1/3" key={day}>
                                    <input
                                        type="checkbox"
                                        checked={selectedDays.includes(day)}
                                        onChange={() => { handleDaySelection(day) }}
                                        className="mr-4"
                                    />
                                    <span>{day}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-[#E04717] text-lg rounded-full  text-white font-boldrounded-full hover:bg-[#D44316] transition duration-300 py-2 hover:scale-90"
                    >
                        Add
                    </button>
                </form>
            </div>
        </div>
    )
}
export default HabitForm
