/* eslint-disable no-undef */
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import UploadReports from './pages/UploadReports'
import { getSellerPerformance, createSellerPerformance, getDepartments, createMunicipality, createNewSeller, getSellers, deleteSeller, editSeller, getCustomers, createNewCustomer, getProducts, createNewProduct, createNewSale } from './services/dataService'
import { useContext, useEffect, useState } from 'react'
import ManageSellers from './pages/ManageSellers'
import SellerProfile from './pages/SellerProfile'
import SalesPage from './pages/SalesPage'
import DetailedSalesPage from './pages/DetailedSalesPage'
import { DataContext } from './context/data'
import ManageCustomers from './pages/ManageCustomers'
import { ThirdPartiesContext } from './context/thirdParties'
import CustomerProfile from './pages/CustomerProfile'
import ManageProducts from './pages/ManageProducts'
import { ProductContext } from './context/product'

function App () {
  const { sellers, setSellers } = useContext(DataContext)
  const { setCustomers } = useContext(ThirdPartiesContext)
  const { setProducts } = useContext(ProductContext)

  const [sellerPerformance, setSellerPerformance] = useState([])
  const [newSellerPerformance, setNewSellerPerformance] = useState([])

  const [newSeller, setNewSeller] = useState([])

  const [newCustomer, setNewCustomer] = useState([])

  const [newProduct, setNewProduct] = useState([])

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
      const response = await getDepartments()
      setDepartment(response)
    } catch (error) {
      console.error(error)
    }
  }

  const postMunicipalityToApi = async (newData) => {
    try {
      const response = await createMunicipality(newData)
      return response
    } catch (error) {
      console.log(error)
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

  const deleteSellerToApi = async (idSeller) => {
    try {
      const request = await deleteSeller(idSeller)
      setNewSeller(request)
      return request
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const putSellerToApi = async (id, sellerData) => {
    try {
      const request = await editSeller(id, sellerData)
      setNewSeller(request)
      return request
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const fetchSellerFromApi = async () => {
    try {
      const response = await getSellers()
      setSellers(response)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchCustomerFromApi = async () => {
    try {
      const response = await getCustomers()
      setCustomers(response)
    } catch (error) {
      console.log(error)
    }
  }

  const postCustomerToApi = async (newCustomer) => {
    try {
      const request = await createNewCustomer(newCustomer)
      setNewCustomer(request)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchProductsFromApi = async () => {
    try {
      const response = await getProducts()
      setProducts(response)
    } catch (error) {
      console.log(error)
    }
  }

  const postProductToApi = async (newProduct) => {
    try {
      const request = await createNewProduct(newProduct)
      setNewProduct(request)
    } catch (error) {
      console.log(error)
    }
  }

  const postSaleToApi = async (newSale) => {
    try {
      const request = await createNewSale(newSale)
      return request
    } catch (error) {
      console.log(error)
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

  // const currencyFormat = (number) => {
  //   if (number) {
  //     return number.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
  //   } else {
  //     return number
  //   }
  // }

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

  const extractDate = (fileDate) => {
    if (fileDate !== undefined) {
      const date = fileDate.join()
      const regex = /\b(?:0?[1-9]|[12][0-9]|3[01])\/(?:0?[1-9]|1[0-2])\/\d{4}\b/g
      const matches = date.match(regex)
      if (matches) {
        const datesWithoutLeadingZero = matches.map(match => match.replace(/^0/, ''))
        return datesWithoutLeadingZero
      } else {
        return null
      }
    }
  }

  const removeExtraSpaces = (string) => {
    return string.replace(/\s+/g, ' ')
  }

  const splitName = (name) => {
    const string = name.split(' ')
    const firstAndMiddleName = `${string[0]} ${string[1]}`
    return firstAndMiddleName
  }

  useEffect(() => {
    fetchSellerPerformanceFromApi()
  }, [newSellerPerformance])

  useEffect(() => {
    fetchDepartmentFromApi()
  }, [])

  useEffect(() => {
    fetchSellerFromApi()
    fetchCustomerFromApi()
    fetchProductsFromApi()
  }, [newSeller, newCustomer, newProduct])

  return (
    <div className='App'>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path='/' element={<UploadReports toFixed={toFixed} department={department} convertExcelDateToReadable={convertExcelDateToReadable} extractIdNumber={extractIdNumber} extractText={extractText} extractDate={extractDate} capitalizeWords={capitalizeWords} removeExtraSpaces={removeExtraSpaces} />} />
        <Route path='/sales' element={<SalesPage postSellerPerformanceToApi={postSellerPerformanceToApi} toFixed={toFixed} convertExcelDateToReadable={convertExcelDateToReadable} sellerPerformance={sellerPerformance} extractDateFromData={extractDateFromData} splitName={splitName} />} />

        <Route path='/detailed-sales' element={<DetailedSalesPage splitName={splitName} postSaleToApi={postSaleToApi} />} />

        <Route path='/manage-sellers' element={<ManageSellers postSellerToApi={postSellerToApi} deleteSellerToApi={deleteSellerToApi} putSellerToApi={putSellerToApi} capitalizeWords={capitalizeWords} sellers={sellers} />} />
        <Route path='/manage-sellers/:id' element={<SellerProfile />} />
        <Route path='/manage-customers' element={<ManageCustomers department={department} extractDate={extractDate} extractIdNumber={extractIdNumber} capitalizeWords={capitalizeWords} removeExtraSpaces={removeExtraSpaces} postCustomerToApi={postCustomerToApi} />} />
        <Route path='/manage-customers/:id' element={<CustomerProfile />} />
        <Route path='/manage-products' element={<ManageProducts postProductToApi={postProductToApi} removeExtraSpaces={removeExtraSpaces} />} />
      </Routes>
    </div>
  )
}

export default App
