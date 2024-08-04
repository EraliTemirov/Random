import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

const Regester = ({onRegister}) => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const navigate = useNavigate()

  const handleChange = (index, value) => {
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      document.getElementById(`input-${index + 1}`).focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fullCode = code.join('')
    if (fullCode.length === 6) {
      try {
        const response = await fetch('http://localhost:5000/codes', {
          method: 'GET',
        })
        const data = await response.json()
        const isValid = data.some((entry) => entry.code === fullCode)
        if (isValid) {
          onRegister()
          navigate('/home')
        } else {
          alert('Xatolik yuz berdi. Qaytadan urinib koring.')
        }
      } catch (error) {
        console.error('Xatolik:', error)
        alert('Serverga ulanishda xatolik yuz berdi.')
      }
    } else {
      alert('Iltimos, toliq 6 xonali kodni kiriting.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col items-center justify-center min-h-screen bg-white'
    >
      <h1 className='text-3xl font-bold mb-2'>Kodni Kiriting</h1>
      <p className='text-sm text-gray-600 mb-6'>
        @ushbu telegram botiga kiring va tastiqlovchi kodni oling.
      </p>
      <div className='flex space-x-2 mb-6'>
        {code.map((digit, index) => (
          <input
            key={index}
            id={`input-${index}`}
            type='text'
            maxLength='1'
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            className='w-12 h-12 border-2 border-gray-300 rounded-md text-center text-xl'
          />
        ))}
      </div>
      <button
        type='submit'
        className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300'
      >
        Yuborish
      </button>
    </form>
  )
}

export default Regester
