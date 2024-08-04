import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import HomePage from './Pages/HomePage'
import Register from './Pages/Regester'
import './App.css'

function App() {
  const [isRegistered, setIsRegistered] = React.useState(false)
  const handleRegister = () => {
    setIsRegistered(true)
  }

  return (
    <Routes>
      <Route
        path='/'
        element={isRegistered ? <Navigate to='/home' /> : <Register onRegister={handleRegister} />}
      />
      <Route path='/home' element={isRegistered ? <HomePage /> : <Navigate to='/' />} />
    </Routes>
  )
}

export default App
