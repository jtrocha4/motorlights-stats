import './App.css'
import * as XLSX from 'xlsx'
import InputFile from './components/InputFile'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { useState } from 'react'

function App () {
  const [excelData, setExcelData] = useState([])

  const handleFileRead = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      const fileContent = e.target.result
      const workbook = XLSX.read(new Uint8Array(fileContent), { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      setExcelData(jsonData)
    }
    reader.readAsArrayBuffer(file)
  }

  const formatData = (headers = [], rows = []) => {
    return rows.map(row => {
      const rowData = {}
      headers.forEach((header, index) => {
        if (header !== 'Ventas') {
          rowData[header] = row[index]
        }
      })
      return rowData
    })
  }

  // Todo: tal vez guardar los datos formateados dentro de un hooks
  const headers = excelData[3]
  const rows = excelData.slice(4)
  const formattedData = formatData(headers, rows)
  console.log({ formattedData })

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className='flex'>
        <div className='container'>
          <h2>Inicio</h2>
          <p>Añada los siguientes archivos:</p>
          <div className='inputFile-group'>
            <InputFile label='Informe de Costo' handleChange={handleFileRead} />
            <InputFile label='Informe de Recaudo' handleChange={handleFileRead} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
