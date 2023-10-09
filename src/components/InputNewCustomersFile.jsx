import React, { useContext, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { newCustomersFileToModel } from '../mappers'
import { NewCustomerContext } from './context/newCustomers'
import { SaleItemContext } from './context/saleItem'
import { DataContext } from './context/data'

const InputNewCustomersFile = ({ label }) => {
  const { excelDataNewCustomers, setExcelDataNewCustomers, dataNewCustomers, setDataNewCustomers, setCustomersBySeller, customersBySeller } = useContext(NewCustomerContext)
  const { excelDataSaleItem, dataSaleItem } = useContext(SaleItemContext)
  const { data, setData } = useContext(DataContext)

  const handleReadNewCustomersFile = (event) => {
    const file = event.target.files[0]
    // eslint-disable-next-line no-undef
    const reader = new FileReader()

    reader.onload = (e) => {
      const fileContent = e.target.result
      const workbook = XLSX.read(new Uint8Array(fileContent), { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      setExcelDataNewCustomers(jsonData)
    }
    reader.readAsArrayBuffer(file)
  }

  const formatDataNewCustomers = (headers = [], rows = []) => {
    const newCustomersFile = rows.map(row => {
      const rowData = {}
      headers.forEach((header, index) => {
        rowData[header] = row[index]
      })
      return rowData
    })
    return newCustomersFileToModel(newCustomersFile)
  }

  const headersNewCustomersFile = excelDataNewCustomers[0]
  const rowsNewCustomersFile = excelDataNewCustomers.slice(1)
  const formattedDataNewCustomers = formatDataNewCustomers(headersNewCustomersFile, rowsNewCustomersFile)

  const extractNewCustomersData = (formattedDataNewCustomers = []) => {
    const customerData = formattedDataNewCustomers
    setDataNewCustomers(customerData)
  }

  const extractId = (array) => {
    const regex = /\d+/
    const id = array.map(el => (el !== undefined) ? (el.match(regex)[0]) : (console.error('ID is undefined')))
    return id
  }

  const findNewClients = (dataSaleItem = [], dataNewCustomers = []) => {
    const customersBySeller = {}
    dataSaleItem.forEach(element => {
      dataNewCustomers.forEach(newCustomer => {
        const customerId = newCustomer.id
        const elementCustomerId = extractId(element.clientes)
        if (elementCustomerId.includes(customerId)) {
          const sellerName = element.vendedor
          if (customersBySeller[sellerName]) {
            customersBySeller[sellerName]++
          } else {
            customersBySeller[sellerName] = 1
          }
        }
      })
    })
    setCustomersBySeller(customersBySeller)
  }

  const addCustomersToData = (customerBySeller, data) => {
    for (const key in data) {
      const sellerData = data[key]
      const vendedor = sellerData.vendedor

      if (customerBySeller[vendedor] !== undefined) {
        sellerData.clientesNuevos = customerBySeller[vendedor]
      } else {
        sellerData.clientesNuevos = 0
      }
    }
    setData([...data])
  }

  useEffect(() => {
    extractNewCustomersData(formattedDataNewCustomers)
    findNewClients(dataSaleItem, dataNewCustomers)
  }, [excelDataNewCustomers, excelDataSaleItem, dataSaleItem])

  useEffect(() => {
    addCustomersToData(customersBySeller, data)
  }, [customersBySeller])

  return (
    <>
      <label className='form-label'>{label}</label>
      <input className='form-control' type='file' accept='.xls , .xlsx' onChange={handleReadNewCustomersFile} />
    </>
  )
}

export default InputNewCustomersFile
