import LoginForm from '../components/forms/LoginForm'
const Login = () => {
    return (
        <div className='font-sans h-screen flex flex-col gap-y-28 justify-center items-center w-screen bg-gray-100'>
            <a href='/home'>
                <img className="h-12 w-auto absolute top-0 left-0 ml-14 mt-14" src="../images/logo.svg" alt="habitus_logo"/>
            </a>
            <div className='flex flex-col items-center'>
                <LoginForm />
                <span className='text-lg'>
                    Not registered yet? <a className='font-bold text-blue-600 hover:text-blue-800' href='/register'> Sign up </a>
                </span>
            </div>
        </div>
    )
}

export default Login
