import {useState, useEffect} from 'react'

const RandomPhoneDisplay = () => {
  const [displayNumber, setDisplayNumber] = useState('998000000000')
  const [loading, setLoading] = useState(false)

  const finalNumber = '998931709455'

  useEffect(() => {
    if (loading) {
      startRandomAnimation()
    }
  }, [loading])

  const fetchPhoneNumber = () => {
    setLoading(true)
  }

  const startRandomAnimation = () => {
    const duration = 100
    const totalDigits = finalNumber.length - 3
    let currentDigit = 0

    const animateDigit = (digitIndex) => {
      if (digitIndex >= totalDigits) {
        setDisplayNumber(finalNumber)
        setLoading(false)
        return
      }

      const interval = setInterval(() => {
        setDisplayNumber((prev) => {
          const newNumber = prev.split('')
          newNumber[digitIndex + 3] = Math.floor(Math.random() * 10).toString()
          return newNumber.join('')
        })
      }, duration)

      setTimeout(() => {
        clearInterval(interval)
        setDisplayNumber((prev) => {
          const newNumber = prev.split('')
          newNumber[digitIndex + 3] = finalNumber[digitIndex + 3]
          return newNumber.join('')
        })
        animateDigit(digitIndex + 1)
      }, 1000)
    }

    animateDigit(currentDigit)
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='text-5xl font-bold mb-8'>{displayNumber}</div>
      <button
        className='px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700 transition duration-300'
        onClick={fetchPhoneNumber}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Show Phone Number'}
      </button>
    </div>
  )
}

export default RandomPhoneDisplay
