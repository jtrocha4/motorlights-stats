/* eslint-disable no-undef */
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import { getSellerPerformance, createSellerPerformance, getDepartments, createMunicipality } from './services/dataService'
import { createNewSeller, getSellers, deleteSeller, editSeller, getCustomers, createNewCustomer, getProducts, createNewProduct, getSales, createNewSale } from './services/index'
import { useContext, useEffect, useState } from 'react'
import { DataContext } from './context/data'
import { ThirdPartiesContext } from './context/thirdParties'
import { ProductContext } from './context/product'
import { UserContext } from './context/user'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import UploadReports from './pages/UploadReports'
import SalesPage from './pages/SalesPage'
import DetailedSalesPage from './pages/DetailedSalesPage'
import ManageSellers from './pages/ManageSellers'
import SellerProfile from './pages/SellerProfile'
import ManageCustomers from './pages/ManageCustomers'
import CustomerProfile from './pages/CustomerProfile'
import ManageProducts from './pages/ManageProducts'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Swal from 'sweetalert2'

function App () {
  const { setSellers } = useContext(DataContext)
  const { setCustomers } = useContext(ThirdPartiesContext)
  const { setProducts } = useContext(ProductContext)
  const { user, setUser } = useContext(UserContext)

  const [sellerPerformance, setSellerPerformance] = useState([])
  const [newSellerPerformance, setNewSellerPerformance] = useState([])

  const [newSeller, setNewSeller] = useState([])

  const [newCustomer, setNewCustomer] = useState([])

  const [newProduct, setNewProduct] = useState([])

  const [department, setDepartment] = useState([])

  //* SellerPerformance
  const fetchSellerPerformanceFromApi = async () => {
    try {
      const response = await getSellerPerformance()
      setSellerPerformance(response)
    } catch (error) {
      console.error(error)
      throw error
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

  //* Departments
  const fetchDepartmentFromApi = async () => {
    try {
      const response = await getDepartments()
      setDepartment(response)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const postMunicipalityToApi = async (newData) => {
    try {
      const response = await createMunicipality(newData)
      return response
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  //* Sellers
  const fetchSellerFromApi = async () => {
    let token
    if (user !== null) token = user.token
    try {
      const response = await getSellers(token)
      setSellers(response)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const postSellerToApi = async (newSeller, token) => {
    try {
      const request = await createNewSeller(newSeller, token)
      setNewSeller(request)
      return request
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const deleteSellerToApi = async (idSeller, token) => {
    try {
      const request = await deleteSeller(idSeller, token)
      setNewSeller(request)
      return request
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const putSellerToApi = async (id, sellerData, token) => {
    try {
      const request = await editSeller(id, sellerData, token)
      setNewSeller(request)
      return request
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  //* Customer
  const fetchCustomerFromApi = async () => {
    let token
    if (user !== null) token = user.token
    try {
      const response = await getCustomers(token)
      setCustomers(response)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const postCustomerToApi = async (newCustomer, token) => {
    try {
      const request = await createNewCustomer(newCustomer, token)
      setNewCustomer(request)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  //* Products
  const fetchProductsFromApi = async () => {
    let token
    if (user !== null) token = user.token
    try {
      const response = await getProducts(token)
      setProducts(response)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const postProductToApi = async (newProduct, token) => {
    try {
      const request = await createNewProduct(newProduct, token)
      setNewProduct(request)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  //* Sales
  const fetchSalesFromApi = async () => {
    let token
    if (user !== null) token = user.token
    try {
      const request = await getSales(token)
      // console.log(request)
      return request
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const postSaleToApi = async (newSale, token) => {
    try {
      const request = await createNewSale(newSale, token)
      return request
    } catch (error) {
      console.log(error)
      throw error
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
    return stringLowerCase.replace(/(?:^|\s|[-¡¿!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~])\S/g, match => match.toUpperCase())
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

  const isTokenExpired = () => {
    const tokenExpiration = JSON.parse(window.localStorage.getItem('loggedApp'))
    if (tokenExpiration) {
      const tokenExpirationTime = new Date(tokenExpiration.expiredToken).getTime()
      const dateNow = new Date().getTime()
      if (dateNow >= tokenExpirationTime) {
        Swal.fire({
          title: 'Tu sesión ha expirado.',
          text: 'Por favor, vuelve a iniciar sesión.',
          icon: 'warning'
        }).then((result) => {
          if (result.isConfirmed) {
            setUser(null)
            window.localStorage.removeItem('loggedApp')
          }
        })
      }
    }
  }

  useEffect(() => {
    fetchSellerPerformanceFromApi()
  }, [newSellerPerformance])

  useEffect(() => {
    fetchDepartmentFromApi()
    isTokenExpired()
  }, [])

  useEffect(() => {
    if (user !== null) {
      fetchSellerFromApi()
      fetchCustomerFromApi()
      fetchProductsFromApi()
      fetchSalesFromApi()
    }
  }, [user, newSeller, newCustomer, newProduct])

  const navigate = useNavigate()
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedApp')
    if (loggedUser) {
      const userData = JSON.parse(loggedUser)
      setUser(userData)
      navigate('/')
    }
  }, [])

  return (
    <div className='App'>
      {!isLoginPage && <Navbar />}
      {!isLoginPage && <Sidebar />}
      <Routes>
        <Route element={<ProtectedRoute user={user} />}>
          <Route path='/' element={<UploadReports toFixed={toFixed} department={department} convertExcelDateToReadable={convertExcelDateToReadable} extractIdNumber={extractIdNumber} extractText={extractText} extractDate={extractDate} capitalizeWords={capitalizeWords} removeExtraSpaces={removeExtraSpaces} putSellerToApi={putSellerToApi} />} />
          <Route path='/sales' element={<SalesPage postSellerPerformanceToApi={postSellerPerformanceToApi} toFixed={toFixed} convertExcelDateToReadable={convertExcelDateToReadable} sellerPerformance={sellerPerformance} extractDateFromData={extractDateFromData} splitName={splitName} />} />
          <Route path='/detailed-sales' element={<DetailedSalesPage splitName={splitName} postSaleToApi={postSaleToApi} />} />
          <Route path='/manage-sellers' element={<ManageSellers postSellerToApi={postSellerToApi} deleteSellerToApi={deleteSellerToApi} putSellerToApi={putSellerToApi} capitalizeWords={capitalizeWords} removeExtraSpaces={removeExtraSpaces} />} />
          <Route path='/manage-sellers/:id' element={<SellerProfile />} />
          <Route path='/manage-customers' element={<ManageCustomers department={department} extractDate={extractDate} extractIdNumber={extractIdNumber} capitalizeWords={capitalizeWords} removeExtraSpaces={removeExtraSpaces} postCustomerToApi={postCustomerToApi} />} />
          <Route path='/manage-customers/:id' element={<CustomerProfile />} />
          <Route path='/manage-products' element={<ManageProducts postProductToApi={postProductToApi} removeExtraSpaces={removeExtraSpaces} />} />
        </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
