import React, { useContext, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { saleItemFileToModel } from '../mappers'
import { SaleItemContext } from './context/saleItem'
import { ReportDetailsContext } from './context/reportDetails'

const InputSaleItemFile = ({ label }) => {
  const { excelDataSaleItem, setExcelDataSaleItem, setSellersCustomers, setDataSaleItem } = useContext(SaleItemContext)
  const { setSalesItemsReportName } = useContext(ReportDetailsContext)

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

  // const reportDate = excelDataSaleItem[1]
  const reportName = excelDataSaleItem[1]

  const reportHeaders = excelDataSaleItem[3]
  const reportRows = excelDataSaleItem.slice(4)
  const formattedDataSaleItem = formatDataSaleItemFile(reportHeaders, reportRows)

  const extractCustomersFromSeller = (formattedData) => {
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
    setSellersCustomers(seller)
  }

  const extractDataSaleItems = (formattedData) => {
    let currentSeller
    const salesItem = {}
    let soldItems = []

    const dataSalesItems = []

    let splitChain

    formattedData.forEach(row => {
      if (row.descripcion !== undefined) {
        splitChain = row.descripcion.split(' ')
      }
      if (row.vendedor) {
        if (row.vendedor.startsWith('Total')) {
          if (currentSeller) {
            salesItem[currentSeller] = soldItems
            dataSalesItems.push({
              vendedor: currentSeller,
              itemsVendidos: salesItem[currentSeller]
            })
            currentSeller = null
            soldItems = []
          }
        } else {
          currentSeller = row.vendedor
        }
      }
      if (currentSeller && soldItems && splitChain !== undefined && !splitChain[1].startsWith('Flete')) {
        soldItems.push(row)
      }
    })
    setDataSaleItem(dataSalesItems)
  }

  useEffect(() => {
    extractCustomersFromSeller(formattedDataSaleItem)
    extractDataSaleItems(formattedDataSaleItem)
    setSalesItemsReportName(reportName)
  }, [excelDataSaleItem])

  return (
    <>
      <label className='form-label'>{label}</label>
      <input className='form-control' type='file' accept='.xls , .xlsx' onChange={handleReadSaleItemFile} />
    </>
  )
}

export default InputSaleItemFile
