/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, type ReactNode, createContext } from 'react'
import useNavigate from 'react-use-navigate'
import { HabitusAPI } from '../api/API'
import { type LoginData } from '../types/habitus-types'

interface Props {
    children?: ReactNode
}

interface IAuthContext {
    authenticated: boolean
    setAuthenticated: (newState: boolean) => void
    authenticate: (loginData: LoginData) => void
}

const initialValue = {
    authenticated: false,
    setAuthenticated: () => {},
    authenticate: () => {}
}

const AuthContext = createContext<IAuthContext>(initialValue)

const AuthProvider = ({ children }: Props) => {
    const [authenticated, setAuthenticated] = useState<boolean>(initialValue.authenticated)

    const navigate = useNavigate()

    async function authenticate (loginData: LoginData) {
        const successfullLogin: boolean = await HabitusAPI.login(loginData)
        setAuthenticated(successfullLogin)
    }

    return (
        <AuthContext.Provider value={{ authenticated, setAuthenticated, authenticate }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }
