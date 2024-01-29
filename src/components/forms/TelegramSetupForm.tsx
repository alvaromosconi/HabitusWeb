import { useState } from 'react'

interface Props {
    handleTelegramSubmit: (userEnteredCode: number) => void
}

const TelegramSetupForm = ({ handleTelegramSubmit }: Props) => {
    const [userEnteredCode, setUserEnteredCode] = useState<number>(0)

    const handleSubmit = () => {
        handleTelegramSubmit(userEnteredCode)
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-fit'>
          <div className='max-w-md w-full bg-white p-6 rounded-md shadow-md'>
          <div className='tutorial'>
          <p>
            1. Click on <a href="https://t.me/habitus_v1_bot" target="_blank" rel="noreferrer" className='text-blue-500 hover:text-blue-400 hover:font-bold'>
              Get Telegram Code
            </a>
            <br />
            2. Press the Start button or type /start
            <br />
            3. Once you receive the code, copy and paste it in the input field below.
          </p>
            </div>
            <label htmlFor="telegramCode" className='text-lg font-semibold mb-2'>Enter Telegram Code:</label>
            <div className='flex'>
              <input
                id="telegramCode"
                type="number"
                value={userEnteredCode}
                onChange={(e) => { setUserEnteredCode(parseInt(e.target.value)) }}
                className='flex-grow border border-gray-300 px-3 py-2 rounded-l-md focus:outline-none focus:border-blue-500'
              />
              <button onClick={handleSubmit} className='bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none'>
                Submit
              </button>
            </div>
          </div>
        </div>
      )
}

export default TelegramSetupForm
