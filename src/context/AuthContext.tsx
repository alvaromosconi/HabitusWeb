/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, type ReactNode, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { HabitusAPI } from '../api/API'
import { type APIResponse, type LoginData, type RegisterData } from '../types/habitus-types'

interface Props {
    children?: ReactNode
}

interface IAuthContext {
    authenticated: boolean
    loginError: string | null
    registrationStatus: boolean
    registrationError: string | null
    isLoading: boolean
    authenticate: (loginData: LoginData) => void
    setAuthenticated: (newState: boolean) => void
    logout: () => void
    setLoginError: (error: string | null) => void
    registration: (registerData: RegisterData) => void
    setRegistrationStatus: (status: boolean) => void
    setRegistrationError: (error: string | null) => void
    setIsLoading: (status: boolean) => void
}

const initialValue = {
    authenticated: false,
    registrationStatus: false,
    loginError: '',
    registrationError: '',
    isLoading: false,
    authenticate: () => {},
    setAuthenticated: () => {},
    logout: () => {},
    setLoginError: () => {},
    registration: () => {},
    setRegistrationStatus: () => {},
    setRegistrationError: () => {},
    setIsLoading: () => {}
 }

const AuthContext = createContext<IAuthContext>(initialValue)

const AuthProvider = ({ children }: Props) => {
    const [authenticated, setAuthenticated] = useState(false)
    const [loginError, setLoginError] = useState<string | null>(null)
    const [registrationStatus, setRegistrationStatus] = useState<boolean>(false)
    const [registrationError, setRegistrationError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const navigate = useNavigate()

    async function authenticate (loginData: LoginData) {
        setIsLoading(true)
        await HabitusAPI.login(loginData)
            .then(async (response: APIResponse) => {
                setAuthenticated(response.success)
                localStorage.setItem('authenticated', 'true')
                setIsLoading(false)
                navigate('/')
            })
            .catch(async (response: APIResponse) => {
                setAuthenticated(false)
                setIsLoading(false)
                localStorage.setItem('authenticated', 'false')
                await handleLoginErrors(response.message)
            })
    }

    async function registration (RegisterData: RegisterData) {
        setIsLoading(true)
        await HabitusAPI.register(RegisterData)
            .then(async (response: APIResponse) => {
                setRegistrationStatus(response.success)
                setIsLoading(false)
                navigate('/login')
            })
            .catch(async (response: APIResponse) => {
                setRegistrationStatus(false)
                setIsLoading(false)
                await handleRegistrationError(response.message)
            })
    }

    function logout () {
        localStorage.clear()
        navigate('/login')
    }

    async function handleRegistrationError (error: string) {
        setRegistrationError(error)
    }

    async function handleLoginErrors (error: string) {
        setLoginError(error)
    }

    return (
        <AuthContext.Provider
            value={{
                     authenticated,
                     setAuthenticated,
                     authenticate,
                     logout,
                     isLoading,
                     loginError,
                     setLoginError,
                     registration,
                     registrationError,
                     registrationStatus,
                     setRegistrationError,
                     setRegistrationStatus,
                     setIsLoading
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }
