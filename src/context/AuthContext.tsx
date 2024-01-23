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
    authenticate: (loginData: LoginData) => void
    setAuthenticated: (newState: boolean) => void
    logout: () => void
    setLoginError: (error: string | null) => void
    registration: (registerData: RegisterData) => void
    setRegistrationStatus: (status: boolean) => void
    setRegistrationError: (error: string | null) => void
}

const initialValue = {
    authenticated: false,
    registrationStatus: false,
    loginError: '',
    registrationError: '',
    authenticate: () => {},
    setAuthenticated: () => {},
    logout: () => {},
    setLoginError: () => {},
    registration: () => {},
    setRegistrationStatus: () => {},
    setRegistrationError: () => {}
}

const AuthContext = createContext<IAuthContext>(initialValue)

const AuthProvider = ({ children }: Props) => {
    const [authenticated, setAuthenticated] = useState(false)
    const [loginError, setLoginError] = useState<string | null>(null)
    const [registrationStatus, setRegistrationStatus] = useState<boolean>(false)
    const [registrationError, setRegistrationError] = useState<string | null>(null)

    const navigate = useNavigate()

    async function authenticate (loginData: LoginData) {
        await HabitusAPI.login(loginData)
            .then(async (response: APIResponse) => {
                setAuthenticated(response.success)
                localStorage.setItem('authenticated', 'true')
                navigate('/')
            })
            .catch(async (response: APIResponse) => {
                setAuthenticated(false)
                localStorage.setItem('authenticated', 'false')
                await handleLoginErrors(response.message)
            })
    }

    async function registration (RegisterData: RegisterData) {
        await HabitusAPI.register(RegisterData)
            .then(async (response: APIResponse) => {
                setRegistrationStatus(response.success)
                navigate('/login')
            })
            .catch(async (response: APIResponse) => {
                setRegistrationStatus(false)
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
                     loginError,
                     setLoginError,
                     registration,
                     registrationError,
                     registrationStatus,
                     setRegistrationError,
                     setRegistrationStatus
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }
