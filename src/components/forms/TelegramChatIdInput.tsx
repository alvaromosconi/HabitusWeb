import { useState } from 'react'

interface Props {
    handleTelegramSubmit: (userEnteredCode: number) => void
}

const TelegramChatIdInput = ({ handleTelegramSubmit }: Props) => {
    const [userEnteredCode, setUserEnteredCode] = useState<number>(0)

    const handleSubmit = () => {
        handleTelegramSubmit(userEnteredCode)
      }

    return (
        <div className='flex flex-col items-center justify-center min-h-fit'>
          <div className='max-w-md w-full bg-white p-6 rounded-md shadow-md'>
            <label htmlFor="telegramCode" className='text-lg font-semibold mb-2'>Enter Telegram Code:</label>
            <div className='flex'>
              <input
                id="telegramCode"
                type="text"
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

export default TelegramChatIdInput
