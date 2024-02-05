/* eslint-disable @typescript-eslint/no-misused-promises */
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ZodType, z } from 'zod'
import { type RegisterData } from '../../types/habitus-types'
import { Alert } from '@mui/material'
import { ColorRing } from 'react-loader-spinner'

interface FormData {
    email: string
    password: string
    confirmPassword: string
}

const RegisterForm = () => {
    const { registration, isLoading, registrationStatus, registrationError } = useContext(AuthContext)

    const [registerData, setRegisterData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value })
    }

    const RegisterSchema: ZodType<FormData> = z.object({
        email: z.string().email().regex(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 'Please enter a valid email.'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters long')
            .regex(/^(?=.*[a-z]).*$/, 'Password must contain at least one lowercase letter.')
            .regex(/^(?=.*[A-Z]).*$/, 'Password must contain at least one uppercase letter')
            .regex(/^(?=.*[0-9]).*$/, 'Password must contain at least one number')
            .regex(/^(?=.*[\W_]).*$/, 'Password must contain at least one special symbol'),
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
        <div className='flex flex-col border-4 border-l-4 border-[rgba(0, 0, 0, 0.1)] min-w-[400px] p-4 min-h-fit mt-10 bg-white rounded-md shadow-md'>
            <h1 className='self-left p-2 font-bold text-4xl text-gray-800'>Sign up</h1>
            <form className='' onSubmit={handleSubmit(onSubmitHandler)}>
                <div className='relative flex flex-col my-10 px-4'>
                    <input
                            className='font-mono text-xl mt-2 font-black h-14 border-2 border-gray-700 p-3 mb-2  rounded-md focus:outline-none focus:border-[#D44316]'
                            required
                            placeholder="Email"
                            type="email"
                            {...register('email')}
                            onChange={handleChange}
                        />
                    {(errors.email != null) && <span className="text-sm text-red-600 font-bold mx-2 block">{errors.email.message}</span>}
                    <input
                        className='font-mono text-xl mt-2 font-black h-14 border-2 border-gray-700 p-3 mb-2 rounded-md focus:outline-none focus:border-[#D44316]'
                        required
                        placeholder="Password"
                        type="password"
                        {...register('password')}
                        onChange={handleChange}
                    />
                    {(errors.password != null) && <span className=" text-sm text-red-600 font-bold mx-2 block">{errors.password.message}</span>}
                    <input
                        className='font-mono text-xl mt-2 font-black h-14 border-2 border-gray-700 p-3 mb-2 rounded-md focus:outline-none focus:border-[#D44316]'
                        required
                        placeholder="Confirm Password"
                        type="password"
                        {...register('confirmPassword')}
                        onChange={handleChange}
                    />
                    {(errors.confirmPassword != null) && <span className=" text-sm text-red-600 font-bold mx-2 block">{errors.confirmPassword.message}</span>}
                    <button
                        className='bg-[#E04717] h-16 text-lg text-white font-bold p-3 rounded-full mt-10 hover:bg-[#D44316] focus:outline-none'
                        type="submit"
                    >
                        Sign Up
                    </button>
                    <div className='self-center'>
                        {isLoading ? <ColorRing width={50} height={50}/> : ''}
                    </div>
                </div>

                {registrationStatus && (
                    <p className='mt-4 text-green-500'>
                    Successfully registered!
                    </p>
                )}
                 {!registrationStatus && (
                    <>
                        {(registrationError != null) && (
                            <Alert severity="error">
                                {registrationError}
                            </Alert>
                        )}
                    </>
                )}
            </form>
        </div>
    )
}

export default RegisterForm
