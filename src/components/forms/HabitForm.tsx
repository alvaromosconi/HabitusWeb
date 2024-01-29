/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable padded-blocks */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { type ChangeEvent, useEffect, useState } from 'react'
import { type Habit, type PostHabit, HabitState, WeekDays, type Category } from '../../types/habitus-types'
import HabitusAPI from '../../api/API'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { type Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { type ZodType, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { ArrowUpRightIcon } from '@heroicons/react/24/solid'
import Select from 'react-select'

interface Props {
    habitToUpdate?: Habit
	onHabitsChange: (habit: Habit) => void
}

const HabitForm = ({ habitToUpdate, onHabitsChange }: Props) => {

    dayjs.extend(utc)
    dayjs.extend(timezone)

    interface FormData {
        name: string
        description: string
        categoryId?: number
        selectedDays: WeekDays[]
    }

    const [habit, setHabit] = useState<PostHabit>({
        categoryId: habitToUpdate?.category.id ?? 0,
        name: habitToUpdate?.name ?? '',
        description: habitToUpdate?.description ?? '',
        notificationTime: habitToUpdate?.notificationTime ?? '15:30:00',
        selectedDays: habitToUpdate?.selectedDays ?? [WeekDays.Monday],
        state: habitToUpdate?.state ?? HabitState.Active
    })

    useEffect(() => {
        if (habitToUpdate !== undefined) {
            setTime(dayjs(habitToUpdate?.notificationTime, 'HH:mm:ss'))
            setSelectedDays(habitToUpdate?.selectedDays)
        }

    }, [habitToUpdate])

    const [time, setTime] = React.useState<Dayjs>(dayjs('07:30:00', 'HH:mm:ss'))
    const [selectedDays, setSelectedDays] = useState<WeekDays[]>([])
    const [categories, setCategories] = useState<Category[] | undefined>(undefined)
    const [selectedCategory, setSelectedCategory] = useState<Category>({ name: 'Select Dept', id: 0 })
    const [show, setShow] = useState<boolean>(false)

    const fetchCategories = async () => {
        try {
            await HabitusAPI.getCategories()
                .then((data: Category[]) => {
                    setCategories(data)
                    setSelectedCategory(habitToUpdate ? habitToUpdate.category : data[0])
                })

        } catch (error) {
            console.error('Error deleting habit:', error)
        }
    }

    useEffect(() => {
        void fetchCategories()
        categories ?? setShow(true)
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        console.table(categories)
        const { name, value, type } = e.target
        if (value !== undefined) {
            setHabit({ ...habit, [name]: value })
            if (type === 'checkbox' && name === 'selectedDays') {
                const checkbox = e.target as HTMLInputElement
                handleCheckboxChange(value as WeekDays, checkbox.checked)
            }
        }
    }

    const handleCheckboxChange = (day: WeekDays, isChecked: boolean) => {
        if (isChecked) {
          setSelectedDays([...selectedDays, day])
        } else {
          setSelectedDays(selectedDays.filter((selectedDay) => selectedDay !== day))
        }
    }

    const HabitSchema: ZodType<FormData> = z.object({
        name: z
            .string()
            .trim()
            .min(3, { message: 'Name must be 3 or more characters long' })
            .max(30, { message: 'Name must be at most 30 characters long' }),
        description: z
            .string()
            .trim()
            .max(150, { message: 'Description must be at most 150 characters long' }),
        categoryId: z.number(),
        selectedDays: z.array(z.nativeEnum(WeekDays)).refine((selectedDays) => selectedDays.length > 0,
        { message: 'Select at least one day.' })
    })

    const defaultValues: FormData = {
        name: habitToUpdate?.name ?? '',
        categoryId: habitToUpdate?.category?.id ?? selectedCategory.id,
        selectedDays: habitToUpdate?.selectedDays ?? [WeekDays.Monday],
        description: habitToUpdate?.description ?? ''
    }

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        mode: 'onBlur',
        resolver: zodResolver(HabitSchema),
        defaultValues
    })

    const onSubmitHandler = async (values: FormData) => {
        try {
            console.log(time.format('HH:mm:ss').toString())
            const offset = dayjs().utcOffset()
            const utcTime = time.subtract(offset, 'minute')
            console.log(utcTime.format('HH:mm:ss').toString())
            const habitFormatted = { ...values, notificationTime: utcTime.format('HH:mm:ss').toString(), selectedDays, state: HabitState.Active, categoryId: selectedCategory?.id }
            if (habitToUpdate !== undefined) {
                onHabitsChange(await HabitusAPI.updateHabit(habitFormatted, habitToUpdate.id))
            } else {
                onHabitsChange(await HabitusAPI.postHabit(habitFormatted))
            }
        } catch (e) {
            console.error(e)
         }
    }

    return (
        <div className="bg-gray-50 rounded-xl grid grid-cols-1 px-4 py-4 w-full h-full">
            <div className="flex justify-between flex-col h-max">
                <h2 className="text-3xl font-bold text-center text-[#E04717] mb-4">{habitToUpdate ? 'Update Habit' : 'New Habit'}</h2>
                <form onSubmit={handleSubmit(onSubmitHandler)} className="grid grid-cols-1 max-w-[400px] gap-y-4">
                    <div className="">
                        {errors.name && <span className=" text-sm text-red-600 mx-2 block">{ errors.name.message }</span>}
                        <input
                            type="text"
                            placeholder="Name"
                            value={habit.name}
                            {...register('name')}
                            onChange={handleInputChange}
                            className="w-full h-10 border-b-2 border-gray-300 rounded-md focus:outline-none focus:border-[#D44316] indent-2"
                        />
                    </div>

                    <div className="">
                        <input
                            type="text"
                            placeholder="Description"
                            value={habit.description}
                            {...register('description')}
                            onChange={handleInputChange}
                            className="w-full h-12 border-b-2 border-gray-300 rounded-md focus:outline-none focus:border-[#D44316] indent-2"
                        />
                    </div>

                    <div className='flex flex-col '>
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        {errors.categoryId && <span className=" text-sm text-red-600 mx-2 block">{ errors.categoryId.message }</span>}
                        <div className='flex justify-between'>
                        <Select
                            name='categoryId'
                            options={categories?.map(category => ({ label: category.name, value: category.id }))}
                            defaultValue={{ label: selectedCategory.name, value: selectedCategory.id }}
                            value={{ label: selectedCategory.name, value: selectedCategory.id }}
                            onChange={(selectedOption) => {
                                setSelectedCategory({ id: selectedOption?.value ?? 0, name: selectedOption?.label ?? 'Select' })
                            }}
                            className="w-full border-b-2 border-gray-300 rounded-md"
                        />
                        {show
                            ? <div className='flex'>
                                <button className='ml-2 bg-[#6b92cf] hover:bg-[#4a6f9d] w-fit rounded-full p-2 h-fit relative bottom-0 text-sm border-none text-white transition duration-300 ease-in-out whitespace-nowrap'>
                                    <Link to='/categories' className='flex items-center'>
                                        Explore Categories
                                        <ArrowUpRightIcon stroke='currentColor' fill='none' viewBox="0 0 24 24" className='w-6 h-6 text-sm' />
                                    </Link>
                                </button>
                            </div>
                        : ''}
                        </div>
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
                                        setTime(newValue)
                                        console.log(newValue)
                                    }
                                }}
                                className=""
                            />
                        </LocalizationProvider>
                    </div>

                    <div className="">
                        {errors.selectedDays && <span className=" text-sm text-red-600 mx-2 block">{ errors.selectedDays.message }</span>}
                        <div className="flex flex-wrap gap-x-4 justify-between">
                            {Object.values(WeekDays).map((day) => (
                            <label className="text-lg basis-1/3" key={day}>
                                <input
                                    type='checkbox'
                                    value={day}
                                    checked={selectedDays.includes(day)}
                                    {...register('selectedDays')}
                                    onChange={handleInputChange}
                                    className="mr-4"
                                />
                                <span>{day}</span>
                            </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={'text-lg font-bold rounded-full py-2 bg-[#E04717] text-white hover:bg-[#D44316] transition duration-300 hover:scale-90'}
                    >
                        {habitToUpdate ? 'Save' : 'Add'}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default HabitForm
