/* eslint-disable no-undef */
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import UploadReports from './pages/UploadReports'
import Graphics from './pages/Graphics'
import { getSellerPerformance, createSellerPerformance, getDepartment, createNewSeller, getSeller } from './services/dataService'
import { useContext, useEffect, useState } from 'react'
import HowAreWeDoing from './pages/HowAreWeDoing'
import Analytics from './pages/Analytics'
import ManageSellers from './pages/ManageSellers'
import { DataContext } from './components/context/data'
import SellerProfile from './pages/SellerProfile'

function App () {
  const { sellers, setSellers } = useContext(DataContext)

  const [sellerPerformance, setSellerPerformance] = useState([])
  const [newSellerPerformance, setNewSellerPerformance] = useState([])

  const [newSeller, setNewSeller] = useState([])

  const [department, setDepartment] = useState([])
  // const [loading, setLoading] = useState(false)

  const fetchSellerPerformanceFromApi = async () => {
    try {
      const response = await getSellerPerformance()
      setSellerPerformance(response)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchDepartmentFromApi = async () => {
    try {
      const response = await getDepartment()
      setDepartment(response)
    } catch (error) {
      console.error(error)
    }
  }

  const postSellerPerformanceToApi = async (newData) => {
    try {
      const request = await createSellerPerformance(newData)
      setNewSellerPerformance(request)
      return request
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const postSellerToApi = async (newSeller) => {
    try {
      const request = await createNewSeller(newSeller)
      setNewSeller(request)
      return request
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const fetchSellerFromApi = async () => {
    try {
      const response = await getSeller()
      setSellers(response)
    } catch (error) {
      console.error(error)
    }
  }

  const extractDateFromData = (dataArray = []) => {
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

  const currencyFormat = (number) => {
    if (number) {
      return number.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
    } else {
      return number
    }
  }

  const toFixed = (number, digitAfterPoint = 2) => {
    return parseFloat(number.toFixed(digitAfterPoint))
  }

  const convertExcelDateToReadable = (excelDate) => {
    const excelBaseDate = new Date(1900, 0, 1)
    const days = excelDate - 1
    const formattedDate = new Date(excelBaseDate.getTime() + days * 24 * 60 * 60 * 1000)

    const month = formattedDate.getMonth() + 1
    const day = formattedDate.getDate()
    const year = formattedDate.getFullYear()

    const formattedDateString = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`

    return formattedDateString
  }

  const capitalizeWords = (string) => {
    const stringLowerCase = string.toLowerCase()
    return stringLowerCase.replace(/\b\w/g, match => match.toUpperCase())
  }

  const extractIdNumber = (string) => {
    const regex = /\d+/
    const id = string.match(regex)
    if (id !== null) {
      return id[0]
    } else {
      console.error('the string must contain numbers')
    }
  }

  const extractText = (string) => {
    const regex = /^\d+\s*(.+)/
    const product = string.match(regex)
    return product[1]
  }

  const removeExtraSpaces = (string) => {
    return string.replace(/\s+/g, ' ')
  }

  useEffect(() => {
    fetchSellerPerformanceFromApi()
  }, [newSellerPerformance])

  useEffect(() => {
    fetchDepartmentFromApi()
  }, [])

  useEffect(() => {
    fetchSellerFromApi()
  }, [newSeller])

  return (
    <div className='App'>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path='/' element={<UploadReports toFixed={toFixed} department={department} convertExcelDateToReadable={convertExcelDateToReadable} extractIdNumber={extractIdNumber} extractText={extractText} capitalizeWords={capitalizeWords} removeExtraSpaces={removeExtraSpaces} />} />
        <Route path='/how-are-we-doing' element={<HowAreWeDoing postSellerPerformanceToApi={postSellerPerformanceToApi} sellers={sellers} toFixed={toFixed} convertExcelDateToReadable={convertExcelDateToReadable} currencyFormat={currencyFormat} />} />
        <Route path='/graphics' element={<Graphics sellerPerformance={sellerPerformance} extractDateFromData={extractDateFromData} />} />
        <Route path='/analytics' element={<Analytics convertExcelDateToReadable={convertExcelDateToReadable} currencyFormat={currencyFormat} />} />
        <Route path='/manage-sellers' element={<ManageSellers postSellerToApi={postSellerToApi} capitalizeWords={capitalizeWords} sellers={sellers} />} />
        <Route path='/manage-sellers/:id' element={<SellerProfile />} />
      </Routes>
    </div>
  )
}

export default App
