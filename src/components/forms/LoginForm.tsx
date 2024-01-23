/* eslint-disable @typescript-eslint/no-misused-promises */
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { type LoginData } from '../../types/habitus-types'
import { Alert } from '@mui/material'
import { z, type ZodType } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const LoginForm = () => {
    const { authenticated, authenticate, loginError } = useContext(AuthContext)

    const [loginData, setLoginData] = useState<LoginData>({
        email: '',
        password: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value })
    }

    interface FormData {
        email: string
        password: string
    }

    const LoginSchema: ZodType<FormData> = z.object({
        email: z.string().email(),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters long')
            .regex(/^(?=.*[a-z]).*$/, 'Password must contain at least one lowercase letter.')
            .regex(/^(?=.*[A-Z]).*$/, 'Password must contain at least one uppercase letter')
            .regex(/^(?=.*[0-9]).*$/, 'Password must contain at least one number')
            .regex(/^(?=.*[\W_]).*$/, 'Password must contain at least one special symbol')
    })
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        mode: 'onBlur',
        resolver: zodResolver(LoginSchema)
    })

    const onSubmitHandler = async (values: LoginData) => {
        try {
            authenticate(values)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className='flex flex-col border-4 border-l-4 border-[rgba(0, 0, 0, 0.1)] h-[460px] w-[400px] min-w-[360px] p-8 bg-white rounded-md shadow-md'>
            <h1 className='self-left m-2 font-bold text-4xl text-gray-800'>Sign in</h1>
            <form className='flex flex-col my-10' onSubmit={handleSubmit(onSubmitHandler)}>
                {(errors.email != null) && <span className=" text-sm text-red-600 mx-2 block">{errors.email.message}</span>}
                <input
                    className='font-mono text-xl font-black h-14 border-2 border-gray-700 p-3 mb-2 w-full rounded-md focus:outline-none focus:border-[#D44316]'
                    required
                    placeholder="Email"
                    id="email"
                    type='email'
                    {...register('email')}
                    onChange={handleChange}
                />
                {(errors.password != null) && <span className=" text-sm text-red-600 mx-2 block">{errors.password.message}</span>}
                <input
                    className='font-mono text-xl mt-2 font-black h-14 border-2 border-gray-700 p-3 mb-4 w-full rounded-md focus:outline-none focus:border-[#D44316]'
                    required
                    placeholder="Password"
                    minLength={8}
                    type="password"
                    {...register('password')}
                    onChange={handleChange}
                />
                <button
                    className='bg-[#E04717] h-16 text-lg text-white font-bold p-3 rounded-full my-8 mb-10 w-full hover:bg-[#D44316] focus:outline-none'
                    type="submit"
                >
                Sign in
                </button>

                {authenticated && (
                    <p className='mt-4 text-green-500'>
                    Logged in successfully!
                    </p>
                )}
                 {!authenticated && (
                    <>
                        {(loginError != null) && (
                            <Alert severity="error">
                                {loginError}
                            </Alert>
                        )}
                        <br/>
                    </>
                )}
            </form>
        </div>
    )
}

export default LoginForm
