/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { type Habit } from '../types/habitus-types'
import { PencilIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/solid'

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
			<div className='habit-data flex flex-col flex-wrap justify-between gap-4'>
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
				<button type="button" onClick={	onTelegramButtonClick } className='self-end mx-2 animate-scaleButton'>
					<a href="https://t.me/habitus_v1_bot" target="_blank" rel="noreferrer">
					Notify me by telegram
					</a>
				</button>
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
