/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { type Habit } from '../types/habitus-types'

interface HabitBoxProps {
	habit: Habit
	onEditButtonClick: () => void
	onDeleteButtonClick: () => void
}

interface DefaultHabitProps {
	onAddButtonClick: () => void
}

export function HabitBox ({ habit, onEditButtonClick, onDeleteButtonClick }: HabitBoxProps) {
	return (
		<div className='flex flex-col flex-nowrap habit-container p-4 border-2 rounded-2xl hover:bg-gray-200'>
			<div className='habit-header flex justify-between '>
				<h2 className='w-max text-2xl text-left'>{habit?.name}</h2>
				<div className='flex min-w-fit'>
					<button type="button" onClick={onEditButtonClick} className='self-end mx-2 animate-scaleButton'>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
						</svg>
					</button>
					<button type="button" onClick={onDeleteButtonClick} className='self-end mx-2 animate-scaleButton'>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
						</svg>
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
					{habit.selectedDaysSerialized.split(', ').map((day, index) => (
						<span key={index} className='bg-[#3d2ce0] rounded-full font-Roboto p-2 text-white'>
							{day}
						</span>
					))}
				</div>
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
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
						</svg>
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
