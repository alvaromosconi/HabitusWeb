/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { type LoginData } from '../types/habitus-types'

const Login = () => {
    const { authenticated, authenticate } = useContext(AuthContext)

    const [loginData, setLoginData] = useState<LoginData>({
        username: '',
        password: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        authenticate(loginData)
    }

    return (
        <div className='font-sans w-full h-screen flex justify-center items-center bg-gray-100'>
            <a href='/home'>
                <img className="h-12 w-auto absolute top-0 left-0 ml-14 mt-14" src="../images/logo.svg" alt="habitus_logo"/>
            </a>
            <div className='flex flex-col border-4 border-l-4 border-[rgba(0, 0, 0, 0.1)] w-[460px] h-[400px] p-8 bg-white rounded-md shadow-md'>
                <h1 className='self-left m-2 font-bold text-4xl text-gray-800'>Sign in</h1>
                <form className='flex flex-col items-center my-10' onSubmit={handleSubmit}>
                    <input
                    className='font-mono text-xl font-black h-14 border-2 border-gray-700 p-3 mb-2 w-full rounded-md focus:outline-none focus:border-[#D44316]'
                    required
                    placeholder="Username"
                    id="username"
                    name="username"
                    onChange={handleChange}
                    />
                    <input
                    className='font-mono text-xl mt-2 font-black h-14 border-2 border-gray-700 p-3 mb-4 w-full rounded-md focus:outline-none focus:border-[#D44316]'
                    required
                    placeholder="Password"
                    name="password"
                    type="password"
                    onChange={handleChange}
                    />
                <button
                    className='bg-[#E04717] h-16 text-lg text-white font-bold p-3 rounded-full my-8 w-full hover:bg-[#D44316] focus:outline-none'
                    type="submit"
                >
                    Sign in
                </button>

                {authenticated && (
                    <p className='mt-4 text-green-500'>
                    Logged in successfully!
                    </p>
                )}
                </form>
            </div>
        </div>
    )
}

export default Login
