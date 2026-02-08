import React, { useContext, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { DataExcelContext } from '../../context/dataExcel'
import { inventoryTurnoverFileToModel } from '../../mappers/inventoryTurnoverFile.mapper'
import { DataContext } from '../../context/data'

const InputInventoryTurnover = ({ label, extractIdNumber, extractText }) => {
  const { excelDataInventoryTurnover, setExcelDataInventoryTurnover } = useContext(DataExcelContext)

  const { setNewInventoryTurnover } = useContext(DataContext)

  const handleReadCostFile = (event) => {
    const file = event.target.files[0]
    // eslint-disable-next-line no-undef
    const reader = new FileReader()

    reader.onload = (e) => {
      const fileContent = e.target.result
      const workbook = XLSX.read(new Uint8Array(fileContent), { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      setExcelDataInventoryTurnover(jsonData)
    }
    reader.readAsArrayBuffer(file)
  }

  const formatDataCost = (headers = [], rows = []) => {
    const inventoryTurnover = rows.map(row => {
      const rowData = {}
      headers.forEach((header, index) => {
        rowData[header] = row[index]
      })
      return rowData
    })
    return inventoryTurnoverFileToModel(inventoryTurnover)
  }

  const reportHeader = excelDataInventoryTurnover[2]
  const reportRows = excelDataInventoryTurnover.slice(3)
  const formattedDataInventoryTurnover = formatDataCost(reportHeader, reportRows)

  console.log(reportHeader)
  console.log(formattedDataInventoryTurnover)

  const extractInventoryTurnoverData = (formattedData) => {
    const newInventory = formattedData.map(row => {
      if (row.producto !== undefined) {
        const productId = extractIdNumber(row.producto)
        const product = extractText(row.producto)
        return {
          codigo: productId,
          nombre: product
        }
      } else {
        return undefined
      }
    })

    if (newInventory[0] !== undefined) {
      setNewInventoryTurnover(newInventory)
    }
  }

  useEffect(() => {
    extractInventoryTurnoverData(formattedDataInventoryTurnover)
  }, [excelDataInventoryTurnover])

  return (
    <>
      <label className='form-label'>{label}</label>
      <input className='form-control' type='file' accept='.xls , .xlsx' onChange={handleReadCostFile} />
    </>
  )
}

export default InputInventoryTurnover
