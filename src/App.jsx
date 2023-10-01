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
  const [dataset, setDataset] = useState([])
  const [newData, setNewData] = useState([])
  // const [loading, setLoading] = useState(false)

  const fetchDataFromApi = async () => {
    try {
      const response = await getData()
      setDataset(response)
    } catch (error) {
      console.log(error)
    }
  }

  const postDataToApi = async (newData) => {
    try {
      const request = await createNewData(newData)
      setNewData(request)
    } catch (error) {
      console.log(error)
    }
  }

  const dateData = (dataArray = []) => {
    let date
    dataArray.forEach(el => { date = el.fecha })
    if (date !== undefined) {
      const dateChain = date.split('-')
      const year = parseInt(dateChain[0])
      const month = parseInt(dateChain[1])

      const input = dateChain[2]
      const regex = /(\d+)T/
      const match = input.match(regex)

      const day = parseInt(match[1])

      const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

      const daysOfTheMonth = new Date(year, month, 0).getDate()

      const countSundays = (year, month) => {
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)

        let count = 0

        for (let day = firstDay.getDate(); day <= lastDay.getDate(); day++) {
          const currentDay = new Date(year, month, day)
          if (currentDay.getDay() === 0) { // 0 representa domingo en getDay()
            count++
          }
        }

        return count
      }

      const daysElapsed = (year, month, day) => {
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month, day)
        let countSunday = 0
        let countDays = 0
        for (let day = firstDay.getDate(); day <= lastDay.getDate(); day++) {
          const currentDay = new Date(year, month, day)
          if (currentDay.getDay() === 0) { // 0 representa domingo en getDay()
            countSunday++
          }
          countDays++
        }
        return countDays - countSunday
      }

      const sundays = countSundays(year, month - 1)
      const workDays = daysOfTheMonth - sundays
      const daysPassed = daysElapsed(year, month, day)

      const percentageDaysPassed = parseFloat((daysPassed * 100) / workDays).toFixed(1)
      return {
        dia: day,
        mes: months[month - 1],
        diasLaborales: workDays,
        diasTranscurridos: daysPassed,
        porcentajeDiasTranscurridos: percentageDaysPassed
      }
    }
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
        <Route path='/graphics' element={<Graphics dataset={dataset} dateData={dateData} />} />
        <Route path='/database' element={<DataBase />} />
      </Routes>
    </div>
  )
}

export default App
