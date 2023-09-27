/* eslint-disable no-undef */
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Graphics from './pages/Graphics'
import DataBase from './pages/DataBase'
import { getData, createNewData } from './services/dataService'
import { useEffect, useState } from 'react'

function App () {
  const [data, setData] = useState([])
  const [newData, setNewData] = useState([])
  // const [loading, setLoading] = useState(false)

  const fetchDataFromApi = async () => {
    const response = await getData()
    setData(response)
    // console.log(response)
    return response
  }

  const postDataToApi = async (newData) => {
    const request = await createNewData(newData)
    setNewData(request)
    return request
  }

  useEffect(() => {
    fetchDataFromApi()
  }, [newData])

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
