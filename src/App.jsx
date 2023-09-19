/* eslint-disable no-undef */
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Graphics from './pages/Graphics'
import DataBase from './pages/DataBase'

function App () {
  return (
    <div className='App'>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/graphics' element={<Graphics />} />
        <Route path='/database' element={<DataBase />} />
      </Routes>
    </div>
  )
}

export default App
