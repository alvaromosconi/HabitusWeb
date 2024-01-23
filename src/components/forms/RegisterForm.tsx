/* eslint-disable @typescript-eslint/no-misused-promises */
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ZodType, z } from 'zod'
import { type RegisterData } from '../../types/habitus-types'

interface FormData {
    email: string
    password: string
    confirmPassword: string
}

const RegisterForm = () => {
    const { registration } = useContext(AuthContext)

    const [registerData, setRegisterData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value })
    }

    const RegisterSchema: ZodType<FormData> = z.object({
        email: z.string().email(),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters long')
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).*$/, 'Password must contain at least one lowercase letter, one uppercase letter, one alphanumeric character, and one symbol'),
        confirmPassword: z.string().refine(data => data === registerData.password, {
            message: 'Passwords do not match'
        })
    })

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        mode: 'onBlur',
        resolver: zodResolver(RegisterSchema)
    })

    const onSubmitHandler = async (values: RegisterData) => {
        try {
            registration(values)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className='flex flex-col border-4 border-l-4 border-[rgba(0, 0, 0, 0.1)] min-w-[375px] p-4 min-h-fit bg-white rounded-md shadow-md'>
            <h1 className='self-left p-2 font-bold text-4xl text-gray-800'>Sign up</h1>
            <form className='flex flex-col my-10 w-full px-4' onSubmit={handleSubmit(onSubmitHandler)}>
                {(errors.email != null) && <span className=" text-sm text-red-600 mx-2 block">{errors.email.message}</span>}
                <input
                        className='font-mono text-xl mt-2 font-black h-14 border-2 border-gray-700 p-3 mb-2 w-full rounded-md focus:outline-none focus:border-[#D44316]'
                        required
                        placeholder="Email"
                        type="email"
                        {...register('email')}
                        onChange={handleChange}
                    />
                {(errors.password != null) && <span className=" text-sm text-red-600 mx-2 block">{errors.password.message}</span>}
                <input
                    className='font-mono text-xl mt-2 font-black h-14 border-2 border-gray-700 p-3 mb-2 w-full rounded-md focus:outline-none focus:border-[#D44316]'
                    required
                    placeholder="Password"
                    type="password"
                    {...register('password')}
                    onChange={handleChange}
                />
                 {(errors.confirmPassword != null) && <span className=" text-sm text-red-600 mx-2 block">{errors.confirmPassword.message}</span>}
                <input
                    className='font-mono text-xl mt-2 font-black h-14 border-2 border-gray-700 p-3 mb-4 w-full rounded-md focus:outline-none focus:border-[#D44316]'
                    required
                    placeholder="Confirm Password"
                    type="password"
                    {...register('confirmPassword')}
                    onChange={handleChange}
                />
                <button
                    className='bg-[#E04717] h-16 text-lg text-white font-bold p-3 rounded-full w-full hover:bg-[#D44316] focus:outline-none'
                    type="submit"
                >
                    Sign Up
                </button>
            </form>
        </div>
    )
}

export default RegisterForm
