import React, { useContext, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { DataExcelContext } from '../../context/dataExcel'
import { inventoryTurnoverFileToModel } from '../../mappers/inventoryTurnoverFile.mapper'
import { DataContext } from '../../context/data'

const InputInventoryTurnover = ({ label, extractIdNumber, extractText }) => {
  const { excelDataInventoryTurnover, setExcelDataInventoryTurnover } = useContext(DataExcelContext)

  const { newInventoryTurnover, setNewInventoryTurnover } = useContext(DataContext)

  const TARGET_SHEET_NAME = 'PRODUCTOS ROTACION'

  const handleReadInventoryFile = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      const fileContent = e.target.result
      const workbook = XLSX.read(new Uint8Array(fileContent), { type: 'array' })

      let sheetName = workbook.SheetNames.includes(TARGET_SHEET_NAME)
        ? TARGET_SHEET_NAME
        : null

      if (!sheetName) {
        const sheetsMeta = workbook.Workbook?.Sheets || []
        sheetName = workbook.SheetNames.find((name, index) => {
          const meta = sheetsMeta[index]
          return !meta || meta.Hidden === 0
        })
      }

      if (!sheetName) {
        console.error('No se encontró ninguna hoja válida (ni por nombre, ni visible) en el archivo')
        return
      }

      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

      // Elimina filas vacías (arrays sin ningún valor útil)
      const cleanedData = jsonData.filter(row =>
        row.length > 0 && row.some(cell => cell !== undefined && cell !== null && cell !== '')
      )

      setExcelDataInventoryTurnover(cleanedData)
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

  const reportHeaderIndex = excelDataInventoryTurnover.findIndex(row =>
    row.includes('Descripcion_')
  )
  const reportHeader = reportHeaderIndex !== -1 ? excelDataInventoryTurnover[reportHeaderIndex] : []
  const reportRows = reportHeaderIndex !== -1 ? excelDataInventoryTurnover.slice(reportHeaderIndex + 1) : []
  const formattedDataInventoryTurnover = formatDataCost(reportHeader, reportRows)

  console.log({ reportHeader })

  /*
  const extractInventoryTurnoverData = (formattedData) => {
    const newInventory = formattedData
      .filter(row => row.producto !== undefined && row.motos !== undefined && row.carros !== undefined && (row.motos.includes('ROTACION') || row.carros.includes('CARROS')))
      .map(row => ({
        codigo: extractIdNumber(row.producto),
        nombre: extractText(row.producto),
        motos: row.motos.includes('ROTACION'),
        carro: row.carros.includes('CARROS')
      }))

    setNewInventoryTurnover(newInventory)
  }
  */

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

  useEffect(() => {
    extractInventoryTurnoverData(formattedDataInventoryTurnover)
  }, [excelDataInventoryTurnover])

  console.log(newInventoryTurnover)

  return (
    <>
      <label className='form-label'>{label}</label>
      <input className='form-control' type='file' accept='.xls , .xlsx' onChange={handleReadInventoryFile} />
    </>
  )
}

export default InputInventoryTurnover
