/* eslint-disable @typescript-eslint/no-misused-promises */

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { type ZodType, z } from 'zod'

interface Props {
    handleTelegramSubmit: (userEnteredCode: number) => void
}

interface FormData {
    telegramCode: number
}

const TelegramSetupForm = ({ handleTelegramSubmit }: Props) => {
    const [formData, setFormData] = useState({
		telegramCode: 0
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const numericValue = e.target.value.replace(/[^0-9]/g, '')
		setFormData({ ...formData, telegramCode: parseInt(numericValue, 10) })
    }

	const TelegramSchema: ZodType<FormData> = z.object({
        telegramCode: z.coerce.number()
    })

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        mode: 'onBlur',
        resolver: zodResolver(TelegramSchema)
    })

    const onSubmitHandler = async (values: FormData) => {
        try {
            handleTelegramSubmit(values.telegramCode)
        } catch (e) {
            console.error(e)
        }
    }

	return (
		<div className='flex flex-col items-center justify-center min-h-fit'>
			<div className='max-w-md w-full bg-white p-6 rounded-md shadow-md'>
				<div className='tutorial'>
					<p className='text-lg font-serif text-black'>
						1. Click on <a href="https://t.me/habitus_v1_bot" target="_blank" rel="noreferrer" className='text-blue-500 hover:text-blue-400 hover:font-bold'>
						Get Telegram Code
						</a>
						<br />
						2. Press the <b>Start</b> button or type <i>/start</i>
						<br />
						3. Once you receive the code, copy and paste it in the input field below.
					</p>
				</div>
				<br />
				<label htmlFor="telegramCode" className='text-lg font-semibold mb-2'>Enter Telegram Code:</label>
				<div className='flex flex-col'>
					<form onSubmit={handleSubmit(onSubmitHandler)}>
						<input
							id='telegramCode'
							required
							type='number'
							{...register('telegramCode')}
							onChange={handleChange}
							className='flex-grow border border-gray-300 px-3 py-2 rounded-l-md focus:outline-none focus:border-blue-500'
						/>
						<button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none'>
							Submit
						</button>
						{(errors.telegramCode != null) && <span className=" text-sm text-red-600 font-bold mx-2 block">{errors.telegramCode.message}</span>}
					</form>
				</div>
			</div>
		</div>
	)
}

export default TelegramSetupForm
