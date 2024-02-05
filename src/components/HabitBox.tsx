/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from 'react'
import { type User, type Habit } from '../types/habitus-types'
import { PencilIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/solid'
import { Switch } from '@material-tailwind/react'
import HabitusAPI from '../api/API'

interface HabitBoxProps {
	habit: Habit
	onEditButtonClick: () => void
	onDeleteButtonClick: () => void
	onTelegramButtonClick: () => void
}

interface DefaultHabitProps {
	onAddButtonClick: () => void
}

export function HabitBox ({ habit, onEditButtonClick, onDeleteButtonClick, 	onTelegramButtonClick }: HabitBoxProps) {
	const [telegramReminder, setTelegramReminder] = useState<boolean>(habit.notifyByTelegram)

	async function handleTelegramSwitch (event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
		const userItem: string | null = localStorage.getItem('user')
		if (userItem && userItem !== undefined) {
			const user: User = JSON.parse(userItem)
			const chatId = user.chatId
			if (chatId !== undefined && chatId !== 0) {
				await HabitusAPI.enableTelegramReminder(habit.id)
				setTelegramReminder((prev) => !prev)
			} else { onTelegramButtonClick() }
		}
	}

	const onChange = (): boolean => {
		const user: User | undefined = JSON.parse(localStorage.getItem('user') ?? 'null')
		return user?.chatId !== undefined && telegramReminder
	}

	return (
		<div className='flex flex-col flex-nowrap habit-container p-4 border-2 rounded-2xl hover:bg-gray-200'>
			<div className='habit-header flex justify-between '>
				<h2 className='w-max text-2xl text-left'>{habit?.name}</h2>
				<div className='flex min-w-fit'>
					<button type="button" onClick={onEditButtonClick} className='self-end mx-2 animate-scaleButton'>
						<PencilIcon stroke='currentColor' fill='none' viewBox="0 0 24 24" className='w-8 h-8 text-sm' />
					</button>
					<button type="button" onClick={onDeleteButtonClick} className='self-end mx-2 animate-scaleButton'>
						<TrashIcon stroke='currentColor' fill='none' viewBox="0 0 24 24" className='w-8 h-8 text-sm' />
					</button>
				</div>
			</div>
			<div className='habit-data flex flex-col flex-wrap items-start gap-4 h-full'>
				<span className={`${habit.state === 'Active' ? 'text-[#4ad151]' : 'text-red-700'} text-lg font-bold font-Roboto max-w-min`}>
					{ habit.state }
				</span>
				<p className='text-lg font-light leading-relaxed'> {habit?.description} </p>
				<div className='flex gap-x-1'>
					<time className='text-lg font-bold'>{habit?.notificationTime}</time>
					<span className='text-lg'> {parseInt(habit?.notificationTime) > 12 ? 'PM' : 'AM'} </span>

				</div>
				<div className='days flex flex-wrap gap-2'>
						{habit.selectedDays?.map((day, index) => (
							<span key={index} className='bg-[#3d2ce0] rounded-full font-Roboto p-2 text-white'>
								{day}
							</span>
						))}
				</div>
			</div>
			<div className='flex gap-2 self-end'>
					<svg className='w-8 h-8'viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M52 26C52 40.3594 40.3594 52 26 52C11.6406 52 0 40.3594 0 26C0 11.6406 11.6406 0 26 0C40.3594 0 52 11.6406 52 26ZM26.9319 19.1945C24.403 20.2463 19.3488 22.4234 11.7692 25.7256C10.5384 26.2151 9.89369 26.6939 9.835 27.1621C9.7358 27.9533 10.7267 28.2649 12.076 28.6892C12.2595 28.7469 12.4497 28.8067 12.6447 28.8701C13.9722 29.3016 15.7579 29.8064 16.6863 29.8265C17.5283 29.8447 18.4682 29.4975 19.5059 28.785C26.5876 24.0046 30.2433 21.5884 30.4728 21.5363C30.6347 21.4995 30.8591 21.4533 31.0111 21.5884C31.1631 21.7236 31.1482 21.9795 31.1321 22.0481C31.0339 22.4666 27.1444 26.0826 25.1316 27.9539C24.5041 28.5373 24.059 28.9511 23.968 29.0456C23.7641 29.2573 23.5564 29.4576 23.3568 29.6501C22.1235 30.839 21.1986 31.7305 23.408 33.1865C24.4697 33.8861 25.3193 34.4647 26.1669 35.0419C27.0925 35.6723 28.0158 36.301 29.2103 37.084C29.5146 37.2835 29.8053 37.4907 30.0884 37.6925C31.1656 38.4605 32.1334 39.1505 33.3291 39.0404C34.0238 38.9765 34.7415 38.3232 35.1059 36.3748C35.9673 31.7702 37.6603 21.7934 38.0516 17.6822C38.0859 17.322 38.0428 16.8611 38.0081 16.6587C37.9735 16.4563 37.9011 16.168 37.6381 15.9546C37.3266 15.7018 36.8457 15.6485 36.6306 15.6523C35.6527 15.6695 34.1523 16.1912 26.9319 19.1945Z" fill="url(#paint0_linear_801_1259)"></path>
						<defs>
						<linearGradient id="paint0_linear_801_1259" x1="26" y1="0" x2="26" y2="52" gradientUnits="userSpaceOnUse">
						<stop stopColor="#88C6FF"></stop>
						<stop offset="1" stopColor="#0085FF"></stop>
						</linearGradient>
						</defs>
					</svg>
					<Switch
						color={'blue'}
						checked={onChange()}
						onClick={ handleTelegramSwitch }
						crossOrigin={undefined}
					/>
				</div>
		</div>
	)
}

export function DefaultHabitBox ({ onAddButtonClick }: DefaultHabitProps) {
	return (
		<div className='animate-pulse flex flex-col flex-nowrap default-habit-container p-4 border-2 rounded-2xl hover:bg-gray-200 max-w-[430px]'>
			<div className='habit-header flex justify-between '>
				<h2 className='w-max text-2xl text-left'>New Habit</h2>
				<div className='flex min-w-fit'>
					<button type="button" onClick={onAddButtonClick} className='self-end mx-4 animate-scaleButton'>
						<PlusCircleIcon stroke='currentColor' fill='none' viewBox="0 0 24 24" className='w-8 h-8 text-sm'/>
					</button>
				</div>
			</div>
			<div className='habit-data flex flex-col flex-wrap justify-between gap-4'>
				<h3 className='text-green-500'>Active</h3>
				<p>This is a new habit</p>
				<time>00:00:00</time>
			</div>
		</div>
	)
}

export default HabitBox
