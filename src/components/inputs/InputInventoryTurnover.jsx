import React, { useContext, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { DataExcelContext } from '../../context/dataExcel'
import { inventoryTurnoverFileToModel } from '../../mappers/inventoryTurnoverFile.mapper'
import { DataContext } from '../../context/data'

const InputInventoryTurnover = ({ label, extractIdNumber, extractText }) => {
  const { excelDataInventoryTurnover, setExcelDataInventoryTurnover } = useContext(DataExcelContext)

  const { newInventoryTurnover, setNewInventoryTurnover } = useContext(DataContext)

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

  // const extractInventoryTurnoverData = (formattedData) => {
  //   const newInventory = formattedData
  //     .filter(row => row.producto !== undefined && row.motos !== undefined && row.carros !== undefined && (row.motos.includes('ROTACION') || row.carros.includes('CARROS')))
  //     .map(row => ({
  //       codigo: extractIdNumber(row.producto),
  //       nombre: extractText(row.producto),
  //       motos: row.motos.includes('ROTACION'),
  //       carro: row.carros.includes('CARROS')
  //     }))

  //   setNewInventoryTurnover(newInventory)
  // }

  const extractInventoryTurnoverData = (formattedData) => {
    const newInventory = formattedData
      .filter(row => row.producto !== undefined && (row.motos !== undefined || row.carros !== undefined))
      .map(row => (
        {
          codigo: extractIdNumber(row.producto),
          nombre: extractText(row.producto),
          motos: !!((row.motos !== undefined && row.motos === 'ROTACION 1')),
          carro: !!((row.carros !== undefined && row.carros === 'CARROS'))
        }
      ))
    setNewInventoryTurnover(newInventory)
  }

  console.log(newInventoryTurnover)

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
