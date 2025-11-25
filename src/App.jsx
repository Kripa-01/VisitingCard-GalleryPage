import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminGallery from './admin/AdminGallery'
import LandingPage from './pages/LandingPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />}
          ></Route>
          
          <Route path='/admin/gallery' element={<AdminGallery />}
          ></Route>


        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
