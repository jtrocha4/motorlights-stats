import React, { useContext, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { saleItemFileToModel } from '../mappers'
import { SaleItemContext } from './context/saleItem'

const InputSaleItemFile = ({ label }) => {
  const { excelDataSaleItem, setExcelDataSaleItem, setDataSaleItem } = useContext(SaleItemContext)

  const handleReadSaleItemFile = (event) => {
    const file = event.target.files[0]
    // eslint-disable-next-line no-undef
    const reader = new FileReader()

    reader.onload = (e) => {
      const fileContent = e.target.result
      const workbook = XLSX.read(new Uint8Array(fileContent), { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      setExcelDataSaleItem(jsonData)
    }
    reader.readAsArrayBuffer(file)
  }

  const formatDataSaleItemFile = (headers = [], rows = []) => {
    const saleItemFile = rows.map(row => {
      const rowData = {}
      headers.forEach((header, index) => {
        rowData[header] = row[index]
      })
      return rowData
    })
    return saleItemFileToModel(saleItemFile)
  }

  const headersSaleItemFile = excelDataSaleItem[3]
  const rowsSaleItemFile = excelDataSaleItem.slice(4)
  const formattedDataSaleItem = formatDataSaleItemFile(headersSaleItemFile, rowsSaleItemFile)

  const extractSaleItemData = (formattedData) => {
    let currentSeller
    let customers = []

    const seller = []

    formattedData.forEach(row => {
      if (row.vendedor) {
        if (row.vendedor.startsWith('Total')) {
          if (currentSeller) {
            const uniqueCustomers = [...new Set(customers)]
            seller.push({
              vendedor: currentSeller,
              clientes: uniqueCustomers
            })
            currentSeller = null
            customers = []
          }
        } else {
          currentSeller = row.vendedor
        }
      }
      if (currentSeller && customers) {
        customers.push(row.cliente)
      }
    })
    setDataSaleItem(seller)
  }

  useEffect(() => {
    extractSaleItemData(formattedDataSaleItem)
  }, [excelDataSaleItem])

  return (
    <>
      <label className='form-label'>{label}</label>
      <input className='form-control' type='file' accept='.xls , .xlsx' onChange={handleReadSaleItemFile} />
    </>
  )
}

export default InputSaleItemFile
