import React, { useContext, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { newCustomersFileToModel } from '../mappers'
import { NewCustomerContext } from './context/newCustomers'

const InputNewCustomersFile = ({ label }) => {
  const { excelDataNewCustomers, setExcelDataNewCustomers } = useContext(NewCustomerContext)

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

  useEffect(() => {
    // console.log(formattedDataNewCustomers)
  }, [excelDataNewCustomers])

  return (
    <>
      <label className='form-label'>{label}</label>
      <input className='form-control' type='file' accept='.xls , .xlsx' onChange={handleReadNewCustomersFile} />
    </>
  )
}

export default InputNewCustomersFile
