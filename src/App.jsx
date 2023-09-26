/* eslint-disable no-undef */
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Graphics from './pages/Graphics'
import DataBase from './pages/DataBase'
import { getData, createNewData } from './services/dataService'
import { useEffect } from 'react'

function App () {
  const fetchDataFromApi = async () => {
    const response = await getData()
    return response
  }

  const postDataToApi = async (newData) => {
    const request = await createNewData(newData)
    return request
  }

  useEffect(() => {
    fetchDataFromApi()
  }, [])

  return (
    <div className='App'>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path='/' element={<Home postDataToApi={postDataToApi} />} />
        <Route path='/graphics' element={<Graphics />} />
        <Route path='/database' element={<DataBase />} />
      </Routes>
    </div>
  )
}

export default App
